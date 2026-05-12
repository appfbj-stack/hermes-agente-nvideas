
import React, { useState, useEffect, useCallback } from 'react';
import type { PastoralAgendaEvent } from '../types';
import { PastoralEventType } from '../types';
import { getPastoralAgenda, savePastoralAgenda } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';

// HACK: Make typescript happy
declare const jspdf: any;
declare const XLSX: any;

const PastoralAgendaForm: React.FC<{ event: Partial<PastoralAgendaEvent> | null; onSave: (event: PastoralAgendaEvent) => void; onCancel: () => void; }> = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<PastoralAgendaEvent>>(event || { eventType: PastoralEventType.Visit });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: event?.id || Date.now().toString(), ...formData } as PastoralAgendaEvent);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-teal-500 focus:border-teal-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" placeholder="Título do Compromisso" value={formData.title || ''} onChange={handleChange} className={inputStyles} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Data</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Horário</label>
                    <input type="time" name="time" value={formData.time || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <select name="eventType" value={formData.eventType || ''} onChange={handleChange} className={inputStyles}>
                    <option value="">Tipo de Compromisso</option>
                    {Object.values(PastoralEventType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" name="location" placeholder="Local" value={formData.location || ''} onChange={handleChange} className={inputStyles} />
            </div>
            <textarea name="description" placeholder="Descrição / Detalhes" value={formData.description || ''} onChange={handleChange} className={`${inputStyles} h-24`} />
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 rounded-md hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Salvar</button>
            </div>
        </form>
    );
};

const PastoralAgendaModule: React.FC = () => {
    const [agenda, setAgenda] = useState<PastoralAgendaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<PastoralAgendaEvent | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    const fetchAndSetAgenda = useCallback(async () => {
        setLoading(true);
        const data = await getPastoralAgenda();
        // Sort ascending (earliest date first: menor para maior)
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });
        setAgenda(sortedData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetAgenda();
    }, [fetchAndSetAgenda]);

    const handleSave = async (eventToSave: PastoralAgendaEvent) => {
        const newAgenda = editingEvent
            ? agenda.map(e => e.id === eventToSave.id ? eventToSave : e)
            : [...agenda, eventToSave];
        
        // Sort ascending (earliest date first: menor para maior)
        const sortedAgenda = newAgenda.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });

        setAgenda(sortedAgenda);
        await savePastoralAgenda(sortedAgenda);
        
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleDelete = (eventId: string) => {
        setEventToDelete(eventId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;
        const newAgenda = agenda.filter(e => e.id !== eventToDelete);
        setAgenda(newAgenda);
        await savePastoralAgenda(newAgenda);
        setIsConfirmModalOpen(false);
        setEventToDelete(null);
    };

    const handleEdit = (event: PastoralAgendaEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return { day: 'N/A', month: '', weekday: '' };
        const date = new Date(dateString + 'T00:00:00');
        const day = date.toLocaleDateString('pt-BR', { day: '2-digit' });
        const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        return { day, month: month.charAt(0).toUpperCase() + month.slice(1), weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1) };
    };
    
    const getTypeChipColor = (type: PastoralEventType) => {
        const colors: Record<PastoralEventType, string> = {
            [PastoralEventType.Visit]: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
            [PastoralEventType.Meeting]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
            [PastoralEventType.Counseling]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
            [PastoralEventType.Event]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
            [PastoralEventType.Personal]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
        };
        return colors[type] || colors[PastoralEventType.Personal];
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Data", "Horário", "Compromisso", "Tipo", "Local", "Descrição"];
        const tableRows: (string | null)[][] = [];

        agenda.forEach(event => {
            const date = new Date(`${event.date}T${event.time || '00:00'}`);
            const eventData = [
                date.toLocaleDateString('pt-BR'),
                event.time,
                event.title,
                event.eventType,
                event.location || '',
                event.description || ''
            ];
            tableRows.push(eventData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] },
        });
        doc.text("Agenda Pastoral", 14, 15);
        doc.save("agenda_pastoral.pdf");
    };

    const handleExportExcel = () => {
        const worksheetData = agenda.map(event => ({
            'Data': new Date(`${event.date}T${event.time || '00:00'}`).toLocaleDateString('pt-BR'),
            'Horário': event.time,
            'Compromisso': event.title,
            'Tipo': event.eventType,
            'Local': event.location || '',
            'Descrição': event.description || ''
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        if (worksheetData.length > 0) {
            const objectMaxLength = Object.keys(worksheetData[0]).map(key => ({
                wch: Math.max(key.length, ...worksheetData.map(row => (String(row[key as keyof typeof row]) || '').length))
            }));
            worksheet["!cols"] = objectMaxLength;
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Agenda Pastoral");
        XLSX.writeFile(workbook, "agenda_pastoral.xlsx");
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold dark:text-slate-100">Agenda Pastoral</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                    <button onClick={handleExportPDF} className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <PdfIcon className="w-5 h-5 mr-2" /> Exportar PDF
                    </button>
                    <button onClick={handleExportExcel} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <ExcelIcon className="w-5 h-5 mr-2" /> Exportar Excel
                    </button>
                    <button onClick={handleAdd} className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-md shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all duration-200 transform hover:scale-105 text-sm">
                        <PlusIcon className="w-5 h-5 mr-2" /> Novo Compromisso
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="space-y-4">
                    {agenda.map((event, index) => {
                        const { day, month, weekday } = formatDate(event.date);
                        return (
                            <div key={event.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex-shrink-0 flex items-center justify-center w-24 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg text-center flex-col shadow-inner">
                                    <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">{day}</span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">{month}</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{weekday}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{event.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeChipColor(event.eventType)}`}>{event.eventType}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Horário:</strong> {event.time}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Local:</strong> {event.location || 'N/A'}</p>
                                    {event.description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">{event.description}</p>}
                                </div>
                                <div className="flex space-x-2 self-start sm:self-center">
                                    <button onClick={() => handleEdit(event)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        );
                    })}
                    {agenda.length === 0 && (
                         <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                            <p className="font-semibold">Nenhum compromisso agendado</p>
                            <p className="text-sm">Clique em "Novo Compromisso" para começar.</p>
                        </div>
                    )}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? "Editar Compromisso" : "Novo Compromisso"}>
                <PastoralAgendaForm 
                    event={editingEvent} 
                    onSave={handleSave} 
                    onCancel={() => { setIsModalOpen(false); setEditingEvent(null); }} 
                />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => { setIsConfirmModalOpen(false); setEventToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este compromisso? Esta ação não pode ser desfeita."
            />
        </div>
    );
};

export default PastoralAgendaModule;
