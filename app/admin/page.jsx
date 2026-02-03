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

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Sender Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-center">Interactions</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Reveal Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs hidden md:table-cell">Device Info</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs hidden md:table-cell">CREATED AT</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                                <Search size={32} className="mx-auto mb-3 opacity-20" />
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat) => (
                                            <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 font-sans">
                                                    {stat.sender_name}
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{stat.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {stat.is_accepted ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                            Accepted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-mono font-semibold ${stat.no_hover_count > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                                                        {stat.no_hover_count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {stat.mystery_name ? (
                                                        <span className="text-slate-900 font-medium">"{stat.mystery_name}"</span>
                                                    ) : (
                                                        <span className="text-slate-300 italic">Not revealed</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-slate-500 truncate max-w-[200px]" title={stat.device_type}>
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone size={14} className="text-slate-300" />
                                                        {stat.device_type ? stat.device_type.split('(')[0].trim() : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-300" />
                                                        {new Date(stat.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
