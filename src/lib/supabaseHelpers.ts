// ============================================
// Supabase Helper Functions
// ============================================

import { supabase } from './supabase';
import type { Member, ClubEvent, Team, Project, User } from './types';

// ============================================
// DATA LOADING FUNCTIONS
// ============================================

export const loadMembers = async (): Promise<Member[]> => {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading members:', error);
        return [];
    }

    // Convert snake_case to camelCase
    return (data || []).map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        studentId: member.student_id,
        branch: member.branch,
        year: member.year,
        phone: member.phone,
        joinDate: member.join_date,
        status: member.status,
        attendancePercent: member.attendance_percent,
        feeStatus: member.fee_status,
        avatarUrl: member.avatar_url,
        rank: member.rank,
        skills: member.skills || [],
        socialLinks: member.social_links || {},
        lastAttended: member.last_attended,
    }));
};

export const loadEvents = async (): Promise<ClubEvent[]> => {
    const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

    if (eventsError) {
        console.error('Error loading events:', eventsError);
        return [];
    }

    // Load attendance for each event
    const eventsWithAttendance = await Promise.all(
        (events || []).map(async (event) => {
            const { data: attendance } = await supabase
                .from('event_attendance')
                .select('member_id')
                .eq('event_id', event.id);

            return {
                id: event.id,
                title: event.title,
                description: event.description,
                type: event.type,
                date: event.date,
                startTime: event.start_time,
                endTime: event.end_time,
                location: event.location,
                capacity: event.capacity,
                status: event.status,
                attendees: (attendance || []).map(a => a.member_id),
            };
        })
    );

    return eventsWithAttendance;
};

export const loadUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading users:', error);
        return [];
    }

    return (data || []).map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        password: user.password_hash, // Note: This is the hash, not plain password
        role: user.role,
        isActive: user.is_active,
        failedAccessAttempts: user.failed_access_attempts,
    }));
};

export const loadTeams = async (): Promise<Team[]> => {
    const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

    if (teamsError) {
        console.error('Error loading teams:', teamsError);
        return [];
    }

    // Load team members for each team
    const teamsWithMembers = await Promise.all(
        (teams || []).map(async (team) => {
            const { data: members } = await supabase
                .from('team_members')
                .select('member_id')
                .eq('team_id', team.id);

            return {
                id: team.id,
                name: team.name,
                description: team.description,
                memberIds: (members || []).map(m => m.member_id),
                leadId: team.lead_id,
                createdDate: team.created_date,
            };
        })
    );

    return teamsWithMembers;
};

export const loadProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading projects:', error);
        return [];
    }

    return (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        teamId: project.team_id,
        status: project.status,
        deadline: project.deadline,
        createdDate: project.created_date,
        completedDate: project.completed_date,
    }));
};

// ============================================
// LOAD ALL DATA
// ============================================

export const loadAllData = async () => {
    console.log('Loading all data from Supabase...');

    const [members, events, users, teams, projects] = await Promise.all([
        loadMembers(),
        loadEvents(),
        loadUsers(),
        loadTeams(),
        loadProjects(),
    ]);

    console.log('Data loaded:', {
        members: members.length,
        events: events.length,
        users: users.length,
        teams: teams.length,
        projects: projects.length,
    });

    return {
        members,
        events,
        users,
        teams,
        projects,
    };
};
