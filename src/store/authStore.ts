import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  role: 'superadmin' | 'admin' | 'member' | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  tenantId: null,
  role: null,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user) {
        // In a real app, we would fetch the user's role and tenant_id from our custom tables here
        // For now we set basic state
        set({ 
          user: session.user, 
          session,
          // Temporary mock logic based on email to distinguish SuperAdmin vs Tenant
          role: session.user.email === 'admin@hermes.app' ? 'superadmin' : 'admin',
          tenantId: session.user.email === 'admin@hermes.app' ? null : 'mock-tenant-id',
          isLoading: false 
        });
      } else {
        set({ user: null, session: null, role: null, tenantId: null, isLoading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          set({ 
            user: newSession.user, 
            session: newSession,
            role: newSession.user.email === 'admin@hermes.app' ? 'superadmin' : 'admin',
            tenantId: newSession.user.email === 'admin@hermes.app' ? null : 'mock-tenant-id',
            isLoading: false 
          });
        } else {
          set({ user: null, session: null, role: null, tenantId: null, isLoading: false });
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