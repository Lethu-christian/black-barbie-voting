import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Search, Trophy, Zap, Sparkles, Crown, ChevronRight,
    Fingerprint, Activity, Globe, Star, ShieldCheck, Cpu, LayoutGrid,
    User, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Home() {
    const [contestants, setContestants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();

    // Advanced Parallax for background elements
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
    const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

    useEffect(() => {
        const fetchContestants = async () => {
            const { data } = await supabase.from('contestants').select('*').order('votes', { ascending: false });
            if (data) setContestants(data);
            setLoading(false);
        };
        fetchContestants();

        const subscription = supabase
            .channel('public:contestants')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contestants' }, (payload) => {
                setContestants(current => {
                    const newList = current.map(c => c.id === payload.new.id ? { ...c, votes: payload.new.votes } : c);
                    return newList.sort((a, b) => b.votes - a.votes);
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(subscription); };
    }, []);

    const filtered = contestants.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.number.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#FDF2F8] text-slate-900 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative pb-24 md:pb-0">

            {/* 0. ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div style={{ y: y1, rotate }} className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-transparent rounded-[3rem] blur-[120px]" />
                <motion.div style={{ y: y2 }} className="absolute bottom-[10%] -right-[5%] w-[60vw] h-[60vw] bg-gradient-to-bl from-rose-300/30 via-orange-100/20 to-transparent rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10">

                {/* 1. ADVANCED HUD HEADER */}
                <header className="px-6 py-4 sticky top-0 z-[60]">
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" />
                    <div className="relative flex justify-between items-center max-w-7xl mx-auto">

                        {/* Branding */}
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 bg-pink-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                                <div className="relative bg-white p-1 rounded-xl border border-pink-100 shadow-sm transition-transform group-hover:scale-105 duration-300">
                                    <img src="/logo-bba.png" className="w-full h-full object-contain" alt="Logo" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-slate-400 tracking-[0.3em] uppercase">System.Online</span>
                                </div>
                                <h1 className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-pink-600 transition-colors">
                                    BLACK BARBIE
                                </h1>
                            </div>
                        </Link>

                        {/* Right Side: Telemetry & ADMIN LOGIN */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/50 rounded-full border border-white shadow-sm">
                                <Activity size={14} className="text-pink-500" />

                            </div>

                            {/* --- GALLERY LINK --- */}
                            <Link to="/gallery">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center gap-2 px-5 py-2.5 bg-white overflow-hidden rounded-xl shadow-xl shadow-pink-100 transition-all border border-pink-100 font-black text-xs text-pink-600 tracking-widest"
                                >
                                    <Sparkles size={16} /> 2025 SEASON
                                </motion.button>
                            </Link>

                            {/* --- THE ADMIN LOGIN BUTTON --- */}
                            <Link to="/admin">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative flex items-center gap-2 px-5 py-2.5 bg-slate-900 overflow-hidden rounded-xl shadow-xl shadow-pink-200/50 transition-all hover:shadow-pink-400/40"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <ShieldCheck size={16} className="text-pink-400 relative z-10 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-black text-white tracking-widest relative z-10">ADMIN LOGIN</span>
                                </motion.button>
                            </Link>
                        </div>
                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <Link to="/admin">
                                <div className="p-2 bg-slate-100 rounded-full text-slate-500">
                                    <ShieldCheck size={20} />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">

                    {/* 2. HERO SECTION: Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 md:mb-24">
                        <div className="lg:col-span-7 space-y-8 relative">
                            {/* Decorative Line */}
                            <motion.div
                                initial={{ height: 0 }} animate={{ height: '100%' }}
                                className="absolute -left-6 top-0 w-1 bg-gradient-to-b from-pink-500/0 via-pink-500/50 to-pink-500/0"
                            />

                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100/50 backdrop-blur-md rounded border border-pink-200/50"
                            >
                                <Sparkles size={12} className="text-pink-600" />
                                <span className="text-[10px] font-mono font-bold text-pink-700 uppercase tracking-widest">Official 2026 Season</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-slate-900"
                            >
                                BLACK BARBIE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500">AMBASSADOR.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-slate-500 max-w-lg font-medium leading-relaxed"
                            >
                                The ecosystem is live. Experience the next generation of pageantry with real-time telemetry and secure voting protocols.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap gap-4"
                            >
                                <button
                                    onClick={() => document.getElementById('search-ui').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-sm tracking-widest flex items-center gap-3 shadow-2xl shadow-slate-400/50 hover:bg-slate-800 transition-colors w-full sm:w-auto justify-center sm:justify-start"
                                >
                                    VOTE <ChevronRight size={16} />
                                </button>
                                <Link to="/leaderboard" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-sm tracking-widest flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center sm:justify-start">
                                    VIEW RANKINGS
                                </Link>
                                <Link to="/gallery" className="px-8 py-4 bg-pink-50 text-pink-600 border border-pink-100 rounded-xl font-black text-sm tracking-widest flex items-center gap-3 shadow-sm hover:bg-pink-100 transition-colors w-full sm:w-auto justify-center sm:justify-start md:hidden">
                                    <ImageIcon size={16} /> 2025 SEASON
                                </Link>
                            </motion.div>
                        </div>

                        {/* 3D Floating Element */}
                        <div className="lg:col-span-5 relative flex justify-center perspective-1000 mt-8 lg:mt-0">
                            <motion.div
                                animate={{ y: [0, -25, 0], rotateY: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 w-full max-w-md"
                            >
                                <div className="absolute inset-0 bg-pink-500/30 blur-[60px] rounded-full animate-pulse" />
                                <img src="/logo-bba.png" className="w-full h-auto drop-shadow-2xl relative z-10" alt="3D Logo" />

                                {/* Floating Badges */}
                                <div className="absolute -right-4 top-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/60 animate-bounce delay-700 hidden sm:block">
                                    <Crown size={24} className="text-yellow-500 fill-yellow-500" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* 3. LEADERBOARD PODIUM - UPGRADED FOR MOBILE */}
                    <section className="mb-24 relative">
                        <div className="flex items-end justify-between mb-8 md:mb-12 px-2">
                            <div>
                                <h3 className="text-xs font-black text-pink-500 tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
                                    <Cpu size={14} /> Live Database
                                </h3>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">TOP CONTESTANTS</h2>
                            </div>
                        </div>

                        {/* FORCED GRID FOR ALL SCREENS TO MAINTAIN PODIUM SHAPE */}
                        <div className="grid grid-cols-3 gap-2 md:gap-8 h-[350px] md:h-[450px] items-end pb-8">
                            {loading ? <SkeletonLoader /> : (
                                <>
                                    {/* Rank 2 - Left */}
                                    {contestants[1] && (
                                        <LeaderCard
                                            contestant={contestants[1]}
                                            rank={2}
                                            color="bg-slate-200"
                                            // Mobile: 60% height, Desktop: 75% height
                                            height="h-[60%] md:h-[75%]"
                                            delay={0.2}
                                        />
                                    )}

                                    {/* Rank 1 - Center (Tallest) */}
                                    {contestants[0] && (
                                        <LeaderCard
                                            contestant={contestants[0]}
                                            rank={1}
                                            color="bg-gradient-to-b from-yellow-300 to-yellow-500"
                                            // Mobile: 85% height, Desktop: 100% height
                                            height="h-[85%] md:h-full"
                                            delay={0}
                                            isWinner
                                        />
                                    )}

                                    {/* Rank 3 - Right */}
                                    {contestants[2] && (
                                        <LeaderCard
                                            contestant={contestants[2]}
                                            rank={3}
                                            color="bg-orange-200"
                                            // Mobile: 50% height, Desktop: 65% height
                                            height="h-[50%] md:h-[65%]"
                                            delay={0.3}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    {/* 4. TECH SEARCH & GRID */}
                    <div id="search-ui" className="scroll-mt-32">
                        {/* Search Bar */}
                        <div className="sticky top-24 z-40 mb-12">
                            <div className="relative max-w-2xl mx-auto">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-[2rem] blur opacity-30 transition duration-500 group-hover:opacity-100" />
                                <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl flex items-center p-2 border border-white/50">
                                    <div className="p-3 pl-5">
                                        <Search className="text-slate-400" size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search ecosystem via Name or ID..."
                                        className="bg-transparent w-full outline-none font-bold text-lg text-slate-700 placeholder:text-slate-300 h-12"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button className="hidden md:flex bg-slate-100 hover:bg-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-colors">
                                        FILTER
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            <AnimatePresence>
                                {filtered.map((c) => (
                                    <ContestantCard key={c.id} data={c} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-32 opacity-50">
                                <Fingerprint size={48} className="mx-auto mb-4 text-slate-400" />
                                <p className="font-mono text-sm">NO_DATA_FOUND</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile Nav */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-slate-900/90 backdrop-blur-2xl text-white rounded-[2rem] p-2 shadow-2xl z-50 flex justify-between items-center border border-white/10 md:hidden">
                <NavButton icon={<LayoutGrid size={20} />} active to="/" />
                <button
                    onClick={() => document.getElementById('search-ui').scrollIntoView({ behavior: 'smooth' })}
                    className="p-3 rounded-2xl text-slate-400 hover:text-white"
                >
                    <Search size={20} />
                </button>
                <NavButton icon={<ShieldCheck size={20} />} to="/admin" />
            </nav>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function LeaderCard({ contestant, rank, color, delay, height, isWinner }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 120, damping: 20 }}
            className={cn("col-span-1 flex flex-col items-center justify-end relative z-10", height)}
        >
            <Link to={`/contestant/${contestant.number}`} className="w-full h-full relative group perspective-500">
                <div className={cn(
                    "absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border-2 md:border-4 border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-pink-300/50",
                    isWinner ? "ring-4 md:ring-8 ring-yellow-400/20 z-20" : "grayscale-[20%] group-hover:grayscale-0"
                )}>
                    <img src={contestant.image_url} className="w-full h-full object-cover" alt={contestant.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-2 md:p-6 text-center">
                        <div className={cn(
                            "inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 shadow-lg",
                            color, "text-slate-900"
                        )}>
                            Rank #{rank}
                        </div>
                        <h4 className="text-white font-black text-xs md:text-xl tracking-tight truncate leading-none mb-0.5 md:mb-1">{contestant.name}</h4>
                        <p className="text-white/60 font-mono text-[8px] md:text-xs">{contestant.votes.toLocaleString()} Votes</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function ContestantCard({ data }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group relative col-span-1"
        >
            <Link to={`/contestant/${data.number}`}>
                {/* Card Glass Container */}
                <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-2 md:p-3 border border-white/60 shadow-lg hover:shadow-2xl hover:shadow-pink-200/60 transition-all duration-500">

                    {/* Image Area */}
                    <div className="relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-2 md:mb-4 shadow-inner bg-slate-100">
                        <img src={data.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" alt={data.name} />

                        {/* ID Badge */}
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur text-slate-900 text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/50 tracking-widest shadow-lg">
                            #{data.number.toString().padStart(3, '0')}
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="px-1 md:px-2 pb-1 md:pb-2">
                        <h3 className="font-black text-slate-800 text-sm md:text-lg truncate tracking-tight">{data.name}</h3>

                        <div className="flex justify-between items-center mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/50">
                            <div>
                                <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">Status</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] md:text-xs font-bold text-slate-700">Active</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">Votes</p>
                                <p className="text-xs md:text-sm font-mono font-black text-pink-600">{data.votes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function NavButton({ icon, active, to }) {
    return (
        <Link to={to} className={cn(
            "p-3 rounded-2xl transition-all active:scale-90",
            active ? "bg-white/20 text-white shadow-inner" : "text-slate-400 hover:text-white"
        )}>
            {icon}
        </Link>
    )
}

function SkeletonLoader() {
    return [1, 2, 3].map(i => (
        <div key={i} className="col-span-1 h-full bg-white/20 animate-pulse rounded-[2rem] border border-white/30" />
    ));
}