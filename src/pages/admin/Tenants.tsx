import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Search, Plus, MoreVertical, Edit2, Ban, CheckCircle, Package, Key, X, Building, Link2, DollarSign } from 'lucide-react';

export const Tenants: React.FC = () => {
  const { tenants, modules, isLoading, fetchTenants, fetchModules, updateTenantStatus, toggleTenantModule } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
    fetchModules();
  }, [fetchTenants, fetchModules]);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTenantObj = tenants.find(t => t.id === selectedTenant);

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Clientes (Tenants)</h2>
          <p className="text-gray-400 mt-1">Gerencie empresas, planos e acesse quais módulos cada um possui.</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Plus size={16} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        
        {/* Table Column */}
        <div className={`glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedTenant ? 'hidden lg:flex lg:w-1/2' : 'w-full'}`}>
          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
              />
            </div>
            <div className="hidden sm:flex gap-2">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-300">
                <option value="">Todos os Planos</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-secondary">Carregando tenants...</div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Cliente</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 hidden xl:table-cell">Plano / Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <tr 
                        key={tenant.id} 
                        className={`transition-colors group cursor-pointer ${selectedTenant === tenant.id ? 'bg-secondary/10 border-l-4 border-secondary' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
                        onClick={() => setSelectedTenant(tenant.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-sm border border-white/10 shrink-0">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">{tenant.name}</span>
                              <span className="text-xs text-gray-400 block truncate">{tenant.subdomain}.hermes.app</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              tenant.plan === 'enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                              tenant.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                              {tenant.plan}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              tenant.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              tenant.status === 'blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                              {tenant.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors" title="Gerenciar Acessos">
                            <Key size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTenant && activeTenantObj && (
          <div className="glass-panel rounded-2xl w-full lg:w-[450px] xl:w-[500px] flex flex-col shrink-0 animate-fade-in-up border border-secondary/30 relative z-20 h-full">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20 shrink-0">
              <h3 className="font-bold text-lg text-white">Gerenciar Assinatura</h3>
              <button onClick={() => setSelectedTenant(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 flex-1 min-h-0">
              
              {/* Tenant Header Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-2xl border border-white/10 shadow-lg">
                  {activeTenantObj.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{activeTenantObj.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Link2 size={14} />
                    <a href={`https://${activeTenantObj.subdomain}.hermes.app`} target="_blank" className="hover:text-secondary-light transition-colors underline-offset-2 hover:underline">
                      {activeTenantObj.subdomain}.hermes.app
                    </a>
                  </div>
                </div>
              </div>

              {/* Status and Plan Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><Building size={16}/> <span className="text-xs font-bold uppercase">Status da Conta</span></div>
                  <select 
                    value={activeTenantObj.status} 
                    onChange={(e) => updateTenantStatus(activeTenantObj.id, e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary text-white"
                  >
                    <option value="active">Ativo (Liberado)</option>
                    <option value="blocked">Bloqueado (Inadimplente)</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2"><DollarSign size={16}/> <span className="text-xs font-bold uppercase">Plano</span></div>
                  <select 
                    value={activeTenantObj.plan} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary text-white"
                    disabled
                  >
                    <option value="free">Free / Trial</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              {/* AI Consumption Section (from mockup) */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    HERMES IA — CONSUMO
                  </h4>
                </div>
                
                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">6 / 100 msgs</span>
                    <span className="text-xs font-bold text-secondary-light">6%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: '6%' }}></div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-2 text-sm focus:outline-none focus:border-secondary text-white appearance-none">
                        <option>Teste — 100 msgs</option>
                        <option>Básico — 500 msgs</option>
                        <option>Pro — 2000 msgs</option>
                      </select>
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"></div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-400"></div>
                    </div>
                    <button className="bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary-light p-2 rounded-lg transition-colors flex items-center justify-center shrink-0">
                      <CheckCircle size={16} />
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shrink-0">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.36-2.14"></path></svg>
                      Zerar
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Package className="text-secondary-light" size={18} />
                    Módulos Liberados
                  </h4>
                  <span className="text-xs bg-secondary/20 text-secondary-light px-2 py-1 rounded-full font-bold">
                    {activeTenantObj.modules?.length || 0} ativos
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">Selecione quais aplicativos (módulos) aparecerão no menu deste cliente quando ele fizer login.</p>
                
                <div className="space-y-2">
                  {modules.map(mod => {
                    const isEnabled = activeTenantObj.modules?.includes(mod.id);
                    return (
                      <div key={mod.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isEnabled ? 'bg-secondary/10 border-secondary/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                        <div>
                          <span className={`font-bold block ${isEnabled ? 'text-white' : 'text-gray-400'}`}>{mod.name}</span>
                          <span className="text-xs text-gray-500">{mod.category}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isEnabled || false}
                            onChange={() => toggleTenantModule(activeTenantObj.id, mod.id)}
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};