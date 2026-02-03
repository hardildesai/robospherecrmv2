// ============================================
// Create Election Modal
// ============================================

import { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { Election } from '../../lib/types';
import { Plus, X, User } from 'lucide-react';

interface CreateElectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateElectionModal: React.FC<CreateElectionModalProps> = ({ isOpen, onClose }) => {
    const { members, addToast } = useStore();

    const [formData, setFormData] = useState({
        title: '',
        position: '',
        endDate: '',
    });

    const [candidates, setCandidates] = useState<{ memberId: string; manifesto: string }[]>([]);

    const positionOptions = [
        { value: 'President', label: 'President' },
        { value: 'Vice President', label: 'Vice President' },
        { value: 'Secretary', label: 'Secretary' },
        { value: 'Treasurer', label: 'Treasurer' },
        { value: 'Technical Lead', label: 'Technical Lead' },
        { value: 'Events Coordinator', label: 'Events Coordinator' },
        { value: 'Other', label: 'Other' },
    ];

    const availableMembers = members.filter(m =>
        m.status === 'Active' &&
        !candidates.some(c => c.memberId === m.id)
    );

    const memberOptions = availableMembers.map(m => ({
        value: m.id,
        label: `${m.name} (${m.id})`,
    }));

    const addCandidate = () => {
        setCandidates([...candidates, { memberId: '', manifesto: '' }]);
    };

    const removeCandidate = (index: number) => {
        setCandidates(candidates.filter((_, i) => i !== index));
    };

    const updateCandidate = (index: number, field: 'memberId' | 'manifesto', value: string) => {
        setCandidates(candidates.map((c, i) =>
            i === index ? { ...c, [field]: value } : c
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.position || !formData.endDate) {
            addToast({ type: 'error', message: 'Please fill in all required fields' });
            return;
        }

        if (candidates.length < 2) {
            addToast({ type: 'error', message: 'An election needs at least 2 candidates' });
            return;
        }

        if (candidates.some(c => !c.memberId)) {
            addToast({ type: 'error', message: 'Please select a member for each candidate' });
            return;
        }

        const newElection: Election = {
            id: `election-${Date.now()}`,
            title: formData.title,
            position: formData.position,
            candidates: candidates.map((c, i) => ({
                id: `candidate-${Date.now()}-${i}`,
                memberId: c.memberId,
                position: formData.position,
                manifesto: c.manifesto || 'No manifesto provided',
                votes: 0,
            })),
            status: 'Open',
            startDate: new Date().toISOString().split('T')[0],
            endDate: formData.endDate,
            votedMemberIds: [],
        };

        // Add to store (we need to add a createElection action)
        // For now, we'll use the elections array directly
        const { elections } = useStore.getState();
        useStore.setState({ elections: [...elections, newElection] });

        addToast({ type: 'success', message: 'Election created successfully' });
        onClose();

        // Reset form
        setFormData({ title: '', position: '', endDate: '' });
        setCandidates([]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Election" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Election Title *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Club Leadership Election 2024"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Position *"
                        options={positionOptions}
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                    <Input
                        label="End Date *"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>

                {/* Candidates Section */}
                <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-text-primary">Candidates</h4>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={addCandidate}
                        >
                            Add Candidate
                        </Button>
                    </div>

                    {candidates.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-text-muted">No candidates added yet</p>
                            <p className="text-xs text-text-dim">Click "Add Candidate" to add nominees</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {candidates.map((candidate, index) => (
                                <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="flex-1 space-y-2">
                                        <Select
                                            label="Member"
                                            options={[
                                                { value: '', label: 'Select a member...' },
                                                ...memberOptions,
                                                ...(candidate.memberId ? [{ value: candidate.memberId, label: members.find(m => m.id === candidate.memberId)?.name || candidate.memberId }] : [])
                                            ]}
                                            value={candidate.memberId}
                                            onChange={(e) => updateCandidate(index, 'memberId', e.target.value)}
                                        />
                                        <Textarea
                                            label="Manifesto (optional)"
                                            value={candidate.manifesto}
                                            onChange={(e) => updateCandidate(index, 'manifesto', e.target.value)}
                                            placeholder="Candidate's goals and vision..."
                                            rows={2}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeCandidate(index)}
                                        className="p-2 h-fit text-text-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={candidates.length < 2}>
                        Create Election
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
