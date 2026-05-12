import React, { useState, useEffect, useCallback } from 'react';
import type { Sermon } from '../types';
import { getSermons, saveSermons } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { DownloadIcon } from '../icons/DownloadIcon';

// HACK: Make typescript happy
declare const jspdf: any;

const SermonForm: React.FC<{ sermon: Partial<Sermon> | null; onSave: (sermon: Sermon) => void; onCancel: () => void; }> = ({ sermon, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Sermon>>(sermon || { createdAt: new Date().toISOString() });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: sermon?.id || Date.now().toString(), ...formData } as Sermon);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-teal-500 focus:border-teal-500";
    const labelStyles = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className={labelStyles}>Título do Sermão</label>
                <input type="text" name="title" placeholder="Ex: O Caminho da Vitória" value={formData.title || ''} onChange={handleChange} className={inputStyles} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyles}>Tema Central</label>
                    <input type="text" name="theme" placeholder="Ex: Fé e Perseverança" value={formData.theme || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Texto Bíblico Base</label>
                    <input type="text" name="baseScripture" placeholder="Ex: João 3:16" value={formData.baseScripture || ''} onChange={handleChange} className={inputStyles} />
                </div>
            </div>
            <div>
                <label className={labelStyles}>Esboço / Conteúdo da Mensagem</label>
                <textarea
                    name="content"
                    placeholder="Escreva os pontos principais aqui..."
                    value={formData.content || ''}
                    onChange={handleChange}
                    className={`${inputStyles} h-48 font-serif leading-relaxed text-lg`}
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 rounded-md hover:bg-slate-300 transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow-md">Salvar Esboço</button>
            </div>
        </form>
    );
};

const SermonsModule: React.FC = () => {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [sermonToDelete, setSermonToDelete] = useState<string | null>(null);

    const fetchAndSetSermons = useCallback(async () => {
        setLoading(true);
        const data = await getSermons();
        setSermons(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetSermons();
    }, [fetchAndSetSermons]);

    const handleSave = async (sermonToSave: Sermon) => {
        const newSermons = editingSermon
            ? sermons.map(s => s.id === sermonToSave.id ? sermonToSave : s)
            : [...sermons, sermonToSave];

        setSermons(newSermons.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        await saveSermons(newSermons);
        
        setIsModalOpen(false);
        setEditingSermon(null);
    };

    const handleDelete = (id: string) => {
        setSermonToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!sermonToDelete) return;
        const newSermons = sermons.filter(s => s.id !== sermonToDelete);
        setSermons(newSermons);
        await saveSermons(newSermons);
        setIsConfirmModalOpen(false);
        setSermonToDelete(null);
    };

    const handleExportPDF = (sermon: Sermon) => {
        const doc = new jspdf.jsPDF();
        
        // Estilização do PDF
        // Cabeçalho colorido
        doc.setFillColor(20, 184, 166); // Teal 500
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(sermon.title, 15, 25);
        
        // Metadados
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`TEMA: ${sermon.theme || 'Não definido'}`, 15, 50);
        doc.text(`TEXTO: ${sermon.baseScripture || 'Não definido'}`, 15, 56);
        doc.text(`DATA: ${new Date(sermon.createdAt).toLocaleDateString('pt-BR')}`, 15, 62);
        
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 68, 195, 68);
        
        // Conteúdo com suporte a múltiplas páginas
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("times", "normal"); // Fonte mais legível para leitura longa
        
        const splitText = doc.splitTextToSize(sermon.content || '', 180);
        let cursorY = 80;
        const pageHeight = 280;
        
        splitText.forEach((line: string) => {
            if (cursorY > pageHeight) {
                doc.addPage();
                cursorY = 20;
            }
            doc.text(line, 15, cursorY);
            cursorY += 7;
        });
        
        doc.save(`Esboco_${sermon.title.replace(/\s+/g, '_')}.pdf`);
    };

    const handleExportLibrary = () => {
        const doc = new jspdf.jsPDF();
        doc.setFontSize(18);
        doc.text("Biblioteca de Esboços - Agenda Pastoral", 14, 15);
        
        const tableColumn = ["Título", "Tema", "Texto Base", "Data de Criação"];
        const tableRows = sermons.map(s => [
            s.title,
            s.theme || '',
            s.baseScripture || '',
            new Date(s.createdAt).toLocaleDateString('pt-BR')
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] },
        });

        doc.save("biblioteca_sermoes_completa.pdf");
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold dark:text-slate-100">Biblioteca de Sermões</h2>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={handleExportLibrary} 
                        className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm border border-slate-200 dark:border-slate-600"
                    >
                        <PdfIcon className="w-5 h-5 mr-2" /> Exportar Biblioteca
                    </button>
                    <button 
                        onClick={() => { setEditingSermon(null); setIsModalOpen(true); }} 
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-md shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all duration-200 transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" /> Novo Esboço
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sermons.map((sermon, index) => (
                        <div key={sermon.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="p-5 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <BookOpenIcon className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Esboço</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                                        {new Date(sermon.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">{sermon.title}</h3>
                                <div className="space-y-1 mb-4">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">TEMA: <span className="text-slate-700 dark:text-slate-200">{sermon.theme || 'N/A'}</span></p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">TEXTO: <span className="text-slate-700 dark:text-slate-200">{sermon.baseScripture || 'N/A'}</span></p>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 italic border-t border-slate-100 dark:border-slate-700 pt-3 leading-relaxed">
                                    {sermon.content}
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <button 
                                    onClick={() => handleExportPDF(sermon)} 
                                    className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors" 
                                    title="Baixar PDF do Esboço"
                                >
                                    <DownloadIcon className="w-4 h-4 mr-1.5" />
                                    BAIXAR PDF
                                </button>
                                <div className="flex space-x-1">
                                    <button onClick={() => { setEditingSermon(sermon); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500 transition-colors" title="Editar Esboço">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(sermon.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Excluir">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {sermons.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Sua biblioteca de sermões está vazia.</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500">Comece a organizar seus temas e esboços aqui.</p>
                        </div>
                    )}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSermon ? "Editar Sermão" : "Novo Esboço de Sermão"}>
                <SermonForm sermon={editingSermon} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Sermão"
                message="Tem certeza que deseja excluir este esboço permanentemente da sua biblioteca?"
            />
        </div>
    );
};

export default SermonsModule;