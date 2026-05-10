import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Calendar, Briefcase, Users, ArrowRight, Activity, Zap, Settings } from 'lucide-react';

export const TenantDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Olá, João! 👋</h2>
          <p className="text-gray-300 max-w-2xl text-lg">
            Bem-vindo ao portal da Acme Corp. O Hermes processou 145 interações hoje e agendou 3 novos compromissos automaticamente.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/t/chat" className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-secondary/25">
              <Bot size={20} />
              Falar com Hermes
            </Link>
            <Link to="/t/calendar" className="glass-button px-6 py-3 rounded-xl font-medium flex items-center gap-2">
              <Calendar size={20} />
              Ver Agenda
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apps Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Zap size={20} className="text-accent" />
            Seus Aplicativos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Hermes Chat', desc: 'Assistente pessoal e automações', icon: Bot, path: '/t/chat', color: 'text-secondary-light', bg: 'bg-secondary/20' },
              { name: 'CRM', desc: 'Gestão de clientes e funil', icon: Briefcase, path: '/t/crm', color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { name: 'Agenda', desc: 'Compromissos e lembretes', icon: Calendar, path: '/t/calendar', color: 'text-green-400', bg: 'bg-green-500/20' },
              { name: 'Equipe', desc: 'Gestão de acessos', icon: Users, path: '/t/settings', color: 'text-purple-400', bg: 'bg-purple-500/20' },
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
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            Atividade Recente
          </h3>
          <div className="glass-panel rounded-2xl p-5">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {[
                { time: '10:45', text: 'Hermes agendou reunião com Marcos', icon: Calendar, color: 'text-green-400' },
                { time: '09:30', text: 'Novo lead adicionado ao CRM', icon: Briefcase, color: 'text-blue-400' },
                { time: 'Ontem', text: 'Relatório semanal gerado', icon: Bot, color: 'text-secondary-light' },
                { time: 'Ontem', text: 'Você alterou as configurações', icon: Settings, color: 'text-gray-400' },
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
    </div>
  );
};