import React from 'react';
import { Calendar as CalendarIcon, Clock, Video, User, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const MOCK_EVENTS = [
  { id: 1, title: 'Reunião de Alinhamento - Beta Tech', time: '10:00 - 11:00', type: 'video', client: 'Ana Souza', date: 'Hoje' },
  { id: 2, title: 'Follow-up de Proposta', time: '14:30 - 15:00', type: 'call', client: 'Roberto (Gama)', date: 'Hoje' },
  { id: 3, title: 'Apresentação do Hermes', time: '09:00 - 10:00', type: 'video', client: 'Carlos Silva', date: 'Amanhã' },
];

export const TenantCalendar: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda & Follow-ups</h2>
          <p className="text-gray-400 mt-1">Seus compromissos organizados pela IA.</p>
        </div>
        <button className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50">
          <Plus size={16} />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Side: Mini Calendar & Filters */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Maio 2026</h3>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-white"><ChevronLeft size={20} /></button>
                <button className="p-1 text-gray-400 hover:text-white"><ChevronRight size={20} /></button>
              </div>
            </div>
            
            {/* Very simple mock calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                <div key={d} className="text-gray-500 font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg cursor-pointer ${
                    i + 1 === 10 ? 'bg-secondary text-white font-bold shadow-lg shadow-secondary/30' : 
                    i + 1 === 11 || i + 1 === 15 ? 'text-secondary-light font-bold bg-secondary/10' : 
                    'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold mb-4">Próximos (Resumo)</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-300 text-sm">Reuniões (12)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300 text-sm">Follow-ups (8)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-300 text-sm">Eventos IA (3)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Agenda List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Eventos de Hoje</h3>
            <div className="bg-black/30 p-1 rounded-lg flex text-sm">
              <button className="px-4 py-1.5 rounded-md bg-secondary text-white shadow">Lista</button>
              <button className="px-4 py-1.5 rounded-md text-gray-400 hover:text-white">Dia</button>
              <button className="px-4 py-1.5 rounded-md text-gray-400 hover:text-white">Semana</button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-auto pr-2">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="bg-black/20 border border-white/5 p-5 rounded-xl flex items-start gap-4 hover:border-secondary/30 transition-colors group">
                <div className="mt-1 p-3 rounded-xl bg-secondary/10 text-secondary-light group-hover:bg-secondary group-hover:text-white transition-colors">
                  {event.type === 'video' ? <Video size={20} /> : <CalendarIcon size={20} />}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-white text-lg mb-1">{event.title}</h4>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-gray-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={16} className="text-gray-500" />
                      {event.client}
                    </div>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/10">
                  Detalhes
                </button>
              </div>
            ))}

            <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-xl mt-8">
              <CalendarIcon size={32} className="mx-auto text-gray-600 mb-3" />
              <h4 className="text-gray-300 font-medium">Nenhum outro evento hoje</h4>
              <p className="text-sm text-gray-500 mt-1">O Hermes pode agendar eventos automaticamente conversando com os leads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};