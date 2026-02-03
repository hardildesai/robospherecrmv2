// ============================================
// Professional Modal Component
// ============================================

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    children: React.ReactNode;
    showCloseButton?: boolean;
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    showCloseButton = true,
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
        >
            <div
                className={cn(
                    'w-full bg-bg-card shadow-xl',
                    // Full-screen on mobile, rounded on larger screens
                    'rounded-t-xl sm:rounded-xl',
                    // Full height on mobile, auto on larger screens
                    'max-h-[90vh] sm:max-h-[85vh]',
                    sizeStyles[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
                        {title && (
                            <h2 className="text-lg font-semibold text-text-primary">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="ml-auto -mr-2 text-text-muted hover:text-text-primary"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-4 sm:px-6 py-4 max-h-[calc(90vh-120px)] sm:max-h-[calc(85vh-120px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
