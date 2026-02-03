// ============================================
// RoboSphere CRM v2 - Mock Data
// ============================================

import type { Member, ClubEvent, WaitlistEntry, User, AuditLog, ReleaseProposal, StatusThresholds, Team, Project, Contribution, InventoryItem, CheckoutRecord, RecruitmentApplication, Interview, RecruitmentCohort, WikiArticle, Poll, Election, LabMachine, Reservation } from './types';

// ============ LAB MACHINES ============
export const mockMachines: LabMachine[] = [
    {
        id: 'mach-001',
        name: 'Prusa MK3S+ (Unit A)',
        type: '3D Printer',
        model: 'Prusa i3 MK3S+',
        status: 'In Use',
        imageUrl: 'https://cdn.prusa3d.com/content/images/product/default/228.jpg',
        currentJob: {
            memberId: 'RS-2024-0004',
            startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Started 45 mins ago
            estimatedDuration: 120, // 2 hours total
            completionTime: new Date(Date.now() + 1000 * 60 * 75).toISOString(),
        },
        specs: {
            bedSize: '250x210x210 mm',
            materials: ['PLA', 'PETG'],
        },
    },
    {
        id: 'mach-002',
        name: 'Bambu Lab X1C',
        type: '3D Printer',
        model: 'Bambu Lab X1-Carbon',
        status: 'Idle',
        imageUrl: 'https://us.store.bambulab.com/cdn/shop/products/X1-Carbon_Combo_1.jpg',
        specs: {
            bedSize: '256x256x256 mm',
            materials: ['PLA', 'ABS', 'TPU', 'PA-CF'],
        },
    },
    {
        id: 'mach-003',
        name: 'Epilog Laser Fusion',
        type: 'Laser Cutter',
        model: 'Fusion Pro 32',
        status: 'Maintenance',
        imageUrl: 'https://www.epiloglaser.com/assets/img/product-hero-fusion-pro-32.jpg',
        specs: {
            bedSize: '32" x 20"',
            maxPower: '60W',
            materials: ['Acrylic', 'Wood', 'Leather'],
        },
    },
    {
        id: 'mach-004',
        name: 'Haaland CNC Router',
        type: 'CNC',
        model: 'Desktop Pro 4x4',
        status: 'Idle',
        imageUrl: 'https://www.cncrouterparts.com/images/pro4848_400.jpg',
        specs: {
            bedSize: '4ft x 4ft',
            materials: ['Wood', 'Aluminum', 'Plastics'],
        },
    },
    {
        id: 'mach-005',
        name: 'Electronics Bench 1',
        type: 'Workstation',
        model: 'Standard Workbench',
        status: 'In Use',
        specs: {
            bedSize: 'N/A',
            materials: ['Soldering', 'Testing'],
        },
        currentJob: {
            memberId: 'RS-2024-0002',
            startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            estimatedDuration: 180,
            completionTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        }
    }
];

// ============ RESERVATIONS ============
export const mockReservations: Reservation[] = [
    {
        id: 'res-001',
        machineId: 'mach-003', // Laser Cutter
        memberId: 'RS-2024-0001', // Arjun
        startTime: '2026-01-26T14:00:00',
        endTime: '2026-01-26T16:00:00',
        purpose: 'Chassis parts for Combat Bot',
        status: 'Confirmed',
        createdDate: '2026-01-24T10:00:00',
    },
    {
        id: 'res-002',
        machineId: 'mach-004', // CNC
        memberId: 'RS-2024-0011', // Rohan
        startTime: '2026-01-27T10:00:00',
        endTime: '2026-01-27T12:00:00',
        purpose: 'Milling motor mounts',
        status: 'Confirmed',
        createdDate: '2026-01-25T09:00:00',
    },
];

// ============ USERS ============
export const mockUsers: User[] = [
    {
        id: 'usr-001',
        name: 'Super Administrator',
        username: 'superadmin',
        password: 'password',
        role: 'superadmin',
        isActive: true,
        failedAccessAttempts: 0,
    },
    {
        id: 'usr-002',
        name: 'Admin User',
        username: 'admin',
        password: 'password',
        role: 'admin',
        isActive: true,
        failedAccessAttempts: 0,
    },
    {
        id: 'usr-003',
        name: 'Arjun Patel',
        username: 'RS-2024-0001',
        password: 'password', // Default
        role: 'member',
        isActive: true,
        failedAccessAttempts: 0,
    },
    {
        id: 'usr-004',
        name: 'Priya Sharma',
        username: 'RS-2024-0002',
        password: 'password', // Default
        role: 'member',
        isActive: true,
        failedAccessAttempts: 0,
    },
    {
        id: 'usr-005',
        name: 'Rahul Singh',
        username: 'RS-2024-0003',
        password: 'password', // Default
        role: 'member',
        isActive: true,
        failedAccessAttempts: 0,
    },
];

// ============ MEMBERS ============
export const mockMembers: Member[] = [
    {
        id: 'RS-2024-0001',
        name: 'Arjun Patel',
        email: 'arjun.patel@university.edu',
        studentId: '21ME1001',
        branch: 'Mechanical',
        year: 3,
        phone: '+91 98765 43210',
        joinDate: '2024-01-15',
        status: 'Active',
        attendancePercent: 92,
        feeStatus: 'Paid',
        rank: 'Lead',
        skills: ['CAD', 'SolidWorks', '3D Printing', 'Fabrication'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0002',
        name: 'Priya Sharma',
        email: 'priya.sharma@university.edu',
        studentId: '21EC2015',
        branch: 'Electrical',
        year: 3,
        phone: '+91 87654 32109',
        joinDate: '2024-01-20',
        status: 'Active',
        attendancePercent: 88,
        feeStatus: 'Paid',
        rank: 'Lead',
        skills: ['Arduino', 'PCB Design', 'Soldering', 'Python'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0003',
        name: 'Rahul Singh',
        email: 'rahul.singh@university.edu',
        studentId: '22CS3042',
        branch: 'CS',
        year: 2,
        joinDate: '2024-02-10',
        status: 'Active',
        attendancePercent: 95,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['Python', 'ROS2', 'Computer Vision', 'Machine Learning'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0004',
        name: 'Neha Gupta',
        email: 'neha.gupta@university.edu',
        studentId: '22ME2088',
        branch: 'Mechanical',
        year: 2,
        phone: '+91 76543 21098',
        joinDate: '2024-02-15',
        status: 'Probation',
        attendancePercent: 72,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['CAD', 'Laser Cutting'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0005',
        name: 'Vikram Mehta',
        email: 'vikram.mehta@university.edu',
        studentId: '21CE1056',
        branch: 'Civil',
        year: 3,
        joinDate: '2024-01-25',
        status: 'Passive',
        attendancePercent: 45,
        feeStatus: 'Pending',
        rank: 'Member',
        skills: ['Project Management'],
        lastAttended: '2025-12-01',
    },
    {
        id: 'RS-2024-0006',
        name: 'Ananya Reddy',
        email: 'ananya.reddy@university.edu',
        studentId: '23EC1012',
        branch: 'Electrical',
        year: 1,
        phone: '+91 65432 10987',
        joinDate: '2024-08-01',
        status: 'Active',
        attendancePercent: 98,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['Arduino', 'Electronics'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0007',
        name: 'Karthik Nair',
        email: 'karthik.nair@university.edu',
        studentId: '22CS1077',
        branch: 'CS',
        year: 2,
        joinDate: '2024-03-05',
        status: 'Active',
        attendancePercent: 85,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['Python', 'ROS2', 'Embedded C'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0008',
        name: 'Divya Krishnan',
        email: 'divya.k@university.edu',
        studentId: '21ME3099',
        branch: 'Mechanical',
        year: 3,
        phone: '+91 54321 09876',
        joinDate: '2024-01-18',
        status: 'Probation',
        attendancePercent: 68,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['CAD', '3D Printing'],
        lastAttended: '2026-01-10',
    },
    {
        id: 'RS-2024-0009',
        name: 'Aditya Joshi',
        email: 'aditya.joshi@university.edu',
        studentId: '23CS2001',
        branch: 'CS',
        year: 1,
        joinDate: '2024-08-10',
        status: 'Active',
        attendancePercent: 90,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['Python', 'Web Development'],
        lastAttended: '2026-01-18',
    },
    {
        id: 'RS-2024-0010',
        name: 'Sneha Kulkarni',
        email: 'sneha.k@university.edu',
        studentId: '22EC2045',
        branch: 'Electrical',
        year: 2,
        joinDate: '2024-04-01',
        status: 'Dismissed',
        attendancePercent: 25,
        feeStatus: 'Forfeited',
        rank: 'Member',
        skills: [],
        lastAttended: '2025-10-15',
    },
    {
        id: 'RS-2024-0011',
        name: 'Rohan Desai',
        email: 'rohan.desai@university.edu',
        studentId: '21ME2033',
        branch: 'Mechanical',
        year: 3,
        phone: '+91 43210 98765',
        joinDate: '2024-01-22',
        status: 'Active',
        attendancePercent: 87,
        feeStatus: 'Paid',
        rank: 'Mentor',
        skills: ['CAD', 'SolidWorks', 'Fabrication', 'Welding', 'Leadership'],
        lastAttended: '2026-01-18',
        socialLinks: {
            github: 'https://github.com/rohandesai',
            linkedin: 'https://linkedin.com/in/rohandesai',
        },
    },
    {
        id: 'RS-2024-0012',
        name: 'Meera Iyer',
        email: 'meera.iyer@university.edu',
        studentId: '23ME1055',
        branch: 'Mechanical',
        year: 1,
        joinDate: '2024-08-05',
        status: 'Active',
        attendancePercent: 94,
        feeStatus: 'Paid',
        rank: 'Member',
        skills: ['CAD', 'Sketching'],
        lastAttended: '2026-01-18',
    },
];

// ============ EVENTS ============
export const mockEvents: ClubEvent[] = [
    {
        id: 'evt-001',
        title: 'Introduction to CAD Workshop',
        description: 'Learn the basics of Computer-Aided Design using SolidWorks.',
        type: 'Workshop',
        date: '2026-01-25',
        startTime: '14:00',
        endTime: '17:00',
        location: 'Lab A, Engineering Block',
        capacity: 50,
        attendees: ['RS-2024-0001', 'RS-2024-0002', 'RS-2024-0003', 'RS-2024-0006', 'RS-2024-0007'],
    },
    {
        id: 'evt-002',
        title: 'Arduino Programming Basics',
        description: 'Hands-on session with Arduino microcontrollers.',
        type: 'Workshop',
        date: '2026-01-28',
        startTime: '15:00',
        endTime: '18:00',
        location: 'Electronics Lab',
        capacity: 30,
        attendees: ['RS-2024-0002', 'RS-2024-0006', 'RS-2024-0009'],
    },
    {
        id: 'evt-003',
        title: 'Robowar Prep Meeting',
        description: 'Strategy discussion for the upcoming Robowar competition.',
        type: 'Meeting',
        date: '2026-02-01',
        startTime: '16:00',
        endTime: '18:00',
        location: 'Conference Room B',
        capacity: 40,
        attendees: [],
    },
    {
        id: 'evt-004',
        title: '3D Printing Masterclass',
        description: 'Advanced techniques in FDM and resin printing.',
        type: 'Workshop',
        date: '2026-01-18',
        startTime: '10:00',
        endTime: '13:00',
        location: 'Maker Space',
        capacity: 25,
        attendees: ['RS-2024-0001', 'RS-2024-0003', 'RS-2024-0004', 'RS-2024-0007', 'RS-2024-0008', 'RS-2024-0011', 'RS-2024-0012'],
    },
    {
        id: 'evt-005',
        title: 'ROS2 Introduction',
        description: 'Getting started with Robot Operating System 2.',
        type: 'Workshop',
        date: '2026-01-10',
        startTime: '14:00',
        endTime: '17:00',
        location: 'Lab A, Engineering Block',
        capacity: 35,
        attendees: ['RS-2024-0001', 'RS-2024-0002', 'RS-2024-0003', 'RS-2024-0006', 'RS-2024-0007', 'RS-2024-0009', 'RS-2024-0011'],
    },
];

// ============ WAITLIST ============
export const mockWaitlist: WaitlistEntry[] = [
    {
        id: 'wl-001',
        name: 'Ishaan Verma',
        email: 'ishaan.v@university.edu',
        studentId: '24ME1001',
        appliedDate: '2026-01-15',
        status: 'Pending',
    },
    {
        id: 'wl-002',
        name: 'Tanvi Bhat',
        email: 'tanvi.bhat@university.edu',
        studentId: '24EC2003',
        appliedDate: '2026-01-18',
        status: 'Pending',
    },
    {
        id: 'wl-003',
        name: 'Siddharth Rao',
        email: 'sid.rao@university.edu',
        studentId: '24CS1055',
        appliedDate: '2026-01-20',
        status: 'Pending',
    },
    {
        id: 'wl-004',
        name: 'Kavya Menon',
        email: 'kavya.m@university.edu',
        studentId: '23ME2088',
        appliedDate: '2025-12-10',
        status: 'Archived',
    },
];

// ============ AUDIT LOGS ============
export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-001',
        timestamp: '2026-01-23T10:30:00Z',
        actionType: 'LOGIN_SUCCESS',
        userId: 'usr-001',
        details: 'Super Admin logged in successfully.',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'log-002',
        timestamp: '2026-01-23T10:35:00Z',
        actionType: 'MEMBER_CREATED',
        userId: 'usr-001',
        details: 'Created member: Meera Iyer (RS-2024-0012)',
        ipAddress: '192.168.1.100',
    },
    {
        id: 'log-003',
        timestamp: '2026-01-22T14:20:00Z',
        actionType: 'EVENT_CREATED',
        userId: 'usr-002',
        details: 'Created event: Robowar Prep Meeting',
        ipAddress: '192.168.1.105',
    },
    {
        id: 'log-004',
        timestamp: '2026-01-22T09:15:00Z',
        actionType: 'LOGIN_FAILURE',
        userId: 'usr-002',
        details: 'Failed login attempt for user: admin',
        ipAddress: '192.168.1.222',
    },
    {
        id: 'log-005',
        timestamp: '2026-01-21T16:45:00Z',
        actionType: 'ATTENDANCE_MARKED',
        userId: 'usr-002',
        details: 'Marked attendance for event: 3D Printing Masterclass (7 members)',
        ipAddress: '192.168.1.105',
    },
];

// ============ RELEASE PROPOSALS ============
export const mockReleaseProposals: ReleaseProposal[] = [
    {
        id: 'rel-001',
        memberId: 'RS-2024-0010',
        proposedBy: 'usr-002',
        reason: 'Consistent absence and non-participation for over 3 months.',
        proposedDate: '2026-01-15',
        status: 'Executed',
        executedBy: 'usr-001',
        executedDate: '2026-01-16',
    },
    {
        id: 'rel-002',
        memberId: 'RS-2024-0005',
        proposedBy: 'usr-002',
        reason: 'Attendance below 50% for two consecutive months.',
        proposedDate: '2026-01-20',
        status: 'Pending',
    },
];

// ============ STATUS THRESHOLDS ============
export const mockStatusThresholds: StatusThresholds = {
    green: 85,
    yellow: 60,
};

// ============ TEAMS ============
export const mockTeams: Team[] = [
    {
        id: 'team-001',
        name: 'Combat Robotics',
        description: 'Design and build robots for combat competitions',
        memberIds: ['RS-2024-0001', 'RS-2024-0004', 'RS-2024-0008', 'RS-2024-0011'],
        leadId: 'RS-2024-0001', // Arjun Patel
        createdDate: '2024-01-20',
    },
    {
        id: 'team-002',
        name: 'Autonomous Drones',
        description: 'Developing autonomous navigation systems for drones',
        memberIds: ['RS-2024-0002', 'RS-2024-0003', 'RS-2024-0007', 'RS-2024-0009'],
        leadId: 'RS-2024-0002', // Priya Sharma
        createdDate: '2024-02-01',
    },
    {
        id: 'team-003',
        name: 'Line Following Bots',
        description: 'Entry-level project for new members to learn basics',
        memberIds: ['RS-2024-0006', 'RS-2024-0009', 'RS-2024-0012'],
        leadId: 'RS-2024-0011', // Rohan Desai (Mentor)
        createdDate: '2024-08-10',
    },
    {
        id: 'team-004',
        name: 'ROS2 Research',
        description: 'Advanced robotics research using Robot Operating System 2',
        memberIds: ['RS-2024-0003', 'RS-2024-0007'],
        leadId: 'RS-2024-0003', // Rahul Singh
        createdDate: '2024-03-15',
    },
];

// ============ PROJECTS ============
export const mockProjects: Project[] = [
    {
        id: 'proj-001',
        name: 'Heavyweight Combat Bot "Destroyer"',
        description: '60kg combat robot with horizontal spinner weapon for national competition',
        teamId: 'team-001',
        status: 'Active',
        deadline: '2026-03-15',
        createdDate: '2024-10-01',
    },
    {
        id: 'proj-002',
        name: 'Drone Racing Prototype',
        description: 'FPV racing drone with autonomous obstacle avoidance',
        teamId: 'team-002',
        status: 'Planning',
        deadline: '2026-04-01',
        createdDate: '2025-11-15',
    },
    {
        id: 'proj-003',
        name: 'Line Follower Workshop Bot',
        description: 'Simple line following robot for workshop demonstrations',
        teamId: 'team-003',
        status: 'Complete',
        deadline: '2025-09-30',
        createdDate: '2024-08-15',
        completedDate: '2025-09-25',
    },
    {
        id: 'proj-004',
        name: 'Maze Solver Robot',
        description: 'Autonomous maze-solving robot using computer vision',
        teamId: 'team-002',
        status: 'Active',
        deadline: '2026-02-20',
        createdDate: '2025-12-01',
    },
    {
        id: 'proj-005',
        name: 'SLAM Navigation Research',
        description: 'Implementing SLAM algorithms in ROS2 for indoor navigation',
        teamId: 'team-004',
        status: 'Active',
        createdDate: '2025-06-01',
    },
    {
        id: 'proj-006',
        name: 'Sumo Bot Championship Entry',
        description: '15cm diameter sumo robot for inter-college championship',
        teamId: 'team-001',
        status: 'On Hold',
        deadline: '2026-05-10',
        createdDate: '2025-10-01',
    },
];

// ============ CONTRIBUTIONS ============
export const mockContributions: Contribution[] = [
    {
        id: 'cont-001',
        projectId: 'proj-001',
        memberId: 'RS-2024-0001',
        hours: 8,
        description: 'Designed chassis in SolidWorks, sent for laser cutting',
        date: '2026-01-15',
    },
    {
        id: 'cont-002',
        projectId: 'proj-001',
        memberId: 'RS-2024-0004',
        hours: 5,
        description: '3D printed weapon mount prototypes',
        date: '2026-01-16',
    },
    {
        id: 'cont-003',
        projectId: 'proj-001',
        memberId: 'RS-2024-0011',
        hours: 6,
        description: 'Welded main frame, tested structural integrity',
        date: '2026-01-17',
    },
    {
        id: 'cont-004',
        projectId: 'proj-002',
        memberId: 'RS-2024-0002',
        hours: 4,
        description: 'Wired ESCs and flight controller',
        date: '2026-01-18',
    },
    {
        id: 'cont-005',
        projectId: 'proj-002',
        memberId: 'RS-2024-0003',
        hours: 10,
        description: 'Coded obstacle avoidance algorithm in Python',
        date: '2026-01-19',
    },
    {
        id: 'cont-006',
        projectId: 'proj-004',
        memberId: 'RS-2024-0007',
        hours: 7,
        description: 'Implemented camera feed processing with OpenCV',
        date: '2026-01-20',
    },
    {
        id: 'cont-007',
        projectId: 'proj-005',
        memberId: 'RS-2024-0003',
        hours: 12,
        description: 'Configured SLAM parameters and tested in lab environment',
        date: '2026-01-21',
    },
    {
        id: 'cont-008',
        projectId: 'proj-003',
        memberId: 'RS-2024-0012',
        hours: 3,
        description: 'Assembled robot and calibrated sensors',
        date: '2025-09-20',
    },
];

// ============ INVENTORY ============
export const mockInventory: InventoryItem[] = [
    {
        id: 'inv-001',
        name: 'Arduino Uno R3 Kit',
        category: 'Kit',
        description: 'Complete starter kit with breadboard, jumper wires, LEDs, and sensors',
        quantity: 10,
        available: 7,
        condition: 'Good',
        location: 'Lab A - Cabinet 2',
        purchaseDate: '2023-08-15',
        cost: 3500,
    },
    {
        id: 'inv-002',
        name: 'Soldering Iron Station',
        category: 'Tool',
        description: 'Temperature-controlled soldering station with stand',
        quantity: 5,
        available: 4,
        condition: 'Excellent',
        location: 'Electronics Lab - Bench 3',
        purchaseDate: '2024-01-10',
        cost: 4200,
    },
    {
        id: 'inv-003',
        name: 'Raspberry Pi 4 (4GB)',
        category: 'Component',
        description: '4GB RAM single board computer',
        quantity: 8,
        available: 5,
        condition: 'Good',
        location: 'Lab A - Cabinet 1',
        purchaseDate: '2024-05-20',
        cost: 5500,
    },
    {
        id: 'inv-004',
        name: 'Prusa MK3S+ 3D Printer',
        category: 'Equipment',
        description: 'FDM 3D printer with auto bed leveling',
        quantity: 2,
        available: 2,
        condition: 'Excellent',
        location: 'Maker Space',
        purchaseDate: '2023-12-01',
        cost: 85000,
    },
    {
        id: 'inv-005',
        name: 'Laser Cutter (40W CO2)',
        category: 'Equipment',
        description: '40W laser cutter for wood/acrylic',
        quantity: 1,
        available: 0,
        condition: 'Good',
        location: 'Maker Space',
        purchaseDate: '2023-06-15',
        cost: 120000,
    },
    {
        id: 'inv-006',
        name: 'Digital Multimeter',
        category: 'Tool',
        description: 'Fluke 117 True RMS multimeter',
        quantity: 6,
        available: 6,
        condition: 'Excellent',
        location: 'Electronics Lab - Drawer 1',
        purchaseDate: '2024-02-10',
        cost: 8500,
    },
    {
        id: 'inv-007',
        name: 'DC Motor Driver L298N',
        category: 'Component',
        description: 'Dual H-bridge motor driver module',
        quantity: 20,
        available: 14,
        condition: 'Good',
        location: 'Lab A - Cabinet 3',
        purchaseDate: '2024-07-01',
        cost: 250,
    },
    {
        id: 'inv-008',
        name: 'Oscilloscope (2-Channel)',
        category: 'Equipment',
        description: 'Rigol DS1054Z Digital Oscilloscope',
        quantity: 2,
        available: 1,
        condition: 'Excellent',
        location: 'Electronics Lab - Bench 1',
        purchaseDate: '2024-03-15',
        cost: 45000,
    },
];

// ============ CHECKOUT RECORDS ============
export const mockCheckouts: CheckoutRecord[] = [
    {
        id: 'chk-001',
        itemId: 'inv-001',
        memberId: 'RS-2024-0003',
        quantity: 2,
        checkoutDate: '2026-01-20',
        dueDate: '2026-01-27',
        notes: 'For Maze Solver project',
    },
    {
        id: 'chk-002',
        itemId: 'inv-002',
        memberId: 'RS-2024-0002',
        quantity: 1,
        checkoutDate: '2026-01-18',
        dueDate: '2026-01-25',
        notes: 'PCB soldering work',
    },
    {
        id: 'chk-003',
        itemId: 'inv-003',
        memberId: 'RS-2024-0007',
        quantity: 3,
        checkoutDate: '2026-01-15',
        dueDate: '2026-01-22',
        notes: 'ROS2 navigation testing',
    },
    {
        id: 'chk-004',
        itemId: 'inv-005',
        memberId: 'RS-2024-0001',
        quantity: 1,
        checkoutDate: '2026-01-21',
        dueDate: '2026-01-24',
        notes: 'Cutting chassis parts for combat bot',
    },
    {
        id: 'chk-005',
        itemId: 'inv-007',
        memberId: 'RS-2024-0009',
        quantity: 4,
        checkoutDate: '2026-01-19',
        dueDate: '2026-01-26',
        notes: 'Line follower bot motors',
    },
    {
        id: 'chk-006',
        itemId: 'inv-001',
        memberId: 'RS-2024-0012',
        quantity: 1,
        checkoutDate: '2026-01-10',
        returnDate: '2026-01-15',
        notes: 'Workshop demonstration - Returned',
    },
    {
        id: 'chk-007',
        itemId: 'inv-008',
        memberId: 'RS-2024-0002',
        quantity: 1,
        checkoutDate: '2026-01-22',
        dueDate: '2026-01-29',
        notes: 'Debugging drone flight controller',
    },
    {
        id: 'chk-008',
        itemId: 'inv-007',
        memberId: 'RS-2024-0004',
        quantity: 2,
        checkoutDate: '2026-01-12',
        dueDate: '2026-01-19',
        notes: 'Testing motor drivers - OVERDUE',
    },
];

// ============ RECRUITMENT APPLICATIONS ============
export const mockApplications: RecruitmentApplication[] = [
    {
        id: 'app-001',
        name: 'Aarav Kumar',
        email: 'aarav.k@university.edu',
        studentId: '24ME1099',
        branch: 'Mechanical',
        year: 1,
        phone: '+91 98765 00001',
        whyJoin: 'I want to build robots and compete in national competitions. I have always been passionate about robotics.',
        skills: ['CAD', 'Arduino'],
        experience: 'Built a line follower robot in school',
        appliedDate: '2026-01-15',
        status: 'Pending',
        cohort: 'Spring 2026',
    },
    {
        id: 'app-002',
        name: 'Diya Patel',
        email: 'diya.p@university.edu',
        studentId: '24CS2045',
        branch: 'CS',
        year: 1,
        whyJoin: 'Want to learn robotics programming and computer vision',
        skills: ['Python', 'C++'],
        appliedDate: '2026-01-16',
        status: 'Interview Scheduled',
        cohort: 'Spring 2026',
    },
    {
        id: 'app-003',
        name: 'Aryan Singh',
        email: 'aryan.s@university.edu',
        studentId: '24EC1033',
        branch: 'Electrical',
        year: 1,
        whyJoin: 'Interested in PCB design and embedded systems',
        skills: ['Electronics', 'Soldering'],
        appliedDate: '2026-01-17',
        status: 'Accepted',
        cohort: 'Spring 2026',
    },
];

// ============ INTERVIEWS ============
export const mockInterviews: Interview[] = [
    {
        id: 'int-001',
        applicationId: 'app-002',
        interviewerId: 'RS-2024-0001',
        scheduledDate: '2026-01-25',
        scheduledTime: '15:00',
        score: 8,
        notes: 'Strong Python skills, good fit for computer vision team',
        completed: true,
    },
    {
        id: 'int-002',
        applicationId: 'app-003',
        interviewerId: 'RS-2024-0002',
        scheduledDate: '2026-01-24',
        scheduledTime: '14:00',
        score: 9,
        notes: 'Excellent electronics knowledge, accepted',
        completed: true,
    },
];

// ============ RECRUITMENT COHORTS ============
export const mockCohorts: RecruitmentCohort[] = [
    {
        id: 'cohort-001',
        name: 'Fall 2025',
        startDate: '2025-08-01',
        applicationCount: 25,
        acceptedCount: 12,
    },
    {
        id: 'cohort-002',
        name: 'Spring 2026',
        startDate: '2026-01-01',
        applicationCount: 15,
        acceptedCount: 3,
    },
];

// ============ WIKI ARTICLES ============
export const mockWikiArticles: WikiArticle[] = [
    {
        id: 'wiki-001',
        title: 'How to Use the Laser Cutter',
        category: 'Tutorial',
        content: '# Laser Cutter Safety and Usage\n\n## Safety First\n- Always wear safety glasses\n- Never leave the machine unattended\n\n## Steps\n1. Turn on exhaust fan\n2. Load your design file\n3. Adjust focus height...',
        author: 'RS-2024-0011',
        createdDate: '2025-09-15',
        lastModified: '2025-12-01',
        tags: ['laser-cutter', 'safety', 'fabrication'],
        views: 45,
    },
    {
        id: 'wiki-002',
        title: 'Robowar 2025 Post-Mortem',
        category: 'Post-Mortem',
        content: '# Robowar 2025 - Combat Bot Competition\n\n## What Went Right\n- Strong chassis design\n- Weapon performed well\n\n## What Went Wrong\n- Motor drivers overheated\n- Need better cooling system...',
        author: 'RS-2024-0001',
        createdDate: '2025-11-20',
        lastModified: '2025-11-20',
        tags: ['robowar', 'competition', 'combat-bot'],
        views: 78,
    },
    {
        id: 'wiki-003',
        title: 'ROS2 Installation Guide',
        category: 'Guide',
        content: '# Installing ROS2 on Ubuntu\n\n## Prerequisites\n- Ubuntu 22.04\n- Stable internet connection\n\n## Installation Steps\n```bash\nsudo apt update\nsudo apt install ros-humble-desktop\n```',
        author: 'RS-2024-0003',
        createdDate: '2025-10-05',
        lastModified: '2026-01-10',
        tags: ['ros2', 'software', 'installation'],
        views: 92,
    },
];

// ============ GOVERNANCE ============
export const mockPolls: Poll[] = [
    {
        id: 'poll-001',
        question: 'What should be the theme for the next Hackathon?',
        options: [
            { id: 'opt-1', label: 'AI & Robotics', votes: 12 },
            { id: 'opt-2', label: 'Sustainable Tech', votes: 8 },
            { id: 'opt-3', label: 'Space Exploration', votes: 15 },
        ],
        status: 'Open',
        createdBy: 'RS-2024-0001',
        createdDate: '2026-01-20',
        endDate: '2026-02-01',
        votedMemberIds: ['RS-2024-0002', 'RS-2024-0003'],
    },
    {
        id: 'poll-002',
        question: 'Pizza or Tacos for the meet-and-greet?',
        options: [
            { id: 'opt-1', label: 'Pizza', votes: 25 },
            { id: 'opt-2', label: 'Tacos', votes: 22 },
        ],
        status: 'Closed',
        createdBy: 'RS-2024-0002',
        createdDate: '2026-01-10',
        endDate: '2026-01-15',
        votedMemberIds: ['RS-2024-0001'],
    },
];

export const mockElections: Election[] = [
    {
        id: 'elec-2026-001',
        title: 'Club President Election 2026',
        position: 'President',
        candidates: [
            {
                id: 'cand-1',
                memberId: 'RS-2024-0001',
                position: 'President',
                manifesto: 'I promise to increase our budget for combat robotics and organize two national-level hackathons this year.',
                votes: 45
            },
            {
                id: 'cand-2',
                memberId: 'RS-2024-0011',
                position: 'President',
                manifesto: 'My focus is on mentorship and ensuring every new member gets hands-on experience within their first month.',
                votes: 38
            },
        ],
        status: 'Open',
        startDate: '2026-01-15',
        endDate: '2026-01-30',
        votedMemberIds: [],
    }
];

// ============ HELPER FUNCTIONS ============
export const generateMemberId = (): string => {
    // Generates RS + 5 digits (e.g., RS00123)
    const random = Math.floor(Math.random() * 100000);
    return `RS${random.toString().padStart(5, '0')}`;
};

export const generateEventId = (): string => {
    return `evt-${Date.now().toString(36)}`;
};

export const generateLogId = (): string => {
    return `log-${Date.now().toString(36)}`;
};

export const generateWaitlistId = (): string => {
    return `wl-${Date.now().toString(36)}`;
};

export const generateReleaseId = (): string => {
    return `rel-${Date.now().toString(36)}`;
};

export const simulateIpAddress = (): string => {
    return `192.168.1.${Math.floor(Math.random() * 255)}`;
};

export const generateTeamId = (): string => {
    return `team-${Date.now().toString(36)}`;
};

export const generateProjectId = (): string => {
    return `proj-${Date.now().toString(36)}`;
};

export const generateContributionId = (): string => {
    return `cont-${Date.now().toString(36)}`;
};

export const generateInventoryId = (): string => {
    return `inv-${Date.now().toString(36)}`;
};

export const generateCheckoutId = (): string => {
    return `chk-${Date.now().toString(36)}`;
};
