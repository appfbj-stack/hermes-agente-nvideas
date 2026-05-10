import React, { useState } from 'react';
import { Book, Users, Calendar, Plus, Search, Filter, CheckCircle2, MapPin, MessageSquare, Phone, Briefcase, PartyPopper, Bot, Sparkles } from 'lucide-react';

const INITIAL_EVENTS = [
  { id: 1, type: 'culto', title: 'Culto de Celebração', date: '10/05/2026', time: '19:00', location: 'Templo Principal', status: 'agendado' },
  { id: 2, type: 'visita', title: 'Visita Hospitalar - Irmão João', date: '11/05/2026', time: '14:30', location: 'Hospital Central', status: 'agendado' },
  { id: 3, type: 'aconselhamento', title: 'Aconselhamento Casal Silva', date: '12/05/2026', time: '10:00', location: 'Gabinete 1', status: 'concluido' },
  { id: 4, type: 'compromisso', title: 'Reunião Liderança', date: '13/05/2026', time: '19:30', location: 'Sala 2', status: 'agendado' },
  { id: 5, type: 'evento', title: 'Retiro de Jovens', date: '15/05/2026', time: '08:00', location: 'Acampamento', status: 'agendado' },
];

const INITIAL_MEMBERS = [
  { id: 1, name: 'João Silva', role: 'membro', phone: '(11) 99999-9999', lastVisit: '10/04/2026' },
  { id: 2, name: 'Maria Souza', role: 'lider', phone: '(11) 98888-8888', lastVisit: '05/05/2026' },
  { id: 3, name: 'Pastor Pedro', role: 'pastor', phone: '(11) 97777-7777', lastVisit: '-' },
];

export const Pastoral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'membros'>('agenda');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Book className="text-secondary" />
            Agenda Pastoral
          </h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Gerencie cultos, visitas, aconselhamentos e membros da igreja.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'agenda' && (
            <button className="glass-button flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 w-full sm:w-auto">
              <Plus size={16} />
              <span>Novo Evento</span>
            </button>
          )}
          {activeTab === 'membros' && (
            <button className="glass-button flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 w-full sm:w-auto">
              <Plus size={16} />
              <span>Novo Membro</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6">
        <button 
          onClick={() => setActiveTab('agenda')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'agenda' ? 'text-secondary-light' : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            Agenda & Eventos
          </div>
          {activeTab === 'agenda' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('membros')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'membros' ? 'text-secondary-light' : 'text-gray-400 hover:text-white'}`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            Membros
          </div>
          {activeTab === 'membros' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-t-full"></div>}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-black/20">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder={activeTab === 'agenda' ? "Buscar eventos..." : "Buscar membros..."}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
          />
        </div>
        <button className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            {/* Hermes AI Assistant Banner */}
            <div className="glass-panel p-4 rounded-xl border border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg shadow-secondary/20 shrink-0 relative z-10">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="font-bold text-white flex items-center gap-2">
                  Hermes IA <Sparkles size={14} className="text-secondary-light" />
                </h4>
                <p className="text-sm text-gray-300 mt-1">O Hermes organizou seus compromissos e sugeriu 2 horários livres para visitas esta semana.</p>
              </div>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-secondary/20 relative z-10 whitespace-nowrap">
                Ver Sugestões
              </button>
            </div>

            {events.map(event => (
              <div key={event.id} className="glass-panel p-5 rounded-xl border border-white/5 hover:border-secondary/30 transition-all group flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-light shrink-0">
                  {event.type === 'culto' && <Users size={24} />}
                  {event.type === 'visita' && <MapPin size={24} />}
                  {event.type === 'aconselhamento' && <MessageSquare size={24} />}
                  {event.type === 'compromisso' && <Briefcase size={24} />}
                  {event.type === 'evento' && <PartyPopper size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-white text-lg truncate group-hover:text-secondary-light transition-colors">{event.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      event.status === 'agendado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {event.date} às {event.time}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                    Detalhes
                  </button>
                  {event.status === 'agendado' && (
                    <button className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/20" title="Marcar como concluído">
                      <CheckCircle2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'membros' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(member => (
              <div key={member.id} className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/20 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-secondary/30 flex items-center justify-center font-bold text-white border border-white/10">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{member.name}</h4>
                      <p className="text-xs text-secondary-light capitalize">{member.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400 mb-4 flex-1">
                  <div className="flex items-center gap-2"><Phone size={14} /> {member.phone}</div>
                  <div className="flex items-center gap-2"><Calendar size={14} /> Última visita: {member.lastVisit}</div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                    Ver Perfil
                  </button>
                  <button className="py-2 px-3 bg-secondary/20 hover:bg-secondary/30 text-secondary-light rounded-lg transition-colors border border-secondary/30" title="Mensagem">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
