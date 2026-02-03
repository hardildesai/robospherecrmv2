// ============================================
// Professional Sidebar
// ============================================

import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    Shield,
    FileText,
    ScrollText,
    Settings,
    LogOut,
    Cpu,
    Folder,
    Package,
    UserPlus,
    BookOpen,
    Vote,
} from 'lucide-react';
import { useStore, useAuth } from '../../lib/store';
import { cn } from '../../lib/utils';
import { Button } from '../ui';

export const Sidebar: React.FC = () => {
    const { sidebarCollapsed } = useStore();
    const { logout, currentUser } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', role: 'all' },
        { icon: Users, label: 'Members', path: '/members', role: 'all' },
        { icon: Folder, label: 'Projects', path: '/projects', role: 'all' },
        { icon: Package, label: 'Inventory', path: '/inventory', role: 'all' },
        { icon: Calendar, label: 'Events List', path: '/events', role: 'all' },
        { icon: UserPlus, label: 'Recruitment', path: '/recruitment', role: 'admin' },
        { icon: Cpu, label: 'Lab Console', path: '/lab', role: 'all' },
        { icon: BookOpen, label: 'Wiki', path: '/wiki', role: 'all' },
        { icon: Vote, label: 'Governance', path: '/governance', role: 'all' },
        { icon: Calendar, label: 'Calendar', path: '/calendar', role: 'all' },
        { icon: ClipboardList, label: 'Waitlist', path: '/waitlist', role: 'admin' },
        { icon: Shield, label: 'Releases', path: '/releases', role: 'superadmin' },
        { icon: FileText, label: 'Reports', path: '/reports', role: 'admin' },
        { icon: ScrollText, label: 'Audit Logs', path: '/audit-logs', role: 'admin' },
        { icon: Settings, label: 'Settings', path: '/admin/settings', role: 'superadmin' }, // Fixed path to match app routes
    ];

    const filteredNav = navItems.filter((item) => {
        if (item.role === 'all') return true;
        if (item.role === 'admin') return currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
        if (item.role === 'superadmin') return currentUser?.role === 'superadmin';
        return false;
    });

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen bg-bg-card border-r border-border transition-all duration-300 ease-in-out z-50 flex flex-col',
                sidebarCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border">
                {!sidebarCollapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                            R
                        </div>
                        <span className="text-lg font-bold text-text-primary">RoboSphere</span>
                    </div>
                ) : (
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg mx-auto">
                        R
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-sm font-medium',
                                sidebarCollapsed ? 'justify-center' : '',
                                isActive
                                    ? 'bg-primary-light text-primary border-l-4 border-primary -ml-0.5 pl-[10px]'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-base'
                            )
                        }
                        title={sidebarCollapsed ? item.label : undefined}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border mt-auto">
                <div className={cn('flex items-center gap-3', sidebarCollapsed ? 'justify-center' : '')}>
                    <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-text-primary truncate">
                                {currentUser?.name}
                            </p>
                            <p className="text-xs text-text-muted truncate capitalize">
                                {currentUser?.role}
                            </p>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            title="Logout"
                            className="text-text-muted hover:text-danger"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </aside>
    );
};
