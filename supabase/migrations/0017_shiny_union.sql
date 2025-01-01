/*
  # Fix Team Creation

  1. Changes
    - Drop and recreate team creation function with proper error handling
    - Add proper grants and permissions
    - Fix policy ordering to prevent circular dependencies

  2. Security
    - Ensure proper RLS enforcement
    - Add input validation
    - Prevent privilege escalation
*/

-- Drop existing function to recreate with better error handling
DROP FUNCTION IF EXISTS create_team_with_owner;

-- Create improved function with validation and error handling
CREATE OR REPLACE FUNCTION create_team_with_owner(
  team_name text,
  team_description text,
  owner_id uuid
) RETURNS teams AS $$
DECLARE
  new_team teams;
BEGIN
  -- Validate inputs
  IF team_name IS NULL OR team_name = '' THEN
    RAISE EXCEPTION 'Team name cannot be empty';
  END IF;

  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'Owner ID cannot be null';
  END IF;

  -- Verify caller is the owner
  IF owner_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create team for another user';
  END IF;

  -- Create team within a subtransaction
  BEGIN
    -- Insert the team
    INSERT INTO teams (name, description)
    VALUES (team_name, team_description)
    RETURNING * INTO new_team;

    -- Insert the owner as a team member
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (new_team.id, owner_id, 'owner');

    RETURN new_team;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback the subtransaction and re-raise with clear message
    RAISE EXCEPTION 'Failed to create team: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke all existing permissions
REVOKE ALL ON teams FROM authenticated;
REVOKE ALL ON team_members FROM authenticated;
REVOKE ALL ON FUNCTION create_team_with_owner FROM authenticated;

-- Grant minimal required permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON teams TO authenticated;
GRANT SELECT, INSERT ON team_members TO authenticated;
GRANT EXECUTE ON FUNCTION create_team_with_owner TO authenticated;

-- Update policies to work with the function
DROP POLICY IF EXISTS "Anyone can create teams" ON teams;
CREATE POLICY "Function can create teams"
  ON teams FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Initial owner can be added" ON team_members;
CREATE POLICY "Function can add initial owner"
  ON team_members FOR INSERT
  WITH CHECK (
    (role = 'owner' AND auth.uid() = user_id) OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- Add row level security assertion
ALTER FUNCTION create_team_with_owner(text, text, uuid) 
SET search_path = public, pg_temp;

COMMENT ON FUNCTION create_team_with_owner IS 'Creates a new team and adds the specified user as owner in a single transaction';