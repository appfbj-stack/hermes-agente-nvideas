-- Add political fields to contacts
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS voting_intent TEXT DEFAULT 'INDECISO',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS leader_id UUID;

-- Leaders table
CREATE TABLE IF NOT EXISTS public.leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  region TEXT,
  goal INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cabinet requests (Gabinete Digital)
CREATE TABLE IF NOT EXISTS public.cabinet_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ABERTO',
  neighborhood TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabinet_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their leaders" ON public.leaders FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can insert leaders" ON public.leaders FOR INSERT WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can update their leaders" ON public.leaders FOR UPDATE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can delete their leaders" ON public.leaders FOR DELETE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

CREATE POLICY "Users can view their cabinet_requests" ON public.cabinet_requests FOR SELECT USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can insert cabinet_requests" ON public.cabinet_requests FOR INSERT WITH CHECK (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can update their cabinet_requests" ON public.cabinet_requests FOR UPDATE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
CREATE POLICY "Users can delete their cabinet_requests" ON public.cabinet_requests FOR DELETE USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
