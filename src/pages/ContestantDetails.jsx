import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Minus, Plus, Loader2, ShieldCheck, Zap, CreditCard, Share2, Crown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YocoPayment from '../components/YocoPayment';

export default function ContestantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contestant, setContestant] = useState(null);
    const [votes, setVotes] = useState(5); // Default to a higher package for better UX
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchContestant();
    }, [id]);

    const fetchContestant = async () => {
        const { data, error } = await supabase.from('contestants').select('*').eq('number', id).single();
        if (error) console.error("Error:", error);
        setContestant(data);
    };

    const totalAmountZAR = (Number(votes) || 0) * 2;
    const amountInCents = totalAmountZAR * 100;

    const handlePaymentSuccess = async () => {
        setIsProcessing(true);
        await fetchContestant(); // Refresh vote count
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000); // Hide success message after 5s
    };

    if (!contestant) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF2F8]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse"></div>
                    <Loader2 className="animate-spin text-pink-600 w-12 h-12 relative z-10" />
                </div>
                <p className="text-xs font-mono text-pink-400 animate-pulse tracking-widest">INITIALIZING DATA STREAM...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDF2F8] text-slate-800 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative">

            {/* 0. BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-b from-pink-300/20 to-purple-300/20 rounded-full blur-[80px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-t from-blue-300/20 to-cyan-300/20 rounded-full blur-[80px] mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="bg-white rounded-[2rem] p-8 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-emerald-50 opacity-50" />
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                                <CheckCircle2 size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 relative z-10">Vote Registered!</h3>
                            <p className="text-slate-500 font-medium mb-6 relative z-10">Thank you for supporting {contestant.name}.</p>
                            <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors relative z-10">
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. NAV HEADER */}
            <div className="relative z-20 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/home" className="group flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                    <ArrowLeft size={16} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 tracking-wide">RETURN</span>
                </Link>
                <div className="flex items-center gap-2 bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200/50 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold tracking-wider">SECURE_CONNECTION</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: CONTESTANT PROFILE */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Holographic Image Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group w-full aspect-[3/4] md:aspect-[16/9] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-pink-200/50 border-[6px] border-white"
                        >
                            <img src={contestant.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={contestant.name} />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                            {/* Floating ID Tag */}
                            <div className="absolute top-6 right-6 z-20">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl flex flex-col items-center shadow-lg">
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/70 mb-0.5">Contestant</span>
                                    <span className="text-2xl font-black font-mono leading-none tracking-tight">#{contestant.number.toString().padStart(3, '0')}</span>
                                </div>
                            </div>

                            {/* Name & Bio Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-20">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 drop-shadow-lg">
                                        {contestant.name}
                                    </h1>
                                    <div className="h-1 w-20 bg-pink-500 rounded-full mb-4" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="max-w-2xl"
                                >
                                    {contestant.bio ? (
                                        <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-none">
                                            {contestant.bio}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-white/60 italic">No biography available.</p>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
                                    <Zap className="fill-current" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Votes</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tight">{contestant.votes.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Profile link copied!");
                                }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                    <Share2 size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Share Profile</p>
                                    <p className="text-sm font-black text-blue-600 group-hover:underline">Copy Link</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: VOTING TERMINAL */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-5 sticky top-24"
                    >
                        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8 relative overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">VOTING TERMINAL</h2>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Secure Transaction Gateway</p>
                                </div>
                            </div>

                            {/* Ticket Selector */}
                            <div className="bg-slate-50/80 rounded-[2rem] p-6 border border-slate-100 mb-8 relative group hover:border-pink-200 transition-colors">
                                <div className="absolute -top-3 left-6 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-200 shadow-sm">
                                    Price: R2.00 / Vote
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <button
                                        onClick={() => setVotes(Math.max(1, (Number(votes) || 1) - 1))}
                                        className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                                    >
                                        <Minus size={24} />
                                    </button>

                                    <div className="flex flex-col items-center">
                                        <input
                                            type="number"
                                            value={votes}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    setVotes('');
                                                } else {
                                                    const parsed = parseInt(val);
                                                    if (!isNaN(parsed) && parsed >= 1) {
                                                        setVotes(parsed);
                                                    }
                                                }
                                            }}
                                            onBlur={() => {
                                                if (!votes || Number(votes) < 1) {
                                                    setVotes(1);
                                                }
                                            }}
                                            min="1"
                                            className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter w-24 text-center bg-transparent outline-none focus:ring-0 appearance-none m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">VOTES SELECTED</span>
                                    </div>

                                    <button
                                        onClick={() => setVotes((Number(votes) || 0) + 1)}
                                        className="w-14 h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                {/* Quick Select Presets */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {[5, 10, 20, 50].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setVotes(v)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${votes === v ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary & Pay */}
                            <div>
                                <div className="flex justify-between items-end mb-6 px-2">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">Total Amount</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-slate-400">ZAR</span>
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter">{totalAmountZAR}<span className="text-2xl text-slate-400">.00</span></span>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                            <ShieldCheck size={14} />
                                            <span className="text-[10px] font-black tracking-wide">SSL SECURE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="mb-6 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Receipt Email</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all text-sm font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
                                    />
                                </div>

                                <YocoPayment
                                    amountInCents={amountInCents}
                                    contestantId={contestant.id}
                                    voteCount={votes}
                                    onSuccess={handlePaymentSuccess}
                                    voterEmail={email}
                                />

                                <div className="mt-6 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <span className="text-[10px] font-mono text-slate-400 uppercase">Powered by</span>
                                    <img src="https://cdn.brandfetch.io/idXUo_X4BA/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1710900616703" alt="Yoco" className="h-4 w-auto object-contain" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}