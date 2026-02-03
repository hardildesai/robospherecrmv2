import { useState } from 'react';
import { PageHeader } from '../components/common';
import { Vote, Plus, Users } from 'lucide-react';
import { Button } from '../components/ui';
import { PollCard } from '../components/governance/PollCard';
import { ElectionCard } from '../components/governance/ElectionCard';
import { CreatePollModal } from '../components/governance/CreatePollModal';
import { CreateElectionModal } from '../components/governance/CreateElectionModal';
import { useStore } from '../lib/store';

export const GovernancePage: React.FC = () => {
    const { polls, elections, currentUser } = useStore();
    const [isCreatePollModalOpen, setCreatePollModalOpen] = useState(false);
    const [isCreateElectionModalOpen, setCreateElectionModalOpen] = useState(false);

    const isAdmin = currentUser?.role !== 'member';

    return (
        <div>
            <PageHeader
                icon={Vote}
                title="Governance & Voting"
                actions={
                    isAdmin && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                leftIcon={<Users className="w-4 h-4" />}
                                onClick={() => setCreateElectionModalOpen(true)}
                            >
                                Create Election
                            </Button>
                            <Button
                                leftIcon={<Plus className="w-4 h-4" />}
                                onClick={() => setCreatePollModalOpen(true)}
                            >
                                Create Poll
                            </Button>
                        </div>
                    )
                }
            />

            <div className="space-y-8">

                {/* 1. Elections Section (High Priority) */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Elections
                    </h3>
                    {elections.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {elections.map(election => (
                                <ElectionCard key={election.id} election={election} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No active elections</p>
                            <p className="text-xs text-slate-400">Create an election to start the voting process!</p>
                        </div>
                    )}
                </section>

                {/* 2. Polls Section */}
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Community Polls
                    </h3>

                    {polls.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Vote className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No active polls</p>
                            <p className="text-xs text-slate-400">Create one to get feedback from the club!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {polls.map(poll => (
                                <div key={poll.id} className="h-full">
                                    <PollCard poll={poll} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>

            <CreatePollModal
                isOpen={isCreatePollModalOpen}
                onClose={() => setCreatePollModalOpen(false)}
            />

            <CreateElectionModal
                isOpen={isCreateElectionModalOpen}
                onClose={() => setCreateElectionModalOpen(false)}
            />
        </div>
    );
};
