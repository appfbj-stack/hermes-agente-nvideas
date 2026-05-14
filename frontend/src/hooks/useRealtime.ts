import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook padronizado para escutar eventos Realtime do Supabase
 * Garante o isolamento por tenantId.
 */
export function useRealtime(
  table: string, 
  tenantId: string | null, 
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  useEffect(() => {
    if (!tenantId) return;

    // Constrói a string do canal com base na tabela e no tenant
    const channelName = `realtime:${table}:${tenantId}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { 
          event: event, 
          schema: 'public', 
          table: table, 
          filter: `tenant_id=eq.${tenantId}` 
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Escutando ${table} para o tenant ${tenantId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, tenantId, event, callback]);
}
