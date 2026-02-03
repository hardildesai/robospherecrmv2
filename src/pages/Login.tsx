// ============================================
// Login Page - "Smooth Fade" Edition
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Command, Users, Globe, Shield, Wifi, Battery } from 'lucide-react';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, addToast } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Authenticating Simulation
        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = await login(username, password);

        if (result.success) {
            setIsSuccess(true);

            // 2. Wait for fade out, then navigate
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } else {
            // Trigger error state and shake
            setIsError(true);
            addToast({ type: 'error', message: 'Authentication Failed.' });
            setIsLoading(false);
            setPassword('');

            // Reset error state after 2 seconds
            setTimeout(() => {
                setIsError(false);
            }, 2000);
        }
    };

    // Reset error when user types
    const handleInput = (setter: (val: string) => void, val: string) => {
        setIsError(false);
        setter(val);
    };

    return (
        <div className="fixed inset-0 z-50 w-full h-full bg-[#09090b] text-white p-4 sm:p-8 flex items-center justify-center font-sans overflow-hidden">

            {/* Ambient Background Glow */}
            <AnimatePresence>
                {!isSuccess && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BENTO GRID LAYOUT */}
            <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-full md:h-[600px] relative">

                <AnimatePresence>
                    {!isSuccess && (
                        <>
                            {/* 1. BRAND WIDGET (Top Left) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                                className="md:col-span-1 md:row-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl hover:bg-white/10 transition-colors duration-300"
                            >
                                <div>
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-black">
                                        <Command className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">RoboSphere</h2>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    SYSTEM ONLINE
                                </div>
                            </motion.div>

                            {/* 2. CLOCK & STATUS WIDGET (Top Center) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="md:col-span-2 md:row-span-1 bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="z-10">
                                    <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Local Time</p>
                                    <h1 className="text-4xl font-mono font-light tracking-tighter">{currentTime}</h1>
                                </div>
                                <div className="flex gap-4 z-10">
                                    <div className="flex flex-col items-center gap-1 text-xs text-white/30">
                                        <Wifi className="w-5 h-5" />
                                        <span>5G</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-xs text-white/30">
                                        <Battery className="w-5 h-5" />
                                        <span>100%</span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* 3. LOGIN FORM (Center/Right - LARGE) */}
                <AnimatePresence>
                    {!isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isError ? {
                                opacity: 1,
                                scale: 1,
                                x: [0, -10, 10, -10, 10, 0], // Shake
                                transition: { duration: 0.4 }
                            } : {
                                opacity: 1,
                                scale: 1
                            }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            className={`md:col-span-2 md:row-span-2 p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl rounded-3xl z-20 transition-colors duration-300 ${isError ? 'bg-red-50 border-2 border-red-500 shadow-red-500/20' : 'bg-white'
                                }`}
                        >
                            <div className="h-full flex flex-col justify-center">
                                {/* Background Decorative Element */}
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none transition-colors duration-300 ${isError ? 'bg-red-200' : 'bg-blue-100'
                                    }`} />

                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h3 className={`text-2xl font-bold mb-2 transition-colors ${isError ? 'text-red-900' : 'text-black'}`}>
                                            {isError ? 'Access Denied' : 'Welcome Back'}
                                        </h3>
                                        <p className={`transition-colors ${isError ? 'text-red-600' : 'text-slate-500'}`}>
                                            {isError ? 'Invalid credentials provided.' : 'Please authenticate to continue.'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className={`text-xs font-bold uppercase tracking-wide transition-colors ${isError ? 'text-red-400' : 'text-slate-400'}`}>
                                                ID / Username
                                            </label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => handleInput(setUsername, e.target.value)}
                                                className={`w-full border-none rounded-xl px-4 py-3 font-medium outline-none transition-all ${isError
                                                    ? 'bg-red-100/50 text-red-900 placeholder:text-red-300 focus:ring-2 focus:ring-red-500'
                                                    : 'bg-slate-100 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter username"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-xs font-bold uppercase tracking-wide transition-colors ${isError ? 'text-red-400' : 'text-slate-400'}`}>
                                                Secure Key
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => handleInput(setPassword, e.target.value)}
                                                className={`w-full border-none rounded-xl px-4 py-3 font-medium outline-none transition-all ${isError
                                                    ? 'bg-red-100/50 text-red-900 placeholder:text-red-300 focus:ring-2 focus:ring-red-500'
                                                    : 'bg-slate-100 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4 ${isError
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-black text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isError ? 'Retry Authentication' : 'Access Dashboard'} <ArrowRight className="w-4 h-4" /></>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {!isSuccess && (
                        <>
                            {/* 4. STATS WIDGET (Bottom Left) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-purple-500/20"
                            >
                                <div>
                                    <div className="p-2 bg-white/20 w-fit rounded-lg mb-4 backdrop-blur-md">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="text-5xl font-bold tracking-tighter mb-1">1,240</div>
                                    <div className="text-white/70 font-medium">Active Members</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-white/10 rounded-full h-1.5 w-full overflow-hidden">
                                        <div className="bg-white w-[70%] h-full rounded-full" />
                                    </div>
                                    <div className="flex justify-between text-xs text-white/50 font-mono">
                                        <span>GROWTH</span>
                                        <span>+12.5%</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 5. MAP/LOCATION WIDGET (Top Right) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="md:col-span-1 md:row-span-1 bg-[#1a1a1a] border border-white/5 rounded-3xl p-0 relative overflow-hidden group"
                            >
                                {/* Abstract Map Dots */}
                                <div className="absolute inset-0 p-6 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                                    <Globe className="w-24 h-24 text-white animate-spin-slow" style={{ animationDuration: '20s' }} />
                                </div>
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-xs text-white/40 font-mono mb-1">SERVER REGION</p>
                                    <p className="font-bold">US-EAST-1</p>
                                </div>
                            </motion.div>

                            {/* 6. SECURITY WIDGET (Bottom Right) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="md:col-span-1 md:row-span-1 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-center items-center text-center backdrop-blur-sm"
                            >
                                <Shield className="w-8 h-8 text-emerald-500 mb-3" />
                                <p className="font-bold text-emerald-400">Secure Environment</p>
                                <p className="text-xs text-emerald-500/40 mt-1">256-bit AES Encrypted</p>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* FULLSCREEN WHITE OVERLAY Transition */}
            {/* This fades in to cover the fading bento grid, effectively "wiping" the screen white */}
            {/* Then we navigate, and the white dashboard fades in from this white state */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 bg-white z-[100]"
                    />
                )}
            </AnimatePresence>

            {/* Mobile-only footer */}
            <AnimatePresence>
                {!isSuccess && (
                    <motion.div exit={{ opacity: 0 }} className="md:hidden mt-8 text-center text-white/30 text-xs font-mono">
                        ROBOSPHERE MOBILE V2
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
