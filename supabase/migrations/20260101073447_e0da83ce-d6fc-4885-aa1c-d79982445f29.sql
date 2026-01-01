-- ============================================================
-- DEFAULT ADMIN ACCOUNT SETUP
-- ============================================================
-- 
-- IMPORTANT: This creates a default admin account for demo/testing.
-- 
-- DEFAULT CREDENTIALS:
--   Email: admin@smartport.defense.gov.in
--   Password: Admin@SecurePort2024
--
-- SECURITY NOTE: Change these credentials immediately in production!
-- ============================================================

-- First, update the handle_new_user function to NOT auto-assign admin to everyone
-- Only manually created admins should have admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile only
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Do NOT auto-assign admin role - this must be done manually by system owner
  -- For security, new users get no roles by default
  
  RETURN NEW;
END;
$$;