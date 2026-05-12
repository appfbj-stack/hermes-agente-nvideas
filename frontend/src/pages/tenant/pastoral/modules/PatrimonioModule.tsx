import React, { useState, useEffect, useCallback } from 'react';
import type { Patrimonio } from '../types';
import { PatrimonioStatus } from '../types';
import { getPatrimonio, savePatrimonio } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CameraIcon } from '../icons/CameraIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { ArchiveBoxIcon } from '../icons/ArchiveBoxIcon';

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

const PatrimonioForm: React.FC<{ item: Partial<Patrimonio> | null; onSave: (item: Patrimonio) => void; onCancel: () => void; }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Patrimonio>>(item || { quantity: 1, value: 0, status: PatrimonioStatus.Good });
    const [photoPreview, setPhotoPreview] = useState<string | null>(item?.photo || null);

    const maskDate = (value: string) => {
        value = value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
        if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);
        return value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;
        if (name === 'purchaseDate') finalValue = maskDate(value);
        else if (type === 'number') finalValue = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, photo: base64String }));
                setPhotoPreview(base64String);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (dataToSave.purchaseDate) dataToSave.purchaseDate = brToIso(dataToSave.purchaseDate);
        onSave({ id: item?.id || Date.now().toString(), ...dataToSave } as Patrimonio);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 text-sm";
    const labelStyles = "block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div className="flex items-center space-x-4">
                 <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center overflow-hidden border">
                    {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <CameraIcon className="w-10 h-10 text-slate-400" />}
                </div>
                <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase text-slate-700 dark:text-slate-200">
                    Alterar Foto
                    <input type="file" className="sr-only" accept="image/*" capture="environment" onChange={handlePhotoChange} />
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className={labelStyles}>Item</label>
                    <input type="text" name="name" placeholder="Ex: Cadeira, Microfone..." value={formData.name || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Situação</label>
                    <select name="status" value={formData.status || ''} onChange={handleChange} className={inputStyles}>
                        {Object.values(PatrimonioStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Data de Aquisição</label>
                    <input type="tel" name="purchaseDate" placeholder="DD/MM/AAAA" value={formData.purchaseDate ? (formData.purchaseDate.includes('-') ? isoToBr(formData.purchaseDate) : formData.purchaseDate) : ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Qtd</label>
                    <input type="number" name="quantity" value={formData.quantity || 1} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Valor (R$)</label>
                    <input type="number" name="value" step="0.01" value={formData.value || 0} onChange={handleChange} className={inputStyles} />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-teal-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg">Salvar</button>
            </div>
        </form>
    );
};

const PatrimonioModule: React.FC = () => {
    const [items, setItems] = useState<Patrimonio[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Patrimonio | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        const data = await getPatrimonio();
        setItems(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleSave = async (i: Patrimonio) => {
        const newData = editingItem ? items.map(p => p.id === i.id ? i : p) : [...items, { ...i, id: Date.now().toString() }];
        setItems(newData);
        await savePatrimonio(newData);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const newData = items.filter(i => i.id !== itemToDelete);
        setItems(newData);
        await savePatrimonio(newData);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Patrimônio</h2>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Novo Item
                </button>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-l-4 border-l-teal-500 dark:border-slate-800">
                             <div className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                                {item.photo ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" /> : <ArchiveBoxIcon className="w-12 h-12 text-slate-200" />}
                             </div>
                             <h3 className="text-lg font-black dark:text-white uppercase">{item.name}</h3>
                             <div className="mt-2 text-xs text-slate-500">
                                <p>Qtd: {item.quantity}</p>
                                <p>Status: {item.status}</p>
                                <p>Valor: R$ {item.value.toLocaleString('pt-BR')}</p>
                             </div>
                             <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-slate-800">
                                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-sky-500"><EditIcon className="w-5 h-5" /></button>
                                <button onClick={() => { setItemToDelete(item.id); setIsConfirmModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                             </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Patrimônio">
                <PatrimonioForm item={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDelete} title="Excluir" message="Remover item do patrimônio?" />
        </div>
    );
};

export default PatrimonioModule;