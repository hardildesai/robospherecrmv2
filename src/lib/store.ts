// ============================================
// RoboSphere CRM v2 - Zustand Store
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import type {
    Member,
    ClubEvent,
    WaitlistEntry,
    User,
    AuditLog,
    ReleaseProposal,
    StatusThresholds,
    Toast,
    ActionType,
    Team,
    Project,
    Contribution,
    InventoryItem,
    CheckoutRecord,
    RecruitmentApplication,
    Interview,
    RecruitmentCohort,
    WikiArticle,
    ItemCondition,
    Poll,
    Election,
    GlobalSettings,
    LabMachine,
    Reservation,
} from './types';
import { loadAllData } from './supabaseHelpers';

// Utility functions for audit logging
const generateLogId = () => `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const simulateIpAddress = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

// ============ STORE INTERFACE ============
interface AppState {
    // Data
    members: Member[];
    events: ClubEvent[];
    waitlist: WaitlistEntry[];
    users: User[];
    auditLogs: AuditLog[];
    releaseProposals: ReleaseProposal[];
    statusThresholds: StatusThresholds;
    teams: Team[];
    projects: Project[];
    contributions: Contribution[];
    inventory: InventoryItem[];
    checkouts: CheckoutRecord[];
    recruitmentApplications: RecruitmentApplication[];
    interviews: Interview[];
    recruitmentCohorts: RecruitmentCohort[];
    wikiArticles: WikiArticle[];
    polls: Poll[];
    elections: Election[];
    machines: LabMachine[];
    reservations: Reservation[];

    // Auth State
    currentUser: User | null;
    isAuthenticated: boolean;

    // UI State
    toasts: Toast[];
    sidebarCollapsed: boolean;

    // Data Loading
    initializeData: () => Promise<void>;

    // Auth Actions
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;

    // Member Actions
    addMember: (member: Member) => void;
    updateMember: (id: string, updates: Partial<Member>) => void;
    deleteMember: (id: string) => void;
    addSkillToMember: (memberId: string, skill: string) => void;
    removeSkillFromMember: (memberId: string, skill: string) => void;
    getGhostMembers: (inactiveWeeks: number) => Member[];

    // Event Actions
    addEvent: (event: ClubEvent) => void;
    updateEvent: (id: string, updates: Partial<ClubEvent>) => void;
    deleteEvent: (id: string) => void;
    markAttendance: (eventId: string, memberId: string, present: boolean) => void;

    // Waitlist Actions
    addWaitlistEntry: (entry: WaitlistEntry) => void;
    approveWaitlistEntry: (id: string) => void;
    archiveWaitlistEntry: (id: string) => void;

    // Release Actions
    proposeRelease: (proposal: ReleaseProposal) => boolean;
    executeRelease: (id: string) => void;
    rejectRelease: (id: string) => void;

    // User Actions
    addUser: (user: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    toggleUserStatus: (id: string) => void;
    resetUserPassword: (id: string) => void;

    // Settings Actions
    updateStatusThresholds: (thresholds: StatusThresholds) => void;

    // Audit Log Actions
    addAuditLog: (actionType: ActionType, details: string) => void;

    // Toast Actions
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;

    // UI Actions
    toggleSidebar: () => void;

    // Team Actions
    addTeam: (team: Team) => void;
    updateTeam: (id: string, updates: Partial<Team>) => void;
    deleteTeam: (id: string) => void;

    // Project Actions
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;

    // Contribution Actions
    addContribution: (contribution: Contribution) => void;
    deleteContribution: (id: string) => void;

    // Inventory Actions
    addInventoryItem: (item: InventoryItem) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    deleteInventoryItem: (id: string) => void;

    // Checkout Actions
    checkoutItem: (checkout: CheckoutRecord) => boolean | void;
    checkInItem: (checkoutId: string, condition: ItemCondition, notes?: string) => void;
    getOverdueCheckouts: () => CheckoutRecord[];

    // Recruitment Actions
    addRecruitmentApplication: (app: RecruitmentApplication) => void;
    updateRecruitmentApplication: (id: string, updates: Partial<RecruitmentApplication>) => void;
    deleteRecruitmentApplication: (id: string) => void;
    addInterview: (interview: Interview) => void;
    updateInterview: (id: string, updates: Partial<Interview>) => void;
    deleteInterview: (id: string) => void;
    addRecruitmentCohort: (cohort: RecruitmentCohort) => void;
    updateRecruitmentCohort: (id: string, updates: Partial<RecruitmentCohort>) => void;
    deleteRecruitmentCohort: (id: string) => void;

    // Wiki Actions
    addWikiArticle: (article: WikiArticle) => void;
    updateWikiArticle: (id: string, updates: Partial<WikiArticle>) => void;
    deleteWikiArticle: (id: string) => void;

    // Governance Actions
    createPoll: (poll: Poll) => void;
    voteInPoll: (pollId: string, optionId: string, memberId: string) => void;
    closePoll: (id: string) => void;
    deletePoll: (id: string) => void;
    createElection: (election: Election) => void;
    voteInElection: (electionId: string, candidateId: string, memberId: string) => void;
    closeElection: (id: string) => void;
    deleteElection: (id: string) => void;

    // Lab Actions
    addMachine: (machine: LabMachine) => void;
    deleteMachine: (id: string) => void;
    reserveMachine: (reservation: Reservation) => void;
    cancelReservation: (id: string) => void;
    updateMachineStatus: (id: string, status: LabMachine['status']) => void;

    // Global Settings
    settings: GlobalSettings;
    updateSettings: (settings: Partial<GlobalSettings>) => void;
}

// ============ HELPERS ============
const recalculateMemberStats = (
    members: Member[],
    events: ClubEvent[],
    thresholds: StatusThresholds
): Member[] => {
    const today = new Date().toISOString().split('T')[0];
    const validEvents = events.filter((e) =>
        e.status === 'Completed' || (e.status !== 'Cancelled' && e.date <= today)
    );
    const totalEvents = validEvents.length;

    if (totalEvents === 0) return members;

    return members.map((m) => {
        if (m.status === 'Dismissed') return m; // Don't touch dismissed members

        const memberEvents = validEvents.filter((e) => e.attendees.includes(m.id));
        const attendedCount = memberEvents.length;
        const newPercent = totalEvents > 0 ? Math.round((attendedCount / totalEvents) * 100) : 0;

        let newStatus: Member['status'] = m.status;
        if (newPercent >= thresholds.green) newStatus = 'Active';
        else if (newPercent >= thresholds.yellow) newStatus = 'Probation';
        else newStatus = 'Passive';

        const sortedDates = memberEvents.map((e) => e.date).sort().reverse();
        const lastAttended = sortedDates.length > 0 ? sortedDates[0] : m.lastAttended;

        return {
            ...m,
            attendancePercent: newPercent,
            status: newStatus,
            lastAttended,
        };
    });
};

// ============ STORE IMPLEMENTATION ============
export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial Data - Empty for production (will be loaded from Supabase)
            members: [],
            events: [],
            waitlist: [],
            users: [],
            auditLogs: [],
            releaseProposals: [],
            statusThresholds: { green: 85, yellow: 60 },
            teams: [],
            projects: [],
            contributions: [],
            inventory: [],
            checkouts: [],
            recruitmentApplications: [],
            interviews: [],
            recruitmentCohorts: [],
            wikiArticles: [],
            polls: [],
            elections: [],
            machines: [],
            reservations: [],

            // Initial Auth State
            currentUser: null,
            isAuthenticated: false,

            // Initial UI State
            toasts: [],
            sidebarCollapsed: false,

            // ============ DATA LOADING ============
            initializeData: async () => {
                try {
                    console.log('Initializing data from Supabase...');
                    const data = await loadAllData();
                    set({
                        members: data.members,
                        events: data.events,
                        users: data.users,
                        teams: data.teams,
                        projects: data.projects,
                    });
                    console.log('Data initialized successfully');
                } catch (error) {
                    console.error('Failed to initialize data:', error);
                    get().addToast({
                        type: 'error',
                        message: 'Failed to load data from database',
                    });
                }
            },

            // ============ AUTH ACTIONS ============
            login: async (username, password) => {
                // Find user by username
                const user = get().users.find((u) => u.username === username);

                if (!user) {
                    get().addAuditLog('LOGIN_FAILURE', `Failed login attempt for user: ${username}`);
                    return { success: false, message: 'Invalid credentials.' };
                }

                // Verify password using bcrypt
                let passwordMatch = false;
                try {
                    // user.password is the bcrypt hash from database
                    passwordMatch = await bcrypt.compare(password, user.password);
                } catch (error) {
                    console.error('Password comparison error:', error);
                    passwordMatch = false;
                }

                if (!passwordMatch) {
                    get().addAuditLog('LOGIN_FAILURE', `Failed login attempt for user: ${username}`);
                    return { success: false, message: 'Invalid credentials.' };
                }

                if (!user.isActive) {
                    return { success: false, message: 'Account suspended. Contact Super Admin.' };
                }

                set({ currentUser: user, isAuthenticated: true });
                get().addAuditLog('LOGIN_SUCCESS', `${user.name} logged in successfully.`);
                get().addToast({ type: 'success', message: 'Login successful!' });
                return { success: true, message: 'Login successful.' };
            },

            logout: () => {
                const user = get().currentUser;
                set({ currentUser: null, isAuthenticated: false });
                get().addAuditLog('LOGOUT', `${user?.name || 'Unknown user'} logged out`);
            },

            // ============ MEMBER ACTIONS ============
            addMember: (member) => {
                const newUser: User = {
                    id: `usr-${member.id}`,
                    name: member.name,
                    username: member.id, // Username is the Member ID (e.g., RS12345)
                    password: 'robosphere', // Default password
                    role: 'member',
                    isActive: true,
                    failedAccessAttempts: 0,
                };
                set((state) => ({
                    members: [...state.members, member],
                    users: [...state.users, newUser]
                }));
                get().addAuditLog('MEMBER_CREATED', `Created member & user account: ${member.name} (${member.id})`);
            },

            updateMember: (id, updates) => {
                const existingMember = get().members.find(m => m.id === id);

                set((state) => ({
                    members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
                    // Sync name change to User account if name was updated
                    users: updates.name
                        ? state.users.map((u) => (u.username === id ? { ...u, name: updates.name as string } : u))
                        : state.users,
                }));

                // Specific audit log for fee status changes
                if (updates.feeStatus && existingMember && updates.feeStatus !== existingMember.feeStatus) {
                    get().addAuditLog('MEMBER_UPDATED', `Fee status changed for ${existingMember.name}: ${existingMember.feeStatus} → ${updates.feeStatus}`);
                } else {
                    get().addAuditLog('MEMBER_UPDATED', `Updated member: ${id}`);
                }
            },

            deleteMember: (id) => {
                const member = get().members.find((m) => m.id === id);
                set((state) => ({
                    members: state.members.filter((m) => m.id !== id),
                    // Also delete the associated User account
                    users: state.users.filter((u) => u.username !== id),
                    // Remove from all teams
                    teams: state.teams.map((t) => ({
                        ...t,
                        memberIds: t.memberIds.filter((mId) => mId !== id),
                        // If deleted member was lead, clear leadId
                        leadId: t.leadId === id ? '' : t.leadId,
                    })),
                }));
                get().addAuditLog('MEMBER_DELETED', `Deleted member: ${member?.name} (${id})`);
            },

            addSkillToMember: (memberId, skill) => {
                set((state) => ({
                    members: state.members.map((m) =>
                        m.id === memberId && !m.skills.includes(skill)
                            ? { ...m, skills: [...m.skills, skill] }
                            : m
                    ),
                }));
                get().addAuditLog('MEMBER_UPDATED', `Added skill "${skill}" to member: ${memberId}`);
            },

            removeSkillFromMember: (memberId, skill) => {
                set((state) => ({
                    members: state.members.map((m) =>
                        m.id === memberId
                            ? { ...m, skills: m.skills.filter((s) => s !== skill) }
                            : m
                    ),
                }));
                get().addAuditLog('MEMBER_UPDATED', `Removed skill "${skill}" from member: ${memberId}`);
            },

            getGhostMembers: (inactiveWeeks) => {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - inactiveWeeks * 7);
                const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

                return get().members.filter((m) => {
                    if (m.status === 'Dismissed') return false;
                    if (!m.lastAttended) return true; // Never attended
                    return m.lastAttended < cutoffDateStr;
                });
            },

            // ============ EVENT ACTIONS ============
            addEvent: (event) => {
                set((state) => {
                    const events = [...state.events, event];
                    const members = recalculateMemberStats(state.members, events, state.statusThresholds);
                    return { events, members };
                });
                get().addAuditLog('EVENT_CREATED', `Created event: ${event.title}`);
            },

            updateEvent: (id, updates) => {
                set((state) => {
                    const events = state.events.map((e) => (e.id === id ? { ...e, ...updates } : e));
                    const members = recalculateMemberStats(state.members, events, state.statusThresholds);
                    return { events, members };
                });
                get().addAuditLog('EVENT_UPDATED', `Updated event: ${id}`);
            },

            deleteEvent: (id) => {
                const event = get().events.find((e) => e.id === id);
                set((state) => {
                    const events = state.events.filter((e) => e.id !== id);
                    const members = recalculateMemberStats(state.members, events, state.statusThresholds);
                    return { events, members };
                });
                get().addAuditLog('EVENT_DELETED', `Deleted event: ${event?.title}`);
            },

            markAttendance: (eventId, memberId, present) => {
                set((state) => {
                    // Update event attendees
                    const updatedEvents = state.events.map((e) => {
                        if (e.id !== eventId) return e;
                        const attendees = present
                            ? [...new Set([...e.attendees, memberId])]
                            : e.attendees.filter((id) => id !== memberId);
                        return { ...e, attendees };
                    });

                    // Recalculate stats for all members (since total events might depend on this event)
                    const updatedMembers = recalculateMemberStats(state.members, updatedEvents, state.statusThresholds);

                    return { events: updatedEvents, members: updatedMembers };
                });
                get().addAuditLog('ATTENDANCE_MARKED', `Marked ${present ? 'present' : 'absent'} for member ${memberId} at event ${eventId}`);
            },

            // ============ WAITLIST ACTIONS ============
            addWaitlistEntry: (entry) => {
                set((state) => ({ waitlist: [...state.waitlist, entry] }));
                get().addAuditLog('WAITLIST_CREATED', `Added waitlist entry: ${entry.name} (${entry.email})`);
            },

            approveWaitlistEntry: (id) => {
                set((state) => ({
                    waitlist: state.waitlist.map((w) =>
                        w.id === id ? { ...w, status: 'Accepted' as const } : w
                    ),
                }));
                get().addAuditLog('WAITLIST_APPROVED', `Approved waitlist entry: ${id}`);
            },

            archiveWaitlistEntry: (id) => {
                set((state) => ({
                    waitlist: state.waitlist.map((w) =>
                        w.id === id ? { ...w, status: 'Archived' as const } : w
                    ),
                }));
                get().addAuditLog('WAITLIST_ARCHIVED', `Archived waitlist entry: ${id}`);
            },

            // ============ RELEASE ACTIONS ============
            proposeRelease: (proposal) => {
                // Validation: Check if member is already dismissed
                const member = get().members.find(m => m.id === proposal.memberId);
                if (!member) {
                    get().addToast({ type: 'error', message: 'Member not found' });
                    return false;
                }
                if (member.status === 'Dismissed') {
                    get().addToast({ type: 'error', message: 'Member is already dismissed' });
                    return false;
                }

                // Validation: Check if a pending proposal already exists for this member
                const existingProposal = get().releaseProposals.find(
                    p => p.memberId === proposal.memberId && p.status === 'Pending'
                );
                if (existingProposal) {
                    get().addToast({ type: 'error', message: 'A pending release proposal already exists for this member' });
                    return false;
                }

                set((state) => ({ releaseProposals: [...state.releaseProposals, proposal] }));
                get().addAuditLog('RELEASE_PROPOSED', `Proposed release for member: ${proposal.memberId}`);
                get().addToast({ type: 'success', message: 'Release proposal submitted' });
                return true;
            },

            executeRelease: (id) => {
                const user = get().currentUser;
                const proposal = get().releaseProposals.find((p) => p.id === id);

                set((state) => ({
                    releaseProposals: state.releaseProposals.map((p) =>
                        p.id === id
                            ? {
                                ...p,
                                status: 'Executed' as const,
                                executedBy: user?.id,
                                executedDate: new Date().toISOString().split('T')[0],
                            }
                            : p
                    ),
                    members: state.members.map((m) =>
                        m.id === proposal?.memberId ? { ...m, status: 'Dismissed' as const } : m
                    ),
                }));
                get().addAuditLog('RELEASE_EXECUTED', `Executed release for member: ${proposal?.memberId}`);
            },

            rejectRelease: (id) => {
                set((state) => ({
                    releaseProposals: state.releaseProposals.map((p) =>
                        p.id === id ? { ...p, status: 'Rejected' as const } : p
                    ),
                }));
                get().addAuditLog('RELEASE_REJECTED', `Rejected release proposal: ${id}`);
            },

            // ============ USER ACTIONS ============
            addUser: (user) => {
                set((state) => ({ users: [...state.users, user] }));
                get().addAuditLog('USER_CREATED', `Created user: ${user.username} (${user.role})`);
            },

            updateUser: (id, updates) => {
                set((state) => ({
                    users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
                }));
                get().addAuditLog('USER_UPDATED', `Updated user: ${id}`);
            },

            toggleUserStatus: (id) => {
                const user = get().users.find((u) => u.id === id);
                if (user) {
                    const newStatus = !user.isActive;
                    get().updateUser(id, { isActive: newStatus });
                    get().addAuditLog(
                        'USER_SUSPENDED',
                        `${newStatus ? 'Reactivated' : 'Suspended'} user: ${user.username}`
                    );
                }
            },

            resetUserPassword: (id) => {
                const user = get().users.find((u) => u.id === id);
                if (user) {
                    get().updateUser(id, { password: 'password' }); // Reset to default
                    get().addAuditLog('USER_UPDATED', `Reset password for user: ${user.username}`);
                }
            },
            // ============ SETTINGS ACTIONS ============
            updateStatusThresholds: (thresholds) => {
                // Validation
                if (thresholds.green < 0 || thresholds.green > 100) {
                    get().addToast({ type: 'error', message: 'Green threshold must be between 0 and 100' });
                    return;
                }
                if (thresholds.yellow < 0 || thresholds.yellow > 100) {
                    get().addToast({ type: 'error', message: 'Yellow threshold must be between 0 and 100' });
                    return;
                }
                if (thresholds.yellow >= thresholds.green) {
                    get().addToast({ type: 'error', message: 'Yellow threshold must be less than green threshold' });
                    return;
                }

                const oldThresholds = get().statusThresholds;
                set((state) => {
                    const members = recalculateMemberStats(state.members, state.events, thresholds);
                    return { statusThresholds: thresholds, members };
                });
                get().addAuditLog('THRESHOLD_UPDATED', `Updated status thresholds: green ${oldThresholds.green}%→${thresholds.green}%, yellow ${oldThresholds.yellow}%→${thresholds.yellow}%`);
                get().addToast({ type: 'success', message: 'Status thresholds updated successfully' });
            },

            // ============ AUDIT LOG ACTIONS ============
            addAuditLog: (actionType, details) => {
                const user = get().currentUser;
                const log: AuditLog = {
                    id: generateLogId(),
                    timestamp: new Date().toISOString(),
                    actionType,
                    userId: user?.id || 'system',
                    details,
                    ipAddress: simulateIpAddress(),
                };
                set((state) => ({ auditLogs: [log, ...state.auditLogs] }));
            },

            // ============ TOAST ACTIONS ============
            addToast: (toast) => {
                const id = `toast-${Date.now()}`;
                set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
                setTimeout(() => get().removeToast(id), toast.duration || 4000);
            },

            removeToast: (id) => {
                set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
            },

            // ============ UI ACTIONS ============
            toggleSidebar: () => {
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
            },

            // ============ TEAM ACTIONS ============
            addTeam: (team) => {
                // Validation
                if (!team.name || team.name.trim() === '') {
                    get().addToast({ type: 'error', message: 'Team name is required' });
                    return;
                }
                if (get().teams.some(t => t.name.toLowerCase() === team.name.toLowerCase())) {
                    get().addToast({ type: 'error', message: 'A team with this name already exists' });
                    return;
                }

                set((state) => ({ teams: [...state.teams, team] }));
                get().addAuditLog('TEAM_CREATED', `Created team: ${team.name}`);
                get().addToast({ type: 'success', message: `Team "${team.name}" created successfully` });
            },

            updateTeam: (id, updates) => {
                const existingTeam = get().teams.find(t => t.id === id);
                if (!existingTeam) {
                    get().addToast({ type: 'error', message: 'Team not found' });
                    return;
                }

                // Validation
                if (updates.name !== undefined && (!updates.name || updates.name.trim() === '')) {
                    get().addToast({ type: 'error', message: 'Team name cannot be empty' });
                    return;
                }

                set((state) => ({
                    teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                }));

                // Enhanced audit log
                const changes = Object.keys(updates).map(key => `${key}: ${existingTeam[key as keyof Team]} → ${updates[key as keyof typeof updates]}`).join(', ');
                get().addAuditLog('TEAM_UPDATED', `Updated team "${existingTeam.name}": ${changes}`);
                get().addToast({ type: 'success', message: 'Team updated successfully' });
            },

            deleteTeam: (id) => {
                const team = get().teams.find((t) => t.id === id);
                if (!team) {
                    get().addToast({ type: 'error', message: 'Team not found' });
                    return;
                }

                set((state) => ({
                    teams: state.teams.filter((t) => t.id !== id),
                    // Clear teamId from projects that reference this team
                    projects: state.projects.map((p) =>
                        p.teamId === id ? { ...p, teamId: '' } : p
                    ),
                }));
                get().addAuditLog('TEAM_DELETED', `Deleted team: ${team?.name}`);
                get().addToast({ type: 'success', message: `Team "${team.name}" deleted` });
            },

            // ============ PROJECT ACTIONS ============
            addProject: (project) => {
                // Validation
                if (!project.name || project.name.trim() === '') {
                    get().addToast({ type: 'error', message: 'Project name is required' });
                    return;
                }
                if (!project.description || project.description.trim() === '') {
                    get().addToast({ type: 'error', message: 'Project description is required' });
                    return;
                }

                set((state) => ({ projects: [...state.projects, project] }));
                get().addAuditLog('PROJECT_CREATED', `Created project: ${project.name}`);
                get().addToast({ type: 'success', message: `Project "${project.name}" created successfully` });
            },

            updateProject: (id, updates) => {
                const existingProject = get().projects.find(p => p.id === id);
                if (!existingProject) {
                    get().addToast({ type: 'error', message: 'Project not found' });
                    return;
                }

                set((state) => ({
                    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                }));

                // Enhanced audit log
                const changes = Object.keys(updates).map(key => `${key}: ${existingProject[key as keyof Project]} → ${updates[key as keyof typeof updates]}`).join(', ');
                get().addAuditLog('PROJECT_UPDATED', `Updated project "${existingProject.name}": ${changes}`);
                get().addToast({ type: 'success', message: 'Project updated successfully' });
            },

            deleteProject: (id) => {
                const project = get().projects.find((p) => p.id === id);
                if (!project) {
                    get().addToast({ type: 'error', message: 'Project not found' });
                    return;
                }

                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== id),
                    // Delete all contributions for this project
                    contributions: state.contributions.filter((c) => c.projectId !== id),
                }));
                get().addAuditLog('PROJECT_DELETED', `Deleted project: ${project?.name}`);
                get().addToast({ type: 'success', message: `Project "${project.name}" deleted` });
            },

            // ============ CONTRIBUTION ACTIONS ============
            addContribution: (contribution) => {
                set((state) => ({ contributions: [...state.contributions, contribution] }));
                get().addAuditLog('CONTRIBUTION_CREATED', `Logged ${contribution.hours}h contribution for project: ${contribution.projectId}`);
            },

            deleteContribution: (id) => {
                set((state) => ({ contributions: state.contributions.filter((c) => c.id !== id) }));
                get().addAuditLog('CONTRIBUTION_DELETED', `Deleted contribution: ${id}`);
            },

            // ============ INVENTORY ACTIONS ============
            addInventoryItem: (item) => {
                // Validation
                if (!item.name || item.name.trim() === '') {
                    get().addToast({ type: 'error', message: 'Item name is required' });
                    return;
                }
                if (item.quantity < 0) {
                    get().addToast({ type: 'error', message: 'Quantity cannot be negative' });
                    return;
                }
                if (item.available < 0 || item.available > item.quantity) {
                    get().addToast({ type: 'error', message: 'Available quantity must be between 0 and total quantity' });
                    return;
                }

                set((state) => ({ inventory: [...state.inventory, item] }));
                get().addAuditLog('INVENTORY_CREATED', `Added inventory item: ${item.name}`);
                get().addToast({ type: 'success', message: `Item "${item.name}" added to inventory` });
            },

            updateInventoryItem: (id, updates) => {
                set((state) => ({
                    inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i)),
                }));
                get().addAuditLog('INVENTORY_UPDATED', `Updated inventory item: ${id}`);
            },

            deleteInventoryItem: (id) => {
                const item = get().inventory.find((i) => i.id === id);
                if (!item) {
                    get().addToast({ type: 'error', message: 'Item not found' });
                    return;
                }

                // Check for active checkouts
                const activeCheckouts = get().checkouts.filter(c => c.itemId === id && !c.returnDate);
                if (activeCheckouts.length > 0) {
                    get().addToast({ type: 'warning', message: `Item has ${activeCheckouts.length} active checkout(s). They will be marked as returned.` });
                }

                set((state) => ({
                    inventory: state.inventory.filter((i) => i.id !== id),
                    // Mark all active checkouts for this item as returned
                    checkouts: state.checkouts.map((c) =>
                        c.itemId === id && !c.returnDate
                            ? { ...c, returnDate: new Date().toISOString(), notes: (c.notes || '') + ' [Item deleted]' }
                            : c
                    ),
                }));
                get().addAuditLog('INVENTORY_DELETED', `Deleted inventory item: ${item?.name}`);
                get().addToast({ type: 'success', message: `Item "${item.name}" deleted` });
            },

            // ============ CHECKOUT ACTIONS ============
            checkoutItem: (checkout) => {
                // Validate: Check if requested quantity is available
                const item = get().inventory.find((i) => i.id === checkout.itemId);
                if (!item) {
                    get().addToast({ type: 'error', message: 'Item not found' });
                    return false;
                }
                if (checkout.quantity > item.available) {
                    get().addToast({ type: 'error', message: `Cannot checkout ${checkout.quantity} items. Only ${item.available} available.` });
                    return false;
                }
                if (checkout.quantity <= 0) {
                    get().addToast({ type: 'error', message: 'Quantity must be at least 1' });
                    return false;
                }

                // Add checkout record
                set((state) => ({ checkouts: [...state.checkouts, checkout] }));

                // Update item availability
                get().updateInventoryItem(checkout.itemId, {
                    available: item.available - checkout.quantity,
                });

                get().addAuditLog('INVENTORY_CHECKOUT', `Checked out ${checkout.quantity}x item ${checkout.itemId} to member ${checkout.memberId}`);
            },

            checkInItem: (checkoutId, condition, notes) => {
                const checkout = get().checkouts.find((c) => c.id === checkoutId);
                if (!checkout || checkout.returnDate) return;

                // Mark as returned
                set((state) => ({
                    checkouts: state.checkouts.map((c) =>
                        c.id === checkoutId
                            ? {
                                ...c,
                                returnDate: new Date().toISOString(),
                                conditionOnReturn: condition,
                                notes: notes ? (c.notes ? c.notes + ' | ' + notes : notes) : c.notes,
                            }
                            : c
                    ),
                }));

                // Update item availability
                const item = get().inventory.find((i) => i.id === checkout.itemId);
                if (item) {
                    get().updateInventoryItem(checkout.itemId, {
                        available: item.available + checkout.quantity,
                        condition: condition, // Update item condition on return
                    });
                }

                get().addAuditLog('INVENTORY_CHECKIN', `Checked in item ${checkout.itemId} from member ${checkout.memberId}`);
            },

            getOverdueCheckouts: () => {
                const today = new Date().toISOString().split('T')[0];
                return get().checkouts.filter((c) => {
                    if (c.returnDate) return false; // Already returned
                    if (!c.dueDate) return false; // No due date set
                    return c.dueDate < today; // Overdue
                });
            },

            // ============ RECRUITMENT ACTIONS ============
            addRecruitmentApplication: (app) => {
                set((state) => ({ recruitmentApplications: [...state.recruitmentApplications, app] }));
                get().addAuditLog('RECRUITMENT_APPLICATION_CREATED', `New recruitment application: ${app.name} (${app.email})`);
            },
            updateRecruitmentApplication: (id, updates) => {
                set((state) => ({
                    recruitmentApplications: state.recruitmentApplications.map(a => a.id === id ? { ...a, ...updates } : a)
                }));
                get().addAuditLog('RECRUITMENT_APPLICATION_UPDATED', `Updated recruitment application: ${id}`);
            },

            // ============ WIKI ACTIONS ============
            addWikiArticle: (article) => {
                // Validation
                if (!article.title || article.title.trim() === '') {
                    get().addToast({ type: 'error', message: 'Article title is required' });
                    return;
                }
                if (!article.content || article.content.trim() === '') {
                    get().addToast({ type: 'error', message: 'Article content is required' });
                    return;
                }

                set((state) => ({ wikiArticles: [...state.wikiArticles, article] }));
                get().addAuditLog('WIKI_CREATED', `Created wiki article: ${article.title}`);
                get().addToast({ type: 'success', message: `Article "${article.title}" created successfully` });
            },
            updateWikiArticle: (id, updates) => {
                const existingArticle = get().wikiArticles.find(a => a.id === id);
                if (!existingArticle) {
                    get().addToast({ type: 'error', message: 'Article not found' });
                    return;
                }

                set((state) => ({
                    wikiArticles: state.wikiArticles.map(a => a.id === id ? { ...a, ...updates } : a)
                }));
                get().addAuditLog('WIKI_UPDATED', `Updated wiki article: ${existingArticle.title}`);
                get().addToast({ type: 'success', message: 'Article updated successfully' });
            },

            // ============ GOVERNANCE ACTIONS ============
            createPoll: (poll) => {
                // Validation
                if (!poll.question || poll.question.trim() === '') {
                    get().addToast({ type: 'error', message: 'Poll question is required' });
                    return;
                }
                if (!poll.options || poll.options.length < 2) {
                    get().addToast({ type: 'error', message: 'Poll must have at least 2 options' });
                    return;
                }

                set((state) => ({ polls: [poll, ...state.polls] }));
                get().addAuditLog('POLL_CREATED', `Created new poll: ${poll.question}`);
                get().addToast({ type: 'success', message: 'Poll created successfully' });
            },

            createElection: (election) => {
                // Validation
                if (!election.title || election.title.trim() === '') {
                    get().addToast({ type: 'error', message: 'Election title is required' });
                    return;
                }
                if (!election.position || election.position.trim() === '') {
                    get().addToast({ type: 'error', message: 'Position is required' });
                    return;
                }
                if (!election.candidates || election.candidates.length < 2) {
                    get().addToast({ type: 'error', message: 'Election must have at least 2 candidates' });
                    return;
                }

                set((state) => ({ elections: [election, ...state.elections] }));
                get().addAuditLog('ELECTION_CREATED', `Created new election: ${election.title} for ${election.position}`);
                get().addToast({ type: 'success', message: `Election for ${election.position} created successfully` });
            },

            voteInPoll: (pollId, optionId, memberId) => {
                const poll = get().polls.find(p => p.id === pollId);
                if (!poll) {
                    get().addToast({ type: 'error', message: 'Poll not found' });
                    return;
                }
                if (poll.status === 'Closed') {
                    get().addToast({ type: 'error', message: 'This poll is closed' });
                    return;
                }
                if (poll.votedMemberIds.includes(memberId)) {
                    get().addToast({ type: 'error', message: 'You have already voted in this poll' });
                    return;
                }

                set((state) => ({
                    polls: state.polls.map(p => {
                        if (p.id !== pollId) return p;
                        return {
                            ...p,
                            votedMemberIds: [...p.votedMemberIds, memberId],
                            options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
                        };
                    })
                }));
                get().addAuditLog('POLL_VOTED', `Member ${memberId} voted in poll ${pollId}`);
                get().addToast({ type: 'success', message: 'Vote recorded successfully' });
            },

            voteInElection: (electionId, candidateId, memberId) => {
                const election = get().elections.find(e => e.id === electionId);
                if (!election) {
                    get().addToast({ type: 'error', message: 'Election not found' });
                    return;
                }
                if (election.status === 'Closed') {
                    get().addToast({ type: 'error', message: 'This election is closed' });
                    return;
                }
                if (election.votedMemberIds.includes(memberId)) {
                    get().addToast({ type: 'error', message: 'You have already voted in this election' });
                    return;
                }

                set((state) => ({
                    elections: state.elections.map(e => {
                        if (e.id !== electionId) return e;
                        return {
                            ...e,
                            votedMemberIds: [...e.votedMemberIds, memberId],
                            candidates: e.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
                        };
                    })
                }));
                get().addAuditLog('ELECTION_VOTED', `Member ${memberId} voted in election ${electionId}`);
                get().addToast({ type: 'success', message: 'Vote recorded successfully' });
            },

            closePoll: (id) => {
                set((state) => ({
                    polls: state.polls.map(p => p.id === id ? { ...p, status: 'Closed' as const } : p)
                }));
                get().addAuditLog('POLL_CLOSED', `Closed poll: ${id}`);
            },

            deletePoll: (id) => {
                set((state) => ({
                    polls: state.polls.filter(p => p.id !== id)
                }));
                get().addAuditLog('POLL_DELETED', `Deleted poll: ${id}`);
            },

            closeElection: (id) => {
                set((state) => ({
                    elections: state.elections.map(e => e.id === id ? { ...e, status: 'Closed' as const } : e)
                }));
                get().addAuditLog('ELECTION_CLOSED', `Closed election: ${id}`);
            },

            deleteElection: (id) => {
                set((state) => ({
                    elections: state.elections.filter(e => e.id !== id)
                }));
                get().addAuditLog('ELECTION_DELETED', `Deleted election: ${id}`);
            },

            deleteWikiArticle: (id) => {
                const article = get().wikiArticles.find(a => a.id === id);
                set((state) => ({
                    wikiArticles: state.wikiArticles.filter(a => a.id !== id)
                }));
                get().addAuditLog('WIKI_DELETED', `Deleted wiki article: ${article?.title} (${id})`);
            },

            deleteRecruitmentApplication: (id) => {
                set((state) => ({
                    recruitmentApplications: state.recruitmentApplications.filter(a => a.id !== id),
                    // Delete associated interviews
                    interviews: state.interviews.filter(i => i.applicationId !== id),
                }));
                get().addAuditLog('RECRUITMENT_APPLICATION_DELETED', `Deleted recruitment application: ${id}`);
            },

            addInterview: (interview) => {
                set((state) => ({ interviews: [...state.interviews, interview] }));
                get().addAuditLog('RECRUITMENT_APPLICATION_UPDATED', `Scheduled interview for application: ${interview.applicationId}`);
            },

            updateInterview: (id, updates) => {
                set((state) => ({
                    interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i)
                }));
                get().addAuditLog('RECRUITMENT_APPLICATION_UPDATED', `Updated interview: ${id}`);
            },

            deleteInterview: (id) => {
                set((state) => ({ interviews: state.interviews.filter(i => i.id !== id) }));
                get().addAuditLog('RECRUITMENT_APPLICATION_UPDATED', `Deleted interview: ${id}`);
            },

            addRecruitmentCohort: (cohort) => {
                set((state) => ({ recruitmentCohorts: [...state.recruitmentCohorts, cohort] }));
                get().addAuditLog('RECRUITMENT_APPLICATION_CREATED', `Created recruitment cohort: ${cohort.name}`);
            },

            updateRecruitmentCohort: (id, updates) => {
                set((state) => ({
                    recruitmentCohorts: state.recruitmentCohorts.map(c => c.id === id ? { ...c, ...updates } : c)
                }));
                get().addAuditLog('RECRUITMENT_APPLICATION_UPDATED', `Updated recruitment cohort: ${id}`);
            },

            deleteRecruitmentCohort: (id) => {
                set((state) => ({ recruitmentCohorts: state.recruitmentCohorts.filter(c => c.id !== id) }));
                get().addAuditLog('RECRUITMENT_APPLICATION_DELETED', `Deleted recruitment cohort: ${id}`);
            },

            // ============ LAB ACTIONS ============
            addMachine: (machine) => {
                // Validation
                if (!machine.name || machine.name.trim() === '') {
                    get().addToast({ type: 'error', message: 'Machine name is required' });
                    return;
                }

                set((state) => ({ machines: [...state.machines, machine] }));
                get().addAuditLog('LAB_MACHINE_CREATED', `Added new machine: ${machine.name}`);
                get().addToast({ type: 'success', message: `Machine "${machine.name}" added successfully` });
            },

            deleteMachine: (id) => {
                const machine = get().machines.find((m) => m.id === id);
                set((state) => ({
                    machines: state.machines.filter((m) => m.id !== id),
                    // Cancel all reservations for this machine
                    reservations: state.reservations.map((r) =>
                        r.machineId === id && r.status !== 'Cancelled' && r.status !== 'Completed'
                            ? { ...r, status: 'Cancelled' as const }
                            : r
                    ),
                }));
                get().addAuditLog('LAB_MACHINE_CREATED', `Deleted machine: ${machine?.name}`);
            },

            reserveMachine: (reservation) => {
                set((state) => ({ reservations: [...state.reservations, reservation] }));
                get().addAuditLog('LAB_RESERVATION_CREATED', `Reserved machine ${reservation.machineId} for member ${reservation.memberId}`);
            },

            cancelReservation: (id) => {
                set((state) => ({
                    reservations: state.reservations.map((r) =>
                        r.id === id ? { ...r, status: 'Cancelled' as const } : r
                    ),
                }));
                get().addAuditLog('LAB_RESERVATION_CANCELLED', `Cancelled reservation ${id}`);
            },

            updateMachineStatus: (id, status) => {
                set((state) => ({
                    machines: state.machines.map((m) =>
                        m.id === id ? { ...m, status } : m
                    ),
                }));
                // No audit log for status updates to avoid spam from "live" sensors
            },

            // ============ GLOBAL SETTINGS ============
            settings: {
                recruitmentOpen: true,
                maintenanceMode: false,
                defaultPassword: 'robosphere',
                allowMemberSignups: false
            },

            updateSettings: (newSettings) => {
                set((state) => ({ settings: { ...state.settings, ...newSettings } }));
                get().addAuditLog('SETTINGS_UPDATED', `Updated global settings: ${Object.keys(newSettings).join(', ')}`);
            }
        }),
        {
            name: 'robosphere-crm-storage',
            version: 2, // Increment this to force clear old localStorage
            // ONLY persist auth state and UI preferences
            // NEVER persist data - always load fresh from Supabase
            partialize: (state) => ({
                currentUser: state.currentUser,
                isAuthenticated: state.isAuthenticated,
                sidebarCollapsed: state.sidebarCollapsed,
                statusThresholds: state.statusThresholds,
            }),
        }
    )
);

// ============ SELECTORS ============
export const useAuth = () => {
    const { currentUser, isAuthenticated, login, logout } = useStore();
    return { currentUser, isAuthenticated, login, logout };
};

export const useMembers = () => {
    const { members, addMember, updateMember, deleteMember } = useStore();
    return { members, addMember, updateMember, deleteMember };
};

export const useEvents = () => {
    const { events, addEvent, updateEvent, deleteEvent, markAttendance } = useStore();
    return { events, addEvent, updateEvent, deleteEvent, markAttendance };
};

export const useToasts = () => {
    const { toasts, addToast, removeToast } = useStore();
    return { toasts, addToast, removeToast };
};

export const useLab = () => {
    const { machines, reservations, addMachine, reserveMachine, cancelReservation, updateMachineStatus } = useStore();
    return { machines, reservations, addMachine, reserveMachine, cancelReservation, updateMachineStatus };
};
