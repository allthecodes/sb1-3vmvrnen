/*
  # Add jobs table and relationships

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `company` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `current` (boolean)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `job_id` to achievements table
    - Add `job_id` to feedback table

  3. Security
    - Enable RLS on jobs table
    - Add policies for user access
*/

-- Create jobs table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
    CREATE TABLE jobs (
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
  END IF;
END $$;

-- Add job_id to achievements if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE achievements ADD COLUMN job_id uuid REFERENCES jobs(id);
  END IF;
END $$;

-- Add job_id to feedback if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'feedback' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE feedback ADD COLUMN job_id uuid REFERENCES jobs(id);
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'jobs' AND rowsecurity = true
  ) THEN
    ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' AND policyname = 'Users can view their own jobs'
  ) THEN
    CREATE POLICY "Users can view their own jobs"
      ON jobs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' AND policyname = 'Users can create their own jobs'
  ) THEN
    CREATE POLICY "Users can create their own jobs"
      ON jobs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' AND policyname = 'Users can update their own jobs'
  ) THEN
    CREATE POLICY "Users can update their own jobs"
      ON jobs FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_jobs_user_id'
  ) THEN
    CREATE INDEX idx_jobs_user_id ON jobs(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_achievements_job_id'
  ) THEN
    CREATE INDEX idx_achievements_job_id ON achievements(job_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_feedback_job_id'
  ) THEN
    CREATE INDEX idx_feedback_job_id ON feedback(job_id);
  END IF;
END $$;