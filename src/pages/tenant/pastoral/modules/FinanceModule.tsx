import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FinanceEntry } from '../types';
import { getFinance, saveFinance } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';

declare const jspdf: any;
declare const XLSX: any;

const FinanceForm: React.FC<{ entry: Partial<FinanceEntry> | null; onSave: (f: FinanceEntry) => void; onCancel: () => void; }> = ({ entry, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<FinanceEntry>>(entry || { type: 'Entrada', amount: 0, date: new Date().toISOString().split('T')[0] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: entry?.id || Date.now().toString(), ...formData } as FinanceEntry);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:ring-teal-500 focus:border-teal-500";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyles}>Tipo de Lançamento</label>
                    <select name="type" value={formData.type || 'Entrada'} onChange={handleChange} className={inputStyles}>
                        <option value="Entrada">Entrada (Dízimo/Oferta)</option>
                        <option value="Saída">Saída (Despesa)</option>
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Valor (R$)</label>
                    <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} className={inputStyles} placeholder="0,00" step="0.01" required />
                </div>
                <div>
                    <label className={labelStyles}>Data</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Categoria</label>
                    <input type="text" name="category" value={formData.category || ''} onChange={handleChange} className={inputStyles} placeholder="Dízimo, Luz, Aluguel..." required />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Descrição</label>
                <input type="text" name="description" value={formData.description || ''} onChange={handleChange} className={inputStyles} placeholder="Ex: Dízimo do Irmão José" required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 dark:text-slate-200 rounded-md hover:bg-slate-300 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow-md">Salvar Lançamento</button>
            </div>
        </form>
    );
};

const FinanceModule: React.FC = () => {
    const [entries, setEntries] = useState<FinanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        const data = await getFinance();
        setEntries(data.sort((a, b) => b.date.localeCompare(a.date)));
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const stats = useMemo(() => {
        const income = entries.filter(e => e.type === 'Entrada').reduce((acc, curr) => acc + curr.amount, 0);
        const outcome = entries.filter(e => e.type === 'Saída').reduce((acc, curr) => acc + curr.amount, 0);
        return { income, outcome, balance: income - outcome };
    }, [entries]);

    const handleSave = async (f: FinanceEntry) => {
        const newData = editingEntry ? entries.map(it => it.id === f.id ? f : it) : [...entries, f];
        setEntries(newData.sort((a, b) => b.date.localeCompare(a.date)));
        await saveFinance(newData);
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    const handleDelete = async () => {
        if (!idToDelete) return;
        const newData = entries.filter(it => it.id !== idToDelete);
        setEntries(newData);
        await saveFinance(newData);
        setIsConfirmModalOpen(false);
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Data", "Descrição", "Tipo", "Categoria", "Valor"];
        const tableRows = entries.map(e => [
            e.date.split('-').reverse().join('/'),
            e.description,
            e.type,
            e.category,
            `R$ ${e.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ]);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });
        doc.text("Relatório Financeiro", 14, 15);
        doc.save("financeiro.pdf");
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold dark:text-white uppercase tracking-tighter">Finanças</h2>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button onClick={handleExportPDF} className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-all text-sm transform hover:scale-105">
                        <PdfIcon className="w-5 h-5 mr-2" /> PDF
                    </button>
                    <button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }} className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-md shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all text-sm transform hover:scale-105">
                        <PlusIcon className="w-5 h-5 mr-2" /> Lançar Valor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-b-4 border-emerald-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Entradas</p>
                    <p className="text-2xl font-black text-emerald-500">R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-b-4 border-rose-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Saídas</p>
                    <p className="text-2xl font-black text-rose-500">R$ {stats.outcome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-b-4 border-teal-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Saldo</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700 border-b dark:border-slate-600">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Data</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Descrição</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Categoria</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Valor</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {entries.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 group transition-colors">
                                    <td className="p-4 text-xs dark:text-slate-400">{e.date.split('-').reverse().join('/')}</td>
                                    <td className="p-4 text-sm font-bold dark:text-white">{e.description}</td>
                                    <td className="p-4 text-xs text-slate-500 italic">{e.category}</td>
                                    <td className={`p-4 text-sm font-black ${e.type === 'Entrada' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {e.type === 'Entrada' ? '+' : '-'} R$ {e.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingEntry(e); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-sky-500"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => { setIdToDelete(e.id); setIsConfirmModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {entries.length === 0 && (
                                <tr><td colSpan={5} className="p-20 text-center opacity-30 font-bold text-xs uppercase tracking-widest">Sem lançamentos</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lançamento Financeiro">
                <FinanceForm entry={editingEntry} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDelete} title="Excluir Lançamento" message="Deseja remover este registro financeiro?" />
        </div>
    );
};

export default FinanceModule;