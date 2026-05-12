import React, { useState } from 'react';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { SaveIcon } from '../icons/SaveIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportsModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'geral' | 'entradas' | 'despesas' | 'resumo'>('geral');

    const [data, setData] = useState({
        // Cabeçalho
        congregation: '', month: '', year: new Date().getFullYear().toString(),
        address: '', neighborhood: '', city: '', state: 'SP', zip: '', sector: '', leader: '', email: '',
        
        // Administrativo
        ebd: { kids: 0, teens: 0, youth: 0, adults: 0 },
        members: { total: 0, conversions: 0, reconciliations: 0, baptismCandidates: 0 },
        
        // Entradas Detalhadas
        tithes: [] as { id: string, day: string, name: string, value: number }[],
        offerings: [] as { id: string, day: string, value: number }[],
        specialOfferings: [] as { id: string, day: string, name: string, value: number }[],
        missionOfferings: [] as { id: string, day: string, value: number }[],
        loans: 0,
        
        // Despesas
        fixedExpenses: {
            rent: 0, financing: 0, construction: 0, pastoral: 0, water: 0, electricity: 0, taxes: 0
        },
        otherExpenses: [] as { id: string, day: string, description: string, value: number }[],
        
        // Saldos
        previousBalance: 0,
        constructionBalance: 0,
        
        // Observações
        observations: ''
    });

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (category: 'ebd' | 'members' | 'fixedExpenses', field: string, value: string) => {
        setData(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: Number(value) || 0 }
        }));
    };

    const addListItem = (listName: 'tithes' | 'offerings' | 'specialOfferings' | 'missionOfferings' | 'otherExpenses') => {
        setData(prev => ({
            ...prev,
            [listName]: [...prev[listName], { id: Date.now().toString(), day: '', name: '', description: '', value: 0 }]
        }));
    };

    const removeListItem = (listName: 'tithes' | 'offerings' | 'specialOfferings' | 'missionOfferings' | 'otherExpenses', id: string) => {
        setData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((item: any) => item.id !== id)
        }));
    };

    const handleListChange = (listName: 'tithes' | 'offerings' | 'specialOfferings' | 'missionOfferings' | 'otherExpenses', id: string, field: string, value: string) => {
        setData(prev => ({
            ...prev,
            [listName]: prev[listName].map((item: any) => 
                item.id === id ? { ...item, [field]: field === 'value' ? Number(value) || 0 : value } : item
            )
        }));
    };

    // Cálculos
    const sumList = (list: any[]) => list.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const sumFixedExpenses = () => Object.values(data.fixedExpenses).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

    const totalTithes = sumList(data.tithes);
    const totalOfferings = sumList(data.offerings);
    const totalSpecialOfferings = sumList(data.specialOfferings);
    const totalMissionOfferings = sumList(data.missionOfferings);
    
    const totalIncome = totalTithes + totalOfferings + totalSpecialOfferings + Number(data.loans || 0);
    const regionalContribution = totalIncome * 0.20;
    
    const totalExpenses = sumFixedExpenses() + sumList(data.otherExpenses) + regionalContribution;
    const subtotal = totalIncome + Number(data.previousBalance || 0);
    const currentBalance = subtotal - totalExpenses;
    const newCurrentBalance = currentBalance + Number(data.constructionBalance || 0);

    const inputStyles = "p-3 border border-slate-300 dark:border-white/10 rounded-xl w-full bg-white dark:bg-black/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-secondary focus:border-secondary text-sm transition-all";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const handleSaveReport = () => {
        const reportKey = `obpc-report-${data.year}-${data.month || 'geral'}`;
        localStorage.setItem(reportKey, JSON.stringify(data));
        alert('Relatório salvo com sucesso localmente!');
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(16);
        doc.text(`Relatório Mensal - ${data.congregation} - ${data.month}/${data.year}`, 14, 20);
        
        // Dados Gerais
        doc.setFontSize(12);
        doc.text('Dados Gerais', 14, 30);
        autoTable(doc, {
            startY: 35,
            head: [['Campo', 'Valor']],
            body: [
                ['Congregação', data.congregation],
                ['Setor', data.sector],
                ['Dirigente', data.leader],
                ['Endereço', `${data.address}, ${data.neighborhood}, ${data.city} - ${data.state}`],
            ],
            theme: 'grid',
        });

        // Resumo Financeiro
        let finalY = (doc as any).lastAutoTable.finalY || 35;
        doc.text('Resumo Financeiro', 14, finalY + 10);
        
        autoTable(doc, {
            startY: finalY + 15,
            head: [['Resumo', 'Valor']],
            body: [
                ['Ofertas Especiais', formatCurrency(totalSpecialOfferings)],
                ['Ofertas', formatCurrency(totalOfferings)],
                ['Dízimos Total', formatCurrency(totalTithes)],
                ['Empréstimos', formatCurrency(Number(data.loans))],
                ['Entrada Total', formatCurrency(totalIncome)],
                ['Saldo Anterior', formatCurrency(Number(data.previousBalance))],
                ['Subtotal', formatCurrency(subtotal)],
                ['Despesas', formatCurrency(totalExpenses)],
                ['Saldo Atual (Caixa Ativo)', formatCurrency(currentBalance)],
                ['Saldo Atual (Caixa Construção)', formatCurrency(Number(data.constructionBalance))],
                ['Novo Saldo Atual', formatCurrency(newCurrentBalance)],
            ],
            theme: 'grid',
        });

        // Dízimos
        finalY = (doc as any).lastAutoTable.finalY || 35;
        if (finalY > 250) { doc.addPage(); finalY = 10; }
        doc.text('Dízimos', 14, finalY + 10);
        autoTable(doc, {
            startY: finalY + 15,
            head: [['Dia', 'Nome', 'Valor']],
            body: data.tithes.map(t => [t.day, t.name, formatCurrency(t.value)]),
            theme: 'grid',
        });

        // Ofertas
        finalY = (doc as any).lastAutoTable.finalY || 35;
        if (finalY > 250) { doc.addPage(); finalY = 10; }
        doc.text('Ofertas', 14, finalY + 10);
        autoTable(doc, {
            startY: finalY + 15,
            head: [['Dia', 'Valor']],
            body: data.offerings.map(o => [o.day, formatCurrency(o.value)]),
            theme: 'grid',
        });

        doc.save(`Relatorio_${data.congregation || 'Igreja'}_${data.month || 'Mes'}_${data.year}.pdf`);
    };

    const handleDownloadExcel = () => {
        const wb = XLSX.utils.book_new();
        
        // Planilha Resumo
        const resumoData = [
            ['Resumo', 'Valor'],
            ['Ofertas Especiais', totalSpecialOfferings],
            ['Ofertas', totalOfferings],
            ['Dízimos Total', totalTithes],
            ['Empréstimos', Number(data.loans)],
            ['Entrada Total', totalIncome],
            ['Saldo Anterior', Number(data.previousBalance)],
            ['Subtotal', subtotal],
            ['Despesas', totalExpenses],
            ['Saldo Atual (Caixa Ativo)', currentBalance],
            ['Saldo Atual (Caixa Construção)', Number(data.constructionBalance)],
            ['Novo Saldo Atual', newCurrentBalance],
        ];
        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
        XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

        // Planilha Dízimos
        const dizimosData = [['Dia', 'Nome', 'Valor'], ...data.tithes.map(t => [t.day, t.name, t.value])];
        const wsDizimos = XLSX.utils.aoa_to_sheet(dizimosData);
        XLSX.utils.book_append_sheet(wb, wsDizimos, 'Dízimos');

        // Planilha Ofertas
        const ofertasData = [['Dia', 'Valor'], ...data.offerings.map(o => [o.day, o.value])];
        const wsOfertas = XLSX.utils.aoa_to_sheet(ofertasData);
        XLSX.utils.book_append_sheet(wb, wsOfertas, 'Ofertas');

        XLSX.writeFile(wb, `Relatorio_${data.congregation || 'Igreja'}_${data.month || 'Mes'}_${data.year}.xlsx`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Relatório Mensal</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Preenchimento de Atividades e Financeiro</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={handleSaveReport} className="flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest">
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Salvar
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-red-50 dark:hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PdfIcon className="w-4 h-4 mr-2" />
                        PDF
                    </button>
                    <button onClick={handleDownloadExcel} className="flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest">
                        <ExcelIcon className="w-4 h-4 mr-2" />
                        Excel
                    </button>
                </div>
            </div>

            {/* Navegação Interna */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {[
                    { id: 'geral', label: 'Dados Gerais' },
                    { id: 'entradas', label: 'Entradas' },
                    { id: 'despesas', label: 'Despesas' },
                    { id: 'resumo', label: 'Resumo Final' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                            : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-slate-50 dark:bg-black/20 rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-xl border border-slate-200 dark:border-white/10">
                
                {/* TAB: DADOS GERAIS & ADMINISTRATIVO */}
                {activeTab === 'geral' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="border-b-2 border-slate-300 dark:border-slate-800 pb-6 mb-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                {/* Logo Placeholder */}
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border dark:border-slate-700">
                                        <span className="text-xs font-black text-slate-400 text-center px-2">LOGO<br/>OBPC</span>
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Igreja Evangélica Pentecostal O Brasil para Cristo</h1>
                                        <p className="text-sm font-bold text-sky-600 dark:text-sky-400">Ministério Sorocaba - Uma Família com Uma Missão</p>
                                        <p className="text-xs font-bold text-sky-600 dark:text-sky-400 italic">Fundação 1961</p>
                                    </div>
                                </div>
                                
                                {/* Sede Regional Info */}
                                <div className="text-left md:text-right text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Sede Regional</p>
                                    <p>Rua Visconde do Rio Branco, 206 - Vila Jardini</p>
                                    <p>Sorocaba - SP Cep: 18044-000</p>
                                    <p>Tel. (15) 3222-8855</p>
                                    <p>E-mail: prluizcarlos.santos@hotmail.com</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RELATÓRIO MENSAL DE ATIVIDADES - {data.year}</h2>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4 border-b dark:border-slate-800 pb-2">Dados da Congregação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2"><label className={labelStyles}>Congregação</label><input type="text" name="congregation" value={data.congregation || ''} onChange={handleHeaderChange} className={inputStyles} placeholder="Nome da congregação" /></div>
                                <div><label className={labelStyles}>Setor</label><input type="text" name="sector" value={data.sector} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>Mês</label><input type="text" name="month" value={data.month} onChange={handleHeaderChange} className={inputStyles} placeholder="Ex: Janeiro" /></div>
                                <div><label className={labelStyles}>Ano</label><input type="text" name="year" value={data.year} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>Dirigente</label><input type="text" name="leader" value={data.leader} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div className="md:col-span-2"><label className={labelStyles}>Endereço</label><input type="text" name="address" value={data.address} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>Bairro</label><input type="text" name="neighborhood" value={data.neighborhood} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>Cidade</label><input type="text" name="city" value={data.city} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>Estado / UF</label><input type="text" name="state" value={data.state} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div><label className={labelStyles}>CEP</label><input type="text" name="zip" value={data.zip} onChange={handleHeaderChange} className={inputStyles} /></div>
                                <div className="md:col-span-3"><label className={labelStyles}>E-mail</label><input type="email" name="email" value={data.email} onChange={handleHeaderChange} className={inputStyles} /></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4 border-b dark:border-slate-800 pb-2">Relatório Administrativo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Frequência Escola Bíblica</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Crianças</label><input type="number" value={data.ebd.kids} onChange={(e) => handleNestedChange('ebd', 'kids', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Adolescentes</label><input type="number" value={data.ebd.teens} onChange={(e) => handleNestedChange('ebd', 'teens', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Jovens</label><input type="number" value={data.ebd.youth} onChange={(e) => handleNestedChange('ebd', 'youth', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Adultos</label><input type="number" value={data.ebd.adults} onChange={(e) => handleNestedChange('ebd', 'adults', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800"><label className="text-sm font-black dark:text-white uppercase">Total EBD</label><span className="text-lg font-black text-teal-500">{data.ebd.kids + data.ebd.teens + data.ebd.youth + data.ebd.adults}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3">Membros</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Total de Membros</label><input type="number" value={data.members.total} onChange={(e) => handleNestedChange('members', 'total', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Conversões</label><input type="number" value={data.members.conversions} onChange={(e) => handleNestedChange('members', 'conversions', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Reconciliações</label><input type="number" value={data.members.reconciliations} onChange={(e) => handleNestedChange('members', 'reconciliations', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                        <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Candidatos ao Batismo</label><input type="number" value={data.members.baptismCandidates} onChange={(e) => handleNestedChange('members', 'baptismCandidates', e.target.value)} className={`${inputStyles} w-24 text-center`} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: ENTRADAS */}
                {activeTab === 'entradas' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Dízimos */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Dízimos / Outras Entradas</h3>
                                <button onClick={() => addListItem('tithes')} className="text-xs font-black text-teal-600 uppercase flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Linha</button>
                            </div>
                            <div className="space-y-2">
                                {data.tithes.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" placeholder="Dia" value={item.day} onChange={(e) => handleListChange('tithes', item.id, 'day', e.target.value)} className={`${inputStyles} w-20`} />
                                        <input type="text" placeholder="Nome Completo - Legível" value={item.name} onChange={(e) => handleListChange('tithes', item.id, 'name', e.target.value)} className={`${inputStyles} flex-1`} />
                                        <input type="number" placeholder="Valor R$" value={item.value || ''} onChange={(e) => handleListChange('tithes', item.id, 'value', e.target.value)} className={`${inputStyles} w-32`} />
                                        <button onClick={() => removeListItem('tithes', item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                {data.tithes.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Nenhum dízimo registrado.</p>}
                                <div className="text-right pt-2"><span className="text-xs font-black text-slate-500 uppercase mr-4">Total Dízimos:</span><span className="text-lg font-black text-emerald-500">{formatCurrency(totalTithes)}</span></div>
                            </div>
                        </div>

                        {/* Ofertas */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ofertas</h3>
                                <button onClick={() => addListItem('offerings')} className="text-xs font-black text-teal-600 uppercase flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Linha</button>
                            </div>
                            <div className="space-y-2">
                                {data.offerings.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" placeholder="Dia" value={item.day} onChange={(e) => handleListChange('offerings', item.id, 'day', e.target.value)} className={`${inputStyles} w-20`} />
                                        <input type="number" placeholder="Valor R$" value={item.value || ''} onChange={(e) => handleListChange('offerings', item.id, 'value', e.target.value)} className={`${inputStyles} flex-1`} />
                                        <button onClick={() => removeListItem('offerings', item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                {data.offerings.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Nenhuma oferta registrada.</p>}
                                <div className="text-right pt-2"><span className="text-xs font-black text-slate-500 uppercase mr-4">Total Ofertas:</span><span className="text-lg font-black text-emerald-500">{formatCurrency(totalOfferings)}</span></div>
                            </div>
                        </div>

                        {/* Ofertas Especiais */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Ofertas Especiais</h3>
                                <button onClick={() => addListItem('specialOfferings')} className="text-xs font-black text-teal-600 uppercase flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Linha</button>
                            </div>
                            <div className="space-y-2">
                                {data.specialOfferings.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" placeholder="Dia" value={item.day} onChange={(e) => handleListChange('specialOfferings', item.id, 'day', e.target.value)} className={`${inputStyles} w-20`} />
                                        <input type="text" placeholder="Nome Completo - Legível" value={item.name} onChange={(e) => handleListChange('specialOfferings', item.id, 'name', e.target.value)} className={`${inputStyles} flex-1`} />
                                        <input type="number" placeholder="Valor R$" value={item.value || ''} onChange={(e) => handleListChange('specialOfferings', item.id, 'value', e.target.value)} className={`${inputStyles} w-32`} />
                                        <button onClick={() => removeListItem('specialOfferings', item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                {data.specialOfferings.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Nenhuma oferta especial registrada.</p>}
                                <div className="text-right pt-2"><span className="text-xs font-black text-slate-500 uppercase mr-4">Total Ofertas Especiais:</span><span className="text-lg font-black text-emerald-500">{formatCurrency(totalSpecialOfferings)}</span></div>
                            </div>
                        </div>

                        {/* Oferta de Missões */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Oferta de Missões</h3>
                                <button onClick={() => addListItem('missionOfferings')} className="text-xs font-black text-teal-600 uppercase flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Linha</button>
                            </div>
                            <div className="space-y-2">
                                {data.missionOfferings.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" placeholder="Dia" value={item.day} onChange={(e) => handleListChange('missionOfferings', item.id, 'day', e.target.value)} className={`${inputStyles} w-20`} />
                                        <input type="number" placeholder="Valor R$" value={item.value || ''} onChange={(e) => handleListChange('missionOfferings', item.id, 'value', e.target.value)} className={`${inputStyles} flex-1`} />
                                        <button onClick={() => removeListItem('missionOfferings', item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                {data.missionOfferings.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Nenhuma oferta de missões registrada.</p>}
                                <div className="text-right pt-2"><span className="text-xs font-black text-slate-500 uppercase mr-4">Total Missões:</span><span className="text-lg font-black text-emerald-500">{formatCurrency(totalMissionOfferings)}</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: DESPESAS */}
                {activeTab === 'despesas' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4 border-b dark:border-slate-800 pb-2">Despesas Fixas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Pagamento Aluguel</label><input type="number" value={data.fixedExpenses.rent || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'rent', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Financiamento/Consórcio</label><input type="number" value={data.fixedExpenses.financing || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'financing', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Construção/Reforma</label><input type="number" value={data.fixedExpenses.construction || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'construction', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Prebenda Pastoral</label><input type="number" value={data.fixedExpenses.pastoral || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'pastoral', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Conta de Água</label><input type="number" value={data.fixedExpenses.water || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'water', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Conta de Energia</label><input type="number" value={data.fixedExpenses.electricity || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'electricity', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium dark:text-slate-300">Impostos e Taxas</label><input type="number" value={data.fixedExpenses.taxes || ''} onChange={(e) => handleNestedChange('fixedExpenses', 'taxes', e.target.value)} className={`${inputStyles} w-32 text-right`} placeholder="R$" /></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-800 pb-2">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Demais Despesas</h3>
                                <button onClick={() => addListItem('otherExpenses')} className="text-xs font-black text-teal-600 uppercase flex items-center"><PlusIcon className="w-4 h-4 mr-1"/> Adicionar Linha</button>
                            </div>
                            <div className="space-y-2">
                                {data.otherExpenses.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" placeholder="Dia" value={item.day} onChange={(e) => handleListChange('otherExpenses', item.id, 'day', e.target.value)} className={`${inputStyles} w-20`} />
                                        <input type="text" placeholder="Descrição da Despesa" value={item.description} onChange={(e) => handleListChange('otherExpenses', item.id, 'description', e.target.value)} className={`${inputStyles} flex-1`} />
                                        <input type="number" placeholder="Valor R$" value={item.value || ''} onChange={(e) => handleListChange('otherExpenses', item.id, 'value', e.target.value)} className={`${inputStyles} w-32`} />
                                        <button onClick={() => removeListItem('otherExpenses', item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                {data.otherExpenses.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Nenhuma despesa extra registrada.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: RESUMO FINAL */}
                {activeTab === 'resumo' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="bg-sky-500/20 dark:bg-sky-500/10 py-3 text-center border-b border-sky-500/30 dark:border-sky-500/20">
                                <h3 className="text-lg font-black text-slate-900 dark:text-sky-300 uppercase tracking-tight">Relatório Final</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
                                <div className="p-3 font-bold text-center border-r border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300">RESUMO</div>
                                <div className="p-3 font-bold text-center text-slate-800 dark:text-slate-300">VALOR</div>
                            </div>

                            <div className="divide-y divide-slate-200 dark:divide-white/10">
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Ofertas Especiais</div>
                                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(totalSpecialOfferings)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Ofertas</div>
                                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(totalOfferings)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Dízimos Total</div>
                                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(totalTithes)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors items-center">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Empréstimos</div>
                                    <div className="p-2">
                                        <input type="number" value={data.loans || ''} onChange={(e) => setData(prev => ({...prev, loans: Number(e.target.value)}))} className={`${inputStyles} w-full text-left py-1 px-2`} placeholder="R$" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 bg-slate-50 dark:bg-secondary/10">
                                    <div className="p-3 border-r border-slate-200 dark:border-secondary/20 text-sm font-bold text-slate-900 dark:text-secondary-light uppercase">Entrada Total</div>
                                    <div className="p-3 text-sm font-bold text-slate-900 dark:text-secondary-light">{formatCurrency(totalIncome)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors items-center">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Saldo Anterior</div>
                                    <div className="p-2">
                                        <input type="number" value={data.previousBalance || ''} onChange={(e) => setData(prev => ({...prev, previousBalance: Number(e.target.value)}))} className={`${inputStyles} w-full text-left py-1 px-2`} placeholder="R$" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 bg-slate-100 dark:bg-white/5 border-y-2 border-slate-300 dark:border-white/10">
                                    <div className="p-3 border-r border-slate-300 dark:border-white/10 text-sm font-black text-slate-900 dark:text-white uppercase">Subtotal</div>
                                    <div className="p-3 text-sm font-black text-slate-900 dark:text-white">{formatCurrency(subtotal)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Despesas</div>
                                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(totalExpenses)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Saldo Atual (Caixa Ativo)</div>
                                    <div className="p-3 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(currentBalance)}</div>
                                </div>
                                <div className="grid grid-cols-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors items-center">
                                    <div className="p-3 border-r border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-300 uppercase">Saldo Atual (Caixa Construção)</div>
                                    <div className="p-2">
                                        <input type="number" value={data.constructionBalance || ''} onChange={(e) => setData(prev => ({...prev, constructionBalance: Number(e.target.value)}))} className={`${inputStyles} w-full text-left py-1 px-2`} placeholder="R$" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 bg-slate-100 dark:bg-white/10 border-t-2 border-slate-300 dark:border-white/20">
                                    <div className="p-3 border-r border-slate-300 dark:border-white/20 text-base font-black text-slate-900 dark:text-white uppercase">Novo Saldo Atual</div>
                                    <div className="p-3 text-base font-black text-slate-900 dark:text-white">{formatCurrency(newCurrentBalance)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
                            <p className="font-bold text-sky-800 dark:text-sky-400 uppercase tracking-tight">
                                *CONTRIBUIÇÃO REGIONAL = 20% DE TODAS AS ENTRADAS (total de: ofertas + ofertas especiais + dízimos)
                            </p>
                            <p>
                                O valor do depósito do dízimo dos dízimos, é sempre arredondado para facilitar o depósito bancário.
                                <br />
                                A oferta de missões é enviada integralmente a Missão Desafio através do pagamento do carnê, ou por meio da tesouraria regional.
                            </p>
                        </div>

                        <div>
                            <label className={labelStyles}>OBSERVAÇÕES - SUGESTÕES - NOTÍCIAS:</label>
                            <textarea name="observations" value={data.observations} onChange={(e) => setData(prev => ({...prev, observations: e.target.value}))} className={`${inputStyles} min-h-[100px]`} placeholder="Digite aqui as observações do relatório..."></textarea>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportsModule;
