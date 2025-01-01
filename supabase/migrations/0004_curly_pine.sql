/*
  # Fix auth schema and user creation
  
  1. Creates necessary extensions
  2. Creates test user with proper constraints
  3. Ensures profile exists for test user
*/

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First ensure the test user doesn't exist
DELETE FROM auth.users WHERE email = 'test@example.com';

-- Create test user with all required fields
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
  confirmation_token,
  is_super_admin,
  last_sign_in_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf', 10)),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  encode(gen_random_bytes(32), 'hex'),
  false,
  now()
);

-- Create profile for the test user
DELETE FROM profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'test@example.com'
);

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