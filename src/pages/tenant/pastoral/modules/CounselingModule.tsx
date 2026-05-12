import React, { useState, useEffect, useCallback } from 'react';
import type { Counseling } from '../types';
import { getCounseling, saveCounseling } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';

const PhoneIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const CounselingForm: React.FC<{ entry: Partial<Counseling> | null; onSave: (c: Counseling) => void; onCancel: () => void; }> = ({ entry, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Counseling>>(entry || { 
        status: 'Aberto',
        date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: entry?.id || Date.now().toString(), ...formData } as Counseling);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all cursor-pointer";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelStyles}>Pessoa Atendida</label>
                    <input type="text" name="personName" value={formData.personName || ''} onChange={handleChange} className={inputStyles} placeholder="Nome do aconselhado" required />
                </div>
                <div>
                    <label className={labelStyles}>Data do Atendimento</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Conselheiro Responsável</label>
                    <input type="text" name="counselor" value={formData.counselor || ''} onChange={handleChange} className={inputStyles} placeholder="Pastor ou Obreiro" required />
                </div>
                <div>
                    <label className={labelStyles}>Status do Caso</label>
                    <select name="status" value={formData.status || 'Aberto'} onChange={handleChange} className={inputStyles}>
                        <option value="Aberto">Em Aberto</option>
                        <option value="Concluído">Concluído</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={labelStyles}>Assunto / Tema Principal</label>
                <input type="text" name="topic" value={formData.topic || ''} onChange={handleChange} className={inputStyles} placeholder="Ex: Crise familiar, Direcionamento espiritual" required />
            </div>
            <div>
                <label className={labelStyles}>Anotações Confidenciais</label>
                <textarea name="observations" value={formData.observations || ''} onChange={handleChange} className={`${inputStyles} h-32 resize-none`} placeholder="Relate os pontos principais do atendimento..." />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 uppercase tracking-widest transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black uppercase tracking-widest transition-all">Salvar Registro</button>
            </div>
        </form>
    );
};

const CounselingModule: React.FC = () => {
    const [entries, setEntries] = useState<Counseling[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Counseling | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCounseling();
            setEntries(data.sort((a, b) => b.date.localeCompare(a.date)));
        } catch (error) {
            console.error("Erro ao carregar atendimentos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleSave = async (c: Counseling) => {
        const newData = editingEntry ? entries.map(it => it.id === c.id ? c : it) : [...entries, c];
        setEntries(newData.sort((a, b) => b.date.localeCompare(a.date)));
        await saveCounseling(newData);
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    const handleDelete = async () => {
        if (!idToDelete) return;
        const newData = entries.filter(it => it.id !== idToDelete);
        setEntries(newData);
        await saveCounseling(newData);
        setIsConfirmModalOpen(false);
        setIdToDelete(null);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return dateStr.split('-').reverse().join('/');
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Aconselhamento</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de atendimentos e cuidado espiritual</p>
                </div>
                <button onClick={() => { setEditingEntry(null); setIsModalOpen(true); }} className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-xl hover:shadow-indigo-500/20 transition-all text-[10px] font-black uppercase tracking-widest">
                    <PlusIcon className="w-4 h-4 mr-2" /> Novo Atendimento
                </button>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map((e, index) => (
                        <div 
                            key={e.id} 
                            className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500 hover:shadow-2xl transition-all group animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">{e.personName}</h3>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{formatDate(e.date)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${e.status === 'Concluído' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 animate-pulse-soft'}`}>
                                    {e.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest mt-0.5">Assunto:</span>
                                    <span className="font-bold dark:text-slate-200 flex-1">{e.topic}</span>
                                </div>
                                <div className="flex items-center text-xs">
                                    <span className="w-20 text-slate-400 font-black uppercase text-[9px] tracking-widest">Conselheiro:</span>
                                    <span className="font-bold dark:text-slate-300">{e.counselor}</span>
                                </div>
                                {e.observations && (
                                    <div className="mt-3 pt-3 border-t dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Anotações:</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2">{e.observations}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-800">
                                <button onClick={() => { setEditingEntry(e); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => { setIdToDelete(e.id); setIsConfirmModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div className="col-span-full py-32 text-center flex flex-col items-center justify-center space-y-4 opacity-30">
                            <PhoneIcon className="w-24 h-24 text-slate-300 dark:text-slate-700" />
                            <div>
                                <p className="font-black uppercase tracking-[0.4em] text-slate-400 text-xs">Sem Registros</p>
                                <p className="text-slate-500 text-sm font-medium mt-2">Clique em 'Novo Atendimento' para iniciar um acompanhamento</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEntry ? "Editar Atendimento" : "Novo Registro de Atendimento"}>
                <CounselingForm entry={editingEntry} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            
            <ConfirmationModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                onConfirm={handleDelete} 
                title="Excluir Registro" 
                message="Tem certeza que deseja remover permanentemente este histórico de aconselhamento? Esta ação é irreversível." 
            />
        </div>
    );
};

export default CounselingModule;