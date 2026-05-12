import { create } from 'zustand';

export type TenantPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: TenantPlan;
  status: 'active' | 'blocked' | 'pending';
  users_count: number;
  api_calls: number;
  created_at: string;
  modules: string[];
}

export interface AppModule {
  id: string;
  name: string;
  category: string;
  description: string;
  is_public: boolean;
  active_tenants: number;
  icon: string;
}

interface AdminState {
  tenants: Tenant[];
  modules: AppModule[];
  isLoading: boolean;
  fetchTenants: () => Promise<void>;
  fetchModules: () => Promise<void>;
  updateTenantStatus: (id: string, status: Tenant['status']) => Promise<void>;
  toggleModuleStatus: (id: string) => Promise<void>;
  toggleTenantModule: (tenantId: string, moduleId: string) => Promise<void>;
}

// Mock data initially. Will be replaced with Supabase calls later.
const MOCK_MODULES: AppModule[] = [
  { id: 'crm', name: 'CRM', category: 'business', description: 'Gestão de clientes, leads e funil de vendas avançado.', icon: 'Briefcase', is_public: true, active_tenants: 145 },
  { id: 'agenda', name: 'Agenda', category: 'productivity', description: 'Calendário compartilhado e agendamento de recursos.', icon: 'Calendar', is_public: true, active_tenants: 210 },
  { id: 'biblia', name: 'Bíblia', category: 'niche', description: 'Bíblia completa com recursos de estudo e IA.', icon: 'BookOpen', is_public: true, active_tenants: 10 },
  { id: 'kanban', name: 'Kanban', category: 'productivity', description: 'Quadro ágil para projetos.', icon: 'Layout', is_public: true, active_tenants: 89 },
  { id: 'whatsapp', name: 'WhatsApp', category: 'niche', description: 'Integração direta.', icon: 'MessageCircle', is_public: true, active_tenants: 42 },
  { id: 'followup', name: 'Follow-up', category: 'niche', description: 'Acompanhamento automático.', icon: 'Activity', is_public: true, active_tenants: 15 },
  { id: 'ai_hermes', name: 'Hermes IA', category: 'core', description: 'Assistente virtual inteligente.', icon: 'Bot', is_public: true, active_tenants: 89 },
  { id: 'instagram', name: 'Instagram', category: 'productivity', description: 'Integração Insta.', icon: 'Instagram', is_public: false, active_tenants: 0 },
  { id: 'youtube', name: 'YouTube', category: 'productivity', description: 'Integração YT.', icon: 'Youtube', is_public: false, active_tenants: 0 },
];

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'borges', subdomain: 'borges', plan: 'enterprise', status: 'active', users_count: 15, api_calls: 45230, created_at: '2025-01-10', modules: ['ai_hermes'] },
  { id: '2', name: 'Global Tech', subdomain: 'globaltech', plan: 'pro', status: 'active', users_count: 5, api_calls: 12500, created_at: '2025-02-15', modules: ['crm'] },
  { id: '3', name: 'Igreja Vida Nova', subdomain: 'igrejavida', plan: 'pro', status: 'active', users_count: 3, api_calls: 8900, created_at: '2025-03-01', modules: ['agenda', 'ai_hermes'] },
  { id: '4', name: 'Oficina do Zé', subdomain: 'oficinaze', plan: 'pro', status: 'active', users_count: 2, api_calls: 1200, created_at: '2025-04-10', modules: ['crm', 'ai_hermes'] },
  { id: '5', name: 'Startup Inc', subdomain: 'startup', plan: 'free', status: 'blocked', users_count: 1, api_calls: 100000, created_at: '2024-11-20', modules: ['kanban'] },
];

export const useAdminStore = create<AdminState>((set) => ({
  tenants: [],
  modules: [],
  isLoading: false,
  
  fetchTenants: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ tenants: MOCK_TENANTS, isLoading: false });
  },

  fetchModules: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    set({ modules: MOCK_MODULES, isLoading: false });
  },
  
  updateTenantStatus: async (id, status) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    set(state => ({
      tenants: state.tenants.map(t => t.id === id ? { ...t, status } : t),
      isLoading: false
    }));
  },

  toggleModuleStatus: async (id) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 400));
    set(state => ({
      modules: state.modules.map(m => m.id === id ? { ...m, is_public: !m.is_public } : m),
      isLoading: false
    }));
  },

  toggleTenantModule: async (tenantId: string, moduleId: string) => {
    set(state => ({
      tenants: state.tenants.map(t => {
        if (t.id === tenantId) {
          const hasModule = t.modules.includes(moduleId);
          return {
            ...t,
            modules: hasModule 
              ? t.modules.filter(m => m !== moduleId) 
              : [...t.modules, moduleId]
          };
        }
        return t;
      })
    }));
  }
}));