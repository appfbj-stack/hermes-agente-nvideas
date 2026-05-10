import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, User, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const INITIAL_MOCK_EVENTS = [
  { id: 1, title: 'Reunião de Alinhamento - Beta Tech', time: '10:00 - 11:00', type: 'video', client: 'Ana Souza', date: 'Hoje' },
  { id: 2, title: 'Follow-up de Proposta', time: '14:30 - 15:00', type: 'call', client: 'Roberto (Gama)', date: 'Hoje' },
  { id: 3, title: 'Apresentação do Hermes', time: '09:00 - 10:00', type: 'video', client: 'Carlos Silva', date: 'Amanhã' },
];

export const TenantCalendar: React.FC = () => {
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'lista' | 'dia' | 'semana'>('lista');
  const [newEvent, setNewEvent] = useState({ title: '', time: '', client: '', type: 'video' });
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 10)); // May 10, 2026

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;

    setEvents([
      ...events,
      {
        id: Date.now(),
        title: newEvent.title,
        time: newEvent.time || '12:00 - 13:00',
        client: newEvent.client || 'Sem cliente',
        type: newEvent.type,
        date: 'Hoje'
      }
    ]);
    
    setNewEvent({ title: '', time: '', client: '', type: 'video' });
    setIsModalOpen(false);
  };

  const removeEvent = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Helper for generating calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => `empty-${i}`);

  return (
    <div className="h-full flex flex-col p-8 space-y-6 relative">
      {/* Modal Novo Evento */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">Novo Evento</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título da Reunião</label>
                <input 
                  type="text" 
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary text-white"
                  placeholder="Ex: Apresentação de Vendas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cliente / Contato</label>
                <input 
                  type="text" 
                  value={newEvent.client}
                  onChange={e => setNewEvent({...newEvent, client: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary text-white"
                  placeholder="Ex: Ana Souza"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Horário</label>
                  <input 
                    type="text" 
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary text-white"
                    placeholder="10:00 - 11:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary text-white appearance-none"
                  >
                    <option value="video">Vídeo Chamada</option>
                    <option value="call">Ligação (Call)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-2.5 rounded-xl transition-colors mt-2">
                Agendar Evento
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agenda & Follow-ups</h2>
          <p className="text-gray-400 mt-1">Seus compromissos organizados pela IA.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50"
        >
          <Plus size={16} />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Side: Mini Calendar & Filters */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg capitalize">{getMonthName(currentDate)}</h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-white"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-white"><ChevronRight size={20} /></button>
              </div>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                <div key={d} className="text-gray-500 font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {emptyDays.map(empty => (
                <div key={empty} className="p-2"></div>
              ))}
              {daysArray.map((day) => (
                <div 
                  key={day} 
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    day === 10 && currentDate.getMonth() === 4 ? 'bg-secondary text-white font-bold shadow-lg shadow-secondary/30' : 
                    (day === 11 || day === 15) && currentDate.getMonth() === 4 ? 'text-secondary-light font-bold bg-secondary/10' : 
                    'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold mb-4">Próximos (Resumo)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300 text-sm">Reuniões</span>
                </div>
                <span className="text-xs font-mono text-gray-400">{events.filter(e => e.type === 'video').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300 text-sm">Follow-ups</span>
                </div>
                <span className="text-xs font-mono text-gray-400">{events.filter(e => e.type === 'call').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300 text-sm">Eventos IA</span>
                </div>
                <span className="text-xs font-mono text-gray-400">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Agenda List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Eventos de Hoje</h3>
            <div className="bg-black/30 p-1 rounded-lg flex text-sm">
              <button 
                onClick={() => setViewMode('lista')}
                className={`px-4 py-1.5 rounded-md transition-colors ${viewMode === 'lista' ? 'bg-secondary text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Lista
              </button>
              <button 
                onClick={() => setViewMode('dia')}
                className={`px-4 py-1.5 rounded-md transition-colors ${viewMode === 'dia' ? 'bg-secondary text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Dia
              </button>
              <button 
                onClick={() => setViewMode('semana')}
                className={`px-4 py-1.5 rounded-md transition-colors ${viewMode === 'semana' ? 'bg-secondary text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Semana
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-auto pr-2">
            {viewMode === 'lista' && (
              <>
                {events.map(event => (
                  <div key={event.id} className="bg-black/20 border border-white/5 p-5 rounded-xl flex items-start gap-4 hover:border-secondary/30 transition-colors group relative">
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

                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/10 hidden md:block">
                        Detalhes
                      </button>
                      <button 
                        onClick={() => removeEvent(event.id)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors border border-red-500/10"
                        title="Cancelar Evento"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {viewMode === 'dia' && (
              <div className="space-y-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const hour = i + 8; // Start at 8 AM
                  const timeString = `${hour.toString().padStart(2, '0')}:00`;
                  // Find if there's an event starting around this hour
                  const hourEvent = events.find(e => e.time.startsWith(timeString));
                  
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-16 text-right text-xs text-gray-500 font-mono pt-3">
                        {timeString}
                      </div>
                      <div className={`flex-1 border-t ${hourEvent ? 'border-secondary/50' : 'border-white/10'} pt-2 pb-6 relative`}>
                        {hourEvent && (
                          <div className="absolute top-2 left-0 right-0 bg-secondary/20 border border-secondary/30 rounded-lg p-3">
                            <p className="font-bold text-white text-sm">{hourEvent.title}</p>
                            <p className="text-xs text-secondary-light mt-1">{hourEvent.client}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'semana' && (
              <div className="grid grid-cols-5 gap-4 h-full">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => (
                  <div key={day} className="flex flex-col border-r border-white/5 pr-4 last:border-0">
                    <div className="text-center mb-4">
                      <p className="text-gray-400 text-xs uppercase">{day}</p>
                      <p className={`text-lg font-bold ${i === 2 ? 'text-secondary' : 'text-white'}`}>{10 + i}</p>
                    </div>
                    <div className="flex-1 relative">
                      {/* Randomly distribute events for mockup purposes */}
                      {events.slice(0, i === 2 ? 2 : i === 1 ? 1 : 0).map((ev, idx) => (
                        <div key={idx} className={`mb-2 p-2 rounded bg-black/40 border-l-2 ${ev.type === 'video' ? 'border-blue-500' : 'border-yellow-500'}`}>
                          <p className="text-xs font-bold text-white truncate">{ev.title}</p>
                          <p className="text-[10px] text-gray-500">{ev.time.split('-')[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {events.length === 0 && viewMode === 'lista' && (
              <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-xl mt-8">
                <CalendarIcon size={32} className="mx-auto text-gray-600 mb-3" />
                <h4 className="text-gray-300 font-medium">Nenhum evento agendado</h4>
                <p className="text-sm text-gray-500 mt-1">Clique em "Novo Evento" ou peça para o Hermes agendar algo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};