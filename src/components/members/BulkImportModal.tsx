import { useState } from 'react';
import { Modal, Button, Textarea } from '../ui';
import { useStore } from '../../lib/store';
import { Upload, CheckCircle } from 'lucide-react';
import type { Member } from '../../lib/types';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
    const { addMember, addToast } = useStore();
    const [csvData, setCsvData] = useState('');
    const [preview, setPreview] = useState<Partial<Member>[]>([]);
    const [step, setStep] = useState<'input' | 'preview'>('input');

    const parseCSV = () => {
        if (!csvData.trim()) return;

        const lines = csvData.split('\n');
        const parsedMembers: Partial<Member>[] = [];

        lines.forEach((line) => {
            const [name, email, studentId, branch, yearStr] = line.split(',').map(s => s.trim());

            if (name && email) {
                parsedMembers.push({
                    name,
                    email,
                    studentId: studentId || `TEMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    branch: (branch as any) || 'CS', // Default or cast
                    year: yearStr ? (parseInt(yearStr) as 1 | 2 | 3 | 4) : 1,
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'Active',
                    attendancePercent: 0,
                    feeStatus: 'Pending',
                    rank: 'Member',
                    skills: [],
                    lastAttended: new Date().toISOString().split('T')[0],
                });
            }
        });

        if (parsedMembers.length === 0) {
            addToast({ type: 'warning', message: 'No valid data found. Use format: Name, Email, ID, Branch, Year' });
            return;
        }

        setPreview(parsedMembers);
        setStep('preview');
    };

    const handleImport = () => {
        let count = 0;
        preview.forEach((m) => {
            addMember({
                ...m,
                id: m.studentId || `RS-${Date.now()}-${count}`,
            } as Member);
            count++;
        });

        addToast({ type: 'success', message: `Successfully imported ${count} members!` });
        handleClose();
    };

    const handleClose = () => {
        setCsvData('');
        setPreview([]);
        setStep('input');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Import Members">
            {step === 'input' ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm">
                        <Upload className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-semibold mb-1">CSV Format Required:</p>
                            <code className="bg-blue-100 px-2 py-0.5 rounded">Name, Email, StudentID, Branch, Year</code>
                            <p className="mt-2 text-xs opacity-80">Example: John Doe, john@uni.edu, 21ME001, Mechanical, 3</p>
                        </div>
                    </div>

                    <Textarea
                        label="Paste CSV Data"
                        placeholder="Paste your spreadsheet data here..."
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        rows={10}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                        <Button onClick={parseCSV}>Preview Import</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 text-emerald-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Ready to import {preview.length} members</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                                <tr>
                                    <th className="px-3 py-2">Name</th>
                                    <th className="px-3 py-2">Email</th>
                                    <th className="px-3 py-2">Branch/Year</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {preview.map((m, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2">{m.name}</td>
                                        <td className="px-3 py-2 text-slate-500">{m.email}</td>
                                        <td className="px-3 py-2 text-slate-500">{m.branch} - Year {m.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setStep('input')}>Back</Button>
                        <Button variant="primary" onClick={handleImport}>Confirm Import</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
