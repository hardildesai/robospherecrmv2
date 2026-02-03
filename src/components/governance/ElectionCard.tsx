import { Avatar, Button, Card, Badge } from '../ui';
import { Shield, FileText } from 'lucide-react';
import type { Election } from '../../lib/types';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ElectionCardProps {
    election: Election;
}

export const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
    const { currentUser, members, voteInElection } = useStore();

    const hasVoted = currentUser ? election.votedMemberIds.includes(currentUser.id) : false;
    const isClosed = election.status === 'Closed';
    const totalVotes = election.candidates.reduce((acc, curr) => acc + curr.votes, 0);

    const handleVote = (candidateId: string) => {
        if (currentUser) {
            voteInElection(election.id, candidateId, currentUser.id);
        }
    };

    return (
        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden">
            {/* Header */}
            <div className="relative z-10 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{election.title}</h2>
                        <p className="text-sm text-slate-500">Position: {election.position} • Ends {new Date(election.endDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {election.candidates.map((candidate) => {
                    const member = members.find(m => m.id === candidate.memberId);
                    const percent = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
                    const isWinner = isClosed && election.candidates.sort((a, b) => b.votes - a.votes)[0].id === candidate.id;

                    return (
                        <div
                            key={candidate.id}
                            className={cn(
                                "flex flex-col p-4 rounded-xl border transition-all",
                                isWinner ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar name={member?.name || 'Unknown'} size="md" />
                                <div>
                                    <h4 className="font-bold text-slate-900">{member?.name}</h4>
                                    <p className="text-xs text-slate-500">{member?.branch} • Year {member?.year}</p>
                                </div>
                                {isWinner && <Badge variant="success" className="ml-auto">Winner</Badge>}
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic mb-4 flex-1">
                                <FileText className="w-3 h-3 inline mr-1 text-slate-400" />
                                "{candidate.manifesto}"
                            </div>

                            {hasVoted || isClosed ? (
                                <div className="mt-auto">
                                    <div className="flex justify-between text-xs font-medium mb-1">
                                        <span>Votes</span>
                                        <span>{candidate.votes} ({percent}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            className={cn("h-full", isWinner ? "bg-emerald-500" : "bg-purple-500")}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="w-full mt-auto"
                                    onClick={() => handleVote(candidate.id)}
                                // variant="secondary"
                                >
                                    Vote for {member?.name.split(' ')[0]}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
