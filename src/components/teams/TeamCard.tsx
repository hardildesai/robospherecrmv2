// ============================================
// Team Card Component
// ============================================

import React from 'react';
import { Users, User } from 'lucide-react';
import { Card, CardHeader, Avatar, Badge } from '../ui';
import type { Team, Member, Project } from '../../lib/types';

interface TeamCardProps {
    team: Team;
    members: Member[];
    projects: Project[];
    onClick?: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, members, projects, onClick }) => {
    const teamMembers = members.filter((m) => team.memberIds.includes(m.id));
    const lead = members.find((m) => m.id === team.leadId);
    const activeProjects = projects.filter(
        (p) => p.teamId === team.id && p.status === 'Active'
    ).length;

    return (
        <Card
            padding="md"
            className="cursor-pointer hover:border-accent-core transition-colors"
            onClick={onClick}
        >
            <CardHeader title={team.name} subtitle={team.description} />

            <div className="mt-4 space-y-3">
                {/* Team Lead */}
                {lead && (
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-accent-core" />
                        <div className="flex-1">
                            <p className="text-xs text-text-dim">Team Lead</p>
                            <p className="text-sm font-medium text-text-primary">{lead.name}</p>
                        </div>
                    </div>
                )}

                {/* Member Count */}
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-text-muted" />
                    <p className="text-sm text-text-dim">
                        {team.memberIds.length} member{team.memberIds.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Active Projects */}
                {activeProjects > 0 && (
                    <div className="pt-2">
                        <Badge variant="success">
                            {activeProjects} Active Project{activeProjects !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                )}

                {/* Member Avatars */}
                <div className="flex -space-x-2 pt-2">
                    {teamMembers.slice(0, 5).map((member) => (
                        <Avatar key={member.id} name={member.name} size="sm" />
                    ))}
                    {teamMembers.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-grid border-2 border-bg-primary flex items-center justify-center text-xs text-text-dim">
                            +{teamMembers.length - 5}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
