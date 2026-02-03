import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../ui';
import { useStore } from '../../lib/store';
import type { InventoryItem } from '../../lib/types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, item }) => {
    const { members, checkoutItem } = useStore();
    const [memberId, setMemberId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const availableMembers = members.filter(m => m.status === 'Active' || m.status === 'Probation');

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        const checkoutRecord = {
            id: `chk-${Date.now().toString(36)}`,
            itemId: item.id,
            memberId,
            quantity,
            checkoutDate: new Date().toISOString(),
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            status: 'Active' as const,
            conditionOnCheckout: item.condition,
            notes
        };

        checkoutItem(checkoutRecord);
        onClose();
        setMemberId('');
        setNotes('');
        setQuantity(1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Check Out Item</h2>
                        <p className="text-sm text-text-secondary">{item.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                    {/* Member Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select Member *
                        </label>
                        <select
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                            value={memberId}
                            onChange={(e) => setMemberId(e.target.value)}
                            required
                        >
                            <option value="">Select a member...</option>
                            {availableMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Quantity
                            </label>
                            <Input
                                type="number"
                                min="1"
                                max={item.available}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                required
                            />
                            <p className="text-xs text-text-muted mt-1">{item.available} available</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Due Date
                            </label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                            placeholder="Project use, special instructions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Confirm Checkout
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
