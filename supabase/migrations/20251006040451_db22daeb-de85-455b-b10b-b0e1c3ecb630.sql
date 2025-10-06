-- Create a view to access user display names from auth.users
CREATE OR REPLACE VIEW public.user_display_info AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'display_name' as display_name,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON public.user_display_info TO authenticated;