// ============================================
// Lab Console Page (Digital Twin)
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, Plus } from 'lucide-react';
import { PageHeader } from '../components/common';
import { MachineCard } from '../components/lab/MachineCard';
import { useLab } from '../lib/store';
import { Button } from '../components/ui';
import { AddMachineModal } from '../components/lab/AddMachineModal';
import { ReserveMachineModal } from '../components/lab/ReserveMachineModal';

export const LabConsolePage: React.FC = () => {
    const { machines } = useLab();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [reserveMachineId, setReserveMachineId] = useState<string | null>(null);

    const handleReserve = (machineId: string) => {
        setReserveMachineId(machineId);
    };

    const targetMachine = machines.find(m => m.id === reserveMachineId);

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Cpu}
                title="Lab Operations Center"
                subtitle="Live status of machinery"
                actions={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-signal-green bg-green-900/10 px-3 py-1 rounded-full border border-green-900/20 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-signal-green" />
                            SYSTEMS ONLINE
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Machine
                        </Button>
                    </div>
                }
            />

            <AddMachineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ReserveMachineModal
                isOpen={!!reserveMachineId}
                onClose={() => setReserveMachineId(null)}
                machineId={reserveMachineId}
                machineName={targetMachine?.name || 'Machine'}
            />

            {/* Machine Grid */}
            <div>
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-text-dim" />
                    Machine Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {machines.map((machine, index) => (
                        <motion.div
                            key={machine.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <MachineCard machine={machine} onReserve={handleReserve} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
