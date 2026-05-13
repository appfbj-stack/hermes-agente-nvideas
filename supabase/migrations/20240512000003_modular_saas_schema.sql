-- Feature Flags / Modules
CREATE TABLE IF NOT EXISTS public.tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, module_name)
);

-- Limits
CREATE TABLE IF NOT EXISTS public.tenant_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan_name TEXT DEFAULT 'BASIC',
  max_whatsapp_instances INTEGER DEFAULT 1,
  max_users INTEGER DEFAULT 3,
  max_contacts INTEGER DEFAULT 1000,
  max_messages INTEGER DEFAULT 5000,
  max_campaigns INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Multi-instance WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'disconnected',
  qr_code TEXT,
  webhook_url TEXT,
  session_data JSONB,
  last_connection TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  event TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adiciona a referência da instância na tabela de mensagens existente
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.tenant_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their modules" ON public.tenant_modules FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can view their limits" ON public.tenant_limits FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their instances" ON public.whatsapp_instances FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can insert their instances" ON public.whatsapp_instances FOR INSERT WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can update their instances" ON public.whatsapp_instances FOR UPDATE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can delete their instances" ON public.whatsapp_instances FOR DELETE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their logs" ON public.whatsapp_webhook_logs FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- Setup Automático de Limites e Módulos para novos Tenants
CREATE OR REPLACE FUNCTION public.handle_new_tenant_setup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert limits
  INSERT INTO public.tenant_limits (tenant_id, plan_name, max_whatsapp_instances)
  VALUES (NEW.id, 'BASIC', 1);

  -- Insert default modules
  INSERT INTO public.tenant_modules (tenant_id, module_name, enabled)
  VALUES 
    (NEW.id, 'whatsapp', true),
    (NEW.id, 'crm', true),
    (NEW.id, 'ai_agent', true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_tenant_created ON public.tenants;
CREATE TRIGGER on_tenant_created
  AFTER INSERT ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_tenant_setup();
