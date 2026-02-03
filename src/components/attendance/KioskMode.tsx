// ============================================
// Kiosk Mode - Event Check-in Component
// ============================================

import React, { useState } from 'react';
import { Search, CheckCircle, User, X } from 'lucide-react';
import { Button, Avatar, Badge } from '../ui';
import type { Member } from '../../lib/types';

interface KioskModeProps {
    eventId: string;
    eventTitle: string;
    members: Member[];
    attendees: string[];
    onCheckIn: (memberId: string) => void;
    onClose: () => void;
}

export const KioskMode: React.FC<KioskModeProps> = ({
    eventTitle,
    members,
    attendees,
    onCheckIn,
    onClose,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentCheckIns, setRecentCheckIns] = useState<string[]>([]);

    const filteredMembers = members.filter(
        (m) =>
            m.status !== 'Dismissed' &&
            (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCheckIn = (memberId: string) => {
        onCheckIn(memberId);
        setRecentCheckIns((prev) => [memberId, ...prev.slice(0, 4)]);
        setSearchQuery('');
    };

    const isCheckedIn = (memberId: string) => attendees.includes(memberId);

    return (
        <div className="fixed inset-0 bg-bg-primary z-50 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-grid p-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{eventTitle}</h1>
                    <p className="text-sm text-text-muted">
                        {attendees.length} checked in • Tap to check in
                    </p>
                </div>
                <Button variant="ghost" onClick={onClose} leftIcon={<X className="w-5 h-5" />}>
                    Exit Kiosk
                </Button>
            </div>

            {/* Search */}
            <div className="p-6">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-dim" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, student ID, or member ID..."
                        className="w-full pl-14 pr-4 py-4 bg-surface border border-grid rounded-lg text-lg text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-core transition-colors"
                        autoFocus
                    />
                </div>
            </div>

            {/* Results */}
            <div className="px-6 pb-6">
                <div className="max-w-4xl mx-auto">
                    {searchQuery && (
                        <div className="mb-4">
                            <h2 className="text-sm font-medium text-text-muted mb-3">
                                Search Results ({filteredMembers.length})
                            </h2>
                            <div className="space-y-2">
                                {filteredMembers.slice(0, 10).map((member) => (
                                    <button
                                        key={member.id}
                                        onClick={() => handleCheckIn(member.id)}
                                        disabled={isCheckedIn(member.id)}
                                        className={`w-full p-4 flex items-center justify-between bg-surface border rounded-lg transition-all ${isCheckedIn(member.id)
                                                ? 'border-green-500 opacity-60 cursor-not-allowed'
                                                : 'border-grid hover:border-accent-core hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar name={member.name} size="md" />
                                            <div className="text-left">
                                                <p className="font-medium text-text-primary">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-text-dim font-mono">
                                                    {member.studentId} • {member.id}
                                                </p>
                                            </div>
                                        </div>
                                        {isCheckedIn(member.id) ? (
                                            <Badge variant="success" dot>
                                                Checked In
                                            </Badge>
                                        ) : (
                                            <CheckCircle className="w-6 h-6 text-text-dim" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!searchQuery && recentCheckIns.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-text-muted mb-3">
                                Recent Check-Ins
                            </h2>
                            <div className="space-y-2">
                                {recentCheckIns.map((memberId) => {
                                    const member = members.find((m) => m.id === memberId);
                                    if (!member) return null;
                                    return (
                                        <div
                                            key={member.id}
                                            className="p-4 flex items-center gap-4 bg-surface border border-green-500 rounded-lg"
                                        >
                                            <Avatar name={member.name} size="md" />
                                            <div className="flex-1">
                                                <p className="font-medium text-text-primary">
                                                    {member.name}
                                                </p>
                                                <p className="text-sm text-text-dim font-mono">
                                                    {member.studentId}
                                                </p>
                                            </div>
                                            <Badge variant="success" dot>
                                                Checked In
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!searchQuery && recentCheckIns.length === 0 && (
                        <div className="text-center py-12">
                            <User className="w-16 h-16 text-text-dim mx-auto mb-4" />
                            <p className="text-text-muted">Start typing to search for members</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
