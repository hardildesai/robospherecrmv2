// ============================================
// Table Component
// ============================================

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

// Table Root
interface TableProps extends React.HTMLAttributes<HTMLTableElement> { }

export const Table = forwardRef<HTMLTableElement, TableProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="w-full overflow-x-auto">
                <table
                    ref={ref}
                    className={cn('w-full text-sm', className)}
                    {...props}
                >
                    {children}
                </table>
            </div>
        );
    }
);

Table.displayName = 'Table';

// Table Header
export const TableHeader = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
    return (
        <thead
            ref={ref}
            className={cn('bg-grid/50', className)}
            {...props}
        >
            {children}
        </thead>
    );
});

TableHeader.displayName = 'TableHeader';

// Table Body
export const TableBody = forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
    return (
        <tbody ref={ref} className={cn('', className)} {...props}>
            {children}
        </tbody>
    );
});

TableBody.displayName = 'TableBody';

// Table Row
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    isClickable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
    ({ className, isClickable, children, ...props }, ref) => {
        return (
            <tr
                ref={ref}
                className={cn(
                    'border-b border-grid/50 transition-colors',
                    isClickable && 'cursor-pointer hover:bg-grid/30',
                    className
                )}
                {...props}
            >
                {children}
            </tr>
        );
    }
);

TableRow.displayName = 'TableRow';

// Table Head Cell
export const TableHead = forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
    return (
        <th
            ref={ref}
            className={cn(
                'px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider',
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
});

TableHead.displayName = 'TableHead';

// Table Cell
export const TableCell = forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
    return (
        <td
            ref={ref}
            className={cn(
                'px-4 py-3 text-text-primary font-mono',
                className
            )}
            {...props}
        >
            {children}
        </td>
    );
});

TableCell.displayName = 'TableCell';
