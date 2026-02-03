// ============================================
// Releases Page (Super Admin Only)
// ============================================

import { Shield, Check, X, AlertTriangle } from 'lucide-react';
import { PageHeader, EmptyState, AccessDenied } from '../components/common';
import { Card, Button, Badge, Avatar, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Modal } from '../components/ui';
import { useStore } from '../lib/store';
import { formatDate } from '../lib/utils';
import { useState } from 'react';

export const ReleasesPage: React.FC = () => {
    const { currentUser, releaseProposals, members, users, executeRelease, rejectRelease, addToast, addAuditLog } = useStore();
    const [confirmModal, setConfirmModal] = useState<{ id: string; action: 'execute' | 'reject' } | null>(null);

    // Access Control
    if (currentUser?.role !== 'superadmin') {
        // Log unauthorized access
        addAuditLog('UNAUTHORIZED_ACCESS', 'Attempted to access Releases page without Super Admin privileges');
        return <AccessDenied />;
    }

    const pendingProposals = releaseProposals.filter((r) => r.status === 'Pending');
    const completedProposals = releaseProposals.filter((r) => r.status !== 'Pending');

    const getMember = (id: string) => members.find((m) => m.id === id);
    const getUser = (id: string) => users.find((u) => u.id === id);

    const handleConfirmAction = () => {
        if (!confirmModal) return;

        if (confirmModal.action === 'execute') {
            executeRelease(confirmModal.id);
            addToast({ type: 'success', message: 'Release executed successfully' });
        } else {
            rejectRelease(confirmModal.id);
            addToast({ type: 'info', message: 'Release proposal rejected' });
        }
        setConfirmModal(null);
    };

    return (
        <div>
            <PageHeader
                icon={Shield}
                title="Releases"
                subtitle="Member dismissal proposals"
            />

            {/* Pending Proposals */}
            <h2 className="text-display text-lg font-semibold text-text-primary mb-4">
                Pending Proposals
            </h2>

            {pendingProposals.length === 0 ? (
                <Card className="mb-8">
                    <EmptyState
                        icon={Shield}
                        title="No pending proposals"
                        description="All clear! No members are proposed for release."
                    />
                </Card>
            ) : (
                <div className="space-y-4 mb-8">
                    {pendingProposals.map((proposal) => {
                        const member = getMember(proposal.memberId);
                        const proposer = getUser(proposal.proposedBy);

                        return (
                            <Card key={proposal.id} variant="outline" className="border-accent-amber/30 bg-accent-amber/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-signal-red/20 flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-signal-red" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-text-primary">
                                                    {member?.name || 'Unknown Member'}
                                                </h3>
                                                <Badge variant="warning">Pending Release</Badge>
                                            </div>
                                            <p className="text-sm text-text-muted font-mono">{proposal.memberId}</p>
                                            <p className="text-sm text-text-muted mt-2">{proposal.reason}</p>
                                            <p className="text-xs text-text-dim mt-2">
                                                Proposed by {proposer?.name || 'Unknown'} on {formatDate(proposal.proposedDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            leftIcon={<Check className="w-4 h-4" />}
                                            onClick={() => setConfirmModal({ id: proposal.id, action: 'execute' })}
                                        >
                                            Execute
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<X className="w-4 h-4" />}
                                            onClick={() => setConfirmModal({ id: proposal.id, action: 'reject' })}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Completed Proposals */}
            {completedProposals.length > 0 && (
                <>
                    <h2 className="text-display text-lg font-semibold text-text-primary mb-4">
                        History
                    </h2>
                    <Card padding="none">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Proposed</TableHead>
                                    <TableHead>Executed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedProposals.map((proposal) => {
                                    const member = getMember(proposal.memberId);
                                    return (
                                        <TableRow key={proposal.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar name={member?.name || 'Unknown'} size="sm" />
                                                    <div>
                                                        <p className="text-text-primary">{member?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-text-dim font-mono">{proposal.memberId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={proposal.status === 'Executed' ? 'danger' : 'default'}>
                                                    {proposal.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-text-muted">
                                                {formatDate(proposal.proposedDate)}
                                            </TableCell>
                                            <TableCell className="text-text-muted">
                                                {proposal.executedDate ? formatDate(proposal.executedDate) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </>
            )}

            {/* Confirmation Modal */}
            <Modal
                isOpen={!!confirmModal}
                onClose={() => setConfirmModal(null)}
                title={confirmModal?.action === 'execute' ? 'Execute Release' : 'Reject Proposal'}
                size="sm"
            >
                <p className="text-text-muted mb-4">
                    {confirmModal?.action === 'execute'
                        ? 'This will permanently dismiss the member. This action cannot be undone.'
                        : 'This will reject the release proposal and keep the member active.'}
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setConfirmModal(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant={confirmModal?.action === 'execute' ? 'danger' : 'secondary'}
                        onClick={handleConfirmAction}
                    >
                        {confirmModal?.action === 'execute' ? 'Execute Release' : 'Reject'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
