import React from 'react';
import { Save, Building, Globe, CreditCard, Users, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TenantSettings: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-full flex flex-col p-8 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-gray-400 mt-1">Gerencie as preferências da sua empresa (Tenant).</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Save size={16} />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav (mocked for visual layout) */}
        <div className="space-y-2">
          {[
            { name: 'Geral', icon: Building, active: true },
            { name: 'Domínio', icon: Globe, active: false },
            { name: 'Faturamento', icon: CreditCard, active: false },
            { name: 'Equipe', icon: Users, active: false },
            { name: 'Segurança', icon: Shield, active: false },
          ].map(tab => (
            <button 
              key={tab.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                tab.active 
                  ? 'bg-secondary/20 text-white border border-secondary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={tab.active ? 'text-secondary-light' : ''} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Informações da Empresa</h3>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-2xl border border-white/10 shadow-lg">
                AC
              </div>
              <div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10 mb-2">
                  Trocar Logo
                </button>
                <p className="text-xs text-gray-500">Recomendado: 256x256px, formato PNG ou SVG.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Empresa</label>
                <input 
                  type="text" 
                  defaultValue="Acme Corp"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subdomínio (Workspace)</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    defaultValue="acme"
                    className="w-full bg-black/30 border border-white/10 rounded-l-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                  />
                  <span className="bg-white/5 border border-l-0 border-white/10 px-4 py-3 text-sm text-gray-500 rounded-r-lg">
                    .hermes.app
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Perfil do Administrador</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Seu Nome</label>
                <input 
                  type="text" 
                  defaultValue="João Silva"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">E-mail de Login</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">O e-mail não pode ser alterado por aqui.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};