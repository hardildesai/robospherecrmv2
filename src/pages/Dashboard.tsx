// ============================================
// Bento OS Dashboard - Optimized Grid Edition
// ============================================

import { Users, UserPlus, Shield, Activity, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import {
    StatusChart,
    ActivityFeed,
    Leaderboard,
} from '../components/dashboard';
import { OverdueAlerts } from '../components/inventory';
import { useStore } from '../lib/store';
import type { MemberStatus } from '../lib/types';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

// Memoized calculation for better performance
const calculateStats = (members: any[], waitlist: any[], releaseProposals: any[]) => {
    return {
        activeMembers: members.filter((m) => m.status === 'Active').length,
        retentionRate: 98, // Static for now, or calc from historical logic
        pendingWaitlist: waitlist.filter((w) => w.status === 'Pending').length,
        pendingReleases: releaseProposals.filter((r) => r.status === 'Pending').length,
        statusData: [
            { name: 'Active' as MemberStatus, value: members.filter((m) => m.status === 'Active').length, color: '#059669' },
            { name: 'Probation' as MemberStatus, value: members.filter((m) => m.status === 'Probation').length, color: '#d97706' },
            { name: 'Passive' as MemberStatus, value: members.filter((m) => m.status === 'Passive').length, color: '#71717a' },
            { name: 'Dismissed' as MemberStatus, value: members.filter((m) => m.status === 'Dismissed').length, color: '#dc2626' },
        ]
    };
};

export const DashboardPage: React.FC = () => {
    const { members, events, waitlist, releaseProposals, auditLogs, currentUser } = useStore();
    const navigate = useNavigate();

    // Use memo to prevent recalculation on every render
    const stats = useMemo(() => calculateStats(members, waitlist, releaseProposals), [members, waitlist, releaseProposals]);

    // Get upcoming event
    const upcomingEvent = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return events
            .filter((e) => e.date >= today)
            .sort((a, b) => a.date.localeCompare(b.date))[0] || null;
    }, [events]);

    const isSuperAdmin = currentUser?.role === 'superadmin';

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const isBasicMember = currentUser?.role === 'member';

    return (
        <div className="space-y-6">

            {/* Header / Welcome Widget */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-light tracking-tight mb-1 text-slate-800">
                        {getTimeGreeting()}, <span className="text-primary font-semibold">{currentUser?.name || 'Operator'}</span>
                    </h1>
                    <p className="text-text-secondary text-sm">System operational. Ready for {isBasicMember ? 'updates' : 'commands'}.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                    </div>
                </div>
            </div>

            {/* BENTO GRID - Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. LARGE STATS CARD (Span 2) - Hidden for basic members */}
                {!isBasicMember ? (
                    <div className="md:col-span-1 lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start h-full flex-col sm:flex-row">
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h2 className="text-4xl font-mono font-medium tracking-tighter mb-1 text-slate-900">{stats.activeMembers}</h2>
                                <p className="text-text-secondary text-sm">Active Members</p>
                            </div>
                            <div className="flex sm:flex-col gap-4 items-end mt-4 sm:mt-0">
                                <div className="text-right">
                                    <p className="text-2xl font-mono font-medium tracking-tighter text-slate-900">{stats.retentionRate}%</p>
                                    <p className="text-text-secondary text-xs">Retention Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // MEMBER VIEW: My Stats
                    <div className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 shadow-sm text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold mb-1">My Participation</h2>
                            <p className="text-indigo-100 text-sm mb-6">Your activity this semester</p>

                            <div className="flex gap-8">
                                <div>
                                    <p className="text-3xl font-mono font-bold tracking-tight">85%</p>
                                    <p className="text-xs text-indigo-200 uppercase tracking-wider">Attendance</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-mono font-bold tracking-tight">Active</p>
                                    <p className="text-xs text-indigo-200 uppercase tracking-wider">Status</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                    </div>
                )}

                {/* 2. QUICK WAITLIST (Span 1) - Only for admins */}
                {!isBasicMember && (
                    <div
                        onClick={() => navigate('/waitlist')}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-amber-200 transition-colors cursor-pointer group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-mono font-medium tracking-tighter mb-1 text-slate-900">{stats.pendingWaitlist}</h2>
                            <p className="text-text-secondary text-sm">Pending Approvals</p>
                        </div>
                    </div>
                )}

                {/* 3. SERVER/ADMIN (Span 1) - Only for admins/superadmins */}
                {!isBasicMember && (
                    <div
                        onClick={() => isSuperAdmin ? navigate('/admin') : null}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-red-200 transition-colors cursor-pointer group"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-mono font-medium tracking-tighter mb-1 text-slate-900">{isSuperAdmin ? stats.pendingReleases : 'Active'}</h2>
                            <p className="text-text-secondary text-sm">{isSuperAdmin ? 'Release Proposals' : 'System Guard'}</p>
                        </div>
                    </div>
                )}

                {/* 4. ACTIVITY FEED (Span 1) */}
                <div className={`md:col-span-1 border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col ${isBasicMember ? 'lg:col-span-2' : 'lg:col-span-1 lg:row-span-2'}`}>
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm text-slate-800">Live Feed</h3>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ActivityFeed logs={auditLogs.slice(0, 5)} />
                    </div>
                </div>

                {/* 5. CHART WIDGET (Span 2) - Only for admins */}
                {!isBasicMember && (
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-slate-800">Membership Distribution</h3>
                        </div>
                        <div className="h-64">
                            <StatusChart data={stats.statusData} />
                        </div>
                    </div>
                )}

                {/* 5.5. OVERDUE ALERTS (Span 1) - Only for admins */}
                {!isBasicMember && (
                    <div className="h-full">
                        <OverdueAlerts variant="widget" />
                    </div>
                )}

                {/* 6. UPCOMING EVENT (Span 1) */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <Calendar className="w-4 h-4" />
                            <h3 className="font-semibold text-sm">Next Operation</h3>
                        </div>
                        {upcomingEvent ? (
                            <div className="mt-2">
                                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{new Date(upcomingEvent.date).toLocaleDateString()}</p>
                                <h4 className="text-lg font-bold leading-tight mb-2 text-slate-900">{upcomingEvent.title}</h4>
                                <div className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-slate-200">
                                    <Zap className="w-3 h-3 text-amber-500" /> {upcomingEvent.type}
                                </div>
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-text-muted text-sm italic">
                                No scheduled ops.
                            </div>
                        )}
                    </div>
                </div>

                {/* 7. LEADERBOARD (Span 2) */}
                <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <Leaderboard members={members} />
                </div>
            </div>
        </div>
    );
};
