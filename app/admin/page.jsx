'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, LayoutDashboard, Lock, LogIn, Smartphone, Calendar, Search, ArrowRight, Heart, Check, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = '/api';

export default function AdminPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    // Override global body styles for this page only
    useEffect(() => {
        if (isAuthenticated) {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = '#f8fafc'; // Slate-50
            document.body.style.color = '#0f172a'; // Slate-900
            document.body.style.fontFamily = "'Inter', sans-serif";
        }
        return () => {
            // Reset to global styles when leaving
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.fontFamily = '';
        };
    }, [isAuthenticated]);

    const login = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { 'x-admin-password': password }
            });
            setStats(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setError('Invalid credentials.');
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
            if (error.response?.status === 401) setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 m-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-slate-200">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-900 p-3 rounded-lg">
                            <Lock className="text-white" size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2 font-sans">Admin Console</h2>
                    <p className="text-center text-slate-500 mb-8 text-sm">Secure access required.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && login()}
                                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-sans"
                                placeholder="••••••••"
                                style={{ borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

                        <button
                            onClick={login}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                            style={{ borderRadius: '6px' }}
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                            Authenticate
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // Force full screen cover to hide global "Cute" theme
        <div className="fixed inset-0 z-[9999] overflow-auto bg-slate-50 text-slate-900 font-sans">
            <div className="min-h-screen p-6 md:p-12">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <LayoutDashboard size={24} /> Analytics Dashboard
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">Real-time usage and engagement metrics.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchStats}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors text-sm font-medium shadow-sm"
                                disabled={loading}
                            >
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                Refresh
                            </button>
                            <button
                                onClick={() => setIsAuthenticated(false)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
                            >
                                <Lock size={16} />
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Scorecards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-32">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invites</p>
                                <h3 className="text-3xl font-black text-slate-900">{stats.length}</h3>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                <LayoutDashboard size={20} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-32">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accepted</p>
                                <h3 className="text-3xl font-black text-emerald-500">{stats.filter(s => s.is_accepted).length}</h3>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-32">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                                <h3 className="text-3xl font-black text-rose-500">
                                    {stats.length > 0 ? Math.round((stats.filter(s => s.is_accepted).length / stats.length) * 100) : 0}%
                                </h3>
                            </div>
                            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                <Heart size={20} fill="currentColor" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-32">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rejected (No Clicks)</p>
                                <h3 className="text-3xl font-black text-indigo-500">
                                    {stats.reduce((acc, curr) => acc + curr.no_hover_count, 0)}
                                </h3>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                                <VolumeX size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Professional Data Table */}
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">Sender</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] text-center whitespace-nowrap">Interaction</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">Recipient / Mystery</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] hidden md:table-cell whitespace-nowrap">Location & IP</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] hidden md:table-cell whitespace-nowrap">Device</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[11px] hidden md:table-cell whitespace-nowrap">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-4 bg-slate-50 rounded-full">
                                                        <Search size={24} className="opacity-40" />
                                                    </div>
                                                    <p>No proposals found yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat, index) => {
                                            // Helper for initials
                                            const initials = stat.sender_name
                                                ? stat.sender_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                                : '??';

                                            const colorClasses = [
                                                'bg-rose-100 text-rose-600', 'bg-blue-100 text-blue-600',
                                                'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600',
                                                'bg-purple-100 text-purple-600', 'bg-indigo-100 text-indigo-600'
                                            ];
                                            const colorClass = colorClasses[stat.sender_name.length % colorClasses.length];

                                            return (
                                                <tr key={stat.id} className="group hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${colorClass} shrink-0 shadow-sm border border-white ring-1 ring-slate-100`}>
                                                                {initials}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-slate-700">{stat.sender_name}</span>
                                                                <span className="text-[10px] text-slate-400 font-mono" title={stat.id}>
                                                                    ID: {stat.id.substring(0, 8)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {stat.is_accepted ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                                <Check size={12} strokeWidth={3} /> Accepted
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center">
                                                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${stat.no_hover_count > 5
                                                                ? 'bg-rose-50 text-rose-600 border-rose-200'
                                                                : stat.no_hover_count > 0
                                                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                                    : 'text-slate-400 border-transparent'
                                                                }`}>
                                                                {stat.no_hover_count} Rejections
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {stat.recipient_name ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">💌</span>
                                                                <span className="font-medium text-slate-700">{stat.recipient_name}</span>
                                                            </div>
                                                        ) : stat.mystery_name ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">✨</span>
                                                                <span className="font-medium text-indigo-600">{stat.mystery_name}</span>
                                                                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">(Entered)</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs italic">Waiting...</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <div className="flex flex-col gap-1">
                                                            {stat.location && (
                                                                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                                                    🌍 {stat.location}
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded w-fit border border-slate-100">
                                                                {stat.ip_address || '---'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                                                            <Smartphone size={14} className="text-slate-400" />
                                                            <span className="max-w-[120px] truncate" title={stat.device_type}>
                                                                {stat.device_type ? stat.device_type.split('(')[0].replace('Mozilla/5.0', '').trim() || 'Device' : 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell text-slate-400 text-xs font-medium">
                                                        {new Date(stat.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                            <span>Showing {stats.length} records</span>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                                <button className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
