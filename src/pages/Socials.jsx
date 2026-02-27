import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Using official brand colors and Simple Icons CDN for accurate logos
const SOCIAL_LINKS = [
    {
        platform: 'Instagram',
        iconUrl: 'https://cdn.simpleicons.org/instagram/ffffff',
        color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
        bgGlow: 'bg-pink-100/50',
        textColor: 'text-pink-600',
        links: [
            { name: '@blackbarbiemodelacademy', url: 'https://www.instagram.com/blackbarbiemodelacademy' },
            { name: '@blackbarbiebytk', url: 'https://www.instagram.com/blackbarbiebytk' },
            { name: '@blackbarbieambassador', url: 'https://www.instagram.com/blackbarbieambassador' },
        ]
    },
    {
        platform: 'TikTok',
        iconUrl: 'https://cdn.simpleicons.org/tiktok/ffffff',
        color: 'bg-black',
        bgGlow: 'bg-slate-200/50',
        textColor: 'text-slate-800',
        links: [
            { name: '@blackbarbieprinting', url: 'https://www.tiktok.com/@blackbarbieprinting' },
            { name: '@blackbarbiebytk', url: 'https://www.tiktok.com/@blackbarbiebytk' },
        ]
    },
    {
        platform: 'Facebook',
        iconUrl: 'https://cdn.simpleicons.org/facebook/ffffff',
        color: 'bg-[#1877F2]',
        bgGlow: 'bg-blue-100/50',
        textColor: 'text-blue-600',
        links: [
            { name: 'Black Barbie Main Profile', url: 'https://www.facebook.com/profile.php?id=100063054290868' },
            { name: 'Latest Post / Event Share 1', url: 'https://www.facebook.com/share/1GahSKyinM/' },
            { name: 'Latest Post / Event Share 2', url: 'https://www.facebook.com/share/1GZQTqfRZF/' },
        ]
    }
];

export default function Socials() {
    return (
        <div className="min-h-screen bg-[#fff0f5] text-slate-800 font-sans overflow-x-hidden relative">

            {/* Modern Animated Background FX */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-300/40 blur-[120px] rounded-full mix-blend-multiply"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 blur-[120px] rounded-full mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 pb-20">
                {/* Refined Glass Header */}
                <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/50 border-b border-white/60 shadow-sm transition-all">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                        <Link to="/home" className="group relative p-2.5 bg-white/80 rounded-xl shadow-sm border border-pink-100 hover:border-pink-400 hover:shadow-md transition-all active:scale-95">
                            <ArrowLeft size={18} className="text-slate-600 group-hover:text-pink-600 transition-colors" />
                        </Link>
                        <h1 className="text-lg font-black tracking-widest text-slate-800 uppercase">
                            Our <span className="text-pink-500">Socials</span>
                        </h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-3xl mx-auto px-4 pt-16">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl p-3 mb-8 border border-white/60 flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300"
                        >
                            <img src="/logo-bba.png" alt="Black Barbie Logo" className="w-full h-full object-contain drop-shadow-sm" />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
                        >
                            CONNECT WITH US
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed"
                        >
                            Stay updated with the latest news, behind the scenes, and updates from the Black Barbie team.
                        </motion.p>
                    </div>

                    <div className="space-y-6">
                        {SOCIAL_LINKS.map((platform, pIdx) => (
                            <motion.div
                                key={platform.platform}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (pIdx * 0.1) }}
                                className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105",
                                        platform.color
                                    )}>
                                        <img src={platform.iconUrl} alt={`${platform.platform} icon`} className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{platform.platform}</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {platform.links.map((link, lIdx) => (
                                        <div key={lIdx} className="relative group/btn">
                                            {/* Pulsing Pink Glow Behind Button */}
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200 animate-pulse" />

                                            <motion.a
                                                whileHover={{ scale: 1.015 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100/50 hover:border-pink-300 hover:bg-white transition-all shadow-sm hover:shadow-md z-10"
                                            >
                                                <div className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                                                    <div className={cn("p-2.5 rounded-xl flex-shrink-0 transition-colors bg-white shadow-sm", platform.textColor)}>
                                                        <ExternalLink size={18} strokeWidth={2.5} />
                                                    </div>
                                                    <span className="font-black text-slate-800 tracking-tight group-hover/btn:text-pink-600 transition-colors break-words max-w-full truncate pr-4 text-base md:text-lg">
                                                        {link.name}
                                                    </span>
                                                </div>

                                                <div className="hidden sm:flex px-5 py-2.5 bg-pink-50 group-hover/btn:bg-pink-500 text-pink-600 group-hover/btn:text-white rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shrink-0 shadow-sm shadow-pink-100">
                                                    Follow
                                                </div>
                                            </motion.a>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            {/* OFFICIAL SPONSORS / FOOTER */}
            <footer className="w-full bg-white/60 backdrop-blur-3xl border-t border-white shadow-[0_-10px_40px_rgba(236,72,153,0.05)] relative z-20 pb-28 md:pb-16 pt-20 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-50 text-pink-600 font-black text-[11px] tracking-widest uppercase mb-12 border border-pink-100 shadow-sm"
                    >
                        <Zap size={14} className="animate-pulse" /> MEET OUR SPONSORS
                    </motion.div>

                    <div className="w-full overflow-hidden pb-14 relative mask-image-gradient">
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
                                gap: 3rem;
                                width: max-content;
                                animation: scroll 40s linear infinite;
                            }
                            .marquee-track:hover {
                                animation-play-state: paused;
                            }
                            @media (min-width: 768px) {
                                .marquee-track { gap: 5rem; animation-duration: 50s; }
                            }
                            .marquee-container {
                                mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                                -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                            }
                        `}</style>
                        <div className="marquee-container w-full overflow-hidden opacity-70 hover:opacity-100 transition-opacity duration-500">
                            <div className="marquee-track">
                                {[
                                    { id: '1a', src: "/bbbtk.png" }, { id: '2a', src: "/2.png" },
                                    { id: '3a', src: "/3.png" }, { id: '4a', src: "/4.png" },
                                    { id: '5a', src: "/5.png" }, { id: '6a', src: "/6.png" },
                                    { id: '7a', src: "/7.png" }, { id: '8a', src: "/8.png" },
                                    { id: '1b', src: "/bbbtk.png" }, { id: '2b', src: "/2.png" },
                                    { id: '3b', src: "/3.png" }, { id: '4b', src: "/4.png" },
                                    { id: '5b', src: "/5.png" }, { id: '6b', src: "/6.png" },
                                    { id: '7b', src: "/7.png" }, { id: '8b', src: "/8.png" },
                                ].map((sponsor, index) => (
                                    <div
                                        key={sponsor.id}
                                        className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 shrink-0 transition-transform duration-300 hover:scale-110 cursor-pointer"
                                    >
                                        <img
                                            src={sponsor.src}
                                            alt={`Sponsor ${sponsor.id}`}
                                            className="w-full h-full object-contain filter drop-shadow-sm transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-200/60">
                        <div className="flex items-center gap-3">
                            <Crown size={20} className="text-pink-500" />
                            <span className="font-black tracking-widest text-slate-800 text-sm">BLACK BARBIE AMBASSADOR</span>
                        </div>
                        <p className="font-bold text-xs text-slate-400 uppercase tracking-widest">© 2026 All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}