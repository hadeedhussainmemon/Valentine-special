'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, MessageCircleHeart } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api';

export default function Home() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateLink = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/proposals`, {
                sender_name: name,
                custom_message: message
            });
            const proposalId = res.data.id;
            const fullLink = `${window.location.origin}/p/${proposalId}`;
            setLink(fullLink);
        } catch (error) {
            console.error('Error creating link:', error);
            alert('Failed to create link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
            >
                <Heart className="w-24 h-24 text-white mx-auto mb-4 animate-pulse drop-shadow-xl" color="#fff" fill="#D4145A" strokeWidth={0} size={90} />
                <h1 className="text-7xl md:text-8xl mb-4 font-romantic">HeartString</h1>
                <p className="mb-8 font-light italic text-2xl opacity-90 tracking-wide font-serif">"Because every love story deserves a beautiful beginning."</p>

                <div className="h-px w-32 bg-white/40 mx-auto mb-8"></div>
                <p className="mb-6 text-sm uppercase tracking-[0.3em] opacity-80 font-bold">Create Your Proposal</p>

                {!link ? (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name (e.g., Alex)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea
                            placeholder="Secret Note (Optional) - Revealed after they say Yes! 💌"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 outline-none focus:bg-white/30 transition-all resize-none h-24"
                        />

                        <button
                            className="btn btn-primary"
                            onClick={generateLink}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Magic Link ✨'}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="p-4 bg-white/10 rounded-lg break-all">
                            <p className="text-sm opacity-70 mb-2">Share this link:</p>
                            <p className="font-mono text-sm">{link}</p>
                        </div>
                        <button
                            className="btn btn-success flex items-center justify-center gap-2"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                            className="btn mt-2 bg-white/10 hover:bg-white/20 text-white"
                            onClick={() => { setLink(''); setName(''); setMessage(''); }}
                        >
                            Create Another
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
