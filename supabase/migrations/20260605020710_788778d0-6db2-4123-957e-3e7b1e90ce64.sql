-- 1. Restrict user_roles SELECT to owner + admins
DROP POLICY IF EXISTS "Anyone can read roles" ON public.user_roles;

CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Revoke direct EXECUTE on the SECURITY DEFINER function from public roles.
-- RLS policies still call it because policy evaluation runs as the policy owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;