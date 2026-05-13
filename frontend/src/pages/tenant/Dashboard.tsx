import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Calendar, Briefcase, Users, ArrowRight, Activity, Zap, Settings, MapPin, Flag, Building2, Wrench, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TenantDashboard: React.FC = () => {
  const { appModule, role } = useAuthStore();

  // Função para renderizar o Dashboard de Política
  const renderPolitica = () => (
    <>
      {/* Welcome Section */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Olá, Vereador(a)! 🇧🇷</h2>
          <p className="text-gray-300 max-w-2xl text-lg">
            Bem-vindo ao seu Gabinete Digital. O Hermes processou 145 interações hoje e cadastrou 12 novos apoiadores via WhatsApp automaticamente.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/t/chat" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/25">
              <Bot size={20} />
              WhatsApp & IA
            </Link>
            <Link to="/t/crm" className="glass-button px-6 py-3 rounded-xl font-medium flex items-center gap-2">
              <Users size={20} />
              Ver Eleitores
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Apps Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            Módulos da Campanha
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'CRM Eleitoral', desc: 'Gestão de eleitores e votos', icon: Users, path: '/t/crm', color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { name: 'Lideranças', desc: 'Coordenadores e Cabos', icon: Flag, path: '/t/liderancas', color: 'text-green-400', bg: 'bg-green-500/20' },
              { name: 'Gabinete Digital', desc: 'Demandas da população', icon: Building2, path: '/t/gabinete', color: 'text-orange-400', bg: 'bg-orange-500/20' },
              { name: 'Agenda Política', desc: 'Eventos, visitas e reuniões', icon: Calendar, path: '/t/calendar', color: 'text-purple-400', bg: 'bg-purple-500/20' },
            ].map(app => (
              <Link key={app.name} to={app.path} className="glass-panel p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all group">
                <div className={`p-3 rounded-xl ${app.bg} ${app.color}`}>
                  <app.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-secondary-light transition-colors">{app.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{app.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
             <div className="glass-panel p-4 rounded-xl text-center">
                <p className="text-gray-400 text-xs mb-1">Apoiadores</p>
                <h4 className="text-2xl font-bold text-white">4.280</h4>
             </div>
             <div className="glass-panel p-4 rounded-xl text-center">
                <p className="text-gray-400 text-xs mb-1">Bairros Mapeados</p>
                <h4 className="text-2xl font-bold text-white">32</h4>
             </div>
             <div className="glass-panel p-4 rounded-xl text-center">
                <p className="text-gray-400 text-xs mb-1">Demandas (Gabinete)</p>
                <h4 className="text-2xl font-bold text-white">156</h4>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity size={20} className="text-green-400" />
            Movimentação
          </h3>
          <div className="glass-panel rounded-2xl p-5">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {[
                { time: '10:45', text: 'Liderança "Carlos" cadastrou 5 apoiadores', icon: Users, color: 'text-green-400' },
                { time: '09:30', text: 'Nova demanda: Tapa Buraco na Zona Sul', icon: Building2, color: 'text-orange-400' },
                { time: 'Ontem', text: 'Hermes respondeu 45 eleitores no Zap', icon: Bot, color: 'text-blue-400' },
                { time: 'Ontem', text: 'Reunião com moradores confirmada', icon: Calendar, color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-primary-light shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <item.icon size={16} className={item.color} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-3 rounded-xl ml-4 md:ml-0">
                    <div className="flex items-center justify-between mb-1">
                      <time className="text-xs font-mono text-gray-500">{item.time}</time>
                    </div>
                    <div className="text-sm text-gray-300">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Função para renderizar o Dashboard Genérico (Oficina, Igreja, etc)
  const renderGenerico = () => (
    <>
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            {appModule === 'oficina' ? 'Olá, Gestor da Oficina! 🚗' : 
             appModule === 'igreja' ? 'Paz do Senhor! 🙏' : 
             'Olá, Bem-vindo! 👋'}
          </h2>
          <p className="text-gray-300 max-w-2xl text-lg">
            O Hermes processou suas interações de WhatsApp hoje e já organizou suas tarefas.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/t/chat" className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-secondary/25">
              <Bot size={20} />
              WhatsApp & IA
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap size={20} className="text-accent" />
            Seus Módulos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/t/chat" className="glass-panel p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all group">
              <div className="p-3 rounded-xl bg-secondary/20 text-secondary-light">
                <Bot size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white group-hover:text-secondary-light transition-colors">Hermes Chat</h4>
                <p className="text-sm text-gray-400 mt-1">Atendimento Inteligente</p>
              </div>
              <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
            </Link>

            {appModule === 'oficina' && (
              <Link to="/t/oficina" className="glass-panel p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all group">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                  <Wrench size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-secondary-light transition-colors">Gestão de Oficina</h4>
                  <p className="text-sm text-gray-400 mt-1">OS, Veículos e Peças</p>
                </div>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            )}

            {appModule === 'igreja' && (
              <Link to="/t/pastoral" className="glass-panel p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all group">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <BookOpen size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white group-hover:text-secondary-light transition-colors">Secretaria Pastoral</h4>
                  <p className="text-sm text-gray-400 mt-1">Membros e Células</p>
                </div>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            )}

            <Link to="/t/calendar" className="glass-panel p-5 rounded-2xl flex items-start gap-4 hover:border-white/20 transition-all group">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white group-hover:text-secondary-light transition-colors">Agenda</h4>
                <p className="text-sm text-gray-400 mt-1">Compromissos e Avisos</p>
              </div>
              <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
      {appModule === 'politica' || role === 'superadmin' ? renderPolitica() : renderGenerico()}
    </div>
  );
};