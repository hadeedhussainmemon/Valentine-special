'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';

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
            alert('Oops! Something went wrong. Try again!');
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
        <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
            >
                {/* Cute Header Image */}
                <img
                    src="https://media.tenor.com/N2oqtqaB_G0AAAAi/peach-goma-phone.gif"
                    alt="Cute Bear"
                    className="w-32 mx-auto mb-4 floating-sticker"
                />

                <h1 className="text-4xl md:text-5xl mb-2 text-[#FF4D6D]">Valentine Generator 💝</h1>
                <p className="mb-8 text-lg opacity-80">Make it cute. Make it yours.</p>

                {!link ? (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name (e.g., Pookie)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea
                            placeholder="A secret message for them... 💌"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="h-24"
                        />

                        <button
                            className="btn btn-primary"
                            onClick={generateLink}
                            disabled={loading}
                        >
                            {loading ? 'Cooking...' : 'Create Invite 🎀'}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="p-4 bg-white/50 rounded-xl border-2 border-[#FFC5D3] break-all">
                            <p className="text-sm opacity-70 mb-2">Send this to your cutie:</p>
                            <p className="font-mono text-sm font-bold text-[#FF4D6D]">{link}</p>
                        </div>
                        <button
                            className="btn btn-secondary flex items-center justify-center gap-2"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                            className="text-sm text-gray-400 hover:text-[#FF4D6D] mt-2 underline"
                            onClick={() => { setLink(''); setName(''); setMessage(''); }}
                        >
                            Make Another One
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
