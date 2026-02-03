// ============================================
// Create Team Modal
// ============================================

import { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { Team } from '../../lib/types';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
    const { addTeam, members, addToast, addAuditLog } = useStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        leadId: '',
    });

    const activeMembers = members.filter(m => m.status === 'Active');

    const memberOptions = [
        { value: '', label: 'Select team lead...' },
        ...activeMembers.map(m => ({
            value: m.id,
            label: `${m.name} (${m.rank})`,
        }))
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            addToast({ type: 'error', message: 'Team name is required' });
            return;
        }

        if (!formData.leadId) {
            addToast({ type: 'error', message: 'Please select a team lead' });
            return;
        }

        const newTeam: Team = {
            id: `team-${Date.now()}`,
            name: formData.name.trim(),
            description: formData.description.trim(),
            memberIds: [formData.leadId], // Lead is automatically a member
            leadId: formData.leadId,
            createdDate: new Date().toISOString().split('T')[0],
        };

        addTeam(newTeam);
        addAuditLog('MEMBER_UPDATED', `Created new team: ${newTeam.name}`);
        addToast({ type: 'success', message: 'Team created successfully' });
        onClose();

        // Reset form
        setFormData({ name: '', description: '', leadId: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Team" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Team Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mechanical Division"
                />

                <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What does this team work on?"
                    rows={3}
                />

                <Select
                    label="Team Lead *"
                    options={memberOptions}
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Create Team
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
