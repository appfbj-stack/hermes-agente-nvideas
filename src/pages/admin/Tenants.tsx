import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Search, Plus, MoreVertical, Edit2, Ban, CheckCircle } from 'lucide-react';

export const Tenants: React.FC = () => {
  const { tenants, isLoading, fetchTenants, updateTenantStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Clientes (Tenants)</h2>
          <p className="text-gray-400 mt-1">Gerencie empresas, planos e acessos à plataforma.</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Plus size={16} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-300">
              <option value="">Todos os Planos</option>
              <option value="enterprise">Enterprise</option>
              <option value="pro">Pro</option>
              <option value="free">Free</option>
            </select>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-300">
              <option value="">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-secondary">Carregando tenants...</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Cliente</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Subdomínio</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Plano</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Uso (API)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-xs border border-white/10">
                            {tenant.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{tenant.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {tenant.subdomain}.hermes.app
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs border capitalize ${
                          tenant.plan === 'enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          tenant.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {tenant.api_calls.toLocaleString()} reqs
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs border inline-flex items-center gap-1 ${
                          tenant.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          tenant.status === 'blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          {tenant.status === 'active' ? 'Ativo' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {tenant.status === 'active' ? (
                            <button 
                              onClick={() => updateTenantStatus(tenant.id, 'blocked')}
                              className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                              title="Bloquear Cliente"
                            >
                              <Ban size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => updateTenantStatus(tenant.id, 'active')}
                              className="p-2 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded transition-colors"
                              title="Desbloquear Cliente"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors" title="Editar">
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};