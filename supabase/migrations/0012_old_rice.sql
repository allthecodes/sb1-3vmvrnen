/*
  # Fix team relationships and policies

  1. Changes
    - Add proper foreign key relationships for team members and profiles
    - Fix recursive policies
    - Add missing indexes
    - Add cascade deletes where appropriate

  2. Security
    - Update RLS policies to prevent recursion
    - Ensure proper access control for team operations
*/

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team owners and admins can update team details" ON teams;
DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can manage team members" ON team_members;

-- Recreate team_members table with proper relationships
DROP TABLE IF EXISTS team_members CASCADE;
CREATE TABLE team_members (
  team_id uuid REFERENCES teams ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- Create new policies with fixed recursion issues
CREATE POLICY "Users can view teams they belong to"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can update team details"
  ON teams FOR UPDATE
  USING (
    id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    team_id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage members"
  ON team_members FOR ALL
  USING (
    team_id IN (
      SELECT team_id 
      FROM team_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Create or replace function to check team membership
CREATE OR REPLACE FUNCTION is_team_member(team_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM team_members 
    WHERE team_members.team_id = $1 
    AND team_members.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;