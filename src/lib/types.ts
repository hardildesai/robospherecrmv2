// ============================================
// RoboSphere CRM v2 - Type Definitions
// ============================================

// Member Types
export type MemberStatus = 'Active' | 'Probation' | 'Passive' | 'Dismissed';
export type MemberRank = 'Member' | 'Lead' | 'Mentor' | 'Alumni';
export type FeeStatus = 'Paid' | 'Pending' | 'Forfeited';
export type Branch = 'Mechanical' | 'Electrical' | 'CS' | 'Civil' | 'Other';

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    studentId: string;
    branch: Branch;
    year: 1 | 2 | 3 | 4;
    phone?: string;
    joinDate: string;
    status: MemberStatus;
    attendancePercent: number;
    feeStatus: FeeStatus;
    avatarUrl?: string;
    // New Fields
    rank: MemberRank;
    skills: string[];
    socialLinks?: SocialLinks;
    lastAttended?: string; // ISO Date
}

// Event Types
export type EventType = 'Workshop' | 'Meeting' | 'Hackathon' | 'Social' | 'Competition';

export interface AttendanceRecord {
    memberId: string;
    timestamp: string; // Time of check-in
    method: 'manual' | 'qr' | 'kiosk';
}

export interface ClubEvent {
    id: string;
    title: string;
    description?: string;
    type: EventType;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    capacity: number;
    attendees: string[]; // Keeping string[] for backward compatibility, but we should migrate to AttendanceRecord logic in store
    attendanceRecords?: AttendanceRecord[]; // New granular tracking
    status?: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Waitlist Types
export type WaitlistStatus = 'Pending' | 'Accepted' | 'Archived';

export interface WaitlistEntry {
    id: string;
    name: string;
    email: string;
    studentId: string;
    appliedDate: string;
    status: WaitlistStatus;
}

// Team & Project Types
export interface Team {
    id: string;
    name: string;
    description: string;
    memberIds: string[]; // Array of Member IDs
    leadId: string; // Member ID of team lead
    createdDate: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'Complete' | 'On Hold';

export interface Project {
    id: string;
    name: string;
    description: string;
    teamId: string;
    status: ProjectStatus;
    deadline?: string;
    createdDate: string;
    completedDate?: string;
}

export interface Contribution {
    id: string;
    projectId: string;
    memberId: string;
    hours: number;
    description: string;
    date: string;
}

// Inventory & Resource Types
export type ItemCategory = 'Tool' | 'Kit' | 'Component' | 'Equipment' | 'Other';
export type ItemCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs Repair';

export interface InventoryItem {
    id: string;
    name: string;
    category: ItemCategory;
    description?: string;
    quantity: number;
    available: number; // quantity - checked out
    condition: ItemCondition;
    location?: string;
    purchaseDate?: string;
    cost?: number;
}

export interface CheckoutRecord {
    id: string;
    itemId: string;
    memberId: string;
    quantity: number;
    checkoutDate: string;
    dueDate?: string;
    returnDate?: string;
    conditionOnReturn?: ItemCondition;
    notes?: string;
}

// Recruitment Pipeline Types
export type ApplicationStatus = 'Pending' | 'Interview Scheduled' | 'Accepted' | 'Rejected';

export interface RecruitmentApplication {
    id: string;
    name: string;
    email: string;
    studentId: string;
    branch: Branch;
    year: 1 | 2 | 3 | 4;
    phone?: string;
    whyJoin: string;
    skills: string[];
    experience?: string;
    appliedDate: string;
    status: ApplicationStatus;
    cohort?: string; // e.g., "Fall 2024"
}

export interface Interview {
    id: string;
    applicationId: string;
    interviewerId: string; // Member ID
    scheduledDate: string;
    scheduledTime: string;
    score?: number; // 1-10
    notes?: string;
    completed: boolean;
}

export interface RecruitmentCohort {
    id: string;
    name: string; // e.g., "Fall 2024", "Spring 2025"
    startDate: string;
    applicationCount: number;
    acceptedCount: number;
}

// Knowledge Base Types
export type ArticleCategory = 'Tutorial' | 'Post-Mortem' | 'Resource' | 'Guide';

export interface WikiArticle {
    id: string;
    title: string;
    category: ArticleCategory;
    content: string;
    author: string; // Member ID
    createdDate: string;
    lastModified: string;
    tags: string[];
    views: number;
}

// User & Auth Types
export type UserRole = 'admin' | 'superadmin' | 'member';

export interface User {
    id: string;
    name: string;
    username: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    failedAccessAttempts: number;
}

// Audit Log Types
export type ActionType =
    | 'MEMBER_CREATED'
    | 'MEMBER_UPDATED'
    | 'MEMBER_DELETED'
    | 'EVENT_CREATED'
    | 'EVENT_UPDATED'
    | 'EVENT_DELETED'
    | 'ATTENDANCE_MARKED'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'LOGOUT'
    | 'UNAUTHORIZED_ACCESS'
    | 'RELEASE_PROPOSED'
    | 'RELEASE_EXECUTED'
    | 'RELEASE_REJECTED'
    | 'WAITLIST_CREATED'
    | 'WAITLIST_APPROVED'
    | 'WAITLIST_ARCHIVED'
    | 'USER_CREATED'
    | 'USER_UPDATED'
    | 'USER_SUSPENDED'
    | 'TEAM_CREATED'
    | 'TEAM_UPDATED'
    | 'TEAM_DELETED'
    | 'PROJECT_CREATED'
    | 'PROJECT_UPDATED'
    | 'PROJECT_DELETED'
    | 'CONTRIBUTION_CREATED'
    | 'CONTRIBUTION_DELETED'
    | 'INVENTORY_CREATED'
    | 'INVENTORY_UPDATED'
    | 'INVENTORY_DELETED'
    | 'INVENTORY_CHECKOUT'
    | 'INVENTORY_CHECKIN'
    | 'RECRUITMENT_APPLICATION_CREATED'
    | 'RECRUITMENT_APPLICATION_UPDATED'
    | 'RECRUITMENT_APPLICATION_DELETED'
    | 'WIKI_CREATED'
    | 'WIKI_UPDATED'
    | 'WIKI_DELETED'
    | 'POLL_CREATED'
    | 'POLL_VOTED'
    | 'POLL_CLOSED'
    | 'POLL_DELETED'
    | 'ELECTION_CREATED'
    | 'ELECTION_VOTED'
    | 'ELECTION_CLOSED'
    | 'ELECTION_DELETED'
    | 'LAB_MACHINE_CREATED'
    | 'LAB_RESERVATION_CREATED'
    | 'LAB_RESERVATION_CANCELLED'
    | 'SETTINGS_UPDATED'
    | 'THRESHOLD_UPDATED';

export interface AuditLog {
    id: string;
    timestamp: string;
    actionType: ActionType;
    userId: string;
    details: string;
    ipAddress: string;
}

// Release Proposal Types
export type ReleaseStatus = 'Pending' | 'Executed' | 'Rejected';

export interface ReleaseProposal {
    id: string;
    memberId: string;
    proposedBy: string;
    reason: string;
    proposedDate: string;
    status: ReleaseStatus;
    executedBy?: string;
    executedDate?: string;
}

// Status Thresholds Configuration
export interface StatusThresholds {
    green: number;  // e.g., 85 means >= 85%
    yellow: number; // e.g., 60 means >= 60% and < green
    // Red is implicit: < yellow
}

// Toast Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}



// Global Settings Types
export interface GlobalSettings {
    recruitmentOpen: boolean;
    maintenanceMode: boolean;
    defaultPassword?: string;
    allowMemberSignups?: boolean;
}

// Governance Types
export type PollStatus = 'Open' | 'Closed';

export interface PollOption {
    id: string;
    label: string;
    votes: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    status: PollStatus;
    createdBy: string; // Member ID
    createdDate: string;
    endDate?: string;
    votedMemberIds: string[]; // Track who voted to prevent double voting
}

export interface Candidate {
    id: string;
    memberId: string;
    position: string; // e.g., "President"
    manifesto: string;
    votes: number;
}

export interface Election {
    id: string;
    title: string;
    position: string;
    candidates: Candidate[];
    status: PollStatus;
    startDate: string;
    endDate: string;
    votedMemberIds: string[];
}

export interface VoteRecord {
    id: string;
    pollId?: string;
    electionId?: string;
    memberId: string;
    timestamp: string;
}

// Navigation Item
export interface NavItem {
    label: string;
    path: string;
    icon: string;
    superAdminOnly?: boolean;
}

// Lab Operations Types
export type MachineType = '3D Printer' | 'CNC' | 'Laser Cutter' | 'Workstation';
export type MachineStatus = 'Idle' | 'In Use' | 'Maintenance' | 'Offline';

export interface LabMachine {
    id: string;
    name: string;
    type: MachineType;
    model: string;
    status: MachineStatus;
    imageUrl?: string;
    currentJob?: {
        memberId: string;
        startTime: string; // ISO String
        estimatedDuration: number; // in minutes
        completionTime: string; // derived
    };
    specs?: {
        bedSize?: string;
        maxPower?: string;
        materials?: string[];
    };
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Reservation {
    id: string;
    machineId: string;
    memberId: string;
    startTime: string; // ISO String
    endTime: string; // ISO String
    purpose: string;
    status: ReservationStatus;
    createdDate: string;
}
