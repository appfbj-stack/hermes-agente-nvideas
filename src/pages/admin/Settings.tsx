import React, { useState } from 'react';
import { Save, Globe, Shield, Mail, Database, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações Globais</h2>
          <p className="text-gray-400 mt-1">Gerencie os parâmetros globais da plataforma SaaS.</p>
        </div>
        <button className="bg-secondary hover:bg-secondary-light text-white flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-secondary/20">
          <Save size={16} />
          <span>Salvar Configurações</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral de Configurações */}
        <div className="space-y-2">
          {[
            { name: 'Geral', icon: Globe, active: true },
            { name: 'Segurança e Acesso', icon: Shield, active: false },
            { name: 'SMTP & Email', icon: Mail, active: false },
            { name: 'Backups', icon: Database, active: false },
          ].map(tab => (
            <button 
              key={tab.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                tab.active 
                  ? 'bg-secondary/20 text-white border border-secondary/30 shadow-[0_0_15px_rgba(123,104,238,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={tab.active ? 'text-secondary-light' : ''} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Área de Conteúdo */}
        <div className="lg:col-span-3 space-y-6">
          {/* Informações Gerais */}
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4 text-white">Informações da Plataforma</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Plataforma</label>
                <input 
                  type="text" 
                  defaultValue="Hermes SaaS"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">URL Base</label>
                <input 
                  type="text" 
                  defaultValue="https://hermes.app"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">E-mail de Suporte Global</label>
                <input 
                  type="email" 
                  defaultValue="suporte@hermes.app"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                />
              </div>
            </div>
          </div>

          {/* Segurança e Controle */}
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4 text-white">Segurança e Controle</h3>
            
            <div className="space-y-6">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-medium">Permitir Novos Cadastros</h4>
                  <p className="text-sm text-gray-400 mt-1">Se ativado, qualquer pessoa poderá criar um Tenant na tela de Login.</p>
                </div>
                <button 
                  onClick={() => setAllowSignups(!allowSignups)}
                  className={`transition-colors ${allowSignups ? 'text-secondary-light' : 'text-gray-500'}`}
                >
                  {allowSignups ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h4 className="text-white font-medium">Modo de Manutenção</h4>
                  <p className="text-sm text-gray-400 mt-1">Bloqueia o acesso de todos os Tenants e exibe uma tela de manutenção.</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`transition-colors ${maintenanceMode ? 'text-red-400' : 'text-gray-500'}`}
                >
                  {maintenanceMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};