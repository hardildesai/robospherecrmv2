// ============================================
// KPI Card Component
// ============================================

import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from '../ui';

interface KpiCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
    };
    accentColor?: 'core' | 'green' | 'amber' | 'red';
}

const accentStyles = {
    core: 'border-t-accent-core',
    green: 'border-t-signal-green',
    amber: 'border-t-signal-amber',
    red: 'border-t-signal-red',
};

const iconStyles = {
    core: 'bg-accent-core/10 text-accent-core',
    green: 'bg-signal-green/10 text-signal-green',
    amber: 'bg-signal-amber/10 text-signal-amber',
    red: 'bg-signal-red/10 text-signal-red',
};

export const KpiCard: React.FC<KpiCardProps> = ({
    icon: Icon,
    label,
    value,
    change,
    accentColor = 'core',
}) => {
    return (
        <Card
            className={cn(
                'border-t-2 hover:shadow-lg transition-shadow',
                accentStyles[accentColor]
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-muted mb-1">{label}</p>
                    <p className="text-display text-3xl font-bold text-text-primary">
                        {value}
                    </p>
                    {change && (
                        <p
                            className={cn(
                                'text-xs mt-2',
                                change.isPositive ? 'text-signal-green' : 'text-signal-red'
                            )}
                        >
                            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}% from last month
                        </p>
                    )}
                </div>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconStyles[accentColor])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );
};
