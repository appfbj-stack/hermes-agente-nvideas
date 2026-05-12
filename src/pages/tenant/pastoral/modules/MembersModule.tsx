import React, { useState, useEffect, useCallback } from 'react';
import type { Member } from '../types';
import { MaritalStatus, EcclesiasticalOffice } from '../types';
import { getMembers, saveMembers } from '../services/mockApi';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CameraIcon } from '../icons/CameraIcon';
import Modal from '../shared/Modal';
import ConfirmationModal from '../shared/ConfirmationModal';
import Spinner from '../shared/Spinner';
import { UsersIcon } from '../icons/UsersIcon';
import { CardIcon } from '../icons/CardIcon';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';

declare const jspdf: any;
declare const XLSX: any;

// Helper para formatar data ISO (YYYY-MM-DD) para BR (DD/MM/YYYY)
const isoToBr = (iso: string) => {
    if (!iso) return '';
    const parts = iso.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// Helper para formatar data BR (DD/MM/YYYY) para ISO (YYYY-MM-DD)
const brToIso = (br: string) => {
    const parts = br.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const MemberForm: React.FC<{ member: Partial<Member> | null; onSave: (member: Member) => void; onCancel: () => void; }> = ({ member, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Member>>(member || { hasCard: false, childrenCount: 0 });
    const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo || null);

    const maskPhone = (value: string) => {
      if (!value) return "";
      value = value.replace(/\D/g, "");
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/, "$1-$2");
      return value.slice(0, 15);
    };

    const maskDate = (value: string) => {
        value = value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
        if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);
        return value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            const isChecked = e.target.checked;
            setFormData(prev => ({ ...prev, [name]: isChecked }));
            return;
        }
        
        let formattedValue: any = value;
        if (name === 'phone') {
            formattedValue = maskPhone(value);
        } else if (name.toLowerCase().includes('date') || name === 'credentialValidity') {
            formattedValue = maskDate(value);
            // No estado interno do formulário mantemos o valor exibido, 
            // mas convertemos para ISO no submit
        } else if (type === 'number') {
            formattedValue = parseInt(value, 10) || 0;
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, photo: base64String }));
                setPhotoPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        
        // Converter datas de volta para ISO antes de salvar
        if (dataToSave.birthDate) dataToSave.birthDate = brToIso(dataToSave.birthDate);
        if (dataToSave.baptismDate) dataToSave.baptismDate = brToIso(dataToSave.baptismDate);
        if (dataToSave.membershipDate) dataToSave.membershipDate = brToIso(dataToSave.membershipDate);
        if (dataToSave.credentialValidity) dataToSave.credentialValidity = brToIso(dataToSave.credentialValidity);

        onSave({ id: member?.id || Date.now().toString(), ...dataToSave } as Member);
    };

    const inputStyles = "p-3 border border-slate-300 dark:border-slate-700 rounded-xl w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all";
    const labelStyles = "block text-[10px] font-black text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
                 <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700">
                    {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <CameraIcon className="w-10 h-10 text-slate-400 dark:text-slate-600" />}
                </div>
                <div>
                    <label htmlFor="photo-upload" className="cursor-pointer bg-slate-100 dark:bg-slate-800 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span>Alterar Foto</span>
                        <input id="photo-upload" name="photo" type="file" className="sr-only" accept="image/*" capture="user" onChange={handlePhotoChange} />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                    <label className={labelStyles}>Nome Completo</label>
                    <input type="text" name="fullName" placeholder="Nome Completo" value={formData.fullName || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Telefone</label>
                    <input type="tel" name="phone" placeholder="(XX) XXXXX-XXXX" value={formData.phone || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Data de Nascimento</label>
                    <input type="tel" name="birthDate" placeholder="DD/MM/AAAA" value={formData.birthDate ? (formData.birthDate.includes('-') ? isoToBr(formData.birthDate) : formData.birthDate) : ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label className={labelStyles}>Estado Civil</label>
                    <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} className={inputStyles}>
                        <option value="">Selecione</option>
                        {Object.values(MaritalStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Cargo Eclesiástico</label>
                    <select name="ecclesiasticalOffice" value={formData.ecclesiasticalOffice || ''} onChange={handleChange} className={inputStyles}>
                        <option value="">Selecione</option>
                        {Object.values(EcclesiasticalOffice).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Data de Batismo</label>
                    <input type="tel" name="baptismDate" placeholder="DD/MM/AAAA" value={formData.baptismDate ? (formData.baptismDate.includes('-') ? isoToBr(formData.baptismDate) : formData.baptismDate) : ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Data de Filiação</label>
                    <input type="tel" name="membershipDate" placeholder="DD/MM/AAAA" value={formData.membershipDate ? (formData.membershipDate.includes('-') ? isoToBr(formData.membershipDate) : formData.membershipDate) : ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelStyles}>Endereço Completo</label>
                    <input type="text" name="address" placeholder="Rua, Número, Bairro, Cidade" value={formData.address || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className={labelStyles}>Escolaridade</label>
                    <select name="educationLevel" value={formData.educationLevel || ''} onChange={handleChange} className={inputStyles}>
                        <option value="">Selecione</option>
                        <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
                        <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                        <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                        <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                        <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                        <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                    </select>
                </div>
                <div>
                    <label className={labelStyles}>Profissão</label>
                    <input type="text" name="profession" placeholder="Sua Profissão" value={formData.profession || ''} onChange={handleChange} className={inputStyles} />
                </div>
            </div>

            <div className="pt-4 border-t dark:border-slate-800">
                <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-4">Filiação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelStyles}>Nome do Pai</label>
                        <input type="text" name="fatherName" placeholder="Nome do Pai" value={formData.fatherName || ''} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className={labelStyles}>Nome da Mãe</label>
                        <input type="text" name="motherName" placeholder="Nome da Mãe" value={formData.motherName || ''} onChange={handleChange} className={inputStyles} />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t dark:border-slate-800">
                <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-4">Filhos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelStyles}>Quantidade de Filhos</label>
                        <input type="number" min="0" name="childrenCount" placeholder="0" value={formData.childrenCount || 0} onChange={handleChange} className={inputStyles} />
                    </div>
                    {formData.childrenCount && formData.childrenCount > 0 ? (
                        <div>
                            <label className={labelStyles}>Nome dos Filhos</label>
                            <input type="text" name="childrenNames" placeholder="Nomes separados por vírgula" value={formData.childrenNames || ''} onChange={handleChange} className={inputStyles} />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                <input type="checkbox" name="hasCard" id="hasCard" checked={formData.hasCard || false} onChange={handleChange} className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer" />
                <label htmlFor="hasCard" className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer">Emitir Credencial / Carteirinha</label>
            </div>

            {formData.hasCard && (
                <div className="animate-fade-in-up">
                    <label className={labelStyles}>Validade da Credencial</label>
                    <input type="tel" name="credentialValidity" placeholder="DD/MM/AAAA" value={formData.credentialValidity ? (formData.credentialValidity.includes('-') ? isoToBr(formData.credentialValidity) : formData.credentialValidity) : ''} onChange={handleChange} className={inputStyles} />
                </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t dark:border-slate-800">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 uppercase tracking-widest transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 text-xs bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 font-black uppercase tracking-widest transition-all">Salvar Membro</button>
            </div>
        </form>
    );
};

const MembersModule: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const fetchAndSetMembers = useCallback(async () => {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetMembers();
    }, [fetchAndSetMembers]);

    const handleSave = async (memberToSave: Member) => {
        const newMembers = editingMember 
            ? members.map(m => m.id === memberToSave.id ? memberToSave : m)
            : [...members, { ...memberToSave, id: Date.now().toString() }];

        setMembers(newMembers);
        await saveMembers(newMembers);
        
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleDelete = (memberId: string) => {
        setMemberToDelete(memberId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;
        const newMembers = members.filter(m => m.id !== memberToDelete);
        setMembers(newMembers);
        await saveMembers(newMembers);
        setIsConfirmModalOpen(false);
        setMemberToDelete(null);
    };


    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };
    
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF({ orientation: 'landscape' });
        const tableColumn = ["Nome", "Telefone", "Endereço", "Cargo", "Nascimento"];
        const tableRows = members.map(m => [m.fullName, m.phone || 'N/A', m.address || 'N/A', m.ecclesiasticalOffice, formatDate(m.birthDate)]);
        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20, theme: 'grid', headStyles: { fillColor: [20, 184, 166] } });
        doc.text("Relatório de Membros", 14, 15);
        doc.save("membros.pdf");
    };

    const handleExportExcel = () => {
        const worksheetData = members.map(m => ({ 'Nome': m.fullName, 'Telefone': m.phone, 'Endereço': m.address, 'Cargo': m.ecclesiasticalOffice, 'Nascimento': formatDate(m.birthDate) }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Membros");
        XLSX.writeFile(workbook, "membros.xlsx");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black dark:text-slate-100 uppercase tracking-tighter">Membros</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de fiéis e obreiros</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportPDF} className="p-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg hover:opacity-90 transition-all"><PdfIcon className="w-4 h-4" /></button>
                    <button onClick={handleExportExcel} className="p-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg hover:opacity-90 transition-all"><ExcelIcon className="w-4 h-4" /></button>
                    <button onClick={handleAdd} className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 text-white rounded-xl shadow-xl hover:shadow-teal-500/20 transition-all text-[10px] font-black uppercase tracking-widest">
                        <PlusIcon className="w-4 h-4 mr-2" /> Novo Membro
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                        <div key={member.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-teal-500 hover:shadow-2xl transition-all animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border dark:border-slate-700">
                                    {member.photo ? <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover" /> : <UsersIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black dark:text-white uppercase tracking-tight truncate">{member.fullName}</h3>
                                    </div>
                                    <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                        {member.ecclesiasticalOffice}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 text-xs text-slate-500">
                                <p><strong>Tel:</strong> {member.phone || 'N/A'}</p>
                                <p><strong>Nasc:</strong> {formatDate(member.birthDate)}</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t dark:border-slate-800">
                                <button onClick={() => handleEdit(member)} className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50"><EditIcon className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl bg-slate-50 dark:bg-slate-800/50"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Editar Membro" : "Novo Cadastro"}>
                <MemberForm member={editingMember} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleConfirmDelete} title="Excluir" message="Remover permanentemente este cadastro?" />
        </div>
    );
};

export default MembersModule;