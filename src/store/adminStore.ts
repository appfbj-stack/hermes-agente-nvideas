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
}

// Mock data initially. Will be replaced with Supabase calls later.
const MOCK_MODULES: AppModule[] = [
  { id: 'm1', name: 'Hermes IA', category: 'core', description: 'Assistente pessoal inteligente com memória', is_public: true, active_tenants: 15, icon: 'Bot' },
  { id: 'm2', name: 'CRM Pro', category: 'business', description: 'Gestão de relacionamento com clientes', is_public: true, active_tenants: 8, icon: 'Briefcase' },
  { id: 'm3', name: 'Agenda Inteligente', category: 'productivity', description: 'Agendamento com IA e lembretes automáticos', is_public: true, active_tenants: 12, icon: 'Calendar' },
  { id: 'm4', name: 'WhatsApp Bot', category: 'communication', description: 'Atendimento automatizado via WhatsApp', is_public: false, active_tenants: 3, icon: 'MessageSquare' },
  { id: 'm5', name: 'Gestão de Igreja', category: 'niche', description: 'Módulo específico para congregações', is_public: true, active_tenants: 2, icon: 'BookOpen' },
  { id: 'm6', name: 'Oficina Auto', category: 'niche', description: 'Orçamentos e gestão de veículos', is_public: true, active_tenants: 1, icon: 'Wrench' },
];

const MOCK_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corp',
    subdomain: 'acme',
    plan: 'enterprise',
    status: 'active',
    users_count: 15,
    api_calls: 150240,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'TechFlow',
    subdomain: 'techflow',
    plan: 'pro',
    status: 'active',
    users_count: 5,
    api_calls: 45000,
    created_at: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Suspended LLC',
    subdomain: 'suspended',
    plan: 'free',
    status: 'blocked',
    users_count: 1,
    api_calls: 0,
    created_at: '2024-03-01T09:15:00Z'
  }
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
  }
}));