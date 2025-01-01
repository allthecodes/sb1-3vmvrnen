/*
  # Create test user

  1. Creates a test user for development
  2. Adds profile information
*/

-- Create test user in auth.users (only runs if user doesn't exist)
DO $$ 
BEGIN 
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role
  )
  SELECT 
    gen_random_uuid(),
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'test@example.com'
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
  WHERE email = 'test@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE full_name = 'Test User'
  );
END $$;