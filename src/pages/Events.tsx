// ============================================
// Events Page
// ============================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, MapPin, Clock, Users, Download, CheckSquare } from 'lucide-react';
import { PageHeader, EmptyState } from '../components/common';
import { Card, Button, Badge } from '../components/ui';
import { useStore } from '../lib/store';
import { formatTime } from '../lib/utils';
import type { ClubEvent } from '../lib/types';

type TabFilter = 'upcoming' | 'past';

export const EventsPage: React.FC = () => {
    const navigate = useNavigate();
    const { events, members } = useStore();
    const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');

    const today = new Date().toISOString().split('T')[0];

    const handleExportEvent = (event: ClubEvent) => {
        const attendeeNames = event.attendees.map(id => {
            const member = members.find(m => m.id === id);
            return member ? member.name : id;
        });

        const csvContent = [
            `Event: ${event.title}`,
            `Date: ${event.date}`,
            `Time: ${event.startTime} - ${event.endTime}`,
            `Location: ${event.location}`,
            ``,
            `Attendees (${event.attendees.length}):`,
            ...attendeeNames
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${event.id}_attendees.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredEvents = useMemo(() => {
        const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
        if (activeTab === 'upcoming') {
            return sorted.filter((e) => e.date >= today);
        }
        return sorted.filter((e) => e.date < today);
    }, [events, activeTab, today]);

    const tabs = [
        { key: 'upcoming' as const, label: 'Upcoming', count: events.filter((e) => e.date >= today).length },
        { key: 'past' as const, label: 'Past', count: events.filter((e) => e.date < today).length },
    ];

    return (
        <div>
            <PageHeader
                icon={Calendar}
                title="Events"
                subtitle={`${events.length} total events`}
                actions={
                    <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/events/new')}>
                        Create Event
                    </Button>
                }
            />

            {/* Tabs */}
            <div className="overflow-x-auto scrollbar-hide mb-6">
                <div className="flex gap-1 p-1 bg-plate rounded-lg w-fit min-w-full sm:min-w-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key
                                ? 'bg-accent-core text-void'
                                : 'text-text-muted hover:text-text-primary hover:bg-grid'
                                }`}
                        >
                            {tab.label}
                            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title={activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
                    description={activeTab === 'upcoming' ? 'Create your first event to get started' : ''}
                    actionLabel={activeTab === 'upcoming' ? 'Create Event' : undefined}
                    onAction={activeTab === 'upcoming' ? () => navigate('/events/new') : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {filteredEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const isToday = new Date().toDateString() === eventDate.toDateString();

                        return (
                            <Card key={event.id} variant="glass" glow className="hover:border-accent-core/50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Date Badge */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-accent-core/10 border border-accent-core/30 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="text-xs text-accent-core uppercase">
                                                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl font-bold text-text-primary font-display">
                                                {eventDate.getDate()}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-text-primary">{event.title}</h3>
                                                {isToday && (
                                                    <Badge variant="success" dot pulse>
                                                        Today
                                                    </Badge>
                                                )}
                                            </div>
                                            {event.description && (
                                                <p className="text-sm text-text-muted mb-2 line-clamp-1">
                                                    {event.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-sm text-text-dim">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {event.attendees.length} / {event.capacity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 md:flex-col lg:flex-row">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            leftIcon={<CheckSquare className="w-4 h-4" />}
                                            onClick={() => navigate(`/events/${event.id}/attendance`)}
                                        >
                                            Attendance
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<Download className="w-4 h-4" />}
                                            onClick={() => handleExportEvent(event)}
                                        >
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
