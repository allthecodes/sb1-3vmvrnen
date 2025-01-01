/*
  # Fix test user credentials

  1. Updates test user with proper password hashing
  2. Ensures user is properly configured for authentication
*/

-- First, remove existing test user if present
DELETE FROM auth.users WHERE email = 'test@example.com';

-- Create test user with proper password hash
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  -- Using Supabase's default password hashing
  crypt('password123', gen_salt('bf', 10)),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  encode(gen_random_bytes(32), 'hex')
);

-- Add profile for the test user
INSERT INTO profiles (
  id,
  full_name,
  role,
  department
)
SELECT 
  id,
  'Test User',
  'Software Engineer',
  'Engineering'
FROM auth.users 
WHERE email = 'test@example.com';