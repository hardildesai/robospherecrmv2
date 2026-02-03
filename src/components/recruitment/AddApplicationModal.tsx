// ============================================
// Add Application Modal
// ============================================

import { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { RecruitmentApplication, Branch } from '../../lib/types';

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ isOpen, onClose }) => {
    const { addRecruitmentApplication, recruitmentCohorts, addToast } = useStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        branch: '',
        year: 1,
        skills: '',
        motivation: '',
        cohort: recruitmentCohorts[0]?.name || '',
    });

    const branchOptions = [
        { value: 'CSE', label: 'Computer Science' },
        { value: 'ECE', label: 'Electronics & Communication' },
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'EE', label: 'Electrical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
        { value: 'Other', label: 'Other' },
    ];

    const yearOptions = [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
    ];

    const cohortOptions = recruitmentCohorts.map(c => ({
        value: c.name,
        label: c.name,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.branch) {
            addToast({ type: 'error', message: 'Please fill in all required fields' });
            return;
        }

        const newApp: RecruitmentApplication = {
            id: `app-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            studentId: formData.email.split('@')[0].toUpperCase(), // Generate from email
            phone: formData.phone,
            branch: formData.branch as Branch,
            year: formData.year as 1 | 2 | 3 | 4,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            whyJoin: formData.motivation,
            status: 'Pending',
            cohort: formData.cohort,
            appliedDate: new Date().toISOString().split('T')[0],
        };

        addRecruitmentApplication(newApp);
        addToast({ type: 'success', message: 'Application added successfully' });
        onClose();

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            branch: '',
            year: 1,
            skills: '',
            motivation: '',
            cohort: recruitmentCohorts[0]?.name || '',
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Application" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@university.edu"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                    />
                    <Select
                        label="Branch *"
                        options={branchOptions}
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    />
                    <Select
                        label="Year"
                        options={yearOptions}
                        value={String(formData.year)}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                </div>

                <Select
                    label="Cohort"
                    options={cohortOptions}
                    value={formData.cohort}
                    onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                />

                <Input
                    label="Skills (comma-separated)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Python, ROS, CAD, Electronics"
                />

                <Textarea
                    label="Motivation"
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Why do you want to join RoboSphere?"
                    rows={3}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Add Application
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
