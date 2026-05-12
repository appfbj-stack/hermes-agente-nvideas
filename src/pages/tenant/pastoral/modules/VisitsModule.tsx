import React, { useState, useEffect, useCallback } from 'react';
import type { Visit } from '../types';
import { getVisits, saveVisits } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PdfIcon } from '../icons/PdfIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';

declare const jspdf: any;

const VISIT_TYPES = ['Lar (Membro)', 'Hospitalar', 'Empresarial', 'Aconselhamento', 'Visitante', 'Outro'];

const DocumentTextIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const VisitForm: React.FC<{ visit: Partial<Visit> | null; onSave: (v: Visit) => void; onCancel: () => void; }> = ({ visit, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Visit>>(visit || { 
        date: new Date().toISOString().split('T')[0],
        type: VISIT_TYPES[0],
        status: 'Realizada'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: visit?.id || Date.now().toString(), ...formData } as Visit);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all cursor-pointer";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelStyles}>Pessoa Visitada</label>
                    <input type="text" name="visitedPerson" value={formData.visitedPerson || ''} onChange={handleChange} className={inputStyles} placeholder="Nome do membro ou visitante" required />
                </div>
                <div>
                    <label className={labelStyles}>Data da Visita</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Tipo de Visita</label>
                    <select name="type" value={formData.type || ''} onChange={handleChange} className={inputStyles}>
                        {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Status</label>
                    <select name="status" value={formData.status || ''} onChange={handleChange} className={inputStyles}>
                        <option value="Realizada">Realizada</option>
                        <option value="Pendente">Pendente</option>
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Responsável (Visitante)</label>
                    <input type="text" name="visitor" value={formData.visitor || ''} onChange={handleChange} className={inputStyles} placeholder="Quem realizou a visita" required />
                </div>
                <div>
                    <label className={labelStyles}>Motivo</label>
                    <input type="text" name="reason" value={formData.reason || ''} onChange={handleChange} className={inputStyles} placeholder="Ex: Enfermidade, Boas-vindas" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Relatório / Observações</label>
                <textarea name="observations" value={formData.observations || ''} onChange={handleChange} className={`${inputStyles} h-32 resize-none`} placeholder="Relate como foi o momento espiritual..." />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 uppercase tracking-widest transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 font-black uppercase tracking-widest transition-all">Salvar Registro</button>
            </div>
        </form>
    );
};

const VisitsModule: React.FC = () => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [visitToDelete, setVisitToDelete] = useState<string | null>(null);

    const fetchVisits = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getVisits();
            if (Array.isArray(data)) {
                setVisits(data.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
            } else {
                setVisits([]);
            }
        } catch (error) {
            console.error("Falha ao carregar visitas:", error);
            setVisits([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVisits(); }, [fetchVisits]);

    const handleSave = async (v: Visit) => {
        const newData = editingVisit 
            ? visits.map(it => it.id === v.id ? v : it) 
            : [...visits, { ...v, id: Date.now().toString() }];
        const sorted = newData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setVisits(sorted);
        await saveVisits(sorted);
        setIsModalOpen(false);
        setEditingVisit(null);
    };

    const handleDeleteClick = (id: string) => {
        setVisitToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!visitToDelete) return;
        const newData = visits.filter(it => it.id !== visitToDelete);
        setVisits(newData);
        await saveVisits(newData);
        setIsConfirmModalOpen(false);
        setVisitToDelete(null);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr || typeof dateStr !== 'string') return 'N/A';
        return dateStr.split('-').reverse().join('/');
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Data", "Visitado", "Visitante", "Tipo", "Motivo", "Status"];
        const tableRows = visits.map(v => [
            formatDate(v.date),
            v.visitedPerson,
            v.visitor,
            v.type || 'N/A',
            v.reason || 'N/A',
            v.status
        ]);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });
        doc.text("Relatório de Visitas Pastorais", 14, 15);
        doc.save("visitas_pastorais.pdf");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Visitações Pastorais</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Histórico de assistência e cuidado</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportPDF} className="flex items-center justify-center px-4 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg hover:opacity-90 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PdfIcon className="w-4 h-4 mr-2" /> Exportar PDF
                    </button>
                    <button onClick={() => { setEditingVisit(null); setIsModalOpen(true); }} className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl shadow-xl hover:shadow-teal-500/20 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PlusIcon className="w-4 h-4 mr-2" /> Nova Visita
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visits.map((v, index) => (
                        <div 
                            key={v.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-teal-500 hover:shadow-2xl transition-all group animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">{v.visitedPerson}</h3>
                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-0.5">{formatDate(v.date)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${v.status === 'Realizada' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                                    {v.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest">Tipo:</span>
                                    <span className="font-bold dark:text-slate-300">{v.type}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest">Motivo:</span>
                                    <span className="font-bold dark:text-slate-300">{v.reason || 'N/A'}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest">Por:</span>
                                    <span className="font-bold dark:text-slate-300">{v.visitor}</span>
                                </div>
                                {v.observations && (
                                    <div className="mt-3 pt-3 border-t dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Observações:</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2">{v.observations}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditingVisit(v); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteClick(v.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {visits.length === 0 && (
                        <div className="col-span-full py-32 text-center flex flex-col items-center justify-center space-y-4 opacity-30">
                            <DocumentTextIcon className="w-24 h-24 text-slate-300 dark:text-slate-700" />
                            <div>
                                <p className="font-black uppercase tracking-[0.4em] text-slate-400 text-xs">Sem Visitas</p>
                                <p className="text-slate-500 text-sm font-medium mt-2">Clique em 'Nova Visita' para começar o registro</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVisit ? "Editar Visita" : "Novo Registro"}>
                <VisitForm visit={editingVisit} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                onConfirm={handleConfirmDelete} 
                title="Apagar Registro" 
                message="Tem certeza que deseja excluir permanentemente este registro de visitação?" 
            />
        </div>
    );
};

export default VisitsModule;