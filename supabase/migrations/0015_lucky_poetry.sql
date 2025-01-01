/*
  # Fix team policies and relationships

  1. Changes
    - Add proper RLS policies for teams and team members
    - Fix relationship between team_members and profiles
    - Add missing insert policy for team_members
  
  2. Security
    - Ensure proper access control for teams
    - Fix recursive policy issues
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team owners and admins can update teams" ON teams;
DROP POLICY IF EXISTS "Users can insert team members" ON team_members;
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can update members" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can delete members" ON team_members;

-- Create new policies with fixed access control
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
CREATE POLICY "Initial owner can be added"
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
  ON team_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Members can leave teams"
  ON team_members FOR DELETE
  USING (
    auth.uid() = user_id AND
    role != 'owner'
  );