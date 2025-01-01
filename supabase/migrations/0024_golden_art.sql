/*
  # Update Team Policies

  1. Changes
    - Drop and recreate team policies with proper permissions
    - Fix team member insertion policy
    - Update view permissions
    - Ensure proper access control for team operations

  2. Security
    - Enable proper team creation
    - Maintain RLS while allowing team creation
    - Ensure proper access control for team members
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create teams" ON teams;
DROP POLICY IF EXISTS "Users can view their teams" ON teams;
DROP POLICY IF EXISTS "Team owners and admins can update teams" ON teams;
DROP POLICY IF EXISTS "Team members can be added" ON team_members;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can manage members" ON team_members;

-- Create new team policies
CREATE POLICY "Anyone can create teams"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their teams"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can update teams"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = id 
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- Team members policies
CREATE POLICY "Team members can be added"
  ON team_members FOR INSERT
  WITH CHECK (
    -- Allow owner creation during team creation
    (role = 'owner' AND auth.uid() = user_id AND NOT EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = team_id
    )) OR
    -- Allow admins to add members
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Ensure view permissions are correct
GRANT SELECT ON team_members_with_profiles TO authenticated;