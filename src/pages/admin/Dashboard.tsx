import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Users, Activity, BrainCircuit, CreditCard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tenants, isLoading, fetchTenants } = useAdminStore();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const stats = [
    { 
      name: 'Total Tenants', 
      value: tenants.length, 
      icon: Users, 
      change: '+2 this week',
      color: 'text-blue-400' 
    },
    { 
      name: 'Active Users', 
      value: tenants.reduce((acc, t) => acc + t.users_count, 0), 
      icon: Activity, 
      change: '+15% from last month',
      color: 'text-green-400'
    },
    { 
      name: 'API Calls (IA)', 
      value: (tenants.reduce((acc, t) => acc + t.api_calls, 0) / 1000).toFixed(1) + 'k', 
      icon: BrainCircuit, 
      change: '+5.4k today',
      color: 'text-purple-400'
    },
    { 
      name: 'MRR', 
      value: '$4,250', 
      icon: CreditCard, 
      change: '+$450 this month',
      color: 'text-emerald-400'
    },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-pulse text-secondary">Carregando dados do painel...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-gray-400 mt-1">Bem-vindo ao painel Superadmin do Hermes SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} className={stat.color} />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-medium text-gray-300">{stat.name}</h3>
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Consumo de IA Recente</h3>
          <div className="h-64 flex items-end gap-2 pt-4">
            {/* Simple CSS Chart placeholder */}
            {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
              <div key={i} className="flex-1 bg-secondary/20 hover:bg-secondary/40 transition-colors rounded-t-md border-t border-secondary/50 relative group" style={{ height: `${(h/120)*100}%` }}>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs">
                  {h}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-medium mb-4">Tenants Recentes</h3>
          <div className="space-y-4">
            {tenants.slice(0, 4).map(tenant => (
              <div key={tenant.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-medium text-sm">{tenant.name}</p>
                  <p className="text-xs text-gray-500">{tenant.subdomain}.hermes.app</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs border ${
                  tenant.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  tenant.status === 'blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {tenant.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};