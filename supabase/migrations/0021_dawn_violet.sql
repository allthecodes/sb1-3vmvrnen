-- Create or replace view for team members with profiles
CREATE OR REPLACE VIEW team_members_with_profiles AS
SELECT 
  tm.*,
  p.full_name,
  p.role as user_role
FROM team_members tm
JOIN profiles p ON p.id = tm.user_id;

-- Grant access to the view
GRANT SELECT ON team_members_with_profiles TO authenticated;

-- Create function to invite team members
CREATE OR REPLACE FUNCTION invite_team_member(
  team_id uuid,
  member_email text,
  member_role text DEFAULT 'member'
) RETURNS team_members AS $$
DECLARE
  member_user_id uuid;
  new_member team_members;
BEGIN
  -- Verify caller has permission
  IF NOT EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.team_id = invite_team_member.team_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Only team owners and admins can invite members';
  END IF;

  -- Find user by email
  SELECT id INTO member_user_id
  FROM auth.users
  WHERE email = member_email;

  IF member_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Check if already a member
  IF EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = invite_team_member.team_id
    AND team_members.user_id = member_user_id
  ) THEN
    RAISE EXCEPTION 'User is already a team member';
  END IF;

  -- Add member
  INSERT INTO team_members (team_id, user_id, role)
  VALUES (team_id, member_user_id, member_role)
  RETURNING * INTO new_member;

  RETURN new_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION invite_team_member TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION invite_team_member IS 'Invites a user to join a team by their email address';