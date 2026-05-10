-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant users relationship
-- Assuming Supabase auth.users exists
CREATE TABLE public.tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- Apps catalog
CREATE TABLE public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    llm_config JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant app installations
CREATE TABLE public.tenant_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, app_id)
);

-- Chat history
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    messages JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage logs for billing
CREATE TABLE public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    provider VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,6) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX idx_tenant_apps_tenant_id ON public.tenant_apps(tenant_id);
CREATE INDEX idx_chat_history_user_tenant ON public.chat_history(user_id, tenant_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);
CREATE INDEX idx_usage_logs_tenant_date ON public.usage_logs(tenant_id, created_at DESC);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their tenant" ON public.tenants FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tenant_users 
        WHERE tenant_users.tenant_id = tenants.id 
        AND tenant_users.user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their tenant users" ON public.tenant_users FOR SELECT USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Anyone can view public apps" ON public.apps FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their tenant apps" ON public.tenant_apps FOR SELECT USING (
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view and create their own chat history" ON public.chat_history FOR ALL USING (
    user_id = auth.uid() AND 
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
) WITH CHECK (
    user_id = auth.uid() AND 
    tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid()
    )
);

-- Grant permissions (these will be executed in grant-supabase-permissions step as well, but good to have in schema)
GRANT SELECT ON public.tenants TO anon;
GRANT ALL ON public.tenants TO authenticated;

GRANT SELECT ON public.tenant_users TO authenticated;
GRANT ALL ON public.tenant_users TO authenticated;

GRANT SELECT ON public.apps TO anon;
GRANT SELECT ON public.apps TO authenticated;

GRANT SELECT ON public.tenant_apps TO authenticated;
GRANT ALL ON public.tenant_apps TO authenticated;

GRANT SELECT ON public.chat_history TO authenticated;
GRANT ALL ON public.chat_history TO authenticated;

GRANT SELECT ON public.usage_logs TO authenticated;
