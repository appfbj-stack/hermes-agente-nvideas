import React, { useState, useEffect, useCallback } from 'react';
import type { Service } from '../types';
import { getServices, saveServices } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { CalendarIcon } from '../icons/CalendarIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';

declare const jspdf: any;
declare const XLSX: any;

const isoToBr = (iso: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const brToIso = (br: string) => {
    const parts = br.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const ServiceForm: React.FC<{ service: Partial<Service> | null; onSave: (service: Service) => void; onCancel: () => void; }> = ({ service, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Service>>(service || {
        date: isoToBr(new Date().toISOString().split('T')[0])
    });

    const maskDate = (value: string) => {
        value = value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
        if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);
        return value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'date') formattedValue = maskDate(value);
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (dataToSave.date) dataToSave.date = brToIso(dataToSave.date);
        onSave({ id: service?.id || Date.now().toString(), ...dataToSave } as Service);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className={labelStyles}>Data do Culto</label>
                    <input type="tel" name="date" placeholder="DD/MM/AAAA" value={formData.date ? (formData.date.includes('-') ? isoToBr(formData.date) : formData.date) : ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Tema da Mensagem</label>
                    <input type="text" name="sermonTitle" placeholder="Ex: O Poder da Oração" value={formData.sermonTitle || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Pregador(a)</label>
                    <input type="text" name="preacher" placeholder="Nome do pregador" value={formData.preacher || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Dirigente</label>
                    <input type="text" name="leader" placeholder="Quem dirigiu o culto" value={formData.leader || ''} onChange={handleChange} className={inputStyles} required />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Observações</label>
                <textarea name="observations" placeholder="Avisos, eventos..." value={formData.observations || ''} onChange={handleChange} className={`${inputStyles} h-24 resize-none`} />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg font-black uppercase tracking-widest transition-all">Salvar Culto</button>
            </div>
        </form>
    );
};

const ServicesModule: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    const fetchAndSetServices = useCallback(async () => {
        setLoading(true);
        const data = await getServices();
        setServices(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
    }, []);

    useEffect(() => { fetchAndSetServices(); }, [fetchAndSetServices]);

    const handleSave = async (serviceToSave: Service) => {
        const newServices = editingService ? services.map(s => s.id === serviceToSave.id ? serviceToSave : s) : [...services, { ...serviceToSave, id: Date.now().toString() }];
        const sorted = newServices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setServices(sorted);
        await saveServices(sorted);
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleDelete = (id: string) => { setServiceToDelete(id); setIsConfirmModalOpen(true); };

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;
        const newServices = services.filter(s => s.id !== serviceToDelete);
        setServices(newServices);
        await saveServices(newServices);
        setIsConfirmModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return { day: '--', month: '--', weekday: '--' };
        const date = new Date(dateString + 'T00:00:00');
        return { 
            day: date.toLocaleDateString('pt-BR', { day: '2-digit' }), 
            month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(), 
            weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0] 
        };
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Histórico de Cultos</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Agenda e registros ministeriais</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl shadow-xl hover:shadow-teal-500/20 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PlusIcon className="w-4 h-4 mr-2" /> Novo Culto
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="space-y-4">
                    {services.map((service, index) => {
                        const { day, month, weekday } = formatDate(service.date);
                        return (
                            <div key={service.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-6 transition-all hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl text-center flex-col border dark:border-slate-700">
                                    <span className="text-3xl font-black text-teal-600">{day}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{month}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-black dark:text-white uppercase truncate">{weekday}</h3>
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 italic text-sm font-bold truncate">
                                        <BookOpenIcon className="w-4 h-4" /> {service.sermonTitle || 'Sem Tema'}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Pregador: <span className="font-bold text-slate-700 dark:text-slate-300">{service.preacher}</span></p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(service.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? "Editar Culto" : "Novo Registro"}>
                <ServiceForm service={editingService} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Excluir" message="Remover registro de culto?" />
        </div>
    );
};

export default ServicesModule;