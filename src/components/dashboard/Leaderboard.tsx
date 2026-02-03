// ============================================
// Leaderboard Component
// ============================================

import { Card, CardHeader, Avatar } from '../ui';
import { Trophy } from 'lucide-react';
import type { Member } from '../../lib/types';

interface LeaderboardProps {
    members: Member[];
    maxItems?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ members, maxItems = 5 }) => {
    const sortedMembers = [...members]
        .filter((m) => m.status !== 'Dismissed')
        .sort((a, b) => b.attendancePercent - a.attendancePercent)
        .slice(0, maxItems);

    const getRankStyle = (index: number) => {
        if (index === 0) return 'bg-signal-amber text-void';
        if (index === 1) return 'bg-gray-400 text-void';
        if (index === 2) return 'bg-amber-700 text-white';
        return 'bg-grid text-text-muted';
    };

    return (
        <Card className="h-full">
            <CardHeader
                title="Attendance Leaders"
                subtitle="Top performers this month"
                action={<Trophy className="w-5 h-5 text-signal-amber" />}
            />

            <div className="space-y-2">
                {sortedMembers.map((member, index) => (
                    <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-grid/30 transition-colors"
                    >
                        {/* Rank */}
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankStyle(index)}`}
                        >
                            {index + 1}
                        </div>

                        {/* Avatar */}
                        <Avatar name={member.name} size="sm" />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                                {member.name}
                            </p>
                            <p className="text-xs text-text-dim font-mono">{member.id}</p>
                        </div>

                        {/* Attendance */}
                        <div className="text-right">
                            <p className="text-sm font-mono text-signal-green font-semibold">
                                {member.attendancePercent}%
                            </p>
                        </div>
                    </div>
                ))}

                {sortedMembers.length === 0 && (
                    <p className="text-sm text-text-dim text-center py-4">No data available</p>
                )}
            </div>
        </Card>
    );
};
