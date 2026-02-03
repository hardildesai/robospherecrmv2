import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, Badge } from '../ui';
import type { Poll } from '../../lib/types';
import { useStore } from '../../lib/store';
import { cn, percentage } from '../../lib/utils';

interface PollCardProps {
    poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
    const { currentUser, voteInPoll } = useStore();

    const hasVoted = currentUser ? poll.votedMemberIds.includes(currentUser.id) : false;
    const isClosed = poll.status === 'Closed';
    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

    const handleVote = (optionId: string) => {
        if (currentUser) {
            voteInPoll(poll.id, optionId, currentUser.id);
        }
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <Badge variant={isClosed ? 'default' : 'success'} dot={!isClosed}>
                        {isClosed ? 'Closed' : 'Active Poll'}
                    </Badge>
                    <span className="text-xs text-text-dim flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(poll.createdDate).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-text-primary mb-6 leading-snug">
                    {poll.question}
                </h3>

                <div className="space-y-3">
                    {poll.options.map((option) => {
                        const percent = percentage(option.votes, totalVotes);

                        // Render Result Bar
                        if (hasVoted || isClosed) {
                            return (
                                <div key={option.id} className="relative group">
                                    <div className="flex justify-between text-sm mb-1 px-1">
                                        <span className="font-medium text-slate-700">{option.label}</span>
                                        <span className="text-slate-500 font-mono">{percent}%</span>
                                    </div>
                                    <div className="h-10 w-full bg-slate-50 rounded-lg overflow-hidden relative border border-slate-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={cn(
                                                "h-full absolute left-0 top-0 opacity-20",
                                                poll.options.sort((a, b) => b.votes - a.votes)[0].id === option.id
                                                    ? "bg-primary" // Winner highlight
                                                    : "bg-slate-500"
                                            )}
                                        />
                                        <div className="absolute inset-0 flex items-center px-4">
                                            {poll.options.sort((a, b) => b.votes - a.votes)[0].id === option.id && (
                                                <CheckCircle className="w-4 h-4 text-primary ml-auto opacity-50" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Render Vote Button
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-slate-700 hover:text-primary active:scale-[0.98]"
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-text-dim">
                <span>Total Votes: {totalVotes}</span>
                <span>Created by {poll.createdBy}</span>
            </div>
        </Card>
    );
};
