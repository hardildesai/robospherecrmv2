// ============================================
// Users Management Page (Super Admin Only)
// ============================================

import { Settings, UserCheck, UserX, Shield, Plus, Key, ShieldCheck, FileText } from 'lucide-react';
import { PageHeader, AccessDenied } from '../components/common';
import { Card, Button, Badge, Avatar, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { useStore } from '../lib/store';
import { CreateUserModal } from '../components/users/CreateUserModal';
import { ChangeRoleModal } from '../components/users/ChangeRoleModal';
import { useState } from 'react';
import type { User } from '../lib/types';
import { useNavigate, useLocation } from 'react-router-dom';

export const UsersPage: React.FC = () => {
    const { currentUser, users, toggleUserStatus, resetUserPassword, addToast, addAuditLog } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    // ... modal states ...
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Access Control
    if (currentUser?.role !== 'superadmin') {
        addAuditLog('UNAUTHORIZED_ACCESS', 'Attempted to access Users page without Super Admin privileges');
        return <AccessDenied />;
    }

    const isActive = (path: string) => location.pathname === path;

    const handleToggleStatus = (userId: string, isActive: boolean) => {
        toggleUserStatus(userId);
        addToast({
            type: isActive ? 'warning' : 'success',
            message: isActive ? 'User suspended' : 'User reactivated',
        });
    };

    const handleResetPassword = (userId: string, username: string) => {
        if (confirm(`Are you sure you want to reset the password for ${username} to 'password'?`)) {
            resetUserPassword(userId);
            addToast({ type: 'success', message: 'Password reset to default.' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Admin Navigation Tabs */}
            <div className="overflow-x-auto scrollbar-hide border-b border-slate-200 pb-1">
                <div className="flex gap-2 min-w-max">
                    <Button
                        variant={isActive('/admin') ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => navigate('/admin')}
                        leftIcon={<Settings className="w-4 h-4" />}
                    >
                        Users
                    </Button>
                    <Button
                        variant={isActive('/admin/audit-logs') ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => navigate('/admin/audit-logs')}
                        leftIcon={<FileText className="w-4 h-4" />}
                    >
                        Audit Logs
                    </Button>
                    <Button
                        variant={isActive('/admin/settings') ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => navigate('/admin/settings')}
                        leftIcon={<Settings className="w-4 h-4" />}
                    >
                        Settings
                    </Button>
                </div>
            </div>

            <PageHeader
                icon={Settings}
                title="User Management"
                subtitle="Manage admin accounts"
                actions={
                    <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateModalOpen(true)}>
                        Create User
                    </Button>
                }
            />

            <Card padding="none">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Failed Attempts</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar name={user.name} size="sm" />
                                        <span className="font-medium text-text-primary">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-text-muted">
                                    {user.username}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'superadmin' ? 'info' : 'default'}>
                                        {user.role === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.isActive ? 'success' : 'danger'}
                                        dot
                                        pulse={user.isActive}
                                    >
                                        {user.isActive ? 'Active' : 'Suspended'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono">
                                    {user.failedAccessAttempts}
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.id !== currentUser?.id && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="Change Role"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setRoleModalOpen(true);
                                                }}
                                            >
                                                <ShieldCheck className="w-4 h-4 text-purple-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="Reset Password"
                                                onClick={() => handleResetPassword(user.id, user.username)}
                                            >
                                                <Key className="w-4 h-4 text-slate-400" />
                                            </Button>
                                            <Button
                                                variant={user.isActive ? 'ghost' : 'secondary'}
                                                size="sm"
                                                leftIcon={
                                                    user.isActive ? (
                                                        <UserX className="w-4 h-4" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4" />
                                                    )
                                                }
                                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                            >
                                                {user.isActive ? 'Suspend' : 'Reactivate'}
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />

            <ChangeRoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};
