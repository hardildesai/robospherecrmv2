// ============================================
// RoboSphere CRM v2 - Utility Functions
// ============================================

import type { MemberStatus } from './types';

// Date Formatting
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
};

// Status Helpers
export const getStatusColor = (status: MemberStatus): string => {
    switch (status) {
        case 'Active':
            return 'signal-green';
        case 'Probation':
            return 'signal-amber';
        case 'Passive':
            return 'text-dim';
        case 'Dismissed':
            return 'signal-red';
        default:
            return 'text-muted';
    }
};

export const getAttendanceColor = (percent: number, thresholds: { green: number; yellow: number }): string => {
    if (percent >= thresholds.green) return 'signal-green';
    if (percent >= thresholds.yellow) return 'signal-amber';
    return 'signal-red';
};

// String Helpers
export const truncate = (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const initials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Number Helpers
export const percentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

// Array Helpers
export const sortByDate = <T extends { date?: string; timestamp?: string }>(
    arr: T[],
    order: 'asc' | 'desc' = 'desc'
): T[] => {
    return [...arr].sort((a, b) => {
        const dateA = new Date(a.date || a.timestamp || 0).getTime();
        const dateB = new Date(b.date || b.timestamp || 0).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
};

export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
    return arr.reduce((acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};

// Validation Helpers
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
};

// Class Name Helper (similar to clsx)
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

// ============================================
// ID Generation Functions
// ============================================

export const generateMemberId = (): string => {
    // Generates RS-YYYY-XXXX format (e.g., RS-2024-0001)
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    return `RS-${year}-${random.toString().padStart(4, '0')}`;
};

export const generateEventId = (): string => {
    return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateWaitlistId = (): string => {
    return `wl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateReleaseId = (): string => {
    return `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTeamId = (): string => {
    return `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateProjectId = (): string => {
    return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateContributionId = (): string => {
    return `cont-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateInventoryId = (): string => {
    return `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateCheckoutId = (): string => {
    return `chk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateUserId = (): string => {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateApplicationId = (): string => {
    return `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateInterviewId = (): string => {
    return `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateCohortId = (): string => {
    return `cohort-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateWikiId = (): string => {
    return `wiki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generatePollId = (): string => {
    return `poll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generatePollOptionId = (): string => {
    return `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateElectionId = (): string => {
    return `elec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateCandidateId = (): string => {
    return `cand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMachineId = (): string => {
    return `mach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateReservationId = (): string => {
    return `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

