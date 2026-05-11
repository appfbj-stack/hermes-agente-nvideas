import React, { useState } from 'react';
import { 
  Wrench, Users, Car, ClipboardList, DollarSign, Package, Calendar, Bot, Sparkles, LayoutDashboard, Plus, Search, Filter, X, Edit2, Trash2
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

// Mocks
const MOCK_CLIENTES = [
  { id: 1, nome: 'João da Silva', telefone: '(11) 99999-9999', veiculos: 'Honda Civic', status: 'Ativo' },
  { id: 2, nome: 'Maria Oliveira', telefone: '(11) 98888-8888', veiculos: 'Toyota Corolla', status: 'Ativo' },
];

const MOCK_VEICULOS = [
  { id: 1, placa: 'ABC-1234', marca: 'Honda', modelo: 'Civic', ano: '2019', cliente: 'João da Silva' },
  { id: 2, placa: 'XYZ-9876', marca: 'Toyota', modelo: 'Corolla', ano: '2021', cliente: 'Maria Oliveira' },
];

const MOCK_OS = [
  { id: 1001, cliente: 'João da Silva', veiculo: 'Honda Civic', status: 'Em manutenção', valor: 'R$ 850,00', data: '10/05/2026' },
  { id: 1002, cliente: 'Maria Oliveira', veiculo: 'Toyota Corolla', status: 'Aguardando', valor: 'R$ 0,00', data: '12/05/2026' },
];

const MOCK_ESTOQUE = [
  { id: 1, codigo: 'P-001', peca: 'Pastilha de Freio', qtd: 4, custo: 'R$ 45,00', venda: 'R$ 120,00' },
  { id: 2, codigo: 'O-005', peca: 'Óleo Sintético 5W30', qtd: 24, custo: 'R$ 25,00', venda: 'R$ 60,00' },
];

export const OficinaMecanica: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TabType | null>(null);

  const openModal = (type: TabType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const inputClass = "w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary text-white placeholder-gray-500";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1";

  const renderModalContent = () => {
    switch (modalType) {
      case 'clientes':
        return (
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nome Completo</label>
                <input type="text" className={inputClass} placeholder="Ex: Carlos Santos" />
              </div>
              <div><label className={labelClass}>CPF/CNPJ</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Telefone</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>WhatsApp</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>E-mail</label><input type="email" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Endereço Completo</label><input type="text" className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Observações</label><textarea className={inputClass} rows={2}></textarea></div>
              <div className="sm:col-span-2"><label className={labelClass}>Foto (Opcional)</label><input type="file" className="text-sm text-gray-400" /></div>
            </div>
            <button className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-2 rounded-xl mt-4">Salvar Cliente</button>
          </form>
        );
      case 'veiculos':
        return (
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Cliente Proprietário</label>
                <select className={inputClass}>
                  <option value="">Selecione um cliente...</option>
                  <option value="1">João da Silva</option>
                  <option value="2">Maria Oliveira</option>
                </select>
              </div>
              <div><label className={labelClass}>Placa</label><input type="text" className={inputClass} placeholder="ABC-1234" /></div>
              <div><label className={labelClass}>Chassi</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Marca</label><input type="text" className={inputClass} placeholder="Ex: Honda" /></div>
              <div><label className={labelClass}>Modelo</label><input type="text" className={inputClass} placeholder="Ex: Civic" /></div>
              <div><label className={labelClass}>Ano</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Cor</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Quilometragem (KM)</label><input type="number" className={inputClass} /></div>
              <div><label className={labelClass}>Combustível</label>
                <select className={inputClass}>
                  <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option>
                </select>
              </div>
              <div className="sm:col-span-2"><label className={labelClass}>Observações</label><textarea className={inputClass} rows={2}></textarea></div>
            </div>
            <button className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-2 rounded-xl mt-4">Salvar Veículo</button>
          </form>
        );
      case 'os':
        return (
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Nº da OS (Automático)</label><input type="text" className={inputClass} value="1003" disabled /></div>
              <div><label className={labelClass}>Status</label>
                <select className={inputClass}>
                  <option>Aguardando</option><option>Orçamento</option><option>Aprovado</option>
                  <option>Em manutenção</option><option>Finalizado</option><option>Entregue</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Cliente</label>
                <select className={inputClass}><option>Selecione...</option></select>
              </div>
              <div>
                <label className={labelClass}>Veículo</label>
                <select className={inputClass}><option>Selecione...</option></select>
              </div>
              <div className="sm:col-span-2"><label className={labelClass}>Defeito Relatado pelo Cliente</label><textarea className={inputClass} rows={2}></textarea></div>
              <div className="sm:col-span-2"><label className={labelClass}>Diagnóstico do Mecânico</label><textarea className={inputClass} rows={2}></textarea></div>
              <div className="sm:col-span-2"><label className={labelClass}>Serviços Executados</label><textarea className={inputClass} rows={2}></textarea></div>
              <div className="sm:col-span-2"><label className={labelClass}>Peças Utilizadas</label><textarea className={inputClass} rows={2}></textarea></div>
              <div><label className={labelClass}>Mecânico Responsável</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Data de Entrada</label><input type="date" className={inputClass} /></div>
              <div><label className={labelClass}>Previsão de Entrega</label><input type="date" className={inputClass} /></div>
            </div>
            <button className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-2 rounded-xl mt-4">Salvar Ordem de Serviço</button>
          </form>
        );
      case 'estoque':
        return (
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={labelClass}>Nome da Peça / Produto</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Código / SKU</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Fornecedor</label><input type="text" className={inputClass} /></div>
              <div><label className={labelClass}>Quantidade em Estoque</label><input type="number" className={inputClass} /></div>
              <div><label className={labelClass}>Estoque Mínimo</label><input type="number" className={inputClass} /></div>
              <div><label className={labelClass}>Valor de Custo</label><input type="text" className={inputClass} placeholder="R$" /></div>
              <div><label className={labelClass}>Valor de Venda</label><input type="text" className={inputClass} placeholder="R$" /></div>
            </div>
            <button className="w-full bg-secondary hover:bg-secondary-light text-white font-medium py-2 rounded-xl mt-4">Salvar Produto</button>
          </form>
        );
      default:
        return <p className="text-white">Formulário em construção...</p>;
    }
  };

  return (
    <div className="h-full flex flex-col p-2 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 relative overflow-hidden">
      
      {/* Modal Genérico para Cadastros */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-white/10 shadow-2xl relative my-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-white capitalize">
              Novo Registro: {modalType}
            </h3>
            {renderModalContent()}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="text-secondary" />
            Gestão de Oficina Mecânica
          </h2>
          <p className="text-gray-400 mt-1 text-xs sm:text-sm lg:text-base">Controle de clientes, veículos, OS, estoque e financeiro em um só lugar.</p>
        </div>
        
        {/* Render New Button only for specific tabs */}
        {['clientes', 'veiculos', 'os', 'estoque'].includes(activeTab) && (
          <button 
            onClick={() => openModal(activeTab)}
            className="glass-button flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-secondary/20 hover:border-secondary/50 w-full sm:w-auto"
          >
            <Plus size={16} />
            <span className="capitalize">Novo {activeTab.replace('os', 'Ordem de Serviço')}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
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

      {/* Search Bar for list views */}
      {['clientes', 'veiculos', 'os', 'estoque'].includes(activeTab) && (
        <div className="glass-panel rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/20 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar registros..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-secondary text-white placeholder-gray-500"
            />
          </div>
          <button className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 flex items-center justify-center gap-2">
            <Filter size={16} /> Filtros
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar min-h-0">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
               <div className="glass-panel p-6 rounded-2xl border border-white/5">
                 <p className="text-gray-400 text-sm font-medium mb-1">OS Abertas</p>
                 <h3 className="text-3xl font-bold text-white">12</h3>
               </div>
               <div className="glass-panel p-6 rounded-2xl border border-white/5">
                 <p className="text-gray-400 text-sm font-medium mb-1">Faturamento (Mês)</p>
                 <h3 className="text-3xl font-bold text-green-400">R$ 14.500</h3>
               </div>
               <div className="glass-panel p-6 rounded-2xl border border-white/5">
                 <p className="text-gray-400 text-sm font-medium mb-1">Veículos no Pátio</p>
                 <h3 className="text-3xl font-bold text-white">8</h3>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Telefone</th>
                  <th className="p-4">Veículo Principal</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_CLIENTES.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{c.nome}</td>
                    <td className="p-4">{c.telefone}</td>
                    <td className="p-4">{c.veiculos}</td>
                    <td className="p-4 flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Edit2 size={14}/></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'veiculos' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="p-4">Placa</th>
                  <th className="p-4">Veículo</th>
                  <th className="p-4">Ano</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_VEICULOS.map(v => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{v.placa}</td>
                    <td className="p-4">{v.marca} {v.modelo}</td>
                    <td className="p-4">{v.ano}</td>
                    <td className="p-4">{v.cliente}</td>
                    <td className="p-4 flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Edit2 size={14}/></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'os' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="p-4">OS #</th>
                  <th className="p-4">Cliente / Veículo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_OS.map(os => (
                  <tr key={os.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{os.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-white">{os.cliente}</div>
                      <div className="text-xs">{os.veiculo}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${os.status === 'Aguardando' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {os.status}
                      </span>
                    </td>
                    <td className="p-4">{os.data}</td>
                    <td className="p-4">{os.valor}</td>
                    <td className="p-4 flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Edit2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Peça/Produto</th>
                  <th className="p-4">Qtd.</th>
                  <th className="p-4">Custo</th>
                  <th className="p-4">Venda</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_ESTOQUE.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{item.codigo}</td>
                    <td className="p-4">{item.peca}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.qtd < 5 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {item.qtd} un
                      </span>
                    </td>
                    <td className="p-4">{item.custo}</td>
                    <td className="p-4">{item.venda}</td>
                    <td className="p-4 flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded"><Edit2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {['financeiro', 'agenda'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl border border-white/5">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
              {React.createElement(TABS.find(t => t.id === activeTab)?.icon || Wrench, { size: 32 })}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Módulo de {TABS.find(t => t.id === activeTab)?.label} em Construção</h3>
            <p className="text-gray-400 max-w-md">
              A arquitetura Hermes está preparando este módulo para ser acoplado à sua plataforma.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
