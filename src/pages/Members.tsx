
// ============================================
// Members Page
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Grid, List, Upload, Download } from 'lucide-react';
import { PageHeader, EmptyState } from '../components/common';
import { MemberCard, MemberTable, BulkImportModal } from '../components/members';
import { Button, Input, Select, Card } from '../components/ui';
import { useStore } from '../lib/store';
import type { Member } from '../lib/types';
import { jsPDF } from 'jspdf';

type TabFilter = 'all' | 'Active' | 'Probation' | 'Passive' | 'Dismissed';
type ViewMode = 'grid' | 'list';

export const MembersPage: React.FC = () => {
    const navigate = useNavigate();
    const { members, statusThresholds } = useStore();

    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isImportModalOpen, setImportModalOpen] = useState(false);

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Student ID', 'Branch', 'Year', 'Status', 'Join Date'];
        const csvContent = [
            headers.join(','),
            ...members.map(m => [
                `"${m.name}"`,
                m.email,
                m.studentId,
                m.branch,
                m.year,
                m.status,
                m.joinDate
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Filter and sort members
    const filteredMembers = useMemo(() => {
        let result = [...members];

        // Filter by status tab
        if (activeTab !== 'all') {
            result = result.filter((m) => m.status === activeTab);
        } else {
            // Exclude dismissed from "all" view
            result = result.filter((m) => m.status !== 'Dismissed');
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (m) =>
                    m.name.toLowerCase().includes(query) ||
                    m.id.toLowerCase().includes(query) ||
                    m.email.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'attendance':
                    return b.attendancePercent - a.attendancePercent;
                case 'branch':
                    return a.branch.localeCompare(b.branch);
                case 'year':
                    return a.year - b.year;
                default:
                    return 0;
            }
        });

        return result;
    }, [members, activeTab, searchQuery, sortBy]);

    const tabs: { key: TabFilter; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: members.filter((m) => m.status !== 'Dismissed').length },
        { key: 'Active', label: 'Active', count: members.filter((m) => m.status === 'Active').length },
        { key: 'Probation', label: 'Probation', count: members.filter((m) => m.status === 'Probation').length },
        { key: 'Passive', label: 'Passive', count: members.filter((m) => m.status === 'Passive').length },
        { key: 'Dismissed', label: 'Dismissed', count: members.filter((m) => m.status === 'Dismissed').length },
    ];





    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'attendance', label: 'Attendance' },
        { value: 'branch', label: 'Branch' },
        { value: 'year', label: 'Year' },
    ];

    const handleDownloadPdf = (member: Member) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Member Profile', 20, 20);
        doc.setFontSize(12);
        doc.text(`Name: ${member.name}`, 20, 40);
        doc.text(`Member ID: ${member.id}`, 20, 50);
        doc.text(`Email: ${member.email}`, 20, 60);
        doc.text(`Student ID: ${member.studentId}`, 20, 70);
        doc.text(`Branch: ${member.branch}`, 20, 80);
        doc.text(`Year: ${member.year}`, 20, 90);
        doc.text(`Status: ${member.status}`, 20, 100);
        doc.text(`Attendance: ${member.attendancePercent}%`, 20, 110);
        doc.text(`Fee Status: ${member.feeStatus}`, 20, 120);
        doc.text(`Rank: ${member.rank}`, 20, 130);
        doc.text(`Skills: ${member.skills.join(', ') || 'None'}`, 20, 140);
        doc.text(`Join Date: ${member.joinDate}`, 20, 150);
        doc.save(`${member.id}_profile.pdf`);
    };

    return (
        <div className="space-y-6">
            <BulkImportModal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
            />

            <PageHeader
                title="Members Directory"
                subtitle={`Total Members: ${members.length}`}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                            Export
                        </Button>
                        <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setImportModalOpen(true)}>
                            Import
                        </Button>
                        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/members/new')}>
                            Add Member
                        </Button>
                    </div>
                }
            />

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 bg-slate-100 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.key
                            ? 'bg-white text-black shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-2 text-xs ${activeTab === tab.key ? 'text-black/60' : 'text-slate-400'}`}>
                            ({tab.count})
                        </span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <Card padding="sm" className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Search by name, ID, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Select
                            options={sortOptions}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-36"
                        />

                        <div className="flex border border-grid rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid'
                                    ? 'bg-accent-core text-void'
                                    : 'text-text-muted hover:text-text-primary'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list'
                                    ? 'bg-accent-core text-void'
                                    : 'text-text-muted hover:text-text-primary'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Content */}
            {
                filteredMembers.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No members found"
                        description={searchQuery ? 'Try adjusting your search criteria' : 'Add your first member to get started'}
                        actionLabel={searchQuery ? undefined : 'Add Member'}
                        onAction={searchQuery ? undefined : () => navigate('/members/new')}
                    />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMembers.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                thresholds={statusThresholds}
                                onDownload={() => handleDownloadPdf(member)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card padding="none">
                        <MemberTable
                            members={filteredMembers}
                            thresholds={statusThresholds}
                            onDownload={handleDownloadPdf}
                        />
                    </Card>
                )
            }
        </div >
    );
};
