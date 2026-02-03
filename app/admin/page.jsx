'use client';

import { useState } from 'react';
import axios from 'axios';
import { RefreshCw, Heart, Lock, LogIn, Smartphone, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = '/api';

export default function AdminPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    // Auth State
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState('');

    const login = async () => {
        setLoading(true);
        setLoginError('');
        try {
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { 'x-admin-password': password }
            });
            setStats(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Wrong password 💔');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { 'x-admin-password': password }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            if (error.response && error.response.status === 401) {
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // If not authenticated, show Login Screen
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card flex flex-col items-center gap-6"
                >
                    <div className="bg-white/10 p-6 rounded-full border border-white/20 shadow-inner">
                        <Lock size={40} className="text-white drop-shadow-md" />
                    </div>
                    <div>
                        <h1 className="text-5xl mb-2 font-romantic">Cupid's Vault</h1>
                        <p className="opacity-80 font-light tracking-wide">Enter the secret password to unlock.</p>
                    </div>

                    <div className="w-full max-w-xs relative bg-white/5 p-4 rounded-2xl border border-white/10">
                        <input
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && login()}
                            className="text-center font-mono text-xl tracking-widest bg-transparent border-b border-white/30 focus:border-white rounded-none px-0 py-2 !mt-0 !mb-4 placeholder-white/20"
                        />
                        {loginError && <p className="text-red-200 text-sm mb-4 bg-red-500/20 py-1 px-3 rounded-md">{loginError}</p>}

                        <button
                            className="btn btn-primary w-full flex justify-center items-center gap-2"
                            onClick={login}
                            disabled={loading}
                        >
                            {loading ? <RefreshCw className="animate-spin" size={20} /> : <LogIn size={20} />}
                            {loading ? 'Verifying...' : 'Unlock'}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Authenticated View
    return (
        <div className="min-h-screen w-full p-4 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 glass-card !p-6 !max-w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-full">
                            <Heart className="text-white heart-beat" fill="#D4145A" size={32} />
                        </div>
                        <div className="text-left">
                            <h1 className="text-4xl m-0 font-romantic leading-none">Love Dashboard</h1>
                            <p className="text-sm opacity-60 uppercase tracking-widest mt-1">Overview of affairs</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="p-4 hover:bg-white/20 rounded-full transition-all mt-4 md:mt-0 active:scale-95 border border-white/10 bg-white/5"
                        title="Refresh Stats"
                    >
                        <RefreshCw className={loading ? "animate-spin" : ""} size={24} />
                    </button>
                </div>

                {/* Table Card */}
                <div className="glass-card !max-w-full !p-0 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-white/70 uppercase text-xs tracking-[0.15em] font-bold">
                                    <th className="p-6">Sender</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-center">Dodges</th>
                                    <th className="p-6">Mystery Reveal</th>
                                    <th className="p-6 hidden md:table-cell">Device</th>
                                    <th className="p-6 hidden md:table-cell">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {stats.map((stat, i) => (
                                        <motion.tr
                                            key={stat.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-white/10 transition-colors group"
                                        >
                                            <td className="p-6">
                                                <div className="font-bold text-lg text-white group-hover:text-pink-200 transition-colors">
                                                    {stat.sender_name}
                                                </div>
                                                <div className="text-xs opacity-50 font-mono mt-1">{stat.id}</div>
                                            </td>
                                            <td className="p-6">
                                                {stat.is_accepted ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-100 px-3 py-1.5 rounded-full text-xs font-bold border border-green-500/30 uppercase tracking-wide shadow-sm">
                                                        <Heart size={10} fill="currentColor" /> Accepted
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-100 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-500/30 uppercase tracking-wide shadow-sm">
                                                        <RefreshCw size={10} className="animate-spin-slow" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`font-mono text-lg font-bold ${stat.no_hover_count > 0 ? 'text-pink-300' : 'opacity-30'}`}>
                                                    {stat.no_hover_count}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                {stat.mystery_name ? (
                                                    <span className="text-white font-serif italic text-lg border-b border-white/20 pb-1">
                                                        "{stat.mystery_name}"
                                                    </span>
                                                ) : (
                                                    <span className="opacity-20 italic">---</span>
                                                )}
                                            </td>
                                            <td className="p-6 hidden md:table-cell">
                                                <div className="flex items-center gap-2 opacity-60 text-xs truncate max-w-[150px]" title={stat.device_type}>
                                                    <Smartphone size={14} />
                                                    {stat.device_type ? stat.device_type.split('(')[0] : 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="p-6 hidden md:table-cell opacity-50 text-xs font-mono">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(stat.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {stats.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center opacity-40">
                                            <Search size={48} className="mx-auto mb-4 opacity-50" />
                                            <p className="text-xl italic font-serif">No love stories recorded yet...</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-white/40 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Lock size={12} /> Lock Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
