// ============================================
// Event Attendance Page
// ============================================

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowLeft, Search, Check, X, Users, Monitor } from 'lucide-react';
import { PageHeader, EmptyState } from '../components/common';
import { Card, Button, Input, Avatar, Badge } from '../components/ui';
import { KioskMode } from '../components/attendance';
import { useStore } from '../lib/store';
import { formatDate, formatTime } from '../lib/utils';

export const EventAttendancePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { events, members, markAttendance, addToast } = useStore();

    const event = events.find((e) => e.id === id);
    const [searchQuery, setSearchQuery] = useState('');
    const [kioskMode, setKioskMode] = useState(false);

    const filteredMembers = useMemo(() => {
        const activeMembers = members.filter((m) => m.status !== 'Dismissed');
        if (!searchQuery) return activeMembers;

        const query = searchQuery.toLowerCase();
        return activeMembers.filter(
            (m) =>
                m.name.toLowerCase().includes(query) ||
                m.id.toLowerCase().includes(query)
        );
    }, [members, searchQuery]);

    if (!event) {
        return (
            <EmptyState
                icon={CheckSquare}
                title="Event not found"
                description="The event you're looking for doesn't exist."
                actionLabel="Back to Events"
                onAction={() => navigate('/events')}
            />
        );
    }

    const eventStart = useMemo(() => {
        if (!event) return new Date();
        const start = new Date(event.date);
        const [hours, minutes] = event.startTime.split(':').map(Number);
        start.setHours(hours, minutes, 0, 0);
        return start;
    }, [event]);

    const hasStarted = new Date() >= eventStart;
    const isFinished = event.status === 'Completed';

    const handleToggleAttendance = (memberId: string) => {
        if (!hasStarted) {
            addToast({ type: 'warning', message: 'Attendance is locked until event starts.' });
            return;
        }
        if (isFinished) {
            addToast({ type: 'warning', message: 'Event is finished. Attendance is final.' });
            return;
        }
        const isPresent = event.attendees.includes(memberId);
        markAttendance(event.id, memberId, !isPresent);
        addToast({
            type: isPresent ? 'info' : 'success',
            message: isPresent ? 'Attendance removed' : 'Attendance marked',
            duration: 2000,
        });
    };

    const handleMarkAllPresent = () => {
        if (!hasStarted) return;
        if (isFinished) {
            addToast({ type: 'warning', message: 'Event is finished. Attendance is final.' });
            return;
        }
        filteredMembers.forEach((m) => {
            if (!event.attendees.includes(m.id)) {
                markAttendance(event.id, m.id, true);
            }
        });
        addToast({
            type: 'success',
            message: 'All visible members marked as present',
        });
    };

    const handleClearAll = () => {
        if (!hasStarted) return;
        if (isFinished) {
            addToast({ type: 'warning', message: 'Event is finished. Attendance is final.' });
            return;
        }
        event.attendees.forEach((memberId) => {
            markAttendance(event.id, memberId, false);
        });
        addToast({
            type: 'info',
            message: 'Attendance cleared',
        });
    };

    const handleFinishEvent = () => {
        if (!hasStarted) return;
        if (confirm('Are you sure you want to finish this event? Attendance cannot be changed afterwards.')) {
            // Access store via hook in a cleaner way if possible, but we already destructuring store
            // We need updateEvent which wasn't destructured initially
            useStore.getState().updateEvent(event.id, { status: 'Completed' });
            addToast({ type: 'success', message: 'Event marked as finished.' });
            navigate('/events');
        }
    };

    const handleKioskCheckIn = (memberId: string) => {
        if (!hasStarted || isFinished) {
            addToast({ type: 'warning', message: 'Check-in unavailable.' });
            return;
        }
        markAttendance(event.id, memberId, true);
    };

    if (kioskMode) {
        return (
            <KioskMode
                eventId={event.id}
                eventTitle={event.title}
                members={members}
                attendees={event.attendees}
                onCheckIn={handleKioskCheckIn}
                onClose={() => setKioskMode(false)}
            />
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Button
                    variant="ghost"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate('/events')}
                >
                    Back to Events
                </Button>
                {hasStarted && !isFinished && (
                    <Button variant="danger" onClick={handleFinishEvent}>
                        Finish Event
                    </Button>
                )}
            </div>

            <PageHeader
                icon={CheckSquare}
                title="Mark Attendance"
                subtitle={event.title}
                actions={
                    !hasStarted ? (
                        <Badge variant="warning">
                            Event Starts at {formatTime(event.startTime)}
                        </Badge>
                    ) : isFinished ? (
                        <Badge variant="success">
                            Event Finished
                        </Badge>
                    ) : (
                        <Badge variant="info">
                            In Progress
                        </Badge>
                    )
                }
            />

            {/* Event Info */}
            <Card padding="sm" className="mb-6">
                <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-text-muted">
                        <strong className="text-text-primary">{formatDate(event.date)}</strong>
                    </span>
                    <span className="text-text-muted">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                    <span className="text-text-muted">{event.location}</span>
                    <Badge variant="info">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees.length} / {event.capacity} Present
                    </Badge>
                </div>
            </Card>

            {/* Toolbar */}
            <Card padding="sm" className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Monitor className="w-4 h-4" />}
                            onClick={() => {
                                if (!hasStarted) {
                                    addToast({ type: 'warning', message: 'Cannot start Kiosk before event starts.' });
                                    return;
                                }
                                setKioskMode(true);
                            }}
                            disabled={!hasStarted || isFinished}
                        >
                            Start Kiosk
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleMarkAllPresent} disabled={!hasStarted || isFinished}>
                            Mark All Present
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={!hasStarted || isFinished}>
                            Clear All
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Members List */}
            <Card padding="none">
                <div className="divide-y divide-grid">
                    {filteredMembers.map((member) => {
                        const isPresent = event.attendees.includes(member.id);
                        return (
                            <div
                                key={member.id}
                                className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${!hasStarted || isFinished ? 'opacity-50 cursor-not-allowed' : 'hover:bg-grid/30'
                                    }`}
                                onClick={() => handleToggleAttendance(member.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar name={member.name} size="sm" />
                                    <div>
                                        <p className="font-medium text-text-primary">{member.name}</p>
                                        <p className="text-xs text-text-dim font-mono">{member.id}</p>
                                    </div>
                                </div>
                                <button
                                    disabled={!hasStarted || isFinished}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isPresent
                                        ? 'bg-signal-green text-void'
                                        : 'bg-grid text-text-dim'
                                        } ${(!hasStarted || isFinished) ? '' : 'hover:bg-grid/80'}`}
                                >
                                    {isPresent ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};
