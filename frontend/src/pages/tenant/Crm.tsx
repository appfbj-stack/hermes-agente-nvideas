import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, MessageSquare, Phone, Calendar as CalendarIcon, X, Edit2, Trash2, Bot, Sparkles, MapPin, Flag } from 'lucide-react';

interface Eleitor {
  id: string;
  name: string;
  phone: string;
  bairro: string;
  lideranca: string;
  status: 'Apoiador' | 'Indeciso' | 'Oposição';
  lastContact: string;
}

const MOCK_ELEITORES: Eleitor[] = [
  { id: '1', name: 'Carlos Oliveira', phone: '(11) 99999-9999', bairro: 'Centro', lideranca: 'João Silva', status: 'Apoiador', lastContact: 'Hoje' },
  { id: '2', name: 'Ana Souza', phone: '(11) 88888-8888', bairro: 'Zona Sul', lideranca: 'Maria', status: 'Indeciso', lastContact: 'Ontem' },
  { id: '3', name: 'Roberto Santos', phone: '(11) 77777-7777', bairro: 'Vila Esperança', lideranca: 'Pedro', status: 'Apoiador', lastContact: '2 dias atrás' },
];

export const TenantCrm: React.FC = () => {
  const [eleitores, setEleitores] = useState<Eleitor[]>(MOCK_ELEITORES);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            CRM Eleitoral
            <span className="bg-secondary/20 text-secondary-light text-xs px-2 py-1 rounded-full border border-secondary/30 flex items-center gap-1">
              <Sparkles size={12} />
              IA Ativa
            </span>
          </h1>
          <p className="text-gray-400">Gestão de eleitores, apoiadores e mapeamento de votos</p>
        </div>
        <button className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Novo Eleitor
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex gap-4 items-center border-white/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone, bairro ou liderança..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-primary/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-secondary/50 transition-colors"
          />
        </div>
        <button className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 hover:text-white">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      <div className="glass-panel flex-1 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/50 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Eleitor</th>
                <th className="px-6 py-4 font-medium">Bairro</th>
                <th className="px-6 py-4 font-medium">Liderança</th>
                <th className="px-6 py-4 font-medium">Intenção de Voto</th>
                <th className="px-6 py-4 font-medium">Último Contato</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eleitores.map((eleitor) => (
                <tr key={eleitor.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{eleitor.name}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {eleitor.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-300">
                      <MapPin size={14} className="text-gray-500" />
                      {eleitor.bairro}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Flag size={14} className="text-gray-500" />
                      {eleitor.lideranca}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      eleitor.status === 'Apoiador' ? 'bg-green-500/20 text-green-400' :
                      eleitor.status === 'Indeciso' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {eleitor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {eleitor.lastContact}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors" title="Chamar no WhatsApp">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-2 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};