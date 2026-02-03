// ============================================
// Member Table Component
// ============================================

import { useNavigate } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Avatar, Button } from '../ui';
import type { Member, StatusThresholds } from '../../lib/types';
import { getAttendanceColor, formatDate } from '../../lib/utils';

interface MemberTableProps {
    members: Member[];
    thresholds: StatusThresholds;
    onDownload?: (member: Member) => void;
}

const statusVariant = {
    Active: 'success' as const,
    Probation: 'warning' as const,
    Passive: 'default' as const,
    Dismissed: 'danger' as const,
};

export const MemberTable: React.FC<MemberTableProps> = ({ members, thresholds, onDownload }) => {
    const navigate = useNavigate();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member) => {
                    const attendanceColor = getAttendanceColor(member.attendancePercent, thresholds);
                    return (
                        <TableRow
                            key={member.id}
                            isClickable
                            onClick={() => navigate(`/members/${member.id}`)}
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar name={member.name} size="sm" />
                                    <div>
                                        <p className="font-medium text-text-primary">{member.name}</p>
                                        <p className="text-xs text-text-dim">{member.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-text-muted">{member.id}</TableCell>
                            <TableCell>{member.branch}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[member.status]} dot pulse={member.status === 'Active'}>
                                    {member.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className={`font-semibold text-${attendanceColor}`}>
                                    {member.attendancePercent}%
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge variant={member.feeStatus === 'Paid' ? 'success' : member.feeStatus === 'Pending' ? 'warning' : 'danger'}>
                                    {member.feeStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-text-muted">{formatDate(member.joinDate)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/members/${member.id}`)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDownload?.(member)}
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
