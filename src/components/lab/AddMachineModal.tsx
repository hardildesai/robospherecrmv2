import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../ui';
import { useLab } from '../../lib/store';
import type { LabMachine, MachineType } from '../../lib/types';

interface AddMachineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({ isOpen, onClose }) => {
    const { addMachine } = useLab();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LabMachine>();

    const machineTypes: MachineType[] = ['3D Printer', 'CNC', 'Laser Cutter', 'Workstation'];

    const onSubmit = (data: Partial<LabMachine>) => {
        const newMachine: LabMachine = {
            id: `mach-${Date.now()}`,
            name: data.name!,
            type: data.type!,
            model: data.model!,
            status: 'Idle',
            imageUrl: data.imageUrl,
            specs: {
                materials: [], // Simplified for now
            }
        };

        addMachine(newMachine);
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Machine">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Machine Name</label>
                    <Input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="e.g., UltraPrint 3000"
                    />
                    {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                    <select
                        {...register('type', { required: true })}
                        className="w-full p-2 rounded-lg border border-border bg-input-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                        {machineTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Model</label>
                    <Input
                        {...register('model', { required: 'Model is required' })}
                        placeholder="e.g., Mk3S+"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Image URL (Optional)</label>
                    <Input
                        {...register('imageUrl')}
                        placeholder="https://..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button variant="primary" type="submit">Add Machine</Button>
                </div>
            </form>
        </Modal>
    );
};
