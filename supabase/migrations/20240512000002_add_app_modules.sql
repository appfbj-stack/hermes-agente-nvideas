-- Add app_module to tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS app_module TEXT DEFAULT 'politica';

-- Create a function to handle new user signups and create a tenant automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  user_app_module TEXT;
  user_company_name TEXT;
BEGIN
  -- Extract app_module and company_name from metadata, default to 'politica' and 'Nova Empresa'
  user_app_module := COALESCE(NEW.raw_user_meta_data->>'app_module', 'politica');
  user_company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'Nova Empresa');

  -- Create the tenant
  INSERT INTO public.tenants (name, app_module)
  VALUES (user_company_name, user_app_module)
  RETURNING id INTO new_tenant_id;

  -- Update the user's metadata to include the new tenant_id
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{tenant_id}',
    to_jsonb(new_tenant_id::text)
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
