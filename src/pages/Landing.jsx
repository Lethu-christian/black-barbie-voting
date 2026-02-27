import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Trophy, Users, Vote, Star, Crown, ChevronDown,
    Sparkles, Globe, ArrowRight, LayoutGrid, User, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- JOURNEY STEPS ---
const STEPS = [
    {
        id: 'semi',
        title: "The Semi-Finalist",
        label: "Phase 01",
        desc: "The journey begins here. Contestants are selected from hundreds of entries.",
        icon: Users,
        color: "bg-pink-500",
        shadow: "shadow-pink-500/40"
    },
    {
        id: 'campaign',
        title: "Campaign",
        label: "Phase 02",
        desc: "Contestants engage with the community and social media introducing themselves as semi-finalists, showcasing their platform, elegance. and intelligence.",
        icon: Globe,
        color: "bg-purple-500",
        shadow: "shadow-purple-500/40"
    },
    {
        id: 'votes',
        title: "Public Voting",
        label: "Phase 03",
        desc: "Power to the people. Live voting begins as the community votes for their favorite semi-finalist.",
        icon: Vote,
        color: "bg-blue-500",
        shadow: "shadow-blue-500/40"
    },
    {
        id: 'finalist',
        title: "The Finalist",
        label: "Phase 04",
        desc: "The elite tier emerges. Only the strongest contestants remain for the grand finale.",
        icon: Star,
        color: "bg-orange-500",
        shadow: "shadow-orange-500/40"
    },
    {
        id: 'finale',
        title: "Grand Finale",
        label: "Coronation",
        desc: "The ultimate moment. The winners rises to wear the Black Barbie Ambassador Crown plus many more prizes.",
        icon: Crown,
        color: "bg-yellow-400",
        shadow: "shadow-yellow-400/60",
        isGrand: true
    }
];

export default function Landing() {
    const containerRef = useRef(null);

    // Parallax Textures
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

    return (
        <div className="min-h-screen bg-[#fff0f5] text-slate-800 font-sans selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden relative">

            {/* --- BACKGROUND FX --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Floating Orbs - Hidden on mobile to save performance */}
                <motion.div style={{ y: y1 }} className="hidden md:block absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-pink-300/30 blur-[80px] md:blur-[100px] rounded-full mix-blend-multiply" />
                <motion.div style={{ y: y2 }} className="hidden md:block absolute bottom-[10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-300/30 blur-[80px] md:blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">

                {/* Logo Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center mb-6 md:mb-8 transition-all"
                >
                    <img src="/logo-bba.png" alt="Logo" className="w-full h-full object-contain" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white shadow-sm mb-6 backdrop-blur-md"
                >
                    <Sparkles size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600">Official Roadmap 2026</span>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]"
                >
                    THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">BBA</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">JOURNEY</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed mb-10 md:mb-12 px-4"
                >
                    Witness the evolution of excellence. Follow the technological roadmap from selection to the crown.
                </motion.p>

                {/* REDIRECTION BUTTON */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full md:w-auto"
                >
                    <Link
                        to="/home"
                        className="group relative inline-flex w-full md:w-auto justify-center items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl md:rounded-full font-bold text-lg shadow-2xl shadow-pink-500/20 hover:scale-105 transition-transform active:scale-95"
                    >
                        <span className="absolute inset-0 rounded-2xl md:rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-3">
                            <LayoutGrid size={20} /> ENTER VOTING ARENA <ArrowRight size={20} />
                        </span>
                    </Link>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 text-pink-400 hidden md:block"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </div>

            {/* --- THE CURVY MAP SECTION --- */}
            <div className="relative z-10 pb-40 overflow-hidden">
                <div className="max-w-4xl mx-auto relative px-4 md:px-0">

                    {/* THE SNAKE LINE (Hidden on Mobile) */}
                    <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none hidden md:block">
                        <svg className="w-full h-full visible" preserveAspectRatio="none" viewBox="0 0 800 1600">
                            <defs>
                                <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                                    <stop offset="20%" stopColor="#ec4899" stopOpacity="1" />
                                    <stop offset="80%" stopColor="#a855f7" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 400 0 
                           C 400 100, 200 100, 200 300 
                           C 200 500, 600 500, 600 700 
                           C 600 900, 200 900, 200 1100
                           C 200 1300, 400 1300, 400 1500"
                                fill="none"
                                stroke="url(#snakeGradient)"
                                strokeWidth="4"
                                strokeDasharray="12 12"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Vertical Line for Mobile */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-pink-500/0 via-purple-500/50 to-yellow-500/0 md:hidden pointer-events-none" />

                    {/* NODES */}
                    <div className="relative h-auto md:h-[1500px] pt-10 md:pt-0 flex flex-col items-center gap-20 md:block">
                        {STEPS.map((step, index) => (
                            <JourneyCard key={step.id} step={step} index={index} />
                        ))}
                    </div>

                </div>
            </div>

            {/* --- FOOTER CTA --- */}
            <div className="relative z-10 py-20 text-center px-6">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Ready to make your voice heard?</h2>
                <Link
                    to="/home"
                    className="inline-flex w-full md:w-auto justify-center items-center gap-3 px-8 py-4 bg-white border border-pink-200 text-pink-600 rounded-2xl md:rounded-full font-bold text-lg shadow-xl hover:bg-pink-50 transition-colors active:scale-95"
                >
                    Go to Dashboard <ArrowRight size={20} />
                </Link>
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

function JourneyCard({ step, index }) {
    // Positioning logic:
    // Mobile: Relative stacking (handled by flex-col in parent)
    // Desktop: Uses absolute positioning for the snake layout

    let positionClass = "md:absolute relative ";
    if (index === 0) positionClass += "md:top-0 md:left-1/2 md:-translate-x-1/2";
    else if (index === 1) positionClass += "md:top-[300px] md:left-10";
    else if (index === 2) positionClass += "md:top-[700px] md:right-10";
    else if (index === 3) positionClass += "md:top-[1100px] md:left-10";
    else if (index === 4) positionClass += "md:top-[1400px] md:left-1/2 md:-translate-x-1/2";

    const isGrand = step.isGrand;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={cn(
                "relative w-[280px] sm:w-[350px] z-10",
                positionClass
            )}
        >
            <div className="relative group">
                {/* Glow Effect */}
                <div className={cn(
                    "absolute -inset-1 rounded-[2.5rem] opacity-40 blur-xl transition-all group-hover:opacity-70",
                    step.color
                )} />

                <div className="relative bg-white/90 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[2rem] shadow-xl text-center md:text-left">

                    {/* Floating Icon */}
                    <div className={cn(
                        "absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform",
                        step.color,
                        step.shadow
                    )}>
                        <step.icon size={32} />
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-center md:justify-center mb-3">
                            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {step.label}
                            </span>
                        </div>
                        <h3 className={cn(
                            "text-2xl font-black text-slate-900 mb-2 text-center",
                            isGrand && "text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600"
                        )}>
                            {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed text-center">
                            {step.desc}
                        </p>
                    </div>

                    {isGrand && (
                        <div className="mt-6 flex justify-center">
                            <div className="animate-pulse bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-xs font-bold border border-yellow-200 uppercase tracking-widest">
                                06 June 2026
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}