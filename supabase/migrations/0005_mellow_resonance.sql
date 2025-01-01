/*
  # Achievement attachments storage setup

  1. Storage
    - Create bucket for achievement attachments
    - Set up RLS policies for secure access

  2. Security
    - Users can upload files to their own achievements
    - Users can view files from their own achievements
    - Files are organized by user_id/achievement_id
*/

-- Create storage bucket for achievement attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievement-attachments', 'achievement-attachments', false);

-- Enable RLS on the bucket
CREATE POLICY "Users can upload achievement attachments"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'achievement-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own achievement attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'achievement-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own achievement attachments"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'achievement-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );