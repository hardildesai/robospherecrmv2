// ============================================
// Member Profile Page
// ============================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    Download,
    Edit,
    Shield,
    ArrowLeft,
    Package,
} from 'lucide-react';
import { EmptyState } from '../components/common';
import { Card, CardHeader, Button, Badge, Avatar, Modal, Textarea } from '../components/ui';
import { SkillTags, MemberForm } from '../components/members';
import { useStore } from '../lib/store';
import { formatDate, getAttendanceColor } from '../lib/utils';

export const MemberProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { members, events, statusThresholds, currentUser, checkouts, inventory, updateMember, proposeRelease, addToast } = useStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
    const [releaseReason, setReleaseReason] = useState('');

    const member = members.find((m) => m.id === id);

    // Derived state for checkouts
    const memberCheckouts = member
        ? checkouts.filter(c => c.memberId === member.id && !c.returnDate)
        : [];



    if (!member) {
        return (
            <EmptyState
                icon={User}
                title="Member not found"
                description="The member you're looking for doesn't exist or has been removed."
                actionLabel="Back to Members"
                onAction={() => navigate('/members')}
            />
        );
    }

    // Get member's attendance history
    const attendedEvents = events.filter((e) => e.attendees.includes(member.id));
    const attendanceColor = getAttendanceColor(member.attendancePercent, statusThresholds);

    const statusVariant = {
        Active: 'success' as const,
        Probation: 'warning' as const,
        Passive: 'default' as const,
        Dismissed: 'danger' as const,
    };

    const handleUpdateMember = (data: any) => {
        if (!member) return;
        updateMember(member.id, data);
        setIsEditModalOpen(false);
        addToast({ type: 'success', message: 'Member profile updated successfully' });
    };

    const handleProposeRelease = () => {
        if (!member || !currentUser) return;

        proposeRelease({
            id: crypto.randomUUID(),
            memberId: member.id,
            proposedBy: currentUser.id,
            reason: releaseReason,
            proposedDate: new Date().toISOString(),
            status: 'Pending'
        });

        setIsReleaseModalOpen(false);
        setReleaseReason('');
        addToast({ type: 'success', message: 'Release proposal submitted' });
    };

    return (
        <div>
            <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/members')}
                className="mb-4"
            >
                Back to Members
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-1"
                >
                    <Card className="text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar name={member.name} size="xl" />
                        </div>
                        <h2 className="text-display text-xl font-bold text-text-primary">
                            {member.name}
                        </h2>
                        <p className="text-mono text-sm text-accent-core mb-2">{member.id}</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Badge variant={statusVariant[member.status]} dot pulse={member.status === 'Active'}>
                                {member.status}
                            </Badge>
                            <Badge variant="default" className="text-xs">
                                {member.rank}
                            </Badge>
                        </div>

                        <div className="h-px bg-grid my-4" />

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className={`text-2xl font-bold font-display text-${attendanceColor}`}>
                                    {member.attendancePercent}%
                                </p>
                                <p className="text-xs text-text-dim">Attendance</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold font-display text-text-primary">
                                    {attendedEvents.length}
                                </p>
                                <p className="text-xs text-text-dim">Events Attended</p>
                            </div>
                        </div>

                        <div className="h-px bg-grid my-4" />

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                                Download Dossier
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                leftIcon={<Edit className="w-4 h-4" />}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit Profile
                            </Button>
                            {currentUser?.role === 'admin' && member.status !== 'Dismissed' && (
                                <Button
                                    variant="ghost"
                                    className="w-full text-signal-red hover:bg-red-50 hover:text-red-600"
                                    leftIcon={<Shield className="w-4 h-4" />}
                                    onClick={() => setIsReleaseModalOpen(true)}
                                >
                                    Propose Release
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Right Column - Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Contact & Academic Info */}
                    <Card>
                        <CardHeader title="Member Information" subtitle="Personal and academic details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-void rounded-lg">
                                <Mail className="w-5 h-5 text-accent-core" />
                                <div>
                                    <p className="text-xs text-text-dim">Email</p>
                                    <p className="text-sm text-text-primary font-mono">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-void rounded-lg">
                                <Phone className="w-5 h-5 text-accent-core" />
                                <div>
                                    <p className="text-xs text-text-dim">Phone</p>
                                    <p className="text-sm text-text-primary font-mono">{member.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-void rounded-lg">
                                <GraduationCap className="w-5 h-5 text-accent-core" />
                                <div>
                                    <p className="text-xs text-text-dim">Branch & Year</p>
                                    <p className="text-sm text-text-primary">{member.branch} • Year {member.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-void rounded-lg">
                                <Calendar className="w-5 h-5 text-accent-core" />
                                <div>
                                    <p className="text-xs text-text-dim">Joined</p>
                                    <p className="text-sm text-text-primary font-mono">{formatDate(member.joinDate)}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Resource Usage - Borrowed Items */}
                    <Card>
                        <CardHeader title="Resource Usage" subtitle={`${memberCheckouts.length} active checkouts`} />
                        {memberCheckouts.length === 0 ? (
                            <p className="text-sm text-text-dim text-center py-4">No items currently borrowed</p>
                        ) : (
                            <div className="space-y-2">
                                {memberCheckouts.map((checkout) => {
                                    const item = inventory.find((i) => i.id === checkout.itemId);
                                    const isOverdue = checkout.dueDate && new Date(checkout.dueDate) < new Date();

                                    return (
                                        <div
                                            key={checkout.id}
                                            className={`p-3 rounded-lg border flex items-center justify-between ${isOverdue
                                                ? 'bg-danger/5 border-danger/20'
                                                : 'bg-void border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                                                    }`}>
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {item?.name || 'Unknown Item'}
                                                    </p>
                                                    <p className={`text-xs ${isOverdue ? 'text-danger' : 'text-text-muted'}`}>
                                                        Due: {checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : 'No due date'}
                                                    </p>
                                                </div>
                                            </div>
                                            {isOverdue && (
                                                <Badge variant="danger" className="text-[10px]">Overdue</Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Fee Status */}
                    <Card>
                        <CardHeader title="Financial Status" />
                        <div className="flex items-center justify-between p-4 bg-void rounded-lg">
                            <div>
                                <p className="text-sm text-text-muted">Fee Status</p>
                                <Badge
                                    variant={
                                        member.feeStatus === 'Paid'
                                            ? 'success'
                                            : member.feeStatus === 'Pending'
                                                ? 'warning'
                                                : 'danger'
                                    }
                                    className="mt-1"
                                >
                                    {member.feeStatus}
                                </Badge>
                            </div>
                            {member.feeStatus === 'Pending' && (
                                <Button size="sm">Mark as Paid</Button>
                            )}
                        </div>
                    </Card>

                    {/* Skills */}
                    <Card>
                        <CardHeader title="Skills & Expertise" subtitle="Technical and soft skills" />
                        <SkillTags skills={member.skills} />
                    </Card>

                    {/* Social Links */}
                    {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
                        <Card>
                            <CardHeader title="Social Links" subtitle="Connect with this member" />
                            <div className="flex flex-wrap gap-2">
                                {member.socialLinks.github && (
                                    <a
                                        href={member.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-void text-sm text-text-primary hover:text-accent-core border border-grid hover:border-accent-core rounded transition-colors"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {member.socialLinks.linkedin && (
                                    <a
                                        href={member.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-void text-sm text-text-primary hover:text-accent-core border border-grid hover:border-accent-core rounded transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                                {member.socialLinks.portfolio && (
                                    <a
                                        href={member.socialLinks.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-void text-sm text-text-primary hover:text-accent-core border border-grid hover:border-accent-core rounded transition-colors"
                                    >
                                        Portfolio
                                    </a>
                                )}
                                {member.socialLinks.twitter && (
                                    <a
                                        href={member.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-void text-sm text-text-primary hover:text-accent-core border border-grid hover:border-accent-core rounded transition-colors"
                                    >
                                        Twitter
                                    </a>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Recent Attendance */}
                    <Card>
                        <CardHeader title="Recent Attendance" subtitle={`${attendedEvents.length} events attended`} />
                        {attendedEvents.length === 0 ? (
                            <p className="text-sm text-text-dim text-center py-4">No attendance records yet</p>
                        ) : (
                            <div className="space-y-2">
                                {attendedEvents.slice(0, 5).map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between p-3 bg-void rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{event.title}</p>
                                            <p className="text-xs text-text-dim font-mono">{formatDate(event.date)}</p>
                                        </div>
                                        <Badge variant="success" dot>Present</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Member Profile"
                size="lg"
            >
                <MemberForm
                    initialData={member}
                    onSubmit={handleUpdateMember}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>

            {/* Release Proposal Modal */}
            <Modal
                isOpen={isReleaseModalOpen}
                onClose={() => setIsReleaseModalOpen(false)}
                title="Propose Member Release"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                        <p className="font-bold mb-1">Warning</p>
                        <p>This action will initiate a formal process to remove <strong>{member.name}</strong> from the organization. This requires Super Admin approval.</p>
                    </div>

                    <Textarea
                        label="Reason for Release"
                        placeholder="Please provide a detailed reason for proposing this release..."
                        value={releaseReason}
                        onChange={(e) => setReleaseReason(e.target.value)}
                        rows={4}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsReleaseModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleProposeRelease}
                            disabled={!releaseReason.trim()}
                        >
                            Submit Proposal
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
