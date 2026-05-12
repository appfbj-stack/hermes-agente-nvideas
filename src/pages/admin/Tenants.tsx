import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Search, Plus, MoreVertical, Edit2, Ban, CheckCircle, Package, Key, X, Building, Link2, DollarSign, Shield, ChevronLeft } from 'lucide-react';

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
          <div className="bg-[#0B0F19] w-full h-full flex flex-col absolute inset-0 z-30 lg:relative lg:w-[450px] xl:w-[500px] border-l border-white/5 animate-fade-in-up">
            {/* Header matching image */}
            <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-white/5 shrink-0">
               <button onClick={() => setSelectedTenant(null)} className="text-white hover:bg-white/10 p-2 -ml-2 rounded-full transition-colors lg:hidden">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
               </button>
               <Shield className="text-secondary" size={28} />
               <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Admin Master</h2>
                  <p className="text-sm text-gray-400">Módulos por cliente</p>
               </div>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <div className="bg-[#151A27] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                 {/* Tenant Info */}
                 <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#1A2030]">
                    <div>
                       <h3 className="text-white font-bold text-lg leading-tight">{activeTenantObj.name}</h3>
                       <p className="text-gray-500 text-sm">{activeTenantObj.subdomain}</p>
                    </div>
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium border border-green-500/20">
                       <div className="w-2 h-2 rounded-full bg-green-400"></div>
                       ativo
                    </div>
                 </div>

                 {/* Module List */}
                 <div className="divide-y divide-white/5">
                    {modules.map(mod => {
                       const isEnabled = activeTenantObj.modules?.includes(mod.id);
                       return (
                          <div key={mod.id} className="flex justify-between items-center p-5 hover:bg-white/5 transition-colors">
                             <span className="text-gray-200 font-medium">{mod.name}</span>
                             <button 
                                onClick={() => toggleTenantModule(activeTenantObj.id, mod.id)}
                                className={`w-12 h-6 rounded-full border-2 flex items-center px-1 transition-colors ${isEnabled ? 'border-secondary' : 'border-gray-600'}`}
                             >
                                <div className={`w-3 h-3 rounded-full transition-transform duration-300 ${isEnabled ? 'bg-secondary translate-x-6' : 'bg-gray-600 translate-x-0'}`}></div>
                             </button>
                          </div>
                       )
                    })}
                 </div>

                 {/* Consumo Section */}
                 <div className="p-5 bg-[#151A27] border-t border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                       HERMES IA — CONSUMO
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-gray-400">6 / 100 msgs</span>
                       <span className="text-sm font-bold text-secondary-light">6%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
                       <div className="bg-secondary h-2 rounded-full" style={{ width: '6%' }}></div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                       <div className="relative flex-1">
                          <select className="w-full bg-[#1A2030] border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-secondary text-white appearance-none">
                             <option>Teste — 100 msgs</option>
                             <option>Básico — 500 msgs</option>
                             <option>Pro — 2000 msgs</option>
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                             <div className="w-3 h-3 rounded-sm bg-green-400/20 border border-green-400 flex items-center justify-center">
                               <div className="w-1.5 h-1.5 bg-green-400 rounded-sm"></div>
                             </div>
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-400"></div>
                       </div>
                       <button className="bg-[#1A2030] hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 shrink-0">
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.36-2.14"></path></svg>
                          Zerar
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};