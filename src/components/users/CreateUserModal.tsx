import { useState } from 'react';
import { Modal, Input, Button, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { UserRole } from '../../lib/types';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
    const { addUser, addToast } = useStore();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('admin');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !username || !password) {
            addToast({ type: 'warning', message: 'All fields are required' });
            return;
        }

        addUser({
            id: `usr-${Date.now()}`,
            name,
            username,
            password,
            role,
            isActive: true,
            failedAccessAttempts: 0,
        });

        addToast({ type: 'success', message: `User ${username} created successfully!` });
        onClose();

        // Reset form
        setName('');
        setUsername('');
        setPassword('');
        setRole('admin');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create System User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    placeholder="e.g. System Backup Admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    label="Username"
                    placeholder="e.g. sysadmin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Initial password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    options={roleOptions}
                    required
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit">Create User</Button>
                </div>
            </form>
        </Modal>
    );
};
