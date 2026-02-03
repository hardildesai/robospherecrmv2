// ============================================
// Confirm Dialog Component
// ============================================

import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
}) => {
    const iconColors = {
        danger: 'text-danger bg-danger-light',
        warning: 'text-warning bg-warning-light',
        info: 'text-info bg-info-light',
    };

    const Icon = variant === 'info' ? Info : AlertTriangle;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="text-text-secondary mb-6">{message}</p>
                <div className="flex gap-3 w-full">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
