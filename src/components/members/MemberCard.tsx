// ============================================
// Member Card Component
// ============================================

import { useNavigate } from 'react-router-dom';
import { Download, Eye, Mail, Phone } from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../ui';
import type { Member, StatusThresholds } from '../../lib/types';
import { getAttendanceColor } from '../../lib/utils';

interface MemberCardProps {
    member: Member;
    thresholds: StatusThresholds;
    onDownload?: () => void;
}

const statusVariant = {
    Active: 'success' as const,
    Probation: 'warning' as const,
    Passive: 'default' as const,
    Dismissed: 'danger' as const,
};

const feeVariant = {
    Paid: 'success' as const,
    Pending: 'warning' as const,
    Forfeited: 'danger' as const,
};

export const MemberCard: React.FC<MemberCardProps> = ({ member, thresholds, onDownload }) => {
    const navigate = useNavigate();
    const attendanceColor = getAttendanceColor(member.attendancePercent, thresholds);

    return (
        <Card variant="glass" className="hover:border-accent-cyan/50 transition-colors group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <Avatar name={member.name} size="lg" />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{member.name}</h3>
                    <p className="text-xs text-text-dim font-mono">{member.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">{member.branch}</span>
                        <span className="text-text-dim">•</span>
                        <span className="text-xs text-text-muted">Year {member.year}</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-grid mb-4" />

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[member.status]} dot pulse={member.status === 'Active'}>
                        {member.status}
                    </Badge>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-mono font-semibold text-${attendanceColor}`}>
                        {member.attendancePercent}%
                    </p>
                    <p className="text-xs text-text-dim">Attendance</p>
                </div>
            </div>

            {/* Fee Status */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-text-muted">Fee Status</span>
                <Badge variant={feeVariant[member.feeStatus]}>
                    {member.feeStatus}
                </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-grid">
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => navigate(`/members/${member.id}`)}
                >
                    View
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={onDownload}
                >
                    PDF
                </Button>
            </div>
        </Card>
    );
};
