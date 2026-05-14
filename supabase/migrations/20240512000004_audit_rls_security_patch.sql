-- AUDIT PATCH: Security and RLS Enforcement
-- Ensures all major tables have strict tenant_id isolation

-- 1. Contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for contacts" ON public.contacts;
CREATE POLICY "Tenant isolation for contacts" ON public.contacts 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- 2. Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for messages" ON public.messages;
CREATE POLICY "Tenant isolation for messages" ON public.messages 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- 3. Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for conversations" ON public.conversations;
CREATE POLICY "Tenant isolation for conversations" ON public.conversations 
  USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));

-- 4. Tasks (If exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tasks') THEN
    ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Tenant isolation for tasks" ON public.tasks;
    CREATE POLICY "Tenant isolation for tasks" ON public.tasks 
      USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
  END IF;
END $$;

-- 5. Schedules (Agenda) (If exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'schedules') THEN
    ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Tenant isolation for schedules" ON public.schedules;
    CREATE POLICY "Tenant isolation for schedules" ON public.schedules 
      USING (tenant_id::text = (auth.jwt() ->> 'tenant_id'));
  END IF;
END $$;

-- Enable Realtime for critical tables
alter publication supabase_realtime add table public.whatsapp_instances;
alter publication supabase_realtime add table public.whatsapp_webhook_logs;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.contacts;
