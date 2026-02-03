// ============================================
// Member Form Component
// ============================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Card } from '../ui';
import { Save, X } from 'lucide-react';
import type { Member } from '../../lib/types';

const memberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    studentId: z.string().min(1, 'Student ID is required'),
    branch: z.string().min(1, 'Branch is required'),
    year: z.string().min(1, 'Year is required'),
    phone: z.string().optional(),
    feeStatus: z.string().min(1, 'Fee status is required'),
    status: z.string().optional(), // Optional because it might be auto-calculated initially, but good to validate if provided
});

type MemberFormData = z.infer<typeof memberSchema>;

// ... (props interface remains same)

// ... (options definitions remain same, verify they are outside or I need to skip them in replacement content if I want to keep context)

// Let's just update the schema and default values part.
// Actually, I can just replace the definition block.

// RE-ATTEMPTING with precise range for schema + defaultValues
// Splitting into two chunks is better for safety.

// CHUNK 1: Schema
// CHUNK 2: Default Values


interface MemberFormProps {
    initialData?: Partial<Member>;
    onSubmit: (data: MemberFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const branchOptions = [
    { value: 'Mechanical', label: 'Mechanical Engineering' },
    { value: 'Electrical', label: 'Electrical Engineering' },
    { value: 'CS', label: 'Computer Science' },
    { value: 'Civil', label: 'Civil Engineering' },
    { value: 'Other', label: 'Other' },
];

const yearOptions = [
    { value: '1', label: 'Year 1' },
    { value: '2', label: 'Year 2' },
    { value: '3', label: 'Year 3' },
    { value: '4', label: 'Year 4' },
];

const feeOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
];

export const MemberForm: React.FC<MemberFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            studentId: initialData?.studentId || '',
            branch: initialData?.branch || '',
            year: initialData?.year?.toString() || '',
            phone: initialData?.phone || '',
            feeStatus: initialData?.feeStatus || 'Pending',
            status: initialData?.status || 'Active',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card padding="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        placeholder="Enter member name"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="member@university.edu"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Student ID"
                        placeholder="e.g., 21ME1001"
                        error={errors.studentId?.message}
                        {...register('studentId')}
                    />

                    <Input
                        label="Phone (Optional)"
                        placeholder="+91 98765 43210"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />

                    <Select
                        label="Branch"
                        options={branchOptions}
                        placeholder="Select branch"
                        error={errors.branch?.message}
                        {...register('branch')}
                    />

                    <Select
                        label="Year"
                        options={yearOptions}
                        placeholder="Select year"
                        error={errors.year?.message}
                        {...register('year')}
                    />

                    <Select
                        label="Fee Status"
                        options={feeOptions}
                        error={errors.feeStatus?.message}
                        {...register('feeStatus')}
                    />

                    <Select
                        label="Member Status"
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Probation', label: 'Probation' },
                            { value: 'Passive', label: 'Passive' },
                            { value: 'Dismissed', label: 'Dismissed' },
                        ]}
                        error={errors.status?.message}
                        {...register('status')}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-grid">
                    <Button
                        type="button"
                        variant="ghost"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        leftIcon={<Save className="w-4 h-4" />}
                    >
                        {initialData ? 'Update Member' : 'Create Member'}
                    </Button>
                </div>
            </Card>
        </form>
    );
};
