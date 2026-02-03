// ============================================
// Breadcrumbs Component
// ============================================

import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../lib/store';
import type { Member, Project, ClubEvent, InventoryItem, Team } from '../../lib/types';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

// Route to label mapping
const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'members': 'Members',
    'new': 'New',
    'events': 'Events',
    'attendance': 'Attendance',
    'projects': 'Projects',
    'inventory': 'Inventory',
    'waitlist': 'Waitlist',
    'recruitment': 'Recruitment',
    'wiki': 'Wiki',
    'reports': 'Reports',
    'admin': 'Admin',
    'audit-logs': 'Audit Logs',
    'settings': 'Settings',
    'releases': 'Releases',
    'governance': 'Governance',
    'calendar': 'Calendar',
    'lab': 'Lab Console',
};

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Don't show breadcrumbs on dashboard or login
    if (pathSegments.length <= 1 || location.pathname === '/login') {
        return null;
    }

    const { members, projects, events, inventory, teams } = useStore();

    const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;

        // Check if segment is an ID
        const isId = /^[a-z]+-\d+$|^\d+$/.test(segment) || segment.includes('-');

        let label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        if (isId) {
            // Try to find the name in our stores
            const member = members.find((m: Member) => m.id === segment);
            const project = projects.find((p: Project) => p.id === segment);
            const event = events.find((e: ClubEvent) => e.id === segment);
            const item = inventory.find((i: InventoryItem) => i.id === segment);
            const team = teams.find((t: Team) => t.id === segment);

            if (member) label = member.name;
            else if (project) label = project.name;
            else if (event) label = event.title;
            else if (item) label = item.name;
            else if (team) label = team.name;
            else label = 'Details';
        }

        return {
            label,
            path: isLast ? undefined : path,
        };
    });

    return (
        <nav className="flex items-center text-sm text-text-muted mb-4">
            <Link
                to="/dashboard"
                className="flex items-center hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-2 text-text-dim" />
                    {crumb.path ? (
                        <Link
                            to={crumb.path}
                            className="hover:text-primary transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="text-text-primary font-medium">{crumb.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};
