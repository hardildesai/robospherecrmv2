// ============================================
// Reports Page - with Export Functions
// ============================================

import { FileText, FileSpreadsheet, File, Download } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Card, CardHeader, Button, Select } from '../components/ui';
import { useStore } from '../lib/store';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

// CSV Export Helper
const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => {
            const value = row[h];
            const cell = typeof value === 'string' ? value : String(value ?? '');
            return `"${cell.replace(/"/g, '""')}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

export const ReportsPage: React.FC = () => {
    const { events, members, auditLogs, addToast } = useStore();
    const [selectedEvent, setSelectedEvent] = useState('');

    const eventOptions = [
        { value: '', label: 'Select an event...' },
        ...events.map((e) => ({
            value: e.id,
            label: e.title,
        }))
    ];

    // Export Club Summary as PDF
    const exportSummaryPDF = () => {
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();

        doc.setFontSize(20);
        doc.text('RoboSphere Club Summary Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Generated: ${today}`, 20, 30);

        doc.setFontSize(14);
        doc.text('Member Statistics', 20, 45);

        doc.setFontSize(11);
        const activeMembers = members.filter(m => m.status === 'Active').length;
        const passiveMembers = members.filter(m => m.status === 'Passive').length;
        const dismissedMembers = members.filter(m => m.status === 'Dismissed').length;

        doc.text(`Total Members: ${members.length}`, 25, 55);
        doc.text(`Active: ${activeMembers}`, 25, 62);
        doc.text(`Passive: ${passiveMembers}`, 25, 69);
        doc.text(`Dismissed: ${dismissedMembers}`, 25, 76);

        doc.setFontSize(14);
        doc.text('Upcoming Events', 20, 91);

        doc.setFontSize(11);
        const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);
        upcomingEvents.forEach((e, i) => {
            doc.text(`• ${e.title} - ${e.date}`, 25, 101 + (i * 7));
        });

        if (upcomingEvents.length === 0) {
            doc.text('No upcoming events scheduled.', 25, 101);
        }

        doc.save(`club_summary_${new Date().toISOString().split('T')[0]}.pdf`);
        addToast({ type: 'success', message: 'Summary report exported as PDF' });
    };

    // Export Club Summary as CSV
    const exportSummaryCSV = () => {
        const summaryData = [
            { metric: 'Total Members', value: members.length },
            { metric: 'Active Members', value: members.filter(m => m.status === 'Active').length },
            { metric: 'Passive Members', value: members.filter(m => m.status === 'Passive').length },
            { metric: 'Dismissed Members', value: members.filter(m => m.status === 'Dismissed').length },
            { metric: 'Total Events', value: events.length },
            { metric: 'Upcoming Events', value: events.filter(e => new Date(e.date) >= new Date()).length },
        ];
        downloadCSV(summaryData, 'club_summary');
        addToast({ type: 'success', message: 'Summary report exported as CSV' });
    };

    // Export Event Attendance as PDF
    const exportAttendancePDF = () => {
        const event = events.find(e => e.id === selectedEvent);
        if (!event) return;

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Event Attendance Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Event: ${event.title}`, 20, 32);
        doc.text(`Date: ${event.date}`, 20, 40);
        doc.text(`Location: ${event.location}`, 20, 48);
        doc.text(`Attendees: ${event.attendees.length} / ${event.capacity}`, 20, 56);

        doc.setFontSize(14);
        doc.text('Attendee List:', 20, 70);

        doc.setFontSize(10);
        event.attendees.forEach((memberId, i) => {
            const member = members.find(m => m.id === memberId);
            if (member && i < 30) { // Limit to first page
                doc.text(`${i + 1}. ${member.name} (${member.email})`, 25, 80 + (i * 6));
            }
        });

        doc.save(`attendance_${event.title.replace(/\s+/g, '_')}_${event.date}.pdf`);
        addToast({ type: 'success', message: 'Attendance report exported as PDF' });
    };

    // Export Event Attendance as CSV
    const exportAttendanceCSV = () => {
        const event = events.find(e => e.id === selectedEvent);
        if (!event) return;

        const attendeeData = event.attendees.map(memberId => {
            const member = members.find(m => m.id === memberId);
            return {
                name: member?.name || 'Unknown',
                email: member?.email || '',
                studentId: member?.studentId || '',
                branch: member?.branch || '',
            };
        });

        downloadCSV(attendeeData, `attendance_${event.title.replace(/\s+/g, '_')}`);
        addToast({ type: 'success', message: 'Attendance exported as CSV' });
    };

    // Export Full Member Database as CSV
    const exportMembersCSV = () => {
        const memberData = members.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            studentId: m.studentId,
            branch: m.branch,
            year: m.year,
            phone: m.phone || '',
            status: m.status,
            rank: m.rank,
            joinDate: m.joinDate,
            feeStatus: m.feeStatus,
            attendancePercent: m.attendancePercent,
            skills: m.skills.join('; '),
        }));

        downloadCSV(memberData, 'members_database');
        addToast({ type: 'success', message: 'Member database exported as CSV' });
    };

    // Export Audit Logs as PDF
    const exportAuditPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('System Audit Log', 20, 20);

        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28);
        doc.text(`Total Records: ${auditLogs.length}`, 20, 35);

        doc.setFontSize(9);
        const recentLogs = auditLogs.slice(0, 40); // First page
        recentLogs.forEach((log, i) => {
            const y = 45 + (i * 6);
            if (y < 280) {
                doc.text(`[${log.timestamp}] ${log.actionType}: ${log.details.substring(0, 60)}`, 15, y);
            }
        });

        doc.save(`audit_log_${new Date().toISOString().split('T')[0]}.pdf`);
        addToast({ type: 'success', message: 'Audit log exported as PDF' });
    };

    return (
        <div>
            <PageHeader
                icon={FileText}
                title="Reports"
                subtitle="Generate and export club data"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Club Summary */}
                <Card>
                    <CardHeader
                        title="Club Summary Report"
                        subtitle="Overview of member counts and upcoming events"
                    />
                    <p className="text-sm text-text-muted mb-4">
                        Generates a comprehensive summary including total members, status breakdown, and upcoming events.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            leftIcon={<File className="w-4 h-4" />}
                            onClick={exportSummaryPDF}
                        >
                            PDF
                        </Button>
                        <Button
                            variant="secondary"
                            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                            onClick={exportSummaryCSV}
                        >
                            CSV
                        </Button>
                    </div>
                </Card>

                {/* Event Attendance */}
                <Card>
                    <CardHeader
                        title="Event Attendance Report"
                        subtitle="Export attendance for a specific event"
                    />
                    <div className="mb-4">
                        <Select
                            label="Select Event"
                            options={eventOptions}
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            leftIcon={<File className="w-4 h-4" />}
                            disabled={!selectedEvent}
                            onClick={exportAttendancePDF}
                        >
                            PDF
                        </Button>
                        <Button
                            variant="secondary"
                            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                            disabled={!selectedEvent}
                            onClick={exportAttendanceCSV}
                        >
                            CSV
                        </Button>
                    </div>
                </Card>

                {/* Full Member Dump */}
                <Card>
                    <CardHeader
                        title="Full Member Database"
                        subtitle="Complete export of all member data"
                    />
                    <p className="text-sm text-text-muted mb-4">
                        Exports all {members.length} members with complete field data for backup or analysis.
                    </p>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={exportMembersCSV}
                    >
                        Export as CSV
                    </Button>
                </Card>

                {/* Audit Log Export */}
                <Card>
                    <CardHeader
                        title="Audit Log Export"
                        subtitle="System activity log for compliance"
                    />
                    <p className="text-sm text-text-muted mb-4">
                        Exports all system actions including logins, member changes, and access attempts.
                    </p>
                    <Button
                        variant="secondary"
                        leftIcon={<File className="w-4 h-4" />}
                        onClick={exportAuditPDF}
                    >
                        Export as PDF
                    </Button>
                </Card>
            </div>
        </div>
    );
};
