// ============================================
// Access Denied Component
// ============================================

import { motion } from 'framer-motion';
import { ShieldOff, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';

export const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-void flex items-center justify-center p-4"
        >
            {/* Red glow background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-signal-red/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Scan lines effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.03) 2px, rgba(239, 68, 68, 0.03) 4px)',
                }}
            />

            <div className="relative z-10 text-center max-w-md">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-signal-red/20 border-2 border-signal-red flex items-center justify-center"
                >
                    <ShieldOff className="w-12 h-12 text-signal-red" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-display text-4xl font-bold text-signal-red mb-4"
                >
                    ACCESS DENIED
                </motion.h1>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <p className="text-text-muted">
                        You do not have the required clearance level to access this section.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-signal-amber">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">This incident has been logged.</span>
                    </div>
                </motion.div>

                {/* Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Return to Dashboard
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};
