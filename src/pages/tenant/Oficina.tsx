import React, { useState } from 'react';
import { 
  Wrench, Users, Car, ClipboardList, DollarSign, Package, Calendar, Bot, Sparkles, LayoutDashboard
} from 'lucide-react';

type TabType = 'dashboard' | 'clientes' | 'veiculos' | 'os' | 'financeiro' | 'estoque' | 'agenda';

const TABS: { id: TabType, label: string, icon: any }[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'veiculos', label: 'Veículos', icon: Car },
  { id: 'os', label: 'Ordens de Serviço', icon: ClipboardList },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
];

export const OficinaMecanica: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="h-full flex flex-col p-2 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="text-secondary" />
            Gestão de Oficina Mecânica
          </h2>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">Controle de clientes, veículos, OS, estoque e financeiro em um só lugar.</p>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar min-h-0">
        
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
                <p className="text-sm text-gray-300 mt-1">O Hermes identificou que você tem 3 Orçamentos aguardando aprovação e o estoque de Pastilhas de Freio está baixo.</p>
              </div>
              <button className="px-4 py-2 bg-secondary hover:bg-secondary-light text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-secondary/20 relative z-10 whitespace-nowrap">
                Ver Insights
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl border border-white/5 mt-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visão Geral da Oficina</h3>
              <p className="text-gray-400 max-w-md">
                Aqui você verá o resumo de faturamento, veículos no pátio e serviços pendentes.
              </p>
            </div>
          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
              {React.createElement(TABS.find(t => t.id === activeTab)?.icon || Wrench, { size: 32 })}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Módulo de {TABS.find(t => t.id === activeTab)?.label} em Construção</h3>
            <p className="text-gray-400 max-w-md">
              A arquitetura Hermes está preparando este módulo para ser acoplado à sua plataforma. Em breve os dados do seu sistema de mecânica estarão disponíveis aqui.
            </p>
            <button className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10">
              Notificar Lançamento
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
