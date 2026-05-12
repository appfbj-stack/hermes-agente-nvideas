-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'Free',
  msg_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true
);

-- Create uazap_sessions table
CREATE TABLE IF NOT EXISTS public.uazap_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  status TEXT DEFAULT 'DISCONNECTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, phone)
);

-- Create messages table (log of sent/received messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  direction TEXT CHECK (direction IN ('INBOUND', 'OUTBOUND')),
  content TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uazap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for Tenants (Users can only see their own tenant data based on auth)
-- Note: Assuming auth.users has a raw_user_meta_data->>'tenant_id'
CREATE POLICY "Users can view their own tenant" 
  ON public.tenants FOR SELECT 
  USING (id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their uazap sessions" 
  ON public.uazap_sessions FOR SELECT 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their contacts" 
  ON public.contacts FOR SELECT 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can insert contacts" 
  ON public.contacts FOR INSERT 
  WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their messages" 
  ON public.messages FOR SELECT 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can insert messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- Insert a default demo tenant
INSERT INTO public.tenants (id, name, plan) 
VALUES ('b4b8a2c2-9a00-4b5c-a5b6-7c98f987d654', 'Demo Acme Corp', 'Enterprise')
ON CONFLICT DO NOTHING;
