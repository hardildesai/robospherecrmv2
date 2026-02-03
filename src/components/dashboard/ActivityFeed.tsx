// ============================================
// Activity Feed Component
// ============================================

import { Card, CardHeader } from '../ui';
import type { AuditLog } from '../../lib/types';
import { getRelativeTime } from '../../lib/utils';
import {
    UserPlus,
    Calendar,
    CheckCircle,
    LogIn,
    AlertTriangle,
    Shield,
} from 'lucide-react';

interface ActivityFeedProps {
    logs: AuditLog[];
    maxItems?: number;
}

const getActionIcon = (type: string) => {
    if (type.includes('MEMBER')) return <UserPlus className="w-4 h-4" />;
    if (type.includes('EVENT')) return <Calendar className="w-4 h-4" />;
    if (type.includes('ATTENDANCE')) return <CheckCircle className="w-4 h-4" />;
    if (type.includes('LOGIN')) return <LogIn className="w-4 h-4" />;
    if (type.includes('RELEASE')) return <Shield className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
};

const getActionColor = (type: string) => {
    if (type.includes('CREATED') || type.includes('SUCCESS')) return 'text-signal-green';
    if (type.includes('FAILURE') || type.includes('UNAUTHORIZED')) return 'text-signal-red';
    if (type.includes('UPDATED') || type.includes('MARKED')) return 'text-accent-core';
    return 'text-text-muted';
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs, maxItems = 5 }) => {
    const displayLogs = logs.slice(0, maxItems);

    return (
        <Card className="h-full">
            <CardHeader title="Recent Activity" subtitle="Latest system events" />

            <div className="space-y-3">
                {displayLogs.map((log) => (
                    <div
                        key={log.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-grid/30 transition-colors"
                    >
                        <div className={`mt-0.5 ${getActionColor(log.actionType)}`}>
                            {getActionIcon(log.actionType)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary truncate">{log.details}</p>
                            <p className="text-xs text-text-dim font-mono mt-0.5">
                                {getRelativeTime(log.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {displayLogs.length === 0 && (
                    <p className="text-sm text-text-dim text-center py-4">No recent activity</p>
                )}
            </div>
        </Card>
    );
};
