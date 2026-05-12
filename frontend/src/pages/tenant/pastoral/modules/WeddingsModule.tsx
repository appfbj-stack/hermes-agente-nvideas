import React, { useState, useEffect, useCallback } from 'react';
import type { Wedding } from '../types';
import { getWeddings, saveWeddings } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';

declare const jspdf: any;
declare const XLSX: any;

const HeartIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const WeddingForm: React.FC<{ wedding: Partial<Wedding> | null; onSave: (w: Wedding) => void; onCancel: () => void; }> = ({ wedding, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Wedding>>(wedding || {
        date: new Date().toISOString().split('T')[0]
    });

    // Fix: Destructure name and value from e.target to avoid using undefined 'name' variable
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: wedding?.id || Date.now().toString(), ...formData } as Wedding);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all cursor-pointer";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelStyles}>Noivo</label>
                    <input type="text" name="groomName" value={formData.groomName || ''} onChange={handleChange} className={inputStyles} placeholder="Nome do Noivo" required />
                </div>
                <div>
                    <label className={labelStyles}>Noiva</label>
                    <input type="text" name="brideName" value={formData.brideName || ''} onChange={handleChange} className={inputStyles} placeholder="Nome da Noiva" required />
                </div>
                <div>
                    <label className={labelStyles}>Data da Cerimônia</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Oficiante</label>
                    <input type="text" name="officiant" value={formData.officiant || ''} onChange={handleChange} className={inputStyles} placeholder="Pastor que realizará" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Localização</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputStyles} placeholder="Igreja, Chácara, Buffet..." />
            </div>
            <div>
                <label className={labelStyles}>Observações da Cerimônia</label>
                <textarea name="observations" value={formData.observations || ''} onChange={handleChange} className={`${inputStyles} h-32 resize-none`} placeholder="Detalhes como recepção, protocolo..." />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 uppercase tracking-widest transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 font-black uppercase tracking-widest transition-all">Salvar Casamento</button>
            </div>
        </form>
    );
};

const WeddingsModule: React.FC = () => {
    const [weddings, setWeddings] = useState<Wedding[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWedding, setEditingWedding] = useState<Wedding | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [weddingToDelete, setWeddingToDelete] = useState<string | null>(null);

    const fetchWeddings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getWeddings();
            setWeddings(data.sort((a, b) => a.date.localeCompare(b.date)));
        } catch (error) {
            console.error("Erro ao carregar casamentos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchWeddings(); }, [fetchWeddings]);

    const handleSave = async (w: Wedding) => {
        const newData = editingWedding ? weddings.map(it => it.id === w.id ? w : it) : [...weddings, w];
        setWeddings(newData.sort((a, b) => a.date.localeCompare(b.date)));
        await saveWeddings(newData);
        setIsModalOpen(false);
        setEditingWedding(null);
    };

    const handleDelete = async () => {
        if (!weddingToDelete) return;
        const newData = weddings.filter(it => it.id !== weddingToDelete);
        setWeddings(newData);
        await saveWeddings(newData);
        setIsConfirmModalOpen(false);
        setWeddingToDelete(null);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return dateStr.split('-').reverse().join('/');
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Data", "Noivos", "Local", "Oficiante"];
        const tableRows = weddings.map(w => [
            formatDate(w.date),
            `${w.groomName} & ${w.brideName}`,
            w.location || 'Não informado',
            w.officiant || 'A definir'
        ]);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });
        doc.text("Calendário de Casamentos", 14, 15);
        doc.save("casamentos.pdf");
    };

    const handleExportExcel = () => {
        const worksheetData = weddings.map(w => ({
            'Data': formatDate(w.date),
            'Noivo': w.groomName,
            'Noiva': w.brideName,
            'Local': w.location || '',
            'Oficiante': w.officiant || '',
            'Observações': w.observations || ''
        }));
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Casamentos");
        XLSX.writeFile(wb, "casamentos.xlsx");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Cerimônias & Casamentos</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Agenda de uniões matrimoniais</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                         <button onClick={handleExportPDF} className="p-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg hover:opacity-90 transition-all" title="Exportar PDF">
                            <PdfIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <button onClick={() => { setEditingWedding(null); setIsModalOpen(true); }} className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl shadow-xl hover:shadow-teal-500/20 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PlusIcon className="w-4 h-4 mr-2" /> Agendar Casamento
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weddings.map((w, index) => (
                        <div 
                            key={w.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-teal-500 hover:shadow-2xl transition-all group animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight leading-tight">
                                        {w.groomName} <br/> <span className="text-teal-500">&</span> {w.brideName}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{formatDate(w.date)}</p>
                                </div>
                                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-500">
                                    <HeartIcon className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest mt-0.5">Local:</span>
                                    <span className="font-bold dark:text-slate-300 flex-1">{w.location || 'Não informado'}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest">Oficiante:</span>
                                    <span className="font-bold dark:text-slate-300">{w.officiant || 'A definir'}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-800">
                                <button onClick={() => { setEditingWedding(w); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => { setWeddingToDelete(w.id); setIsConfirmModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {weddings.length === 0 && (
                        <div className="col-span-full py-32 text-center flex flex-col items-center justify-center space-y-4 opacity-30">
                            <HeartIcon className="w-24 h-24 text-slate-300 dark:text-slate-700" />
                            <div>
                                <p className="font-black uppercase tracking-[0.4em] text-slate-400 text-xs">Nenhum Casamento</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingWedding ? "Editar Casamento" : "Novo Agendamento"}>
                <WeddingForm wedding={editingWedding} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            
            <ConfirmationModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                onConfirm={handleDelete} 
                title="Excluir Agendamento" 
                message="Deseja realmente apagar este registro de casamento da agenda?" 
            />
        </div>
    );
};

export default WeddingsModule;