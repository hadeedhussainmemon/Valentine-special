'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, LayoutDashboard, Lock, LogIn, Smartphone, Calendar, Search, ArrowRight } from 'lucide-react';
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
            <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Proposals</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {stats.filter(s => s.is_accepted).length}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
                            <p className="text-3xl font-bold text-amber-500 mt-2">
                                {stats.filter(s => !s.is_accepted).length}
                            </p>
                        </div>
                    </div>

                    {/* Professional Data Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs whitespace-nowrap">Sender Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs whitespace-nowrap">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs text-center whitespace-nowrap">Interactions</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs whitespace-nowrap">Mystery Reveal</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell whitespace-nowrap">Device Info</th>
                                        <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs hidden md:table-cell whitespace-nowrap">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center">
                                                    <Search size={32} className="mb-3 opacity-20" />
                                                    <p>No proposals found yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat) => (
                                            <tr key={stat.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{stat.sender_name}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 select-all">{stat.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {stat.is_accepted ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                            Accepted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold w-12 text-center ${stat.no_hover_count > 0
                                                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                                : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {stat.no_hover_count}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 cursor-default">
                                                    {stat.mystery_name ? (
                                                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                                                            <span>✨</span>
                                                            <span className="font-medium">"{stat.mystery_name}"</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs italic pl-2">Waiting...</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs bg-white border border-slate-100 rounded px-2 py-1 w-fit shadow-sm">
                                                        <Smartphone size={12} className="text-slate-400" />
                                                        <span className="max-w-[150px] truncate" title={stat.device_type}>
                                                            {stat.device_type ? stat.device_type.split('(')[0].trim() : 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-slate-500 text-xs">
                                                    {new Date(stat.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))
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
