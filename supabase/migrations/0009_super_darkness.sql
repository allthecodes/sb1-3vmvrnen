/*
  # Add template status and review responses

  1. Changes
    - Add status field to reflection_templates
    - Create review_responses table for completed reviews
    - Add RLS policies for review responses

  2. Security
    - Enable RLS on review_responses
    - Add policies for creating and viewing responses
*/

-- Add status to reflection_templates
ALTER TABLE reflection_templates 
ADD COLUMN status text CHECK (status IN ('draft', 'active')) NOT NULL DEFAULT 'draft';

-- Create review_responses table
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  template_id uuid REFERENCES reflection_templates NOT NULL,
  responses jsonb NOT NULL,
  status text CHECK (status IN ('in_progress', 'completed')) NOT NULL DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for review_responses
CREATE POLICY "Users can create their own responses"
  ON review_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own responses"
  ON review_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses"
  ON review_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_review_responses_user_id ON review_responses(user_id);
CREATE INDEX idx_review_responses_template_id ON review_responses(template_id);