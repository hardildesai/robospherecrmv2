// ============================================
// Project Card Component
// ============================================

import React from 'react';
import { Clock, Target, Users } from 'lucide-react';
import { Card, Badge } from '../ui';
import type { Project, Team, Contribution } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
    project: Project;
    team?: Team;
    contributions: Contribution[];
    onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    team,
    contributions,
    onClick,
}) => {
    const statusVariant = {
        Planning: 'default' as const,
        Active: 'success' as const,
        Complete: 'info' as const,
        'On Hold': 'warning' as const,
    };

    const totalHours = contributions
        .filter((c) => c.projectId === project.id)
        .reduce((sum, c) => sum + c.hours, 0);

    const isOverdue =
        project.deadline && new Date(project.deadline) < new Date() && project.status !== 'Complete';

    return (
        <Card
            padding="md"
            className="cursor-pointer hover:border-accent-core transition-colors"
            onClick={onClick}
        >
            <div className="space-y-3">
                {/* Header */}
                <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
                        <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                    </div>
                    <p className="text-sm text-text-dim line-clamp-2">{project.description}</p>
                </div>

                {/* Team */}
                {team && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-text-muted" />
                        <p className="text-sm text-text-dim">{team.name}</p>
                    </div>
                )}

                {/* Deadline */}
                {project.deadline && (
                    <div className="flex items-center gap-2">
                        <Clock
                            className={`w-4 h-4 ${isOverdue ? 'text-signal-red' : 'text-text-muted'}`}
                        />
                        <p className={`text-sm ${isOverdue ? 'text-signal-red font-medium' : 'text-text-dim'}`}>
                            {isOverdue ? 'Overdue: ' : 'Deadline: '}
                            {formatDate(project.deadline)}
                        </p>
                    </div>
                )}

                {/* Hours Logged */}
                {totalHours > 0 && (
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent-core" />
                        <p className="text-sm text-text-dim">{totalHours} hours logged</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
