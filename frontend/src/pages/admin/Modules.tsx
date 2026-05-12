import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Search, Plus, Bot, Briefcase, Calendar, MessageSquare, BookOpen, Wrench, Settings } from 'lucide-react';

// Icon mapping helper
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Bot': return Bot;
    case 'Briefcase': return Briefcase;
    case 'Calendar': return Calendar;
    case 'MessageSquare': return MessageSquare;
    case 'BookOpen': return BookOpen;
    case 'Wrench': return Wrench;
    default: return Settings;
  }
};

export const Modules: React.FC = () => {
  const { modules, isLoading, fetchModules, toggleModuleStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Módulos & App Store</h2>
          <p className="text-gray-400 mt-1">Gerencie os aplicativos disponíveis globalmente para os clientes.</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Plus size={16} />
          <span>Criar Módulo</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 bg-black/20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Buscar módulos por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
          />
        </div>
        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-300 w-48">
          <option value="">Todas as Categorias</option>
          <option value="core">Core (Base)</option>
          <option value="business">Business</option>
          <option value="productivity">Produtividade</option>
          <option value="niche">Nichos Específicos</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-pulse text-secondary">Carregando módulos...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-auto pb-6">
          {filteredModules.map((mod) => {
            const IconComponent = getIcon(mod.icon);
            return (
              <div key={mod.id} className="glass-panel p-6 rounded-2xl flex flex-col relative group transition-all duration-300 hover:border-secondary/30 hover:shadow-[0_0_20px_rgba(123,104,238,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${mod.is_public ? 'bg-secondary/20 text-secondary-light' : 'bg-gray-500/20 text-gray-400'}`}>
                    <IconComponent size={24} />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={mod.is_public}
                      onChange={() => toggleModuleStatus(mod.id)}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                  </label>
                </div>
                
                <div className="mb-2">
                  <span className="text-xs font-mono uppercase text-gray-500 tracking-wider bg-black/30 px-2 py-1 rounded-md">
                    {mod.category}
                  </span>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${mod.is_public ? 'text-white' : 'text-gray-400'}`}>
                  {mod.name}
                </h3>
                
                <p className="text-sm text-gray-400 mb-6 flex-1">
                  {mod.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                  <div className="text-xs text-gray-500">
                    <span className="font-bold text-gray-300">{mod.active_tenants}</span> clientes ativos
                  </div>
                  <button className="text-secondary hover:text-secondary-light transition-colors p-1">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};