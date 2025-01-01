/*
  # Teams Schema

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `team_members`
      - `team_id` (uuid, references teams)
      - `user_id` (uuid, references auth.users)
      - `role` (text: owner, admin, member)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for team access and membership management
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid REFERENCES teams ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- Add team_id to templates and feedback
ALTER TABLE reflection_templates 
ADD COLUMN team_id uuid REFERENCES teams(id);

ALTER TABLE feedback 
ADD COLUMN team_id uuid REFERENCES teams(id);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they belong to"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can update team details"
  ON teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- Team members policies
CREATE POLICY "Users can view team members of their teams"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS my_teams
      WHERE my_teams.team_id = team_members.team_id 
      AND my_teams.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members AS admins
      WHERE admins.team_id = team_members.team_id 
      AND admins.user_id = auth.uid()
      AND admins.role IN ('owner', 'admin')
    )
  );

-- Create indexes
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_templates_team_id ON reflection_templates(team_id);
CREATE INDEX idx_feedback_team_id ON feedback(team_id);