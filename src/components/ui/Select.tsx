// ============================================
// Select Component
// ============================================

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-text-muted mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={cn(
                            'w-full bg-void border border-grid rounded-lg appearance-none',
                            'px-4 py-2.5 pr-10 text-sm text-text-primary',
                            'transition-all duration-200 cursor-pointer',
                            'focus:outline-none focus:border-accent-core focus:ring-1 focus:ring-accent-core/50',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            error && 'border-signal-red focus:border-signal-red focus:ring-signal-red/50',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-signal-red">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
