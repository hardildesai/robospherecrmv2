// ============================================
// At Risk Members Component
// ============================================

import { Card, CardHeader, Avatar, Badge } from '../ui';
import { AlertTriangle } from 'lucide-react';
import type { Member, StatusThresholds } from '../../lib/types';

interface AtRiskMembersProps {
    members: Member[];
    thresholds: StatusThresholds;
    maxItems?: number;
}

export const AtRiskMembers: React.FC<AtRiskMembersProps> = ({
    members,
    thresholds,
    maxItems = 5,
}) => {
    // Filter members who are in Yellow or Red zones
    const atRiskMembers = members
        .filter((m) => m.status !== 'Dismissed' && m.attendancePercent < thresholds.green)
        .sort((a, b) => a.attendancePercent - b.attendancePercent)
        .slice(0, maxItems);

    const getZone = (percent: number) => {
        if (percent >= thresholds.yellow) return { label: 'Yellow', variant: 'warning' as const };
        return { label: 'Red', variant: 'danger' as const };
    };

    return (
        <Card className="h-full">
            <CardHeader
                title="At Risk Members"
                subtitle="Below attendance threshold"
                action={<AlertTriangle className="w-5 h-5 text-signal-amber" />}
            />

            <div className="space-y-2">
                {atRiskMembers.map((member) => {
                    const zone = getZone(member.attendancePercent);
                    return (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-grid/30 transition-colors"
                        >
                            {/* Avatar */}
                            <Avatar name={member.name} size="sm" />

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {member.name}
                                </p>
                                <p className="text-xs text-text-dim">{member.branch}</p>
                            </div>

                            {/* Status */}
                            <div className="text-right flex items-center gap-2">
                                <span className="text-sm font-mono text-text-muted">
                                    {member.attendancePercent}%
                                </span>
                                <Badge variant={zone.variant} dot>
                                    {zone.label}
                                </Badge>
                            </div>
                        </div>
                    );
                })}

                {atRiskMembers.length === 0 && (
                    <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-signal-green/10 flex items-center justify-center">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <p className="text-sm text-signal-green">All members in good standing!</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
