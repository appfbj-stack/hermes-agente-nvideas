import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  appModule: string | null;
  role: 'superadmin' | 'admin' | 'member' | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  tenantId: null,
  appModule: null,
  role: null,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user) {
        // Read tenant_id and app_module from metadata
        const metadata = session.user.user_metadata || {};
        const tenantId = metadata.tenant_id || (session.user.email === 'admin@hermes.app' ? null : 'mock-tenant-id');
        const appModule = metadata.app_module || 'politica';
        
        set({ 
          user: session.user, 
          session,
          role: session.user.email === 'admin@hermes.app' ? 'superadmin' : 'admin',
          tenantId,
          appModule,
          isLoading: false 
        });
      } else {
        set({ user: null, session: null, role: null, tenantId: null, appModule: null, isLoading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          const metadata = newSession.user.user_metadata || {};
          const tenantId = metadata.tenant_id || (newSession.user.email === 'admin@hermes.app' ? null : 'mock-tenant-id');
          const appModule = metadata.app_module || 'politica';

          set({ 
            user: newSession.user, 
            session: newSession,
            role: newSession.user.email === 'admin@hermes.app' ? 'superadmin' : 'admin',
            tenantId,
            appModule,
            isLoading: false 
          });
        } else {
          set({ user: null, session: null, role: null, tenantId: null, appModule: null, isLoading: false });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, session: null, role: null, tenantId: null, isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null, tenantId: null, isLoading: false });
  }
}));