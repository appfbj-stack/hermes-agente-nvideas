import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task } from '../types';
import { getTasks, saveTasks } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { ClipboardCheckIcon } from '../icons/ClipboardCheckIcon';

const POSTIT_COLORS = [
    { name: 'Canário', bg: '#FEF9C3', text: '#451a03', border: '#fef08a' },
    { name: 'Pétala', bg: '#FCE7F3', text: '#500724', border: '#fbcfe8' },
    { name: 'Céu', bg: '#E0F2FE', text: '#082f49', border: '#bae6fd' },
    { name: 'Menta', bg: '#DCFCE7', text: '#052e16', border: '#bbf7d0' },
    { name: 'Lavanda', bg: '#F3E8FF', text: '#2e1065', border: '#e9d5ff' },
    { name: 'Laranja', bg: '#FFEDD5', text: '#431407', border: '#fed7aa' },
    { name: 'Pérola', bg: '#F0FDFA', text: '#042f2e', border: '#ccfbf1' },
    { name: 'Nuvem', bg: '#F8FAFC', text: '#0f172a', border: '#f1f5f9' },
    { name: 'Ametista', bg: '#EDE9FE', text: '#1e1b4b', border: '#ddd6fe' },
    { name: 'Acqua', bg: '#CFFAFE', text: '#083344', border: '#a5f3fc' },
];

const TaskForm: React.FC<{ task: Partial<Task> | null; onSave: (task: Task) => void; onCancel: () => void; }> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Task>>(task || { color: POSTIT_COLORS[0].bg, completed: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleColorSelect = (colorBg: string) => {
        setFormData(prev => ({ ...prev, color: colorBg }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: task?.id || Date.now().toString(), 
            ...formData, 
            completed: formData.completed || false,
            color: formData.color || POSTIT_COLORS[0].bg
        } as Task);
    };

    const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-lg w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-teal-500 focus:border-teal-500 text-xs";
    const labelStyles = "block text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className={labelStyles}>Título da Nota</label>
                <input type="text" name="title" placeholder="Ex: Telefonar para membro..." value={formData.title || ''} onChange={handleChange} className={inputStyles} required />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelStyles}>Data</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Cor Pastel</label>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                        {POSTIT_COLORS.map(color => (
                            <button
                                key={color.bg}
                                type="button"
                                onClick={() => handleColorSelect(color.bg)}
                                style={{ backgroundColor: color.bg }}
                                className={`w-5 h-5 rounded-full border shadow-sm transition-transform hover:scale-125 ${formData.color === color.bg ? 'ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-slate-800' : 'border-slate-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className={labelStyles}>Descrição</label>
                <textarea
                    name="description"
                    placeholder="Mais detalhes..."
                    value={formData.description || ''}
                    onChange={handleChange}
                    className={`${inputStyles} h-20 resize-none`}
                />
            </div>

            <div className="flex justify-end space-x-2 pt-1">
                <button type="button" onClick={onCancel} className="px-3 py-1.5 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded hover:bg-slate-200 font-bold uppercase tracking-widest">CANCELAR</button>
                <button type="submit" className="px-3 py-1.5 text-[10px] bg-teal-600 text-white rounded font-bold shadow hover:bg-teal-700 uppercase tracking-widest">FIXAR NOTA</button>
            </div>
        </form>
    );
};

const TasksModule: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const fetchAndSetTasks = useCallback(async () => {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetTasks();
    }, [fetchAndSetTasks]);

    const handleSave = async (taskToSave: Task) => {
        const newTasks = editingTask
            ? tasks.map(t => t.id === taskToSave.id ? taskToSave : t)
            : [...tasks, taskToSave];
        
        const sortedTasks = newTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setTasks(sortedTasks);
        await saveTasks(sortedTasks);
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleToggleComplete = async (taskId: string) => {
        const newTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        setTasks(newTasks);
        await saveTasks(newTasks);
    };

    const handleDelete = (taskId: string) => {
        setTaskToDelete(taskId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        const newTasks = tasks.filter(t => t.id !== taskToDelete);
        setTasks(newTasks);
        await saveTasks(newTasks);
        setIsConfirmModalOpen(false);
        setTaskToDelete(null);
    };

    const filteredTasks = useMemo(() => {
        switch (filter) {
            case 'pending': return tasks.filter(t => !t.completed);
            case 'completed': return tasks.filter(t => t.completed);
            default: return tasks;
        }
    }, [tasks, filter]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 animate-fade-in-up">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
                    <ClipboardCheckIcon className="w-6 h-6 text-teal-500" />
                    Mural de Lembretes
                </h2>
                
                <div className="flex items-center gap-2">
                    <div className="inline-flex p-1 bg-slate-200/50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        {(['all', 'pending', 'completed'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {f === 'all' ? 'TUDO' : f === 'pending' ? 'PENDENTES' : 'FEITAS'}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }} 
                        className="flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-2xl shadow-lg hover:bg-teal-700 transition-transform active:scale-90"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {filteredTasks.map((task, index) => {
                        const colorSet = POSTIT_COLORS.find(c => c.bg === task.color) || POSTIT_COLORS[0];
                        const rotation = (parseInt(task.id.slice(-1)) % 3) - 1.5;
                        
                        return (
                            <div 
                                key={task.id} 
                                className={`relative p-3 flex flex-col shadow-sm transition-all duration-300 hover:shadow-xl hover:z-20 group animate-fade-in-up border-t-4 ${task.completed ? 'opacity-40 grayscale-[0.5]' : ''} min-h-[140px] rounded-b-xl cursor-default`}
                                style={{ 
                                    transform: `rotate(${rotation}deg)`,
                                    animationDelay: `${index * 30}ms`,
                                    backgroundColor: colorSet.bg,
                                    borderColor: colorSet.border
                                }}
                            >
                                <button 
                                    onClick={() => handleToggleComplete(task.id)}
                                    className={`absolute -top-2 -left-2 w-6 h-6 rounded-full border shadow-md flex items-center justify-center transition-all ${task.completed ? 'bg-teal-600 border-teal-700 text-white' : 'bg-white border-slate-200 text-transparent'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                </button>

                                <div className="flex-1 overflow-hidden">
                                    <h3 className={`text-[11px] font-black mb-1 leading-tight ${task.completed ? 'line-through' : ''}`} style={{ color: colorSet.text }}>
                                        {task.title}
                                    </h3>
                                    <p className={`text-[10px] leading-snug opacity-90 line-clamp-5 font-medium italic`} style={{ color: colorSet.text }}>
                                        {task.description}
                                    </p>
                                </div>

                                <div className="mt-2 pt-2 border-t border-black/5 flex justify-between items-center">
                                    <span className={`text-[8px] font-black uppercase opacity-50`} style={{ color: colorSet.text }}>
                                        {formatDate(task.date)}
                                    </span>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-1 hover:scale-125 transition-transform" style={{ color: colorSet.text }}>
                                            <EditIcon className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="p-1 hover:scale-125 transition-transform" style={{ color: colorSet.text }}>
                                            <TrashIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredTasks.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Mural Vazio</p>
                        </div>
                    )}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? "Editar" : "Fixar Nota"}>
                <TaskForm 
                    task={editingTask} 
                    onSave={handleSave} 
                    onCancel={() => { setIsModalOpen(false); setEditingTask(null); }} 
                />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => { setIsConfirmModalOpen(false); setTaskToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="Remover"
                message="Deseja retirar este lembrete do mural?"
            />
        </div>
    );
};

export default TasksModule;