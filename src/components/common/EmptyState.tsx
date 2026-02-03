// ============================================
// Empty State Component
// ============================================

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon = Inbox,
    title,
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-grid flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-text-dim" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>
            )}
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
};
