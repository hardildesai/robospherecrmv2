// ============================================
// Page Header Component
// ============================================

import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    icon?: LucideIcon;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    icon: Icon,
    title,
    subtitle,
    actions,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-lg bg-accent-core/10 border border-accent-core/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-core" />
                    </div>
                )}
                <div>
                    <h1 className="text-display text-2xl font-bold text-text-primary">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
};
