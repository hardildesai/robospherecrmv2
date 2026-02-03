// ============================================
// Professional Badge Component
// ============================================

import { cn } from '../../lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    dot?: boolean;
    pulse?: boolean;
    className?: string;
}

const variants = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    dot = false,
    pulse: _pulse = false, // Kept for API compatibility
    className
}) => {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {dot && (
                <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    variant === 'success' && 'bg-success',
                    variant === 'warning' && 'bg-warning',
                    variant === 'danger' && 'bg-danger',
                    variant === 'info' && 'bg-info',
                    variant === 'default' && 'bg-text-muted'
                )} />
            )}
            {children}
        </span>
    );
};
