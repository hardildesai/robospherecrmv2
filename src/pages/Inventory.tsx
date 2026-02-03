
// ============================================
// Inventory Page
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, AlertTriangle, Download } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Button } from '../components/ui';
import { InventoryCard, OverdueAlerts } from '../components/inventory';
import { useStore } from '../lib/store';
import type { ItemCategory } from '../lib/types';

export const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { inventory, checkouts } = useStore();
    const [filter, setFilter] = useState<ItemCategory | 'All'>('All');

    const filteredInventory =
        filter === 'All' ? inventory : inventory.filter((i) => i.category === filter);

    const categoryCount = {
        All: inventory.length,
        Tool: inventory.filter((i) => i.category === 'Tool').length,
        Kit: inventory.filter((i) => i.category === 'Kit').length,
        Component: inventory.filter((i) => i.category === 'Component').length,
        Equipment: inventory.filter((i) => i.category === 'Equipment').length,
        Other: inventory.filter((i) => i.category === 'Other').length,
    };

    const lowStockItems = inventory.filter((i) => i.available === 0);

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Category', 'Quantity', 'Available', 'Condition', 'Location'];
        const csvContent = [
            headers.join(','),
            ...inventory.map(i => [
                i.id,
                `"${i.name}"`, // Escape check
                i.category,
                i.quantity,
                i.available,
                i.condition,
                `"${i.location || 'N/A'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Overdue Banner */}
            <OverdueAlerts variant="banner" />

            <PageHeader
                title="Inventory Management"
                subtitle={`Total Items: ${inventory.length} `}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                            Export
                        </Button>
                        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/inventory/new')}>
                            Add Item
                        </Button>
                    </div>
                }
            />

            {lowStockItems.length > 0 && (
                <div className="mb-6 flex items-center gap-2 p-3 bg-signal-yellow/10 border border-signal-yellow/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-signal-yellow" />
                    <span className="text-sm text-text-primary">
                        {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} out of stock
                    </span>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['All', 'Tool', 'Kit', 'Component', 'Equipment', 'Other'] as const).map((category) => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === category
                            ? 'bg-accent-core text-bg-primary'
                            : 'bg-surface text-text-muted hover:text-text-primary hover:bg-grid'
                            }`}
                    >
                        {category} ({categoryCount[category]})
                    </button>
                ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                    <InventoryCard
                        key={item.id}
                        item={item}
                        checkouts={checkouts}
                        onClick={() => navigate(`/inventory/${item.id}`)}
                    />
                ))}
            </div>

            {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-text-dim mx-auto mb-4" />
                    <p className="text-text-muted">
                        No {filter !== 'All' ? filter.toLowerCase() : ''} items found.
                    </p>
                </div>
            )}
        </div>
    );
};
