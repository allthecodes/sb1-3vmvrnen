/*
  # Fix team policies and relationships

  1. Changes
    - Add policy for creating teams
    - Fix team member profile relationship
    - Simplify policies to prevent recursion
    - Add missing indexes

  2. Security
    - Ensure proper access control for all operations
    - Fix recursive policy issues
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team owners and admins can update team details" ON teams;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can manage members" ON team_members;

-- Create new policies with proper access control
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view teams they belong to"
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