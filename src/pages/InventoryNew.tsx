// ============================================
// Create New Inventory Item Page
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Card, Button, Input, Select } from '../components/ui';
import { useStore } from '../lib/store';
import type { ItemCategory, ItemCondition } from '../lib/types';

export const InventoryNewPage: React.FC = () => {
    const navigate = useNavigate();
    const { addInventoryItem } = useStore();

    const [formData, setFormData] = useState({
        name: '',
        category: 'Tool' as ItemCategory,
        description: '',
        quantity: 1,
        condition: 'Excellent' as ItemCondition,
        location: '',
        purchaseDate: '',
        cost: 0,
    });

    const categoryOptions = [
        { value: 'Tool', label: 'Tool' },
        { value: 'Kit', label: 'Kit' },
        { value: 'Component', label: 'Component' },
        { value: 'Equipment', label: 'Equipment' },
        { value: 'Other', label: 'Other' },
    ];

    const conditionOptions = [
        { value: 'Excellent', label: 'Excellent' },
        { value: 'Good', label: 'Good' },
        { value: 'Fair', label: 'Fair' },
        { value: 'Needs Repair', label: 'Needs Repair' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newItem = {
            id: `inv-${Date.now().toString(36)}`,
            ...formData,
            available: formData.quantity, // Initially all are available
        };

        addInventoryItem(newItem);
        navigate('/inventory');
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <PageHeader
                icon={Package}
                title="Add Inventory Item"
                subtitle="Register a new item in the inventory"
                actions={
                    <Button
                        variant="secondary"
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/inventory')}
                    >
                        Back to Inventory
                    </Button>
                }
            />

            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Item Name *
                        </label>
                        <Input
                            placeholder="e.g. Soldering Iron Station"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                            placeholder="Describe the item specs..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Category *
                            </label>
                            <Select
                                options={categoryOptions}
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Condition *
                            </label>
                            <Select
                                options={conditionOptions}
                                value={formData.condition}
                                onChange={(e) => handleChange('condition', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Quantity *
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Cost (₹)
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.cost}
                                onChange={(e) => handleChange('cost', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                            </label>
                            <Input
                                placeholder="e.g. Lab A - Shelf 2"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Purchase Date
                            </label>
                            <Input
                                type="date"
                                value={formData.purchaseDate}
                                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                            Add Item
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/inventory')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
