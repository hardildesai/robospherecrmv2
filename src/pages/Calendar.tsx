import { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { getCalendarDays, getMonthName, isSameDay } from '../lib/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Flag, Plus } from 'lucide-react';
import { Card, Button } from '../components/ui';

type FilterType = 'All' | 'Event' | 'Deadline';

export const CalendarPage = () => {
    const { events, projects } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filter, setFilter] = useState<FilterType>('All');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(year, month + delta, 1));
        setSelectedDate(null);
    };

    const jumpToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    // Combine Data Sources
    const calendarItems = useMemo(() => {
        const items: {
            id: string;
            title: string;
            date: string;
            type: 'Event' | 'Deadline';
            subType?: string; // Workshop, Meeting, etc.
            description?: string;
            meta?: any;
        }[] = [];

        // Add Events
        events.forEach(event => {
            if (filter === 'All' || filter === 'Event') {
                items.push({
                    id: event.id,
                    title: event.title,
                    date: event.date,
                    type: 'Event',
                    subType: event.type,
                    description: event.description || event.location,
                    meta: event
                });
            }
        });

        // Add Project Deadlines
        projects.forEach(project => {
            if (project.deadline && (filter === 'All' || filter === 'Deadline')) {
                items.push({
                    id: project.id,
                    title: `Deadline: ${project.name}`,
                    date: project.deadline,
                    type: 'Deadline',
                    subType: 'Milestone',
                    description: `Project Status: ${project.status}`,
                    meta: project
                });
            }
        });

        return items;
    }, [events, projects, filter]);

    const getItemsForDay = (date: Date) => {
        return calendarItems.filter(item => isSameDay(date, item.date));
    };

    const selectedDayItems = selectedDate ? getItemsForDay(selectedDate) : [];

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                        Master Calendar
                    </h1>
                    <p className="text-text-secondary text-sm">Schedule of events, workshops, and project deadlines.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                        {(['All', 'Event', 'Deadline'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f
                                    ? 'bg-slate-100 text-slate-900 font-bold'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
                {/* Main Calendar Grid */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    {/* Month Nav */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-slate-800 min-w-[150px]">
                                {getMonthName(currentDate)}
                            </h2>
                            <div className="flex gap-1">
                                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                                </button>
                                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <button onClick={jumpToToday} className="text-xs font-medium text-primary hover:underline">
                            Jump to Today
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-6">
                        {calendarDays.map((day, i) => {
                            const dayItems = getItemsForDay(day.date);
                            const isSelected = selectedDate && isSameDay(day.date, selectedDate);

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`
                                        min-h-[80px] p-2 border-r border-b border-slate-50 relative cursor-pointer transition-colors
                                        ${!day.isCurrentMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white text-slate-700'}
                                        ${day.isToday ? 'bg-blue-50/30' : ''}
                                        ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : 'hover:bg-slate-50'}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-xs font-medium ${day.isToday ? 'bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full' : ''}`}>
                                            {day.date.getDate()}
                                        </span>
                                    </div>

                                    <div className="mt-1 flex flex-col gap-1">
                                        {dayItems.slice(0, 3).map((item, idx) => (
                                            <div
                                                key={`${item.id}-${idx}`}
                                                className={`
                                                    h-1.5 rounded-full w-full
                                                    ${item.type === 'Event' ? 'bg-blue-400' : 'bg-red-400'}
                                                `}
                                                title={item.title}
                                            />
                                        ))}
                                        {dayItems.length > 3 && (
                                            <span className="text-[10px] text-slate-400 leading-none">
                                                +{dayItems.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Side Panel: Selected Date Details */}
                <div className="lg:w-80 flex-shrink-0">
                    <Card className="h-full min-h-[400px]">
                        <div className="p-1">
                            {selectedDate ? (
                                <>
                                    <div className="mb-4 pb-4 border-b border-slate-100">
                                        <h3 className="font-bold text-lg text-slate-800">
                                            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <p className="text-xs text-text-secondary mt-1">
                                            {selectedDayItems.length} activities scheduled
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedDayItems.length > 0 ? (
                                            selectedDayItems.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`
                                                        p-3 rounded-lg border-l-4 
                                                        ${item.type === 'Event' ? 'border-primary bg-primary/5' : 'border-danger bg-danger/5'}
                                                    `}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`
                                                            text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                                                            ${item.type === 'Event' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}
                                                        `}>
                                                            {item.subType}
                                                        </span>
                                                        {item.type === 'Event' && (
                                                            <span className="text-xs font-mono text-slate-500">
                                                                {new Date(item.date + 'T' + (item.meta.startTime || '00:00')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-1">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                                                        {item.type === 'Event' ? <MapPin className="w-3 h-3" /> : <Flag className="w-3 h-3" />}
                                                        <span className="truncate max-w-[180px]">{item.description}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-slate-400">
                                                <p>No events scheduled for this day.</p>
                                                <Button size="sm" variant="ghost" className="mt-2 text-primary" onClick={() => window.alert('Navigation to Add Event not implemented yet')}>
                                                    <Plus className="w-3 h-3 mr-1" /> Add Event
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                                    <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                                    <p>Select a date on the calendar to view details.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
