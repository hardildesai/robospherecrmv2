// ============================================
// Optimized Card Component
// ============================================

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'glass' | 'outline';
    glow?: boolean;
    animate?: boolean; // Kept for API compatibility, but handled via CSS now
    // Convenience props for internal Header
    title?: string;
    subtitle?: string;
    icon?: React.ElementType;
    action?: React.ReactNode;
}

const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, padding = 'md', variant: _variant, glow: _glow, animate: _animate, children, title, subtitle, icon, action, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-surface rounded-xl border border-grid transition-all duration-300',
                    'hover:border-accent-core/30 hover:shadow-lg hover:translate-y-[-2px]',
                    'animate-fade-in-up', // Default entrance animation via CSS
                    paddings[padding],
                    className
                )}
                {...props}
            >
                {(title || icon) && (
                    <CardHeader title={title || ''} subtitle={subtitle} icon={icon} action={action} />
                )}
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<{
    title: string;
    subtitle?: string;
    icon?: React.ElementType;
    action?: React.ReactNode;
    className?: string;
}> = ({ title, subtitle, icon: Icon, action, className }) => (
    <div className={cn('flex items-center justify-between mb-4', className)}>
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <div>
                <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const CardContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={cn('', className)}>{children}</div>
);
