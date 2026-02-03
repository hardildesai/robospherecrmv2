// ============================================
// Optimized Button Component
// ============================================

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variants = {
    primary: 'bg-accent-core text-bg-primary hover:opacity-90 shadow-sm shadow-accent-core/20',
    secondary: 'bg-surface text-text-primary border border-grid hover:bg-grid/50',
    ghost: 'bg-transparent text-text-muted hover:bg-surface hover:text-text-primary',
    danger: 'bg-signal-red text-bg-primary hover:opacity-90 shadow-sm shadow-signal-red/20',
    success: 'bg-signal-green text-bg-primary hover:opacity-90 shadow-sm shadow-signal-green/20',
    outline: 'bg-transparent text-accent-core border border-accent-core hover:bg-accent-core/10',
};

const sizes = {
    sm: 'h-9 sm:h-8 px-3 text-xs rounded-md',
    md: 'h-11 sm:h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-lg',
    icon: 'h-11 w-11 sm:h-10 sm:w-10 p-0 items-center justify-center rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all duration-200',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'focus:outline-none focus:ring-2 focus:ring-accent-core focus:ring-offset-2 focus:ring-offset-bg-primary',
                    'active:scale-[0.98] hover:scale-[1.02]', // CSS transforms instead of JS
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <span className="mr-2 animate-spin">
                        <Loader2 className="w-4 h-4" />
                    </span>
                )}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
