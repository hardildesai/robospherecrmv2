import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../ui';
import { useLab, useStore } from '../../lib/store';
import type { Reservation } from '../../lib/types';
import { Calendar } from 'lucide-react';

interface ReserveMachineModalProps {
    isOpen: boolean;
    onClose: () => void;
    machineId: string | null;
    machineName: string;
}

export const ReserveMachineModal: React.FC<ReserveMachineModalProps> = ({
    isOpen,
    onClose,
    machineId,
    machineName
}) => {
    const { reserveMachine, reservations } = useLab();
    const { currentUser, members } = useStore();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Reservation>>();

    const machineReservations = reservations
        .filter(r => r.machineId === machineId && new Date(r.endTime) > new Date())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const onSubmit = (data: Partial<Reservation> & { memberId?: string }) => {
        if (!machineId || !currentUser) return;

        const newReservation: Reservation = {
            id: `res-${Date.now()}`,
            machineId,
            memberId: data.memberId || currentUser.id,
            startTime: data.startTime!,
            endTime: data.endTime!,
            purpose: data.purpose || 'General Use',
            status: 'Pending',
            createdDate: new Date().toISOString(),
        };

        reserveMachine(newReservation);
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reserve ${machineName}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary">New Reservation</h3>

                    {/* Member Selection */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Reserve For</label>
                        <select
                            {...register('memberId')}
                            defaultValue={currentUser?.id}
                            className="w-full p-2 rounded-lg border border-border bg-input-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                            {members.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Start Time</label>
                            <Input
                                type="datetime-local"
                                {...register('startTime', { required: 'Start time is required' })}
                            />
                            {errors.startTime && <span className="text-xs text-danger">{errors.startTime.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">End Time</label>
                            <Input
                                type="datetime-local"
                                {...register('endTime', { required: 'End time is required' })}
                            />
                            {errors.endTime && <span className="text-xs text-danger">{errors.endTime.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Purpose</label>
                        <Input
                            {...register('purpose', { required: 'Purpose is required' })}
                            placeholder="e.g., Senior Project"
                        />
                        {errors.purpose && <span className="text-xs text-danger">{errors.purpose.message}</span>}
                    </div>

                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
                        <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>
                            Max duration: 4 hours.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                        <Button variant="primary" type="submit">Confirm</Button>
                    </div>
                </form>

                {/* Schedule Sidebar */}
                <div className="border-l border-border pl-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Upcoming Schedule</h3>
                    {machineReservations.length === 0 ? (
                        <p className="text-sm text-text-muted italic">No upcoming reservations.</p>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {machineReservations.map(res => {
                                const member = members.find(m => m.id === res.memberId);
                                return (
                                    <div key={res.id} className="text-xs p-2 bg-bg-base rounded border border-border">
                                        <div className="flex justify-between font-medium text-text-primary mb-1">
                                            <span>{new Date(res.startTime).toLocaleDateString()}</span>
                                            <span>{new Date(res.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="text-text-secondary truncate">{member?.name || 'Unknown User'}</div>
                                        <div className="text-text-muted truncate mt-0.5">{res.purpose}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
