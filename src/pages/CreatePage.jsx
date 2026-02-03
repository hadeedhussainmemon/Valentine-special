import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, MessageCircleHeart } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api';

const CreatePage = () => {
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
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
            alert(`Failed to create link: ${errorMsg}`);
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
        >
            <Heart className="w-20 h-20 text-primary mx-auto mb-2 animate-pulse drop-shadow-lg" color="#FF4D6D" fill="#FF4D6D" strokeWidth={1.5} size={80} />
            <h1>HeartString</h1>
            <p className="mb-6 font-light italic text-lg opacity-90">"Because every love story deserves a beautiful beginning."</p>

            <p className="mb-4 text-sm uppercase tracking-widest opacity-70">create your proposal</p>

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

                    <p className="text-xs opacity-60 mt-2">
                        <MessageCircleHeart size={14} className="inline mr-1" />
                        Tip: Add a date time or location in the secret note!
                    </p>
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
    );
};

export default CreatePage;
