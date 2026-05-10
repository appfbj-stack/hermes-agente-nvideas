import React from 'react';
import { Plus, Search, Filter, MoreHorizontal, MessageSquare, Phone, Calendar as CalendarIcon } from 'lucide-react';

const KANBAN_COLUMNS = [
  { id: 'leads', title: 'Novos Leads', color: 'border-blue-500/50' },
  { id: 'contacting', title: 'Em Contato / Follow-up', color: 'border-yellow-500/50' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'border-purple-500/50' },
  { id: 'closed', title: 'Fechado (Ganho)', color: 'border-green-500/50' },
];

const MOCK_LEADS = [
  { id: 1, name: 'Empresa Alpha', contact: 'Carlos Silva', status: 'leads', value: 'R$ 5.000', lastAction: 'Cadastrou via site' },
  { id: 2, name: 'Beta Tech', contact: 'Ana Souza', status: 'contacting', value: 'R$ 12.000', lastAction: 'Reunião agendada' },
  { id: 3, name: 'Gama Solutions', contact: 'Roberto', status: 'proposal', value: 'R$ 8.500', lastAction: 'Proposta enviada ontem' },
  { id: 4, name: 'Delta Corp', contact: 'Mariana', status: 'closed', value: 'R$ 25.000', lastAction: 'Contrato assinado' },
  { id: 5, name: 'Omega Lda', contact: 'Pedro', status: 'leads', value: 'R$ 3.000', lastAction: 'Hermes qualificou' },
];

export const TenantCrm: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">CRM & Pipeline</h2>
          <p className="text-gray-400 mt-1">Gerencie seus clientes e acompanhe o funil de vendas (Follow-ups).</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Plus size={16} />
          <span>Novo Lead</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 bg-black/20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Buscar por nome, empresa ou valor..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
          />
        </div>
        <button className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(column => (
          <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
            <div className={`mb-4 pb-2 border-b-2 ${column.color} flex justify-between items-center`}>
              <h3 className="font-semibold text-white">{column.title}</h3>
              <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">
                {MOCK_LEADS.filter(l => l.status === column.id).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {MOCK_LEADS.filter(l => l.status === column.id).map(lead => (
                <div key={lead.id} className="glass-panel p-4 rounded-xl cursor-pointer hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(123,104,238,0.1)] transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white group-hover:text-secondary-light transition-colors">{lead.name}</h4>
                    <button className="text-gray-500 hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{lead.contact}</p>
                  
                  <div className="text-xs text-gray-500 bg-black/20 p-2 rounded-lg mb-4">
                    <span className="text-secondary-light font-medium block mb-1">Última ação:</span>
                    {lead.lastAction}
                  </div>

                  <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-3">
                    <span className="font-mono text-sm text-green-400">{lead.value}</span>
                    <div className="flex gap-2 text-gray-400">
                      <button className="hover:text-blue-400 transition-colors"><MessageSquare size={14} /></button>
                      <button className="hover:text-green-400 transition-colors"><Phone size={14} /></button>
                      <button className="hover:text-purple-400 transition-colors"><CalendarIcon size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};