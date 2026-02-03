// ============================================
// Inventory Item Detail Page
// ============================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    Calendar,
    Clock,
    Trash
} from 'lucide-react';
import { PageHeader } from '../components/common';
import { Card, Button, Badge } from '../components/ui';
import { CheckoutModal } from '../components/inventory/CheckoutModal';
import { CheckInModal } from '../components/inventory/CheckInModal';
import { useStore } from '../lib/store';
import type { ItemCondition } from '../lib/types';

const conditionColor: Record<ItemCondition, 'success' | 'warning' | 'danger' | 'default'> = {
    Excellent: 'success',
    Good: 'success',
    Fair: 'warning',
    'Needs Repair': 'danger',
};

export const InventoryItemDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { inventory, checkouts, members, deleteInventoryItem } = useStore();
    const [isCheckoutModalOpen, setCheckoutModal] = useState(false);
    const [activeCheckInId, setActiveCheckInId] = useState<string | null>(null);

    const item = inventory.find((i) => i.id === id);

    if (!item) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-slate-800">Item not found</h2>
                <Button variant="secondary" onClick={() => navigate('/inventory')} className="mt-4">
                    Back to Inventory
                </Button>
            </div>
        );
    }

    const itemCheckouts = checkouts
        .filter(c => c.itemId === item.id)
        .sort((a, b) => new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime());

    const activeCheckouts = itemCheckouts.filter(c => !c.returnDate);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteInventoryItem(item.id);
            navigate('/inventory');
        }
    };

    return (
        <div>
            <PageHeader
                icon={Package}
                title={item.name}
                subtitle={`Details and history for ${item.id}`}
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/inventory')}>
                            Back
                        </Button>
                        <Button variant="danger" leftIcon={<Trash className="w-4 h-4" />} onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <Card className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-text-muted mb-1">Current Status</p>
                            <div className="flex items-center gap-3">
                                <h2 className={`text-2xl font-bold ${item.available > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {item.available} / {item.quantity} Available
                                </h2>
                                <Badge variant={conditionColor[item.condition]}>
                                    {item.condition}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            {item.available > 0 && (
                                <Button onClick={() => setCheckoutModal(true)}>
                                    Check Out Item
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Active Checkouts List */}
                    {activeCheckouts.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Checkouts ({activeCheckouts.length})</h3>
                            {activeCheckouts.map(checkout => (
                                <div key={checkout.id} className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-amber-800 mb-4">
                                                Borrowed by <span className="font-medium">{members.find(m => m.id === checkout.memberId)?.name}</span>
                                            </p>
                                            <div className="flex gap-4 text-sm text-amber-700">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Due: {checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Since: {new Date(checkout.checkoutDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={() => setActiveCheckInId(checkout.id)}>
                                            Return Item
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Description & Specs */}
                    <Card title="Item Details">
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 mb-4">{item.description || 'No description provided.'}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-text-muted block mb-1">Category</span>
                                    <span className="font-medium">{item.category}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-text-muted block mb-1">Location</span>
                                    <span className="font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-text-muted" />
                                        {item.location || 'Unknown'}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-text-muted block mb-1">Purchase Date</span>
                                    <span className="font-medium">
                                        {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'Unknown'}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-text-muted block mb-1">Cost</span>
                                    <span className="font-medium">
                                        {item.cost ? `$${item.cost}` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar History Column */}
                <div className="space-y-6">
                    <Card title="Usage History">
                        <div className="space-y-4">
                            {itemCheckouts.length === 0 ? (
                                <p className="text-sm text-text-muted text-center py-4">No history yet.</p>
                            ) : (
                                itemCheckouts.map(checkout => {
                                    const member = members.find(m => m.id === checkout.memberId);
                                    const isReturned = !!checkout.returnDate;

                                    return (
                                        <div key={checkout.id} className="relative pl-4 border-l-2 border-slate-100 py-1">
                                            <div className={`absolute left-[-5px] top-2 w-2 h-2 rounded-full ${isReturned ? 'bg-slate-300' : 'bg-amber-400'}`} />
                                            <p className="text-sm font-medium text-slate-800">
                                                {member?.name || 'Unknown Member'}
                                            </p>
                                            <p className="text-xs text-text-muted mb-1">
                                                {new Date(checkout.checkoutDate).toLocaleDateString()}
                                                {checkout.returnDate && ` - ${new Date(checkout.returnDate).toLocaleDateString()}`}
                                            </p>
                                            {checkout.conditionOnReturn && (
                                                <Badge variant="default" className="mt-1 text-[10px]">
                                                    Returned: {checkout.conditionOnReturn}
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setCheckoutModal(false)}
                item={item}
            />

            {activeCheckInId && checkouts.find(c => c.id === activeCheckInId) && (
                <CheckInModal
                    isOpen={!!activeCheckInId}
                    onClose={() => setActiveCheckInId(null)}
                    checkout={checkouts.find(c => c.id === activeCheckInId)!}
                    item={item}
                />
            )}
        </div>
    );
};
