'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const API_URL = '/api';
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

export default function ProposalClient({ id }) {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
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
        setAccepted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFC5D3', '#FF4D6D']
        });
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }
        axios.post(`${API_URL}/proposals/${id}/accept`, {}).catch(console.error);
    };

    if (loading) return <div className="flex h-screen items-center justify-center text-[#FF4D6D] text-2xl font-bold">Loading Cuteness... 🧸</div>;
    if (!proposal) return <div className="flex h-screen items-center justify-center text-4xl">💔</div>;

    const yesScale = Math.min(1.5, 1 + noCount * 0.1);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <button
                onClick={toggleMusic}
                className="absolute top-4 right-4 z-50 p-2 bg-white/50 rounded-full hover:bg-white transition-all text-[#FF4D6D]"
            >
                {isPlaying ? <Volume2 /> : <VolumeX />}
            </button>

            <AnimatePresence mode="wait">
                {!accepted ? (
                    <motion.div
                        key="ask"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card max-w-lg w-full"
                    >
                        <h1 className="text-4xl md:text-5xl mb-2 text-[#FF4D6D] drop-shadow-sm font-fredoka">Will you be my Valentine?</h1>
                        <p className="mb-6 text-gray-500 text-sm">Official invite from your admirer 💌</p>

                        <img
                            src="https://media.tenor.com/N2oqtqaB_G0AAAAi/peach-goma-phone.gif"
                            className="w-48 mx-auto mb-8 rounded-xl object-cover floating-sticker"
                        />

                        <div className="flex justify-center gap-4 relative h-20 items-center">
                            <motion.button
                                className="btn btn-primary shadow-xl"
                                style={{ transform: `scale(${yesScale})` }}
                                whileHover={{ scale: yesScale * 1.1 }}
                                onClick={handleYes}
                            >
                                YES! 💖
                            </motion.button>

                            <motion.button
                                className="btn bg-gray-300 text-gray-600 absolute"
                                style={{
                                    transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                                    position: 'relative' // Keeps it in flow initially, but transform moves it
                                }}
                                animate={{ x: noPosition.x, y: noPosition.y }}
                                onMouseEnter={handleNoHover}
                            >
                                No 🙄
                            </motion.button>
                        </div>

                        {/* Date Ideas Section */}
                        <div className="mt-12 text-left">
                            <h3 className="text-[#FF4D6D] font-bold mb-4 text-xl">Our Virtual Date Ideas 📱</h3>
                            <div className="date-idea">
                                <span className="text-2xl">🎬</span>
                                <div>
                                    <p className="font-bold text-gray-700">Netflix Party + Video Call</p>
                                    <p className="text-xs text-gray-500">(I'll let you pick the movie... maybe)</p>
                                </div>
                            </div>
                            <div className="date-idea">
                                <span className="text-2xl">🍕</span>
                                <div>
                                    <p className="font-bold text-gray-700">Order Food & Eat Together</p>
                                    <p className="text-xs text-gray-500">(Pizza? Sushi? You decide!)</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card max-w-lg w-full"
                    >
                        <h1 className="text-4xl mb-2 text-[#FF4D6D]">Good choice babu 😌</h1>
                        <p className="text-gray-600 mb-8">You just unlocked unlimited hugs, kisses, and cuddles!</p>

                        <div className="flex justify-center gap-4 mb-8">
                            <img src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" className="w-32 rounded-xl shadow-md border-2 border-white" />
                            <img src="https://media.tenor.com/gm_5C8aXbEkAAAAi/peach-goma.gif" className="w-32 rounded-xl shadow-md border-2 border-white" />
                        </div>

                        {proposal.custom_message && (
                            <div className="bg-[#FFF0F3] p-4 rounded-xl border border-[#FFC5D3] mb-8">
                                <p className="font-handwriting text-2xl text-[#800F2F]">"{proposal.custom_message}"</p>
                            </div>
                        )}

                        <p className="font-bold text-[#FF4D6D] text-lg mb-8">Now you're stuck with me forever ∞</p>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-xs text-gray-400 mb-2">Wait... do you want to change your mind? 🤔</p>
                            <button className="btn bg-gray-200 text-gray-400 text-sm cursor-not-allowed">Actually... No 😈</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
