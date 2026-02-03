// ============================================
// Add New Member Page
// ============================================

import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../components/common';
import { MemberForm } from '../components/members';
import { useStore } from '../lib/store';
import { generateMemberId } from '../lib/mockData';
import type { Member, Branch, FeeStatus } from '../lib/types';

export const MemberNewPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addMember, addToast } = useStore();

    // Pre-fill from waitlist approval
    const prefillData = {
        name: searchParams.get('name') || '',
        email: searchParams.get('email') || '',
        studentId: searchParams.get('studentId') || '',
    };

    const handleSubmit = (data: {
        name: string;
        email: string;
        studentId: string;
        branch: string;
        year: string;
        phone?: string;
        feeStatus: string;
    }) => {
        const newMember: Member = {
            id: generateMemberId(),
            name: data.name,
            email: data.email,
            studentId: data.studentId,
            branch: data.branch as Branch,
            year: parseInt(data.year) as 1 | 2 | 3 | 4,
            phone: data.phone,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            attendancePercent: 100, // New members start at 100%
            feeStatus: data.feeStatus as FeeStatus,
            rank: 'Member', // New members start as Member
            skills: [], // Skills to be added later
            lastAttended: new Date().toISOString().split('T')[0], // Set to join date
        };

        addMember(newMember);
        addToast({
            type: 'success',
            message: `Member ${newMember.name} created successfully!`,
        });
        navigate('/members');
    };

    return (
        <div>
            <PageHeader
                icon={UserPlus}
                title="Add New Member"
                subtitle="Register a new member to the club"
            />

            <MemberForm
                initialData={prefillData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/members')}
            />
        </div>
    );
};
