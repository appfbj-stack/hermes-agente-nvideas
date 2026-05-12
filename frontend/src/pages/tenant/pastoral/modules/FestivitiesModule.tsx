import React, { useState, useEffect, useCallback } from 'react';
import type { Festivity } from '../types';
import { FestivityName } from '../types';
import { getFestivities, saveFestivities } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { GiftIcon } from '../icons/GiftIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';

// HACK: Make typescript happy
declare const jspdf: any;
declare const XLSX: any;

const FestivityForm: React.FC<{ festivity: Partial<Festivity> | null; onSave: (festivity: Festivity) => void; onCancel: () => void; }> = ({ festivity, onSave, onCancel }) => {
    // Detect if initial name is from the enum or custom
    const initialIsCustom = festivity?.name && !Object.values(FestivityName).includes(festivity.name as FestivityName);
    
    const [formData, setFormData] = useState<Partial<Festivity>>(festivity || { name: FestivityName.UFEBRAC });
    const [isCustomName, setIsCustomName] = useState(initialIsCustom);
    const [customNameValue, setCustomNameValue] = useState(initialIsCustom ? festivity.name : '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            if (value === 'OTHER') {
                setIsCustomName(true);
            } else {
                setIsCustomName(false);
                setFormData(prev => ({ ...prev, name: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomNameValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = isCustomName ? customNameValue : formData.name;
        onSave({ id: festivity?.id || Date.now().toString(), ...formData, name: finalName } as Festivity);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-teal-500 focus:border-teal-500 transition-all";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className={labelStyles}>Festividade / Departamento</label>
                        <select 
                            name="name" 
                            value={isCustomName ? 'OTHER' : (formData.name || '')} 
                            onChange={handleChange} 
                            className={inputStyles}
                        >
                            {Object.values(FestivityName).map(s => <option key={s} value={s}>{s}</option>)}
                            <option value="OTHER">Outro (Personalizado...)</option>
                        </select>
                    </div>
                    {isCustomName && (
                        <div className="animate-fade-in-up">
                            <label className={labelStyles}>Nome Personalizado</label>
                            <input 
                                type="text" 
                                placeholder="Digite o nome do evento" 
                                value={customNameValue} 
                                onChange={handleCustomNameChange} 
                                className={`${inputStyles} border-teal-400 dark:border-teal-500`} 
                                required 
                                autoFocus
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label className={labelStyles}>Data do Evento</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Pregador(a)</label>
                    <input type="text" name="preacher" placeholder="Nome do pregador" value={formData.preacher || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Dirigente</label>
                    <input type="text" name="leader" placeholder="Nome do dirigente" value={formData.leader || ''} onChange={handleChange} className={inputStyles} required />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Observações</label>
                <textarea
                    name="observations"
                    placeholder="Detalhes adicionais..."
                    value={formData.observations || ''}
                    onChange={handleChange}
                    className={`${inputStyles} h-24`}
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 rounded-md hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Salvar</button>
            </div>
        </form>
    );
};

const FestivitiesModule: React.FC = () => {
    const [festivities, setFestivities] = useState<Festivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFestivity, setEditingFestivity] = useState<Festivity | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [festivityToDelete, setFestivityToDelete] = useState<string | null>(null);

    const fetchAndSetFestivities = useCallback(async () => {
        setLoading(true);
        const data = await getFestivities();
        const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFestivities(sortedData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetFestivities();
    }, [fetchAndSetFestivities]);

    const handleSave = async (festivityToSave: Festivity) => {
        const newFestivities = editingFestivity
            ? festivities.map(f => f.id === festivityToSave.id ? festivityToSave : f)
            : [...festivities, { ...festivityToSave, id: Date.now().toString() }];

        const sortedFestivities = newFestivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFestivities(sortedFestivities);
        await saveFestivities(sortedFestivities);
        
        setIsModalOpen(false);
        setEditingFestivity(null);
    };

    const handleDelete = (festivityId: string) => {
        setFestivityToDelete(festivityId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!festivityToDelete) return;
        const newFestivities = festivities.filter(f => f.id !== festivityToDelete);
        setFestivities(newFestivities);
        await saveFestivities(newFestivities);
        setIsConfirmModalOpen(false);
        setFestivityToDelete(null);
    };

    const handleEdit = (festivity: Festivity) => {
        setEditingFestivity(festivity);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingFestivity(null);
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
    
    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Data", "Festividade", "Pregador(a)", "Dirigente", "Observações"];
        const tableRows: (string | null)[][] = [];

        festivities.forEach(festivity => {
            const date = new Date(festivity.date + 'T00:00:00');
            const festivityData = [
                date.toLocaleDateString('pt-BR'),
                festivity.name,
                festivity.preacher,
                festivity.leader,
                festivity.observations || ''
            ];
            tableRows.push(festivityData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] },
        });
        doc.text("Agenda de Festividades", 14, 15);
        doc.save("agenda_de_festividades.pdf");
    };

    const handleExportExcel = () => {
        const worksheetData = festivities.map(festivity => ({
            'Data': new Date(festivity.date + 'T00:00:00').toLocaleDateString('pt-BR'),
            'Festividade': festivity.name,
            'Pregador(a)': festivity.preacher,
            'Dirigente': festivity.leader,
            'Observações': festivity.observations || ''
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Festividades");
        XLSX.writeFile(workbook, "agenda_de_festividades.xlsx");
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold dark:text-slate-100">Agenda de Festividades</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                     <button onClick={handleExportPDF} className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <PdfIcon className="w-5 h-5 mr-2" /> Exportar PDF
                    </button>
                    <button onClick={handleExportExcel} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <ExcelIcon className="w-5 h-5 mr-2" /> Exportar Excel
                    </button>
                    <button onClick={handleAdd} className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-md shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all duration-200 transform hover:scale-105 text-sm">
                        <PlusIcon className="w-5 h-5 mr-2" /> Nova Festividade
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="space-y-4">
                    {festivities.map((festivity, index) => {
                        const { day, month, weekday } = formatDate(festivity.date);
                        return (
                            <div key={festivity.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg text-center flex-col shadow-inner">
                                    <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">{day}</span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">{month}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{festivity.name}</h3>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{weekday}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Pregador:</strong> {festivity.preacher}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Dirigente:</strong> {festivity.leader}</p>
                                    {festivity.observations && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">{festivity.observations}</p>}
                                </div>
                                <div className="flex space-x-2 self-start sm:self-center">
                                    <button onClick={() => handleEdit(festivity)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(festivity.id)} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFestivity ? "Editar Festividade" : "Nova Festividade"}>
                <FestivityForm festivity={editingFestivity} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Festividade"
                message="Deseja excluir esta festividade?"
            />
        </div>
    );
};

export default FestivitiesModule;