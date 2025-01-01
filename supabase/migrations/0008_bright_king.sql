/*
  # Add RLS policies for reflection templates

  1. Security Changes
    - Enable RLS on reflection_templates table
    - Add policies for:
      - Authenticated users can create templates
      - Authenticated users can view all templates
      - Template creators can update their templates
      - Template creators can delete their templates

  2. Changes
    - Add user_id column to track template ownership
    - Add RLS policies for CRUD operations
*/

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reflection_templates' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE reflection_templates ADD COLUMN user_id uuid REFERENCES auth.users NOT NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE reflection_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can create templates"
  ON reflection_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all templates"
  ON reflection_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own templates"
  ON reflection_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON reflection_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);