// ============================================
// Projects Page
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Plus } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Button } from '../components/ui';
import { ProjectCard } from '../components/projects';
import { useStore } from '../lib/store';
import type { ProjectStatus } from '../lib/types';

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { projects, teams, contributions } = useStore();
    const [filter, setFilter] = useState<ProjectStatus | 'All'>('All');

    const filteredProjects =
        filter === 'All' ? projects : projects.filter((p) => p.status === filter);

    const statusCounts = {
        All: projects.length,
        Planning: projects.filter((p) => p.status === 'Planning').length,
        Active: projects.filter((p) => p.status === 'Active').length,
        Complete: projects.filter((p) => p.status === 'Complete').length,
        'On Hold': projects.filter((p) => p.status === 'On Hold').length,
    };

    return (
        <div>
            <PageHeader
                icon={Folder}
                title="Projects"
                subtitle="Track ongoing and completed projects"
                actions={
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => navigate('/projects/new')}
                    >
                        New Project
                    </Button>
                }
            />

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['All', 'Active', 'Planning', 'On Hold', 'Complete'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                            ? 'bg-accent-core text-bg-primary'
                            : 'bg-surface text-text-muted hover:text-text-primary hover:bg-grid'
                            }`}
                    >
                        {status} ({statusCounts[status]})
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        team={teams.find((t) => t.id === project.teamId)}
                        contributions={contributions}
                        onClick={() => navigate(`/projects/${project.id}`)}
                    />
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <Folder className="w-16 h-16 text-text-dim mx-auto mb-4" />
                    <p className="text-text-muted">
                        No {filter !== 'All' ? filter.toLowerCase() : ''} projects found.
                    </p>
                </div>
            )}
        </div>
    );
};
