-- Agenda Pastoral Module Schema

CREATE TABLE public.pastoral_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'membro' CHECK (role IN ('membro', 'pastor', 'lider')),
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.pastoral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('culto', 'visita', 'aconselhamento', 'reuniao', 'evento')),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    member_id UUID REFERENCES public.pastoral_members(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'concluido', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pastoral_members_tenant_id ON public.pastoral_members(tenant_id);
CREATE INDEX idx_pastoral_events_tenant_id ON public.pastoral_events(tenant_id);
CREATE INDEX idx_pastoral_events_date ON public.pastoral_events(event_date);

-- Row Level Security
ALTER TABLE public.pastoral_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastoral_events ENABLE ROW LEVEL SECURITY;

-- Policies for pastoral_members
CREATE POLICY "Users can view their tenant pastoral_members" ON public.pastoral_members FOR SELECT USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert their tenant pastoral_members" ON public.pastoral_members FOR INSERT WITH CHECK (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their tenant pastoral_members" ON public.pastoral_members FOR UPDATE USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their tenant pastoral_members" ON public.pastoral_members FOR DELETE USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

-- Policies for pastoral_events
CREATE POLICY "Users can view their tenant pastoral_events" ON public.pastoral_events FOR SELECT USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert their tenant pastoral_events" ON public.pastoral_events FOR INSERT WITH CHECK (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their tenant pastoral_events" ON public.pastoral_events FOR UPDATE USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their tenant pastoral_events" ON public.pastoral_events FOR DELETE USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

-- Insert Agenda Pastoral into Apps catalog so it can be enabled/disabled
INSERT INTO public.apps (name, slug, category, description, is_public) 
VALUES ('Agenda Pastoral', 'agenda_pastoral', 'productivity', 'Módulo de gestão de agenda pastoral, membros e cultos.', true)
ON CONFLICT (slug) DO NOTHING;

GRANT ALL ON public.pastoral_members TO authenticated;
GRANT ALL ON public.pastoral_events TO authenticated;
