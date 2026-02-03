// ============================================
// Create New Project Page
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Card, Button, Input, Select } from '../components/ui';
import { useStore } from '../lib/store';
import type { ProjectStatus } from '../lib/types';

export const ProjectNewPage: React.FC = () => {
    const navigate = useNavigate();
    const { addProject, teams } = useStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        teamId: '',
        status: 'Planning' as ProjectStatus,
        deadline: '',
    });

    const statusOptions = [
        { value: 'Planning', label: 'Planning' },
        { value: 'Active', label: 'Active' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Complete', label: 'Complete' },
    ];

    const teamOptions = teams.map(team => ({
        value: team.id,
        label: team.name
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newProject = {
            id: `proj-${Date.now().toString(36)}`,
            ...formData,
            createdDate: new Date().toISOString().split('T')[0],
        };

        addProject(newProject);
        navigate('/projects');
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <PageHeader
                icon={Folder}
                title="Create Project"
                subtitle="Start a new engineering project"
                actions={
                    <Button
                        variant="secondary"
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/projects')}
                    >
                        Back to Projects
                    </Button>
                }
            />

            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Project Name *
                        </label>
                        <Input
                            placeholder="e.g. Autonomous Drone V2"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                            placeholder="Describe the project goals and scope..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Assigned Team *
                            </label>
                            <Select
                                options={[{ value: '', label: 'Select Team' }, ...teamOptions]}
                                value={formData.teamId}
                                onChange={(e) => handleChange('teamId', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status *
                            </label>
                            <Select
                                options={statusOptions}
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Deadline
                        </label>
                        <Input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => handleChange('deadline', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                            Create Project
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
