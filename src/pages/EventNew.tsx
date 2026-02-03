// ============================================
// Create New Event Page
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '../components/common';
import { Card, Button, Input, Select } from '../components/ui';
import { useStore } from '../lib/store';
import type { EventType } from '../lib/types';

export const EventNewPage: React.FC = () => {
    const navigate = useNavigate();
    const { addEvent } = useStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Workshop' as EventType,
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        capacity: 50,
    });

    const eventTypes = [
        { value: 'Workshop', label: 'Workshop' },
        { value: 'Meeting', label: 'Meeting' },
        { value: 'Hackathon', label: 'Hackathon' },
        { value: 'Social', label: 'Social' },
        { value: 'Competition', label: 'Competition' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent = {
            id: `evt-${Date.now().toString(36)}`,
            ...formData,
            attendees: [],
        };

        addEvent(newEvent);
        navigate('/events');
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <PageHeader
                icon={Calendar}
                title="Create Event"
                subtitle="Schedule a new club event"
                actions={
                    <Button
                        variant="secondary"
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/events')}
                    >
                        Back to Events
                    </Button>
                }
            />

            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Event Title *
                        </label>
                        <Input
                            placeholder="e.g. Arduino Workshop"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                            placeholder="Describe the event..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Event Type *
                            </label>
                            <Select
                                options={eventTypes}
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Capacity *
                            </label>
                            <Input
                                type="number"
                                placeholder="50"
                                value={formData.capacity}
                                onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Date *
                        </label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Start Time *
                            </label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleChange('startTime', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                End Time *
                            </label>
                            <Input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleChange('endTime', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Location *
                        </label>
                        <Input
                            placeholder="e.g. Lab A, Engineering Block"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                            Create Event
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/events')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
