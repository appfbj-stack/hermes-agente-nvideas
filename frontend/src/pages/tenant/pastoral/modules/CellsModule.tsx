import React, { useState, useEffect, useCallback } from 'react';
import type { Cell } from '../types';
import { getCells, saveCells } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { CalendarIcon } from '../icons/CalendarIcon';

const HomeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

declare const jspdf: any;
declare const XLSX: any;

const CellForm: React.FC<{ cell: Partial<Cell> | null; onSave: (cell: Cell) => void; onCancel: () => void; }> = ({ cell, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Cell>>(cell || { membersCount: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: cell?.id || Date.now().toString(), ...formData } as Cell);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:ring-teal-500 focus:border-teal-500";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelStyles}>Nome da Célula</label>
                    <input type="text" name="name" placeholder="Ex: Célula Monte Sião" value={formData.name || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Líder Responsável</label>
                    <input type="text" name="leader" placeholder="Nome do líder" value={formData.leader || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Anfitrião</label>
                    <input type="text" name="host" placeholder="Quem recebe em casa" value={formData.host || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Dia da Reunião</label>
                    <select name="meetingDay" value={formData.meetingDay || ''} onChange={handleChange} className={inputStyles} required>
                        <option value="">Selecione o dia</option>
                        <option value="Segunda">Segunda-feira</option>
                        <option value="Terça">Terça-feira</option>
                        <option value="Quarta">Quarta-feira</option>
                        <option value="Quinta">Quinta-feira</option>
                        <option value="Sexta">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Horário</label>
                    <input type="time" name="meetingTime" value={formData.meetingTime || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div className="md:col-span-2">
                    <label className={labelStyles}>Endereço Completo</label>
                    <input type="text" name="address" placeholder="Rua, Número, Bairro..." value={formData.address || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Total de Membros</label>
                    <input type="number" name="membersCount" value={formData.membersCount || 0} onChange={handleChange} className={inputStyles} min="0" />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Observações</label>
                <textarea name="observations" placeholder="Detalhes adicionais..." value={formData.observations || ''} onChange={handleChange} className={`${inputStyles} h-24 resize-none`} />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 dark:text-slate-200 rounded-md hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Salvar Célula</button>
            </div>
        </form>
    );
};

const CellsModule: React.FC = () => {
    const [cells, setCells] = useState<Cell[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<Cell | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [cellToDelete, setCellToDelete] = useState<string | null>(null);

    const fetchCells = useCallback(async () => {
        setLoading(true);
        const data = await getCells();
        setCells(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCells();
    }, [fetchCells]);

    const handleSave = async (cellToSave: Cell) => {
        const newCells = editingCell 
            ? cells.map(c => c.id === cellToSave.id ? cellToSave : c)
            : [...cells, { ...cellToSave, id: Date.now().toString() }];
        setCells(newCells);
        await saveCells(newCells);
        setIsModalOpen(false);
        setEditingCell(null);
    };

    const handleDelete = (id: string) => {
        setCellToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!cellToDelete) return;
        const newCells = cells.filter(c => c.id !== cellToDelete);
        setCells(newCells);
        await saveCells(newCells);
        setIsConfirmModalOpen(false);
        setCellToDelete(null);
    };

    const exportPDF = () => {
        const doc = new jspdf.jsPDF();
        const rows = cells.map(c => [
            c.name, 
            c.leader, 
            c.meetingDay + " às " + (c.meetingTime || 'N/A'),
            c.membersCount.toString(),
            c.address || 'Não inf.'
        ]);
        doc.autoTable({
            head: [['Nome da Célula', 'Líder', 'Reunião', 'Membros', 'Endereço']],
            body: rows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] }
        });
        doc.text("Relatório de Células", 14, 15);
        doc.save("relatorio_celulas.pdf");
    };

    const exportExcel = () => {
        const worksheetData = cells.map(c => ({
            'Nome': c.name,
            'Líder': c.leader,
            'Anfitrião': c.host || '',
            'Dia': c.meetingDay,
            'Hora': c.meetingTime,
            'Membros': c.membersCount,
            'Endereço': c.address || ''
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Células");
        XLSX.writeFile(workbook, "relatorio_celulas.xlsx");
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold dark:text-slate-100 uppercase tracking-tighter">Células</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                    <button onClick={exportPDF} className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-all text-sm transform hover:scale-105">
                        <PdfIcon className="w-5 h-5 mr-2" /> PDF
                    </button>
                    <button onClick={exportExcel} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all text-sm transform hover:scale-105">
                        <ExcelIcon className="w-5 h-5 mr-2" /> Excel
                    </button>
                    <button onClick={() => { setEditingCell(null); setIsModalOpen(true); }} className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-md shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all text-sm transform hover:scale-105">
                        <PlusIcon className="w-5 h-5 mr-2" /> Nova Célula
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cells.map(cell => (
                        <div key={cell.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border-t-4 border-[#00D1B2]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{cell.name}</h3>
                                <span className="text-xs font-bold text-[#00D1B2] bg-[#00D1B2]/10 px-2 py-1 rounded-full">{cell.membersCount} membros</span>
                            </div>
                            <div className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                                <p><strong>Líder:</strong> {cell.leader}</p>
                                <p><strong>Encontros:</strong> {cell.meetingDay} às {cell.meetingTime}</p>
                                <p className="truncate"><strong>Endereço:</strong> {cell.address || 'N/A'}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                                <button onClick={() => { setEditingCell(cell); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 transition-colors"><EditIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(cell.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                    {cells.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <HomeIcon className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-bold uppercase tracking-widest text-xs">Nenhuma célula cadastrada</p>
                        </div>
                    )}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCell ? "Editar Célula" : "Nova Célula"}>
                <CellForm cell={editingCell} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Remover Célula" message="Deseja realmente excluir esta célula?" />
        </div>
    );
};

export default CellsModule;