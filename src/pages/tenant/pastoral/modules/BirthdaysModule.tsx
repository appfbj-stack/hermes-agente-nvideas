import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Member } from '../types';
import { getMembers } from '../services/mockApi';
import { CakeIcon } from '../icons/CakeIcon';
import Spinner from '../shared/Spinner';
import { PdfIcon } from '../icons/PdfIcon';
import { ExcelIcon } from '../icons/ExcelIcon';

// HACK: Make typescript happy
// We are loading these libraries from a CDN in index.html
declare const jspdf: any;
declare const XLSX: any;

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const BirthdaysModule: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

    const fetchAndSetMembers = useCallback(async () => {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAndSetMembers();
    }, [fetchAndSetMembers]);

    const birthdaysByMonth = useMemo(() => {
        const grouped: { [key: number]: Member[] } = {};
        for (let i = 0; i < 12; i++) {
            grouped[i] = [];
        }
        members.forEach(member => {
            if (member.birthDate) {
                const month = new Date(member.birthDate + 'T00:00:00').getMonth();
                grouped[month].push(member);
            }
        });
        Object.values(grouped).forEach(monthMembers => {
            monthMembers.sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate());
        });
        return grouped;
    }, [members]);

    const selectedMonthBirthdays = birthdaysByMonth[selectedMonth] || [];
    
    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Dia", "Nome Completo", "Telefone"];
        const tableRows: (string | number)[][] = [];

        selectedMonthBirthdays.forEach(member => {
            const birthDate = new Date(member.birthDate + 'T00:00:00');
            const day = birthDate.getDate();
            const memberData = [
                day,
                member.fullName,
                member.phone || 'N/A'
            ];
            tableRows.push(memberData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            headStyles: { fillColor: [20, 184, 166] },
        });
        doc.text(`Aniversários de ${monthNames[selectedMonth]}`, 14, 15);
        doc.save(`aniversarios_${monthNames[selectedMonth].toLowerCase().replace('ç','c')}.pdf`);
    };
    
    const handleExportExcel = () => {
        const worksheetData = selectedMonthBirthdays.map(member => {
            const birthDate = new Date(member.birthDate + 'T00:00:00');
            return {
                'Dia': birthDate.getDate(),
                'Nome Completo': member.fullName,
                'Telefone': member.phone || 'N/A'
            };
        });
        
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        
        if (worksheetData.length > 0) {
            const objectMaxLength = Object.keys(worksheetData[0]).map(key => ({
                wch: Math.max(key.length, ...worksheetData.map(row => (String(row[key as keyof typeof row]) || '').length))
            }));
            worksheet["!cols"] = objectMaxLength;
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Aniversários");
        XLSX.writeFile(workbook, `aniversarios_${monthNames[selectedMonth].toLowerCase().replace('ç','c')}.xlsx`);
    };


    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold dark:text-slate-100">Aniversários do Mês</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                     <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm"
                    >
                        {monthNames.map((name, index) => (
                            <option key={index} value={index}>{name}</option>
                        ))}
                    </select>
                    <button onClick={handleExportPDF} className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <PdfIcon className="w-5 h-5 mr-2" />
                        Exportar PDF
                    </button>
                    <button onClick={handleExportExcel} className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 text-sm">
                        <ExcelIcon className="w-5 h-5 mr-2" />
                        Exportar Excel
                    </button>
                </div>
            </div>

            {loading ? <Spinner /> : (
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                    {selectedMonthBirthdays.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {selectedMonthBirthdays.map((member, index) => {
                                const birthDate = new Date(member.birthDate + 'T00:00:00');
                                const day = birthDate.getDate();
                                return (
                                    <li key={member.id} className="py-4 flex items-center space-x-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-400 dark:from-amber-500 dark:to-yellow-500 text-white rounded-full font-bold text-lg shadow-md">
                                            {day}
                                        </div>
                                        <div>
                                            <p className="text-md font-semibold text-slate-800 dark:text-slate-100">{member.fullName}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{member.phone}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <CakeIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                            <p className="font-semibold">Nenhum aniversário</p>
                            <p className="text-sm">Não há aniversários cadastrados para {monthNames[selectedMonth]}.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BirthdaysModule;