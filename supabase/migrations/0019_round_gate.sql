-- Create view for team members with profiles
CREATE OR REPLACE VIEW team_members_with_profiles AS
SELECT 
  tm.*,
  p.full_name,
  p.role as user_role
FROM team_members tm
JOIN profiles p ON p.id = tm.user_id;

-- Grant access to the view
GRANT SELECT ON team_members_with_profiles TO authenticated;

-- Add comment for documentation
COMMENT ON VIEW team_members_with_profiles IS 'Team members with their profile information';