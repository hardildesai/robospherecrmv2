// ============================================
// Toast Component
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToasts } from '../../lib/store';
import type { ToastType } from '../../lib/types';

const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
};

const styleMap: Record<ToastType, string> = {
    success: 'border-signal-green/50 text-signal-green',
    error: 'border-signal-red/50 text-signal-red',
    warning: 'border-signal-amber/50 text-signal-amber',
    info: 'border-accent-core/50 text-accent-core',
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToasts();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3',
                            'bg-plate border rounded-lg shadow-lg',
                            'min-w-[280px] max-w-[400px]',
                            styleMap[toast.type]
                        )}
                    >
                        <span className="flex-shrink-0">{iconMap[toast.type]}</span>
                        <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 text-text-dim hover:text-text-primary transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
