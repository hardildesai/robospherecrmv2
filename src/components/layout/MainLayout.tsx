// ============================================
// Bento OS Main Layout - Floating Sidebar Edition
// ============================================

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    Box,
    LogOut,
    Menu,
    X,
    FolderKanban,
    Cpu,
    BookOpen,
    FileText,
    GraduationCap,
    Shield,
    Vote
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Breadcrumbs } from '../common';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

export const MainLayout: React.FC = () => {
    const { logout, currentUser: user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mainContentRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname.startsWith(path);

    // Initialize Lenis for Smooth Scrolling
    useEffect(() => {
        const lenis = new Lenis({
            wrapper: mainContentRef.current!,
            content: mainContentRef.current?.firstElementChild as HTMLElement,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const isBasicMember = user?.role === 'member';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        ...(isBasicMember ? [] : [
            { icon: Users, label: 'Members', path: '/members' },
            { icon: FolderKanban, label: 'Projects', path: '/projects' },
            { icon: Box, label: 'Inventory', path: '/inventory' },
        ]),
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: Cpu, label: 'Lab Console', path: '/lab' },
    ];

    const secondaryItems = [
        ...(isBasicMember ? [] : [
            { icon: Clock, label: 'Waitlist', path: '/waitlist' },
            { icon: GraduationCap, label: 'Recruitment', path: '/recruitment' },
        ]),
        { icon: BookOpen, label: 'Wiki', path: '/wiki' },
        { icon: Vote, label: 'Governance', path: '/governance' },
        ...(isBasicMember ? [] : [
            { icon: FileText, label: 'Reports', path: '/reports' },
        ]),
    ];

    if (user?.role === 'superadmin') {
        secondaryItems.push(
            { icon: Shield, label: 'Admin', path: '/admin' }
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#F8FAFC] text-text-primary font-sans selection:bg-primary selection:text-white flex flex-col md:flex-row overflow-hidden p-4">

            {/* FLOATING SIDEBAR (Desktop) */}
            <motion.aside
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden md:flex flex-col w-20 lg:w-64 h-full bg-white rounded-2xl z-30 shrink-0 shadow-xl border border-slate-100 mr-4"
            >
                {/* Brand */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden lg:block text-slate-800">RoboSphere</span>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
                    {/* Main Group */}
                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-semibold text-slate-400 mb-2 hidden lg:block uppercase tracking-wider">Core</p>
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group relative font-medium ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="text-sm hidden lg:block">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Secondary Group */}
                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-semibold text-slate-400 mb-2 hidden lg:block uppercase tracking-wider">Utilities</p>
                        {secondaryItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group font-medium ${isActive(item.path)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 shrink-0 ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="text-sm hidden lg:block">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <div className="p-3 border-t border-slate-200/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-sm hidden lg:block">Disconnect</span>
                    </button>
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA */}
            <motion.main
                ref={mainContentRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                className="flex-1 h-full overflow-y-auto relative z-10 bg-white rounded-2xl shadow-sm border border-slate-100"
            >
                {/* Top Mobile Bar */}
                <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-slate-200/50 p-4 flex items-center justify-between sticky top-0 z-50">
                    <span className="font-bold text-slate-800">RoboSphere</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-800">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Content Container with proper padding */}
                <div className="p-6">
                    <Breadcrumbs />
                    <Outlet />
                </div>
            </motion.main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 md:hidden p-6 flex flex-col pt-20"
                    >
                        <div className="space-y-2">
                            {[...navItems, ...secondaryItems].map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium ${isActive(item.path)
                                        ? 'bg-primary text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <item.icon className="w-6 h-6" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-auto w-full py-4 text-red-600 font-medium flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" /> Disconnect
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
