import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Minus, Plus, Loader2, ShieldCheck, Zap, CreditCard, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import YocoPayment from '../components/YocoPayment'; // Import Yoco Component

export default function ContestantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contestant, setContestant] = useState(null);
    const [votes, setVotes] = useState(1);
    const [email, setEmail] = useState(''); // Kept for receipt/record purposes if needed
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchContestant();
    }, [id]);

    const fetchContestant = async () => {
        const { data, error } = await supabase.from('contestants').select('*').eq('id', id).single();
        if (error) console.error("Error:", error);
        setContestant(data);
    };

    const totalAmountZAR = votes * 2;
    const amountInCents = totalAmountZAR * 100;

    const handleYocoSuccess = async () => {
        setIsProcessing(true);
        // Refresh data to show new vote count immediately
        await fetchContestant();
        setIsProcessing(false);
        // Optional: Navigate or show success message
        // navigate('/'); 
    };

    if (!contestant) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF4F8]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="animate-spin text-pink-600 w-12 h-12 relative z-10" />
                </div>
                <p className="text-xs font-mono text-pink-400 animate-pulse">INITIALIZING DATA STREAM...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDF4F8] text-slate-800 font-sans selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden relative">

            {/* 0. BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-b from-pink-300/20 to-purple-300/20 rounded-full blur-[80px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-t from-blue-300/20 to-cyan-300/20 rounded-full blur-[80px] mix-blend-multiply" />
            </div>

            {/* 1. NAV HEADER */}
            <div className="relative z-20 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="group flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                    <ArrowLeft size={16} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 tracking-wide">RETURN</span>
                </Link>
                <div className="flex items-center gap-2 bg-pink-100/50 px-3 py-1 rounded-full border border-pink-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-pink-700 font-bold">SECURE_CONNECTION</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

                    {/* LEFT COLUMN: CONTESTANT PROFILE (Mobile: Top) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Holographic Image Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white/40 shadow-2xl border border-white/50"
                        >
                            <img src={contestant.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={contestant.name} />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                            {/* Floating ID Tag */}
                            <div className="absolute top-6 right-6">
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl flex flex-col items-center">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/70">ID Code</span>
                                    <span className="text-2xl font-black font-mono leading-none">#{contestant.number}</span>
                                </div>
                            </div>

                            {/* Name & Bio Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl font-black tracking-tight mb-2"
                                >
                                    {contestant.name}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/90 font-medium max-w-2xl"
                                >
                                    {contestant.bio && <p className="leading-relaxed drop-shadow-md">{contestant.bio}</p>}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                                    <Zap className="fill-current" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Power</p>
                                    <p className="text-2xl font-black text-slate-900">{contestant.votes.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Share2 size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share Profile</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert("Link copied to clipboard!");
                                        }}
                                        className="text-sm font-bold text-blue-600 hover:underline"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: VOTING CONSOLE (Mobile: Bottom) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-5 sticky top-24"
                    >
                        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-6 md:p-8 relative overflow-hidden">

                            {/* Decorative Tech Lines */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-slate-900 rounded-lg text-white">
                                    <CreditCard size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">VOTING TERMINAL</h2>
                            </div>

                            {/* Ticket Selector */}
                            <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Vote Quantity</span>
                                    <span className="text-xs font-mono text-pink-600 font-bold bg-pink-100 px-2 py-1 rounded">R2.00 / UNIT</span>
                                </div>

                                <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
                                    <button
                                        onClick={() => setVotes(Math.max(1, votes - 1))}
                                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>

                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-slate-900 tabular-nums leading-none">{votes}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">VOTES</span>
                                    </div>

                                    <button
                                        onClick={() => setVotes(votes + 1)}
                                        className="w-12 h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-colors shadow-lg shadow-slate-900/20"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Summary & Pay */}
                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-slate-500">ZAR</span>
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalAmountZAR}.00</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                            <ShieldCheck size={14} />
                                            <span className="text-[10px] font-bold">SSL SECURE</span>
                                        </div>
                                    </div>
                                </div>

                                <YocoPayment
                                    amountInCents={amountInCents}
                                    contestantId={contestant.id}
                                    voteCount={votes}
                                    onSuccess={handleYocoSuccess}
                                />
                            </div>

                            <div className="mt-4 flex justify-center">
                                <p className="text-[10px] text-slate-400 font-mono">POWERED BY YOCO PAYMENT GATEWAY</p>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}