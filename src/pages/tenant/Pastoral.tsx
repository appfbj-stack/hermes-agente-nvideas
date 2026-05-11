import React, { useState } from 'react';
import { 
  Book, Users, Calendar, Plus, Search, Filter, CheckCircle2, 
  MapPin, MessageSquare, Phone, Briefcase, PartyPopper, Bot, 
  Sparkles, LayoutDashboard, Church, Home, HeartHandshake, 
  Heart, DollarSign, CheckSquare, Gift, Package, FileText, FileBarChart
} from 'lucide-react';

import BirthdaysModule from './pastoral/modules/BirthdaysModule';
import CellsModule from './pastoral/modules/CellsModule';
import CounselingModule from './pastoral/modules/CounselingModule';
import FestivitiesModule from './pastoral/modules/FestivitiesModule';
import FinanceModule from './pastoral/modules/FinanceModule';
import MembersModule from './pastoral/modules/MembersModule';
import PastoralAgendaModule from './pastoral/modules/PastoralAgendaModule';
import PatrimonioModule from './pastoral/modules/PatrimonioModule';
import ReportsModule from './pastoral/modules/ReportsModule';
import SermonsModule from './pastoral/modules/SermonsModule';
import ServicesModule from './pastoral/modules/ServicesModule';
import TasksModule from './pastoral/modules/TasksModule';
import VisitsModule from './pastoral/modules/VisitsModule';
import WeddingsModule from './pastoral/modules/WeddingsModule';

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

type TabType = 'dashboard' | 'agenda' | 'members' | 'services' | 'cells' | 'visits' | 'weddings' | 'counseling' | 'finance' | 'tasks' | 'festivities' | 'birthdays' | 'patrimonio' | 'sermons' | 'reports';

const TABS: { id: TabType, label: string, icon: any }[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'members', label: 'Membros', icon: Users },
  { id: 'services', label: 'Cultos', icon: Church },
  { id: 'cells', label: 'Células', icon: Home },
  { id: 'visits', label: 'Visitas', icon: HeartHandshake },
  { id: 'weddings', label: 'Casamentos', icon: Heart },
  { id: 'counseling', label: 'Aconselhamento', icon: MessageSquare },
  { id: 'finance', label: 'Financeiro', icon: DollarSign },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'festivities', label: 'Festividades', icon: PartyPopper },
  { id: 'birthdays', label: 'Aniversariantes', icon: Gift },
  { id: 'patrimonio', label: 'Patrimônio', icon: Package },
  { id: 'sermons', label: 'Esboços', icon: FileText },
  { id: 'reports', label: 'Relatórios', icon: FileBarChart },
];

export const Pastoral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('agenda');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  return (
      <div className="h-full flex flex-col p-2 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Book className="text-secondary" />
            Agenda Pastoral Completa
          </h2>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">Gestão integrada da sua igreja: membros, cultos, financeiro e muito mais.</p>
        </div>
        <div className="flex gap-2">
          <button className="glass-button flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 w-full sm:w-auto">
            <Plus size={16} />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Tabs - Horizontally scrollable */}
      <div className="flex border-b border-white/10 gap-4 sm:gap-6 overflow-x-auto custom-scrollbar pb-1 shrink-0 -mx-2 px-2 sm:mx-0 sm:px-0">
        {TABS.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'text-secondary-light' : 'text-gray-400 hover:text-white'}`}
          >
            <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-black/20 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Buscar nos registros..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all text-white placeholder-gray-500"
          />
        </div>
        <button className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar min-h-0">
        {activeTab === 'agenda' && <PastoralAgendaModule />}
        {activeTab === 'members' && <MembersModule />}
        {activeTab === 'services' && <ServicesModule />}
        {activeTab === 'cells' && <CellsModule />}
        {activeTab === 'visits' && <VisitsModule />}
        {activeTab === 'weddings' && <WeddingsModule />}
        {activeTab === 'counseling' && <CounselingModule />}
        {activeTab === 'finance' && <FinanceModule />}
        {activeTab === 'tasks' && <TasksModule />}
        {activeTab === 'festivities' && <FestivitiesModule />}
        {activeTab === 'birthdays' && <BirthdaysModule />}
        {activeTab === 'patrimonio' && <PatrimonioModule />}
        {activeTab === 'sermons' && <SermonsModule />}
        {activeTab === 'reports' && <ReportsModule />}

        {activeTab === 'dashboard' && (
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
                <p className="text-sm text-gray-300 mt-1">O Hermes organizou seus compromissos, identificou 3 membros ausentes há mais de 30 dias e gerou 1 novo esboço de sermão baseado na série atual.</p>
              </div>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-secondary/20 relative z-10 whitespace-nowrap">
                Ver Insights
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                {React.createElement(TABS.find(t => t.id === activeTab)?.icon || Book, { size: 32 })}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dashboard Geral em Construção</h3>
              <p className="text-gray-400 max-w-md">
                Os relatórios consolidados e os gráficos gerais estarão disponíveis aqui.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
