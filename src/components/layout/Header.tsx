// ============================================
// Professional Header
// ============================================

import { useState } from 'react';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useStore, useAuth } from '../../lib/store';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';


export const Header: React.FC = () => {
    const { currentUser } = useStore();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <header className="h-16 bg-bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
            {/* Left: Welcome & Date */}
            <div>
                <h1 className="text-lg font-semibold text-text-primary">
                    Welcome, {currentUser?.name?.split(' ')[0]}!
                </h1>
                <p className="text-sm text-text-muted">Today is {today}</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 bg-bg-base border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-text-secondary">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
                </Button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-bg-base rounded-lg px-2 py-1.5 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-text-primary">{currentUser?.name}</p>
                            <p className="text-xs text-text-muted capitalize">{currentUser?.role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-text-muted hidden md:block" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-bg-card rounded-xl shadow-lg border border-border z-50 py-2">
                            <div className="px-4 py-2 border-b border-border">
                                <p className="text-xs text-text-muted">Signed in as</p>
                                <p className="text-sm font-medium text-text-primary">{currentUser?.username}</p>
                            </div>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-base transition-colors">
                                <User className="w-4 h-4" />
                                Profile
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-base transition-colors">
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                            <div className="border-t border-border my-1" />
                            <button
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    logout();
                                    navigate('/login');
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger-light transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
