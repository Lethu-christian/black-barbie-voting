import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Crown, ArrowLeft, Zap, Sparkles, Activity, Globe, Hexagon, BarChart3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Main Component ---
export default function Leaderboard() {
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContestants = async () => {
            const { data } = await supabase.from('contestants').select('*').order('votes', { ascending: false });
            if (data) setContestants(data);
            setLoading(false);
        };
        fetchContestants();

        const sub = supabase.channel('leaderboard')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contestants' }, (payload) => {
                setContestants(curr => {
                    const updated = curr.map(c => c.id === payload.new.id ? { ...c, votes: payload.new.votes } : c);
                    return updated.sort((a, b) => b.votes - a.votes);
                });
            }).subscribe();
        return () => supabase.removeChannel(sub);
    }, []);

    const top3 = contestants.slice(0, 3);
    const others = contestants.slice(3);
    const maxVotes = contestants.length > 0 ? contestants[0].votes : 100; // For progress bar scaling

    return (
        <div className="min-h-screen bg-[#fff0f5] text-slate-800 font-sans selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden relative">

            {/* --- ADVANCED BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Perspective Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                {/* Moving Orbs */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-300/30 blur-[120px] rounded-full mix-blend-multiply"
                />
                <motion.div
                    animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-300/30 blur-[120px] rounded-full mix-blend-multiply"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-200/10 blur-[100px] rounded-full"
                />
            </div>

            <div className="relative z-10 pb-24">
                {/* --- HUD HEADER --- */}
                <Header />

                {/* --- PODIUM STAGE --- */}
                <main className="max-w-6xl mx-auto px-4 pt-8">
                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <div className="animate-spin text-pink-500"><Hexagon size={48} /></div>
                        </div>
                    ) : (
                        <>
                            {/* Top 3 Display */}
                            <div className="relative mb-16 mt-8">
                                {/* Decorative Ring behind podium */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-64 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-3xl -z-10" />

                                <div className="flex justify-center items-end gap-4 md:gap-8 h-[420px]">
                                    {top3[1] && <PodiumCard data={top3[1]} rank={2} delay={0.2} />}
                                    {top3[0] && <PodiumCard data={top3[0]} rank={1} delay={0} />}
                                    {top3[2] && <PodiumCard data={top3[2]} rank={3} delay={0.4} />}
                                </div>
                            </div>

                            {/* --- DATA LIST --- */}
                            <div className="max-w-3xl mx-auto">
                                <div className="flex items-center justify-between mb-6 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-pink-100">
                                            <Activity size={16} className="text-pink-500" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest font-mono">
                                            Active Contenders
                                        </span>
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 bg-white/50 px-2 py-1 rounded border border-white">
                                        TOTAL: {contestants.length}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence mode='popLayout'>
                                        {others.map((c, idx) => (
                                            <ContestantRow
                                                key={c.id}
                                                contestant={c}
                                                index={idx + 4}
                                                maxVotes={maxVotes}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* 5. OFFICIAL SPONSORS / FOOTER */}
            <footer className="w-full bg-white/40 backdrop-blur-3xl border-t border-white shadow-[0_-10px_40px_rgba(236,72,153,0.05)] relative z-20 pb-28 md:pb-16 pt-16 mt-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-black text-[10px] tracking-widest uppercase mb-10 border border-pink-200 shadow-sm"
                    >
                        <Zap size={14} /> MEET OUR SPONSORS
                    </motion.div>

                    <div className="w-full overflow-hidden pb-12 pt-4 relative mask-image-gradient">
                        <style>{`
                            @keyframes scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .marquee-track {
                                display: flex;
                                flex-direction: row;
                                flex-wrap: nowrap;
                                align-items: center;
                                gap: 2rem;
                                width: max-content;
                                animation: scroll 40s linear infinite;
                            }
                            @media (min-width: 768px) {
                                .marquee-track { gap: 4rem; animation-duration: 50s; }
                            }
                            @media (min-width: 1024px) {
                                .marquee-track { gap: 5rem; animation-duration: 60s; }
                            }
                            .marquee-container {
                                mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                                -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            }
                        `}</style>
                        <div className="marquee-container w-full overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-700">
                            <div className="marquee-track">
                                {[
                                    // Array is duplicated to create a seamless infinite loop
                                    { id: '1a', src: "/bbbtk.png" }, { id: '2a', src: "/2.png" },
                                    { id: '3a', src: "/3.png" }, { id: '4a', src: "/4.png" },
                                    { id: '5a', src: "/5.png" }, { id: '6a', src: "/6.png" },
                                    { id: '7a', src: "/7.png" }, { id: '8a', src: "/8.png" },
                                    { id: '1b', src: "/bbbtk.png" }, { id: '2b', src: "/2.png" },
                                    { id: '3b', src: "/3.png" }, { id: '4b', src: "/4.png" },
                                    { id: '5b', src: "/5.png" }, { id: '6b', src: "/6.png" },
                                    { id: '7b', src: "/7.png" }, { id: '8b', src: "/8.png" },
                                ].map((sponsor, index) => (
                                    <motion.div
                                        key={sponsor.id}
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: (index % 8) * 0.2 // Keep bounce timing synced across duplicates
                                        }}
                                        whileHover={{ scale: 1.15 }}
                                        className="relative flex items-center justify-center w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0 transition-transform duration-500 cursor-pointer"
                                    >
                                        <img
                                            src={sponsor.src}
                                            alt={`Sponsor ${sponsor.id}`}
                                            className="w-full h-full object-contain filter drop-shadow-sm hover:drop-shadow-xl transition-all"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200/50">
                        <div className="flex items-center gap-3">
                            <Crown size={20} className="text-pink-500" />
                            <span className="font-black tracking-tighter text-slate-900 text-sm">BLACK BARBIE AMBASSADOR</span>
                        </div>
                        <p className="font-bold text-xs text-slate-400 uppercase tracking-widest">© 2025 All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- SUB COMPONENTS ---

function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/home" className="group relative overflow-hidden p-2.5 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-all active:scale-95">
                        <div className="absolute inset-0 bg-pink-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <ArrowLeft size={18} className="relative z-10 text-slate-700 group-hover:text-pink-600" />
                    </Link>

                    <div className="hidden md:block w-px h-8 bg-slate-300/50" />

                    <div>
                        <h1 className="text-lg font-black tracking-tighter text-slate-800 flex items-center gap-2">
                            GLOBAL <span className="text-pink-500">RANKINGS</span>
                        </h1>
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            System Online
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg shadow-lg shadow-pink-500/20">
                        <Globe size={12} className="text-pink-400 animate-[spin_10s_linear_infinite]" />
                        <span className="text-[10px] font-mono tracking-widest">NET_V.2.0</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

function PodiumCard({ data, rank, delay }) {
    const isFirst = rank === 1;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
                "relative flex flex-col items-center group",
                isFirst ? "w-1/3 z-20" : "w-1/4 z-10"
            )}
        >
            {/* Crown for #1 */}
            {isFirst && (
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-12 z-30"
                >
                    <Crown size={32} className="text-amber-400 fill-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                </motion.div>
            )}

            {/* Avatar Container */}
            <div className="relative mb-4">
                {/* Glowing Ring */}
                <div className={cn(
                    "absolute inset-0 rounded-[2rem] blur-xl opacity-60 transition-all duration-500",
                    isFirst ? "bg-gradient-to-tr from-amber-300 to-pink-500 group-hover:opacity-80 scale-110" : "bg-slate-300"
                )} />

                <div className={cn(
                    "relative overflow-hidden border-4 bg-white shadow-2xl transition-transform duration-300 group-hover:-translate-y-2",
                    isFirst ? "w-28 h-28 md:w-40 md:h-40 rounded-[2rem] border-amber-200" : "w-20 h-20 md:w-28 md:h-28 rounded-3xl border-white"
                )}>
                    <img src={data.image_url} alt={data.name} className="w-full h-full object-cover" />

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-50" />
                </div>

                {/* Rank Badge */}
                <div className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black text-white shadow-lg border-2 border-white z-30",
                    isFirst ? "bg-slate-900 min-w-[3rem] text-center" : "bg-slate-400"
                )}>
                    #{rank}
                </div>
            </div>

            {/* Info */}
            <div className="text-center relative z-20 mb-2">
                <h3 className={cn(
                    "font-bold text-slate-800 leading-tight px-2 truncate w-full",
                    isFirst ? "text-xl" : "text-sm"
                )}>
                    {data.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap size={10} className={isFirst ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                    <span className="font-mono font-bold text-xs text-slate-500">{data.votes.toLocaleString()}</span>
                </div>
            </div>

            {/* Podium Base */}
            <div className={cn(
                "w-full rounded-t-[2.5rem] relative overflow-hidden backdrop-blur-md border-t border-x border-white/60",
                isFirst ? "h-48 bg-gradient-to-b from-amber-100/50 to-white/10" : "h-24 bg-gradient-to-b from-white/40 to-white/10"
            )}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                {/* Light beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-gradient-to-b from-white/60 to-transparent blur-md" />
            </div>
        </motion.div>
    );
}

function ContestantRow({ contestant, index, maxVotes }) {
    // Calculate percentage for the bar
    const percentage = Math.max((contestant.votes / maxVotes) * 100, 5);

    return (
        <Link to={`/contestant/${contestant.number}`} className="block">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl p-1 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-200 transition-all duration-300"
            >
                {/* Background Progress Bar (Tech Style) */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-pink-50 via-purple-50/50 to-transparent transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100"
                    style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center p-3 gap-4">

                    {/* Rank Number (Monospace) */}
                    <div className="flex flex-col items-center justify-center w-8 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">RANK</span>
                        <span className="text-lg font-black text-slate-300 font-mono group-hover:text-pink-500 transition-colors">
                            {index.toString().padStart(2, '0')}
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:ring-2 ring-pink-300 ring-offset-2 transition-all">
                            <img src={contestant.image_url} alt={contestant.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Status Dot */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                        </div>
                    </div>

                    {/* Name & ID */}
                    <div className="grow min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-pink-600 transition-colors">
                            {contestant.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono border border-slate-200">
                                ID-{contestant.number}
                            </span>
                        </div>
                    </div>

                    {/* Stats Area */}
                    <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                            <Zap size={14} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="font-black text-slate-800 text-sm md:text-lg tabular-nums tracking-tight">
                                {contestant.votes}
                            </span>
                        </div>

                        {/* Mini visualizer bar */}
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden ml-auto">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="w-6 flex justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <ArrowLeft size={16} className="rotate-180 text-pink-400" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
