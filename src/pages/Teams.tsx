// ============================================
// Teams Page
// ============================================

import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Button } from '../components/ui';
import { TeamCard, CreateTeamModal } from '../components/teams';
import { useStore } from '../lib/store';

export const TeamsPage: React.FC = () => {
    const { teams, members, projects } = useStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div>
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <PageHeader
                icon={Users}
                title="Teams"
                subtitle="Manage club teams and rosters"
                actions={
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Create Team
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        members={members}
                        projects={projects}
                    />
                ))}
            </div>

            {teams.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-text-dim mx-auto mb-4" />
                    <p className="text-text-muted">No teams yet. Create your first team!</p>
                </div>
            )}
        </div>
    );
};
