import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { CheckoutRecord, InventoryItem, ItemCondition } from '../../lib/types';

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    checkout: CheckoutRecord;
    item: InventoryItem;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, checkout, item }) => {
    const { checkInItem, members } = useStore();
    const [condition, setCondition] = useState<ItemCondition>(item.condition);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const memberName = members.find(m => m.id === checkout.memberId)?.name || 'Unknown Member';

    const conditions: { value: ItemCondition; label: string }[] = [
        { value: 'Excellent', label: 'Excellent' },
        { value: 'Good', label: 'Good' },
        { value: 'Fair', label: 'Fair' },
        { value: 'Needs Repair', label: 'Needs Repair' },
    ];

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        checkInItem(checkout.id, condition, notes);
        onClose();
        setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Return Item</h2>
                        <p className="text-sm text-text-secondary">Returning from {memberName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleCheckIn} className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 font-bold text-lg text-slate-700">
                            {checkout.quantity}x
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">{item.name}</h4>
                            <p className="text-xs text-text-muted">Due: {checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : 'No due date'}</p>
                        </div>
                    </div>

                    {/* Condition Usage */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Condition on Return *
                        </label>
                        <Select
                            options={conditions}
                            value={condition}
                            onChange={(e) => setCondition(e.target.value as ItemCondition)}
                        />
                        {condition === 'Needs Repair' && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                This item will be flagged for maintenance.
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Return Notes (Optional)
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                            placeholder="Missing parts, damage description, etc..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                            Confirm Return
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
