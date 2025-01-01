/*
  # Add Jobs Tracking

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `company` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `current` (boolean)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `job_id` to achievements table
    - Add `job_id` to feedback table
    
  3. Security
    - Enable RLS on jobs table
    - Add policies for user access
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add job_id to achievements
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS job_id uuid REFERENCES jobs(id);

-- Add job_id to feedback
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS job_id uuid REFERENCES jobs(id);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Users can view their own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_job_id ON achievements(job_id);
CREATE INDEX IF NOT EXISTS idx_feedback_job_id ON feedback(job_id);