'use client';

import { useState } from 'react';
import axios from 'axios';
import { RefreshCw, Heart, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

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

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card flex flex-col items-center gap-6"
                >
                    <div className="bg-white/10 p-4 rounded-full">
                        <Lock size={40} className="text-pink-200" />
                    </div>
                    <div>
                        <h1 className="text-3xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Admin Access</h1>
                        <p className="opacity-80">Please enter the secret password.</p>
                    </div>

                    <div className="w-full max-w-xs">
                        <input
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && login()}
                            className="text-center"
                        />
                        {loginError && <p className="text-red-200 text-sm mt-2">{loginError}</p>}

                        <button
                            className="btn btn-primary w-full mt-4 flex justify-center items-center gap-2"
                            onClick={login}
                            disabled={loading}
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : <LogIn size={18} />}
                            {loading ? 'Verifying...' : 'Unlock Dashboard'}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl p-4 mx-auto pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 glass-card w-full mx-auto px-8 py-4">
                <div className="flex items-center gap-3">
                    <Heart className="text-primary animate-pulse" fill="#FF4D6D" />
                    <h1 className="text-4xl m-0" style={{ fontFamily: "'Great Vibes', cursive" }}>HeartString Admin</h1>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors mt-4 md:mt-0"
                    title="Refresh Stats"
                >
                    <RefreshCw className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="glass-card w-full mx-auto p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/10 text-pink-200 uppercase text-xs tracking-wider">
                                <th className="p-4">Sender</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Dodges</th>
                                <th className="p-4">Mystery Reveal</th>
                                <th className="p-4">Device</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat) => (
                                <tr key={stat.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-lg">{stat.sender_name}</td>
                                    <td className="p-4">
                                        {stat.is_accepted ? (
                                            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 uppercase tracking-wide">
                                                Accepted ❤️
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 uppercase tracking-wide">
                                                Pending ⏳
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center font-mono opacity-80">{stat.no_hover_count}</td>
                                    <td className="p-4 italic text-white/90 font-medium">
                                        {stat.mystery_name || <span className="opacity-30">-</span>}
                                    </td>
                                    <td className="p-4 text-xs opacity-70">{stat.device_type || 'Unknown'}</td>
                                    <td className="p-4 text-xs opacity-50 font-mono">
                                        {new Date(stat.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {stats.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center opacity-50 italic">
                                        No love stories created yet...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-white/50 hover:text-white text-sm"
                >
                    Lock Dashboard
                </button>
            </div>
        </div>
    );
};
