import { useState } from 'react';
import { useStore } from '../lib/store';
import { Search, Plus, MoreHorizontal, Calendar, MessageSquare, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ApplicationStatus, RecruitmentApplication } from '../lib/types';
import { AddApplicationModal } from '../components/recruitment';

// Kanban Column Component with Drop Zone
interface KanbanColumnProps {
    status: ApplicationStatus;
    applications: RecruitmentApplication[];
    color: string;
    onDrop: (appId: string, newStatus: ApplicationStatus) => void;
    onDragStart: (appId: string) => void;
    draggingId: string | null;
}

const KanbanColumn = ({ status, applications, color, onDrop, onDragStart, draggingId }: KanbanColumnProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const appId = e.dataTransfer.getData('text/plain');
        if (appId) {
            onDrop(appId, status);
        }
    };

    return (
        <div
            className={`flex-1 min-w-[300px] flex flex-col gap-4 ${isDragOver ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`flex items-center justify-between p-3 rounded-xl ${color} bg-opacity-10 border border-opacity-20 border-[color:var(--color-border)]`}>
                <h3 className="font-semibold text-sm uppercase tracking-wider">{status}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{applications.length}</span>
            </div>
            <div className="flex flex-col gap-3 h-full overflow-y-auto pb-4 min-h-[200px]">
                {applications.map((app) => (
                    <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: draggingId === app.id ? 0.5 : 1, y: 0 }}
                        draggable
                        onDragStart={(e) => {
                            (e as unknown as React.DragEvent).dataTransfer?.setData('text/plain', app.id);
                            onDragStart(app.id);
                        }}
                        onDragEnd={() => onDragStart('')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-2">
                                <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">{app.name}</h4>
                                    <p className="text-xs text-text-secondary">{app.branch} • Year {app.year}</p>
                                </div>
                            </div>
                            <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {app.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded-md border border-slate-200">
                                    {skill}
                                </span>
                            ))}
                            {app.skills.length > 3 && <span className="text-[10px] text-slate-400">+{app.skills.length - 3}</span>}
                        </div>

                        <div className="flex items-center justify-between text-xs text-text-muted mt-2 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                            {app.status === 'Interview Scheduled' && (
                                <div className="flex items-center gap-1 text-primary">
                                    <MessageSquare className="w-3 h-3" />
                                    Interview
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {applications.length === 0 && (
                    <div className={`h-24 rounded-xl border-2 border-dashed flex items-center justify-center text-slate-300 text-sm ${isDragOver ? 'border-primary bg-primary/5' : 'border-slate-100'}`}>
                        {isDragOver ? 'Drop here' : 'Empty'}
                    </div>
                )}
            </div>
        </div>
    );
};

export const RecruitmentPage = () => {
    const { recruitmentApplications, recruitmentCohorts, updateRecruitmentApplication, addToast } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCohort, setActiveCohort] = useState(recruitmentCohorts[0]?.id || 'all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
        updateRecruitmentApplication(appId, { status: newStatus });
        addToast({ type: 'success', message: `Application moved to ${newStatus}` });
    };

    const filteredApps = recruitmentApplications.filter(app =>
        (activeCohort === 'all' || app.cohort === recruitmentCohorts.find(c => c.id === activeCohort)?.name) &&
        (app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pendingApps = filteredApps.filter(a => a.status === 'Pending');
    const interviewApps = filteredApps.filter(a => a.status === 'Interview Scheduled');
    const acceptedApps = filteredApps.filter(a => a.status === 'Accepted');
    const rejectedApps = filteredApps.filter(a => a.status === 'Rejected');

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Add Application Modal */}
            <AddApplicationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Recruitment Pipeline</h1>
                    <p className="text-text-secondary text-sm">Drag cards to change application status. Click "Add Application" to add manually.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Application
                    </button>
                </div>
            </div>

            {/* Cohort Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {recruitmentCohorts.map(cohort => (
                    <button
                        key={cohort.id}
                        onClick={() => setActiveCohort(cohort.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${activeCohort === cohort.id
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {cohort.name}
                    </button>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1200px] h-full pb-6">
                    <KanbanColumn status="Pending" applications={pendingApps} color="bg-amber-500 text-amber-700" onDrop={handleStatusChange} onDragStart={setDraggingId} draggingId={draggingId} />
                    <KanbanColumn status="Interview Scheduled" applications={interviewApps} color="bg-blue-500 text-blue-700" onDrop={handleStatusChange} onDragStart={setDraggingId} draggingId={draggingId} />
                    <KanbanColumn status="Accepted" applications={acceptedApps} color="bg-emerald-500 text-emerald-700" onDrop={handleStatusChange} onDragStart={setDraggingId} draggingId={draggingId} />
                    <KanbanColumn status="Rejected" applications={rejectedApps} color="bg-red-500 text-red-700" onDrop={handleStatusChange} onDragStart={setDraggingId} draggingId={draggingId} />
                </div>
            </div>
        </div>
    );
};
