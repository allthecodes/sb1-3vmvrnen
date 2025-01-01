/*
  # Initial Schema Setup for Career Achievements Tracker

  1. New Tables
    - users
      - Extended user profile information
    - achievements
      - Weekly achievements entries
    - feedback
      - Peer and manager feedback
    - reviews
      - Annual performance reviews
    - reflection_templates
      - Customizable templates for reviews and reflections
    
  2. Security
    - RLS enabled on all tables
    - Policies for user data access
*/

-- Users table extension (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  role text,
  department text,
  manager_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text,
  impact_level text CHECK (impact_level IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  provider_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  type text CHECK (type IN ('peer', 'manager')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Review templates
CREATE TABLE IF NOT EXISTS reflection_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL,
  type text CHECK (type IN ('self_reflection', 'manager_review')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  reviewer_id uuid REFERENCES auth.users,
  template_id uuid REFERENCES reflection_templates NOT NULL,
  responses jsonb NOT NULL,
  year integer NOT NULL,
  status text CHECK (status IN ('draft', 'submitted', 'completed')) NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view feedback about themselves"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = provider_id);

CREATE POLICY "Users can provide feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Templates policies
CREATE POLICY "Everyone can view templates"
  ON reflection_templates FOR SELECT
  TO authenticated
  USING (true);

-- Reviews policies
CREATE POLICY "Users can view their own reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = reviewer_id);

CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update reviews they created or are reviewing"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = reviewer_id);