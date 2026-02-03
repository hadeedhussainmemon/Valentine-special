'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Star, Sparkles, Check, ArrowDown } from 'lucide-react';

const API_URL = '/api';
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

// Floating Hearts Component
const FloatingHearts = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHearts(current => {
                const newHeart = {
                    id: Date.now(),
                    left: Math.random() * 100,
                    animationDuration: 3 + Math.random() * 4,
                    scale: 0.5 + Math.random() * 0.5
                };
                return [...current.slice(-20), newHeart];
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {hearts.map(h => (
                <motion.div
                    key={h.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 0] }}
                    transition={{ duration: h.animationDuration, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        left: `${h.left}%`,
                        fontSize: `${h.scale * 2}rem`,
                        color: 'rgba(255, 197, 211, 0.6)'
                    }}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    );
};

export default function ProposalClient({ id }) {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [noCount, setNoCount] = useState(0);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

    // Audio
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;

        axios.get(`${API_URL}/proposals/${id}`)
            .then(res => {
                setProposal(res.data);
                if (res.data.is_accepted) setAccepted(true);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        return () => audioRef.current?.pause();
    }, [id]);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play().catch(console.error);
        setIsPlaying(!isPlaying);
    };

    const handleNoHover = () => {
        setNoCount(prev => prev + 1);
        setNoPosition({
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100
        });
        axios.post(`${API_URL}/proposals/${id}/interaction`).catch(console.error);
    };

    const handleYes = () => {
        setShowNameModal(true);
    };

    const confirmAcceptance = () => {
        setShowNameModal(false);
        setAccepted(true);

        // Update local state so the success screen shows the name immediately
        setProposal(prev => ({ ...prev, mystery_name: enteredName }));

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFC5D3', '#FF4D6D']
        });
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }

        // Send the entered name as 'mystery_name'
        axios.post(`${API_URL}/proposals/${id}/accept`, { mystery_name: enteredName }).catch(console.error);
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-[#FF4D6D] text-2xl font-bold font-fredoka">Loading Cuteness... 🧸</div>;
    if (!proposal) return <div className="flex h-screen items-center justify-center text-4xl">💔</div>;

    const yesScale = Math.min(1.5, 1 + noCount * 0.1);

    return (
        <div className="relative min-h-screen font-fredoka overflow-x-hidden pb-20">
            <FloatingHearts />

            <button
                onClick={toggleMusic}
                className="fixed top-4 right-4 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full text-[#FF4D6D] shadow-lg border-2 border-[#FFC5D3] hover:scale-110 transition-transform"
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>

            <AnimatePresence mode="wait">
                {!accepted ? (
                    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-10 md:pt-20 space-y-24 z-10 relative">

                        {/* HERO SECTION */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card w-full text-center flex flex-col items-center"
                        >
                            <h1 className="text-4xl md:text-6xl mb-4 text-[#FF4D6D] drop-shadow-sm font-bold">
                                {proposal.recipient_name ? `Hey ${proposal.recipient_name}, ` : ''}
                                Will you be my Valentine?
                            </h1>
                            <p className="mb-6 text-[#800F2F] text-lg font-medium opacity-80">Official invite from {proposal.sender_name} 💌</p>

                            <img
                                src="https://media.tenor.com/N2oqtqaB_G0AAAAi/peach-goma-phone.gif"
                                className="w-64 mx-auto mb-8 rounded-xl object-cover floating-sticker shadow-[0_10px_40px_rgba(255,77,109,0.2)]"
                            />

                            <div className="flex justify-center gap-6 relative h-24 items-center">
                                <motion.button
                                    className="btn btn-primary shadow-xl text-xl px-10 py-4"
                                    style={{ transform: `scale(${yesScale})` }}
                                    whileHover={{ scale: yesScale * 1.1 }}
                                    onClick={handleYes}
                                >
                                    YES! 💖
                                </motion.button>

                                <motion.button
                                    className="btn bg-[#FFB3C6] text-[#800F2F] absolute font-bold hover:bg-[#FF8FAB]"
                                    style={{
                                        transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                                        position: 'relative'
                                    }}
                                    animate={{ x: noPosition.x, y: noPosition.y }}
                                    onMouseEnter={handleNoHover}
                                    onTouchStart={handleNoHover}
                                    onClick={handleNoHover}
                                >
                                    No 🙄
                                </motion.button>
                            </div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mt-8 text-[#FF4D6D] flex flex-col items-center gap-2 opacity-80"
                            >
                                <span className="text-xs uppercase tracking-widest font-bold">Scroll for reasons why</span>
                                <ArrowDown size={20} />
                            </motion.div>
                        </motion.div>

                        {/* REASONS SECTION */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full"
                        >
                            <h2 className="text-3xl font-bold text-[#FF4D6D] text-center mb-8 flex items-center justify-center gap-2">
                                <Sparkles size={28} /> Why I Chews You <Sparkles size={28} />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card !bg-[#FFF0F3]/60 hover:scale-105 transition-transform border border-[#FFB3C6]">
                                    <div className="text-4xl mb-4">🧠</div>
                                    <h3 className="text-xl font-bold text-[#800F2F] mb-2">You're Smort</h3>
                                    <p className="text-[#A4133C]">Like, way smarter than me. I need you to explain movies to me.</p>
                                </div>
                                <div className="glass-card !bg-[#FFF0F3]/60 hover:scale-105 transition-transform border border-[#FFB3C6]">
                                    <div className="text-4xl mb-4">🥰</div>
                                    <h3 className="text-xl font-bold text-[#800F2F] mb-2">You're Cute</h3>
                                    <p className="text-[#A4133C]">Actually illegal how cute you are. I'm calling the police.</p>
                                </div>
                                <div className="glass-card !bg-[#FFF0F3]/60 hover:scale-105 transition-transform border border-[#FFB3C6]">
                                    <div className="text-4xl mb-4">🥺</div>
                                    <h3 className="text-xl font-bold text-[#800F2F] mb-2">Your Smile</h3>
                                    <p className="text-[#A4133C]">Literally cures my depression. Don't stop smiling pls.</p>
                                </div>
                                <div className="glass-card !bg-[#FFF0F3]/60 hover:scale-105 transition-transform border border-[#FFB3C6]">
                                    <div className="text-4xl mb-4">🧸</div>
                                    <h3 className="text-xl font-bold text-[#800F2F] mb-2">Cuddles</h3>
                                    <p className="text-[#A4133C]">Top tier cuddler. 10/10 would nap again.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* PROMISES SECTION */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card w-full !bg-[#FFF0F3]/80 border border-[#FFB3C6]"
                        >
                            <h2 className="text-3xl font-bold text-[#FF4D6D] text-center mb-6">My Promises To You 🤞</h2>
                            <ul className="space-y-4 text-left max-w-md mx-auto">
                                {[
                                    "I will always share my french fries (maybe)",
                                    "I will text you back in 0.005 seconds",
                                    "I will listen to your drama",
                                    "I will always be your #1 fan",
                                    "I will buy you snacks without asking"
                                ].map((promise, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#590d22] text-lg font-medium">
                                        <div className="bg-[#FF4D6D] p-1 rounded-full text-white">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        {promise}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* MEMORIES SECTION */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full text-center"
                        >
                            <div className="glass-card p-8 rotate-1 hover:rotate-0 transition-transform duration-500 !bg-[#FFC5D3] border-4 border-white shadow-xl">
                                <h2 className="text-3xl font-bold text-[#800F2F] mb-4">Our Memories 📸</h2>
                                <div className="bg-[#FFF0F3] rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-[#FF4D6D] mb-4">
                                    <p className="text-[#FF8FAB] font-medium">Imagine a super cute photo of us here</p>
                                </div>
                                <p className="text-[#800F2F] italic">"Making memories since forever 💖"</p>
                            </div>
                        </motion.div>

                        {/* FINAL ASK */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            className="w-full text-center pb-20 flex flex-col items-center justify-center"
                        >
                            <p className="text-3xl font-bold text-[#FF4D6D] mb-8 font-handwriting">So... what do you say?</p>
                            <button
                                className="btn btn-primary shadow-xl px-12 py-5 text-2xl animate-bounce"
                                onClick={handleYes}
                            >
                                YES! I LOVE YOU! 💖
                            </button>
                        </motion.div>

                    </div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center min-h-screen px-4 z-10 relative"
                    >
                        <div className="glass-card max-w-lg w-full text-center border-4 border-[#FFC5D3]">
                            <h1 className="text-5xl mb-4 text-[#FF4D6D] font-bold">
                                {proposal.mystery_name || proposal.recipient_name
                                    ? `Yay! ${proposal.mystery_name || proposal.recipient_name} said YES! 💖`
                                    : "Good choice babu 😌"}
                            </h1>
                            <p className="text-[#800F2F] text-xl mb-8">You just unlocked unlimited hugs, kisses, and cuddles!</p>

                            <div className="flex justify-center gap-4 mb-8">
                                <img src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" className="w-32 rounded-xl shadow-md border-4 border-[#FFB3C6]" />
                                <img src="https://media.tenor.com/gm_5C8aXbEkAAAAi/peach-goma.gif" className="w-32 rounded-xl shadow-md border-4 border-[#FFB3C6]" />
                            </div>

                            {proposal.custom_message && (
                                <div className="bg-[#FFF0F3] p-6 rounded-xl border border-[#FFC5D3] mb-8 shadow-inner">
                                    <p className="font-handwriting text-3xl text-[#590d22]">"{proposal.custom_message}"</p>
                                </div>
                            )}

                            <p className="font-bold text-[#FF4D6D] text-lg mb-8">Now you're stuck with me forever ∞</p>

                            <div className="border-t border-[#FFC5D3] pt-6 mt-6">
                                <h3 className="text-[#FF4D6D] font-bold mb-4 text-xl">What's Next? 📱</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="date-idea bg-[#FFF0F3] border border-[#FFB3C6]">
                                        <span className="text-2xl">🎬</span>
                                        <div className="text-left">
                                            <p className="font-bold text-[#800F2F]">Netflix Party + Video Call</p>
                                            <p className="text-xs text-[#FF8FAB]">Get the popcorn ready!</p>
                                        </div>
                                    </div>
                                    <div className="date-idea bg-[#FFF0F3] border border-[#FFB3C6]">
                                        <span className="text-2xl">🍕</span>
                                        <div className="text-left">
                                            <p className="font-bold text-[#800F2F]">Order Food & Eat Together</p>
                                            <p className="text-xs text-[#FF8FAB]">I'm paying (this time)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Name Input Modal */}
            <AnimatePresence>
                {showNameModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border-4 border-[#FFC5D3] text-center"
                        >
                            <h3 className="text-2xl font-bold text-[#FF4D6D] mb-4">Wait! One last thing... 👀</h3>
                            <p className="text-[#800F2F] mb-6">What should I call you? (So I know who accepted!)</p>

                            <input
                                autoFocus
                                type="text"
                                placeholder="Your Name (e.g. Alex)"
                                value={enteredName}
                                onChange={(e) => setEnteredName(e.target.value)}
                                className="w-full p-4 bg-[#FFF0F3] border-2 border-[#FFB3C6] rounded-xl text-center text-lg font-bold text-[#FF4D6D] focus:outline-none focus:border-[#FF4D6D] mb-6 placeholder:text-[#FFB3C6] placeholder:font-normal"
                                onKeyDown={(e) => e.key === 'Enter' && enteredName.trim() && confirmAcceptance()}
                            />

                            <button
                                onClick={confirmAcceptance}
                                disabled={!enteredName.trim()}
                                className="w-full btn btn-primary py-4 text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm & Say YES! 💖
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
