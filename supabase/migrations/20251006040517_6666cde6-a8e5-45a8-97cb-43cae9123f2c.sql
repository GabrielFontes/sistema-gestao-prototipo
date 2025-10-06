-- Drop the insecure view
DROP VIEW IF EXISTS public.user_display_info;

-- Create a secure function to get member details for a specific empresa
CREATE OR REPLACE FUNCTION public.get_empresa_members_with_details(p_empresa_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  display_name text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user has permission to view members
  IF NOT EXISTS (
    SELECT 1 FROM empresa_members
    WHERE empresa_id = p_empresa_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    em.id,
    em.user_id,
    au.email,
    COALESCE(
      au.raw_user_meta_data->>'display_name',
      au.raw_user_meta_data->>'full_name',
      au.email
    ) as display_name,
    em.role,
    em.created_at
  FROM empresa_members em
  JOIN auth.users au ON au.id = em.user_id
  WHERE em.empresa_id = p_empresa_id
  ORDER BY em.created_at;
END;
$$;