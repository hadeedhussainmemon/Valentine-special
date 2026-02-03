'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX } from 'lucide-react';

const API_URL = '/api';
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

export default function ProposalClient({ id }) {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noCount, setNoCount] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [mysteryName, setMysteryName] = useState('');
    const [submittedName, setSubmittedName] = useState(false);

    // Music State
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        const fetchProposal = async () => {
            try {
                // Ensure ID is valid before request
                if (!id) throw new Error("No ID provided");

                const res = await axios.get(`${API_URL}/proposals/${id}`);
                setProposal(res.data);

                if (res.data.is_accepted) {
                    setAccepted(true);
                    setSubmittedName(!!res.data.mystery_name);
                }
            } catch (err) {
                console.error('Error fetching proposal:', err);
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProposal();
        } else {
            setLoading(false);
            setError("Invalid Link ID");
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [id]);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("User must interact first", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNoHover = async () => {
        setNoCount(prev => prev + 1);
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoPosition({ x, y });

        try {
            await axios.post(`${API_URL}/proposals/${id}/interaction`);
        } catch (error) { console.error(error); }
    };

    const handleYesClick = async () => {
        setAccepted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4D6D', '#FF8FA3', '#FFFFFF']
        });

        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
        }

        try {
            await axios.post(`${API_URL}/proposals/${id}/accept`, {
                device_type: navigator.userAgent
            });
        } catch (error) { console.error(error); }
    };

    const submitMysteryName = async () => {
        if (!mysteryName.trim()) return;
        try {
            await axios.post(`${API_URL}/proposals/${id}/accept`, {
                mystery_name: mysteryName
            });
            setSubmittedName(true);
            confetti({ particleCount: 50, spread: 50 });
        } catch (error) {
            console.error('Error submitting name:', error);
        }
    };

    if (loading) return <div className="text-white text-center mt-20 text-2xl animate-pulse">Loading magic... ✨</div>;

    if (error || !proposal) return (
        <div className="text-white text-center mt-20">
            <h1 className="text-4xl mb-4">💔</h1>
            <p className="text-xl">Proposal not found or expired.</p>
            <p className="text-sm opacity-50 mt-2">{error}</p>
        </div>
    );

    const noScale = Math.max(0.5, 1 - noCount * 0.1);
    const yesScale = Math.min(2, 1 + noCount * 0.2);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative w-full">
            <button
                onClick={toggleMusic}
                className="absolute top-4 right-4 z-50 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all backdrop-blur-md border border-white/20"
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? <Volume2 className="text-white animate-pulse" /> : <VolumeX className="text-white/70" />}
            </button>

            <AnimatePresence mode="wait">
                {!accepted ? (
                    <motion.div
                        key="question"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="glass-card z-10"
                    >
                        <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" fill="#FF4D6D" strokeWidth={0} />
                        <h1 className="mb-8">{proposal.sender_name} asks...</h1>
                        <p className="text-3xl font-bold mb-12">Will you be my Valentine? 🌹</p>

                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center h-24">
                            <motion.button
                                className="btn btn-primary text-xl px-8 py-3 rounded-full"
                                style={{ transform: `scale(${yesScale})` }}
                                whileHover={{ scale: yesScale * 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleYesClick}
                            >
                                YES! ❤️
                            </motion.button>

                            <motion.button
                                className="btn bg-gray-500 text-white text-sm px-4 py-2 rounded-full absolute"
                                style={{
                                    transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                                    position: 'relative'
                                }}
                                animate={{ x: noPosition.x, y: noPosition.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onMouseEnter={handleNoHover}
                                onClick={handleNoHover}
                            >
                                No 💔
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card z-10 max-w-lg"
                    >
                        <h1 className="text-5xl mb-4">Yay! ❤️</h1>
                        <p className="text-xl mb-6">You've made {proposal.sender_name} the happiest person!</p>

                        {proposal.custom_message && (
                            <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Secret Message from {proposal.sender_name}:</p>
                                <p className="font-handwriting text-2xl italic leading-relaxed" style={{ fontFamily: 'Great Vibes, cursive' }}>
                                    "{proposal.custom_message}"
                                </p>
                            </div>
                        )}

                        {!submittedName && !proposal.mystery_name ? (
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="mb-4 text-sm opacity-80">Who is this wonderful person? (Optional)</p>
                                <div className="flex gap-2 justify-center">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={mysteryName}
                                        onChange={(e) => setMysteryName(e.target.value)}
                                        className="max-w-[200px]"
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={submitMysteryName}
                                    >
                                        Reveal 🎭
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-8 text-white/60 italic">
                                ~ {proposal.mystery_name || submittedName ? mysteryName : 'A Mysterious Admirer'} ~
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Animations */}
            <Heart className="heart" style={{ left: '10%', animationDelay: '0s' }} size={30} />
            <Heart className="heart" style={{ left: '30%', animationDelay: '2s' }} size={40} />
            <Heart className="heart" style={{ left: '70%', animationDelay: '4s' }} size={25} />
            <Heart className="heart" style={{ left: '90%', animationDelay: '1s' }} size={35} />
            <div className="unicorn" style={{ animationDelay: '0s', left: '10%' }}>🦄</div>
            <div className="unicorn" style={{ animationDelay: '5s', left: '50%' }}>🦄</div>
        </div>
    );
}
