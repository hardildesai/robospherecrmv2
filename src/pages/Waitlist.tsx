// ============================================
// Waitlist Page
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Check, Archive, Mail, Calendar } from 'lucide-react';
import { PageHeader, EmptyState } from '../components/common';
import { Card, Button, Badge, Avatar, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { useStore } from '../lib/store';
import { formatDate } from '../lib/utils';

type TabFilter = 'Pending' | 'Archived';

export const WaitlistPage: React.FC = () => {
    const navigate = useNavigate();
    const { waitlist, approveWaitlistEntry, archiveWaitlistEntry, addToast } = useStore();
    const [activeTab, setActiveTab] = useState<TabFilter>('Pending');

    const filteredWaitlist = useMemo(() => {
        return waitlist.filter((w) => w.status === activeTab);
    }, [waitlist, activeTab]);

    const tabs = [
        { key: 'Pending' as const, label: 'Pending', count: waitlist.filter((w) => w.status === 'Pending').length },
        { key: 'Archived' as const, label: 'Archived', count: waitlist.filter((w) => w.status === 'Archived').length },
    ];

    const handleApprove = (entry: typeof waitlist[0]) => {
        approveWaitlistEntry(entry.id);
        addToast({ type: 'success', message: `${entry.name} approved!` });
        // Navigate to add member form with prefilled data
        navigate(`/members/new?name=${encodeURIComponent(entry.name)}&email=${encodeURIComponent(entry.email)}&studentId=${encodeURIComponent(entry.studentId)}`);
    };

    const handleArchive = (entry: typeof waitlist[0]) => {
        archiveWaitlistEntry(entry.id);
        addToast({ type: 'info', message: `${entry.name} archived` });
    };

    return (
        <div>
            <PageHeader
                icon={UserPlus}
                title="Waitlist"
                subtitle={`${waitlist.filter((w) => w.status === 'Pending').length} pending applications`}
            />

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 bg-plate rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                                ? 'bg-accent-core text-void'
                                : 'text-text-muted hover:text-text-primary hover:bg-grid'
                            }`}
                    >
                        {tab.label}
                        <span className="ml-2 text-xs opacity-70">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            {filteredWaitlist.length === 0 ? (
                <EmptyState
                    icon={UserPlus}
                    title={activeTab === 'Pending' ? 'No pending applications' : 'No archived applications'}
                    description={activeTab === 'Pending' ? 'New applicants will appear here' : ''}
                />
            ) : (
                <Card padding="none">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWaitlist.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={entry.name} size="sm" />
                                            <div>
                                                <p className="font-medium text-text-primary">{entry.name}</p>
                                                <p className="text-xs text-text-dim flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {entry.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-text-muted">
                                        {entry.studentId}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-text-muted">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(entry.appliedDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                entry.status === 'Pending'
                                                    ? 'warning'
                                                    : entry.status === 'Accepted'
                                                        ? 'success'
                                                        : 'default'
                                            }
                                        >
                                            {entry.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {entry.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    leftIcon={<Check className="w-4 h-4" />}
                                                    onClick={() => handleApprove(entry)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    leftIcon={<Archive className="w-4 h-4" />}
                                                    onClick={() => handleArchive(entry)}
                                                >
                                                    Archive
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
};
