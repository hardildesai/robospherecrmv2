// ============================================
// Upcoming Event Card Component
// ============================================

import { Card, Badge, Button } from '../ui';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ClubEvent } from '../../lib/types';
import { formatDate, formatTime } from '../../lib/utils';

interface UpcomingEventProps {
    event: ClubEvent | null;
}

export const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event }) => {
    const navigate = useNavigate();

    if (!event) {
        return (
            <Card className="h-full border border-dashed border-grid">
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-text-dim mx-auto mb-3" />
                    <p className="text-text-muted">No upcoming events</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3"
                        onClick={() => navigate('/events')}
                    >
                        Create Event
                    </Button>
                </div>
            </Card>
        );
    }

    const eventDate = new Date(event.date);
    const isToday = new Date().toDateString() === eventDate.toDateString();
    const isTomorrow =
        new Date(Date.now() + 86400000).toDateString() === eventDate.toDateString();

    return (
        <Card className="h-full border-l-4 border-l-accent-core">
            <div className="flex items-start justify-between mb-4">
                <Badge variant={isToday ? 'success' : isTomorrow ? 'warning' : 'info'} dot pulse={isToday}>
                    {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Upcoming'}
                </Badge>
            </div>

            <h3 className="text-display text-lg font-semibold text-text-primary mb-3">
                {event.title}
            </h3>

            {event.description && (
                <p className="text-sm text-text-muted mb-4 line-clamp-2">
                    {event.description}
                </p>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                    <Calendar className="w-4 h-4 text-accent-core" />
                    <span className="font-mono">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                    <Clock className="w-4 h-4 text-accent-core" />
                    <span className="font-mono">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                    <MapPin className="w-4 h-4 text-accent-core" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                    <Users className="w-4 h-4 text-accent-core" />
                    <span className="font-mono">
                        {event.attendees.length} / {event.capacity} registered
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-grid">
                <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => navigate(`/events`)}
                    className="w-full justify-center"
                >
                    View Event
                </Button>
            </div>
        </Card>
    );
};
