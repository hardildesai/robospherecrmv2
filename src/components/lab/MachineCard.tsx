import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle, Power, User } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import type { LabMachine } from '../../lib/types';
import { useLab, useStore } from '../../lib/store';

interface MachineCardProps {
    machine: LabMachine;
    onReserve: (machineId: string) => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine, onReserve }) => {
    const { updateMachineStatus } = useLab();
    const { currentUser, members } = useStore();
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

    const currentJobMember = machine.currentJob ? members.find(m => m.id === machine.currentJob?.memberId) : null;

    const statusColor: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
        Idle: 'success',
        'In Use': 'warning',
        Maintenance: 'danger',
        Offline: 'default',
    };

    const statusIcon: Record<string, React.ReactNode> = {
        Idle: <CheckCircle className="w-4 h-4" />,
        'In Use': <Clock className="w-4 h-4" />,
        Maintenance: <AlertCircle className="w-4 h-4" />,
        Offline: <Power className="w-4 h-4" />,
    };

    return (
        <Card padding="none" className="overflow-hidden h-full flex flex-col group relative">
            {/* Image Header */}
            <div className="relative h-48 bg-grid overflow-hidden">
                {machine.imageUrl ? (
                    <img
                        src={machine.imageUrl}
                        alt={machine.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        No Image
                    </div>
                )}

                {/* Admin Controls Overlay */}
                {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2">
                        <select
                            value={machine.status}
                            onChange={(e) => updateMachineStatus(machine.id, e.target.value as any)}
                            className="bg-white/90 backdrop-blur text-xs font-medium py-1 px-2 rounded shadow-sm border-none focus:ring-2 focus:ring-primary cursor-pointer"
                        >
                            <option value="Idle">Idle</option>
                            <option value="In Use">In Use</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>
                )}

                {/* Status Badge (if not admin or just for visibility) */}
                {!isAdmin && (
                    <div className="absolute top-3 right-3">
                        <Badge variant={statusColor[machine.status]} className="backdrop-blur-md bg-white/80 shadow-sm">
                            <span className="flex items-center gap-1.5">
                                {statusIcon[machine.status]}
                                {machine.status}
                            </span>
                        </Badge>
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="default" className="backdrop-blur-md bg-black/50 text-white border-transparent">
                        {machine.type}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-text-primary mb-1">{machine.name}</h3>
                    <p className="text-sm text-text-muted">{machine.model}</p>
                </div>

                {/* Specs */}
                {machine.specs && (
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-text-dim">
                        {machine.specs.bedSize && (
                            <div className="bg-surface p-2 rounded border border-grid">
                                <span className="block font-medium text-text-muted mb-0.5">Build Area</span>
                                {machine.specs.bedSize}
                            </div>
                        )}
                        {machine.specs.materials && (
                            <div className="bg-surface p-2 rounded border border-grid">
                                <span className="block font-medium text-text-muted mb-0.5">Material</span>
                                {machine.specs.materials[0]} +
                            </div>
                        )}
                    </div>
                )}

                {/* Live Status / Job Info */}
                <div className="mt-auto space-y-3">
                    {machine.status === 'In Use' && machine.currentJob ? (
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                            <div className="flex justify-between items-center mb-2 text-xs">
                                <span className="text-amber-800 font-medium flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {currentJobMember ? currentJobMember.name : 'Unknown Member'}
                                </span>
                                <span className="text-amber-600">
                                    {Math.round((new Date(machine.currentJob.completionTime).getTime() - Date.now()) / 60000)}m left
                                </span>
                            </div>
                            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-amber-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, (1 - (new Date(machine.currentJob.completionTime).getTime() - Date.now()) / (machine.currentJob.estimatedDuration * 60000)) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-[62px] flex items-center justify-center text-sm text-text-dim border border-dashed border-grid rounded-lg bg-surface/50">
                            {machine.status === 'Idle' ? 'Ready for next job' : 'Machine unavailable'}
                        </div>
                    )}

                    <Button
                        variant={machine.status === 'Idle' ? 'primary' : 'outline'}
                        className="w-full justify-center"
                        onClick={() => onReserve(machine.id)}
                        disabled={machine.status === 'Maintenance' || machine.status === 'Offline'}
                    >
                        {machine.status === 'Idle' ? 'Reserve Now' : 'Check Schedule'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
