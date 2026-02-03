// ============================================
// Inventory Card Component
// ====================================================================================

import React from 'react';
import { Package, MapPin, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import type { InventoryItem, CheckoutRecord } from '../../lib/types';

interface InventoryCardProps {
    item: InventoryItem;
    checkouts: CheckoutRecord[];
    onClick?: () => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, checkouts, onClick }) => {
    const activeCheckouts = checkouts.filter(
        (c) => c.itemId === item.id && !c.returnDate
    ).length;

    const conditionVariant = {
        Excellent: 'success' as const,
        Good: 'info' as const,
        Fair: 'warning' as const,
        'Needs Repair': 'danger' as const,
    };

    const isLowStock = item.available === 0;
    const isRunningLow = item.available > 0 && item.available <= Math.ceil(item.quantity * 0.2);

    return (
        <Card
            padding="md"
            className="cursor-pointer hover:border-accent-core transition-colors"
            onClick={onClick}
        >
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-accent-core" />
                            <h3 className="text-lg font-semibold text-text-primary">{item.name}</h3>
                        </div>
                        <p className="text-sm text-text-dim line-clamp-2">{item.description}</p>
                    </div>
                    <Badge variant="default">{item.category}</Badge>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between pt-2 border-t border-grid">
                    <div>
                        <p className="text-xs text-text-dim">Available</p>
                        <p className={`text-2xl font-bold font-display ${isLowStock ? 'text-signal-red' : isRunningLow ? 'text-signal-yellow' : 'text-signal-green'}`}>
                            {item.available}
                        </p>
                        <p className="text-xs text-text-dim">of {item.quantity} total</p>
                    </div>
                    <div className="text-right">
                        <Badge variant={conditionVariant[item.condition]}>{item.condition}</Badge>
                        {activeCheckouts > 0 && (
                            <p className="text-xs text-text-dim mt-1">{activeCheckouts} checked out</p>
                        )}
                    </div>
                </div>

                {/* Location */}
                {item.location && (
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-text-muted" />
                        <span className="text-text-dim">{item.location}</span>
                    </div>
                )}

                {/* Warnings */}
                {isLowStock && (
                    <div className="flex items-center gap-2 text-sm text-signal-red">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Out of stock</span>
                    </div>
                )}

                <div className="pt-4 border-t border-grid mt-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            if (onClick) onClick();
                        }}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </Card>
    );
};
