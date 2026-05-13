import React from 'react';
import { Building2, Plus, Search, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

export const GabineteDigital: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="text-blue-400" />
            Gabinete Digital
          </h1>
          <p className="text-gray-400">Gestão de demandas, ofícios e pedidos da população</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          Nova Demanda
        </button>
      </div>

      {/* Kanban Board Style for Demands */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {/* ABERTOS */}
        <div className="flex-1 min-w-[300px] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-medium text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-400" />
              Abertos
            </h3>
            <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">2</span>
          </div>
          
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-orange-400 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">Iluminação</span>
              <span className="text-xs text-gray-500">Hoje, 09:30</span>
            </div>
            <h4 className="font-semibold text-white mb-1">Troca de Lâmpada - Rua XV</h4>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">Morador relata que a lâmpada do poste em frente ao número 400 está queimada há 3 dias.</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <MessageSquare size={14} /> 1 msg
              </div>
              <span className="text-blue-400">João Silva</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-orange-400 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">Asfalto</span>
              <span className="text-xs text-gray-500">Ontem</span>
            </div>
            <h4 className="font-semibold text-white mb-1">Buraco na Via - Av. Brasil</h4>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">Solicitação de tapa buraco urgente devido a acidentes na via principal.</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <MessageSquare size={14} /> 3 msgs
              </div>
              <span className="text-blue-400">Maria Souza</span>
            </div>
          </div>
        </div>

        {/* EM ANDAMENTO */}
        <div className="flex-1 min-w-[300px] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-medium text-white flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Em Andamento
            </h3>
            <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">1</span>
          </div>
          
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-blue-400 hover:border-white/20 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">Saúde</span>
              <span className="text-xs text-gray-500">10/05/2024</span>
            </div>
            <h4 className="font-semibold text-white mb-1">Agendamento Exame - UBS Centro</h4>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">Ofício enviado para a secretaria de saúde aguardando resposta para o exame da Dona Cida.</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <MessageSquare size={14} /> 5 msgs
              </div>
              <span className="text-blue-400">Carlos Assessor</span>
            </div>
          </div>
        </div>

        {/* CONCLUÍDOS */}
        <div className="flex-1 min-w-[300px] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-medium text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Concluídos
            </h3>
            <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full">24</span>
          </div>
          
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-green-500 opacity-70 hover:opacity-100 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">Poda de Árvore</span>
              <span className="text-xs text-gray-500">08/05/2024</span>
            </div>
            <h4 className="font-semibold text-white mb-1">Poda na Praça da Matriz</h4>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">Serviço executado pela prefeitura após ofício do nosso gabinete.</p>
          </div>
        </div>
      </div>
    </div>
  );
};