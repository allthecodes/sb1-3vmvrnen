-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create teams" ON teams;
DROP POLICY IF EXISTS "Users can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owners and admins can update teams" ON teams;
DROP POLICY IF EXISTS "Team members can be added" ON team_members;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can manage members" ON team_members;
DROP POLICY IF EXISTS "Members can leave teams" ON team_members;

-- Reset RLS
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create function to check team role
CREATE OR REPLACE FUNCTION check_team_role(team_id uuid, required_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = $1
    AND team_members.user_id = auth.uid()
    AND team_members.role = ANY($2)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Team policies
CREATE POLICY "Anyone can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT team_id FROM team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Team owners and admins can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (check_team_role(id, ARRAY['owner', 'admin']));

-- Team member policies
CREATE POLICY "Initial owner can be added"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    (role = 'owner' AND user_id = auth.uid() AND NOT EXISTS (
      SELECT 1 FROM team_members WHERE team_members.team_id = team_id
    ))
  );

CREATE POLICY "Admins can add members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    role != 'owner' AND check_team_role(team_id, ARRAY['owner', 'admin'])
  );

CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (team_id IN (
    SELECT tm.team_id FROM team_members tm WHERE tm.user_id = auth.uid()
  ));

CREATE POLICY "Admins can update members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (check_team_role(team_id, ARRAY['owner', 'admin']));

CREATE POLICY "Members can leave teams"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() AND role != 'owner'
  );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_team_role TO authenticated;