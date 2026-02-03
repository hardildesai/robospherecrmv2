import { useState, useEffect } from 'react';
import { Modal, Button, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { UserRole, User } from '../../lib/types';

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
];

export const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ isOpen, onClose, user }) => {
    const { updateUser, addToast } = useStore();
    const [role, setRole] = useState<UserRole>('member');

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        updateUser(user.id, { role });
        addToast({ type: 'success', message: `User role updated to ${role}` });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Change Role: ${user?.username}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-500">
                    Changing the role will verify the user's access permissions immediately.
                </p>

                <Select
                    label="Select New Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    options={roleOptions}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit">Update Role</Button>
                </div>
            </form>
        </Modal>
    );
};
