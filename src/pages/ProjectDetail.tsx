// ============================================
// Project Detail Page
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, Users, Calendar, Target, Save, X } from 'lucide-react';
import { EmptyState } from '../components/common';
import { Card, Button, Badge, Avatar, Input, Textarea, Select } from '../components/ui';
import { useStore } from '../lib/store';
import { formatDate } from '../lib/utils';
import type { ProjectStatus, Member } from '../lib/types';

export const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, teams, members, updateProject, deleteProject, addToast } = useStore();

    const project = projects.find(p => p.id === id);
    const team = teams.find(t => t.id === project?.teamId);
    const teamMembers: Member[] = team?.memberIds
        ?.map((mId: string) => members.find(m => m.id === mId))
        .filter((m): m is Member => m !== undefined) || [];

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        status: project?.status || 'Planning' as ProjectStatus,
        deadline: project?.deadline || '',
    });

    if (!project) {
        return (
            <div>
                <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/projects')}>
                    Back to Projects
                </Button>
                <EmptyState
                    title="Project Not Found"
                    description="The project you're looking for doesn't exist."
                />
            </div>
        );
    }

    const statusOptions = [
        { value: 'Planning', label: 'Planning' },
        { value: 'Active', label: 'Active' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Complete', label: 'Complete' },
    ];

    const statusColors = {
        'Planning': 'warning',
        'Active': 'success',
        'On Hold': 'default',
        'Complete': 'info',
    } as const;

    const handleSave = () => {
        updateProject(project.id, editData);
        addToast({ type: 'success', message: 'Project updated successfully' });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(project.id);
            addToast({ type: 'success', message: 'Project deleted' });
            navigate('/projects');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/projects')}>
                    Back to Projects
                </Button>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" leftIcon={<X className="w-4 h-4" />} onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" leftIcon={<Edit2 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                            <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Card>
                {isEditing ? (
                    <div className="space-y-4">
                        <Input
                            label="Project Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <Textarea
                            label="Description"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={4}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Status"
                                options={statusOptions}
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value as ProjectStatus })}
                            />
                            <Input
                                label="Deadline"
                                type="date"
                                value={editData.deadline}
                                onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
                                <p className="text-text-muted mt-1">{project.description}</p>
                            </div>
                            <Badge variant={statusColors[project.status]}>{project.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-text-dim" />
                                <div>
                                    <p className="text-xs text-text-dim">Created</p>
                                    <p className="text-sm font-medium">{formatDate(project.createdDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-text-dim" />
                                <div>
                                    <p className="text-xs text-text-dim">Deadline</p>
                                    <p className="text-sm font-medium">{project.deadline ? formatDate(project.deadline) : 'No deadline'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-text-dim" />
                                <div>
                                    <p className="text-xs text-text-dim">Team</p>
                                    <p className="text-sm font-medium">{team?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Card>

            {/* Team Members Section */}
            {team && teamMembers.length > 0 && (
                <Card>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Team Members ({teamMembers.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="flex flex-col items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                onClick={() => navigate(`/members/${member.id}`)}
                            >
                                <Avatar name={member.name} size="lg" />
                                <p className="text-sm font-medium text-center mt-2">{member.name}</p>
                                <p className="text-xs text-text-dim">{member.rank}</p>
                                {member.id === team.leadId && (
                                    <Badge variant="info" className="mt-1 text-xs">Lead</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};
