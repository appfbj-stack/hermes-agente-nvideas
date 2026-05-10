-- Create a trigger to automatically create a tenant and link the user when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_tenant_id uuid;
  company_name text;
  company_subdomain text;
BEGIN
  -- If the user is the superadmin, we don't necessarily need a tenant, but let's create a default one or skip
  IF new.email = 'admin@hermes.app' THEN
    RETURN new;
  END IF;

  -- Generate a basic company name and subdomain from the email
  company_name := split_part(new.email, '@', 1) || ' Workspace';
  -- Create a clean subdomain (alphanumeric only)
  company_subdomain := regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]', '', 'g') || '-' || substr(md5(random()::text), 1, 4);

  -- Insert the new tenant
  INSERT INTO public.tenants (name, subdomain, plan, settings)
  VALUES (company_name, company_subdomain, 'free', '{}')
  RETURNING id INTO new_tenant_id;

  -- Link the user to the tenant as an admin
  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (new_tenant_id, new.id, 'admin');

  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
