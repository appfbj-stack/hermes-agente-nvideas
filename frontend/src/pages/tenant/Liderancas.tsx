import React from 'react';
import { Flag, Plus, Search, Users, MapPin, Target, MoreHorizontal } from 'lucide-react';

export const Liderancas: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flag className="text-accent" />
            Gestão de Lideranças
          </h1>
          <p className="text-gray-400">Gerencie seus coordenadores e cabos eleitorais</p>
        </div>
        <button className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Nova Liderança
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-l-4 border-l-secondary">
          <div className="p-3 bg-secondary/20 rounded-xl text-secondary-light">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total de Lideranças</p>
            <h3 className="text-2xl font-bold text-white">45</h3>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
            <Target size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Apoiadores Captados</p>
            <h3 className="text-2xl font-bold text-white">1.284</h3>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Bairros com Atuação</p>
            <h3 className="text-2xl font-bold text-white">12</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel flex-1 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar liderança por nome ou bairro..." 
              className="w-full bg-primary/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-secondary/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/50 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Região/Bairro</th>
                <th className="px-6 py-4 font-medium">Apoiadores</th>
                <th className="px-6 py-4 font-medium">Meta</th>
                <th className="px-6 py-4 font-medium">Conversão</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Carlos Mendes', region: 'Zona Sul', count: 145, goal: 200, conv: '72%' },
                { name: 'Ana Paula', region: 'Centro', count: 89, goal: 100, conv: '89%' },
                { name: 'Roberto Justus', region: 'Vila Esperança', count: 42, goal: 150, conv: '28%' },
              ].map((l, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{l.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{l.region}</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary/20 text-secondary-light px-3 py-1 rounded-full text-sm font-medium">
                      {l.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{l.goal}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: l.conv }}></div>
                      </div>
                      <span className="text-xs text-gray-400">{l.conv}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white p-2">
                      <MoreHorizontal size={20} />
                    </button>
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