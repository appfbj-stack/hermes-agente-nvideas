import React, { useState } from 'react';
import { Save, Building, Globe, CreditCard, Users, Shield, Plus, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TenantSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Geral');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const TABS = [
    { name: 'Geral', icon: Building },
    { name: 'Domínio', icon: Globe },
    { name: 'Faturamento', icon: CreditCard },
    { name: 'Equipe', icon: Users },
    { name: 'Segurança', icon: Shield },
  ];

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Gerencie as preferências da sua empresa (Tenant).</p>
        </div>
        <button 
          onClick={handleSave}
          className="glass-button flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 transition-all w-full sm:w-auto"
        >
          {isSaving ? <Check size={16} className="text-green-400" /> : <Save size={16} />}
          <span>{isSaving ? 'Salvo!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar Nav */}
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
          {TABS.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.name 
                  ? 'bg-secondary/20 text-white border border-secondary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.name ? 'text-secondary-light' : ''} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'Geral' && (
            <>
              <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Informações da Empresa</h3>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-2xl border border-white/10 shadow-lg shrink-0">
                    AC
                  </div>
                  <div className="text-center sm:text-left">
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
                        className="w-full bg-black/30 border border-white/10 rounded-l-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white min-w-0"
                      />
                      <span className="bg-white/5 border border-l-0 border-white/10 px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-500 rounded-r-lg whitespace-nowrap">
                        .hermes.app
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
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
            </>
          )}

          {activeTab === 'Domínio' && (
            <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Domínio Personalizado</h3>
              <p className="text-gray-300 text-sm mb-4">Conecte seu próprio domínio (ex: app.suaempresa.com.br) para oferecer uma experiência White-Label aos seus clientes.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Seu Domínio</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="app.suaempresa.com.br"
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 text-white"
                  />
                  <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6 overflow-x-auto">
                <h4 className="text-sm font-semibold text-white mb-2">Configuração de DNS</h4>
                <p className="text-xs text-gray-400 mb-4">Adicione o registro abaixo no painel do seu provedor de domínio (Registro.br, Cloudflare, GoDaddy).</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-black/50 p-3 rounded text-sm font-mono text-gray-300 border border-white/5 gap-2 min-w-[300px]">
                  <span className="text-secondary-light">CNAME</span>
                  <span>app</span>
                  <span className="truncate">cname.hermes.app</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Faturamento' && (
            <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <h3 className="text-lg font-bold">Plano e Faturamento</h3>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">Ativo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-secondary/20 to-purple-500/10 border border-secondary/30 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <p className="text-sm text-gray-300 mb-1 relative z-10">Plano Atual</p>
                  <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Enterprise</h4>
                  <p className="text-3xl font-bold text-white mb-1 relative z-10">R$ 497<span className="text-sm text-gray-400 font-normal">/mês</span></p>
                  <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors relative z-10 border border-white/5">
                    Mudar de Plano
                  </button>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-center">
                  <p className="text-sm text-gray-400 mb-2">Método de Pagamento</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-8 bg-black/50 rounded flex items-center justify-center text-xs font-bold border border-white/10 text-gray-300">VISA</div>
                    <div>
                      <p className="text-sm text-white font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expira em 12/28</p>
                    </div>
                  </div>
                  <button className="text-secondary hover:text-secondary-light text-sm font-medium text-left transition-colors">
                    Atualizar cartão
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Equipe' && (
            <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                <h3 className="text-lg font-bold">Membros da Equipe</h3>
                <button className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-secondary/20 w-full sm:w-auto">
                  <Plus size={16} />
                  Convidar Membro
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'João Silva', email: user?.email || 'joao@acme.com', role: 'Admin', status: 'Ativo' },
                  { name: 'Maria Souza', email: 'maria@acme.com', role: 'Editor', status: 'Pendente' },
                ].map((member, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white border border-white/10 shrink-0">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                        <p className="text-xs text-gray-400 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:justify-end">
                      <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">{member.role}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
                        member.status === 'Ativo' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Segurança' && (
            <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Segurança da Conta</h3>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white">Autenticação em Duas Etapas (2FA)</h4>
                    <p className="text-xs text-gray-400 mt-1">Adicione uma camada extra de segurança à sua conta.</p>
                  </div>
                  <button className="bg-secondary hover:bg-secondary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-secondary/20 w-full sm:w-auto">
                    Configurar 2FA
                  </button>
                </div>
                
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white">Senha de Acesso</h4>
                    <p className="text-xs text-gray-400 mt-1">Sua senha foi alterada pela última vez há 3 meses.</p>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 w-full sm:w-auto">
                    Alterar Senha
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};