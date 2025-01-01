/*
  # Add template lifecycle and review responses

  1. Changes
    - Add status field to reflection_templates if not exists
    - Create review_responses table if not exists
    - Add indexes for performance

  2. Security
    - Enable RLS on review_responses
    - Add policies for creating and viewing responses
*/

-- Add status to reflection_templates if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reflection_templates' AND column_name = 'status'
  ) THEN
    ALTER TABLE reflection_templates 
    ADD COLUMN status text CHECK (status IN ('draft', 'active')) NOT NULL DEFAULT 'draft';
  END IF;
END $$;

-- Create review_responses table if not exists
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  template_id uuid REFERENCES reflection_templates NOT NULL,
  responses jsonb NOT NULL,
  status text CHECK (status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'review_responses' AND rowsecurity = true
  ) THEN
    ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_responses' AND policyname = 'Users can create their own responses'
  ) THEN
    CREATE POLICY "Users can create their own responses"
      ON review_responses
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_responses' AND policyname = 'Users can view their own responses'
  ) THEN
    CREATE POLICY "Users can view their own responses"
      ON review_responses
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_responses' AND policyname = 'Users can update their own responses'
  ) THEN
    CREATE POLICY "Users can update their own responses"
      ON review_responses
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_review_responses_user_id'
  ) THEN
    CREATE INDEX idx_review_responses_user_id ON review_responses(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_review_responses_template_id'
  ) THEN
    CREATE INDEX idx_review_responses_template_id ON review_responses(template_id);
  END IF;
END $$;