import { motion } from 'framer-motion';
import { Facebook, Instagram, Video, ArrowLeft, ExternalLink, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const SOCIAL_LINKS = [
    {
        platform: 'Instagram',
        icon: Instagram,
        color: 'from-purple-500 via-pink-500 to-orange-500',
        bgGlow: 'bg-pink-500/20',
        textColor: 'text-pink-600',
        links: [
            { name: '@blackbarbiemodelacademy', url: 'https://www.instagram.com/blackbarbiemodelacademy?igsh=bzcwMXBqdWp1dmNx' },
            { name: '@blackbarbiebytk', url: 'https://www.instagram.com/blackbarbiebytk?igsh=MTV4bGY5aHJ1bjNjOQ==' },
            { name: '@blackbarbieambassador', url: 'https://www.instagram.com/blackbarbieambassador?igsh=OWRjaGFzbzJkOHgw' },
        ]
    },
    {
        platform: 'TikTok',
        icon: Video, // Using Video to represent TikTok
        color: 'from-teal-400 to-black',
        bgGlow: 'bg-teal-500/20',
        textColor: 'text-teal-700',
        links: [
            { name: '@blackbarbieprinting', url: 'https://www.tiktok.com/@blackbarbieprinting?_r=1&_t=ZS-94HB486TW6f' },
            { name: '@blackbarbiebytk', url: 'https://www.tiktok.com/@blackbarbiebytk?_r=1&_t=ZS-94HB2s1vXOu' },
        ]
    },
    {
        platform: 'Facebook',
        icon: Facebook,
        color: 'from-blue-600 to-blue-400',
        bgGlow: 'bg-blue-500/20',
        textColor: 'text-blue-600',
        links: [
            { name: 'Black Barbie Main Profile', url: 'https://www.facebook.com/profile.php?id=100063054290868&mibextid=wwXIfr&mibextid=wwXIfr' },
            { name: 'Latest Post / Event Share 1', url: 'https://www.facebook.com/share/1GahSKyinM/?mibextid=wwXIfr' },
            { name: 'Latest Post / Event Share 2', url: 'https://www.facebook.com/share/1GZQTqfRZF/?mibextid=wwXIfr' },
        ]
    }
];

export default function Socials() {
    return (
        <div className="min-h-screen bg-[#fff0f5] text-slate-800 font-sans overflow-x-hidden relative">

            {/* Background FX */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/30 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/30 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 pb-20">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/40 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                        <Link to="/home" className="group relative p-2.5 bg-white rounded-xl shadow-sm border border-pink-100 hover:border-pink-300 transition-all active:scale-95">
                            <ArrowLeft size={18} className="text-slate-700 group-hover:text-pink-600" />
                        </Link>
                        <h1 className="text-lg font-black tracking-tighter text-slate-800">
                            OUR <span className="text-pink-500">SOCIALS</span>
                        </h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-3xl mx-auto px-4 pt-12">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto bg-white rounded-[2rem] shadow-xl p-2 mb-6 border border-pink-100 flex items-center justify-center transform hover:rotate-6 transition-transform"
                        >
                            <img src="/logo-bba.png" alt="Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4"
                        >
                            CONNECT WITH US
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 font-medium"
                        >
                            Stay updated with the latest news, behind the scenes, and updates from the Black Barbie team.
                        </motion.p>
                    </div>

                    <div className="space-y-8">
                        {SOCIAL_LINKS.map((platform, pIdx) => (
                            <motion.div
                                key={platform.platform}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (pIdx * 0.1) }}
                                className="bg-white/60 backdrop-blur-lg rounded-[2.5rem] p-6 md:p-8 border border-white shadow-xl"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br",
                                        platform.color
                                    )}>
                                        <platform.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800">{platform.platform}</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {platform.links.map((link, lIdx) => (
                                        <a
                                            key={lIdx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/50 rounded-2xl border border-white hover:border-pink-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
                                                <div className={cn("p-2 rounded-xl flex-shrink-0", platform.bgGlow, platform.textColor)}>
                                                    <ExternalLink size={16} />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-pink-600 transition-colors break-words max-w-full truncate pr-4">
                                                    {link.name}
                                                </span>
                                            </div>

                                            <div className="hidden sm:flex px-4 py-2 bg-slate-100 group-hover:bg-slate-800 text-slate-500 group-hover:text-white rounded-xl text-xs font-black tracking-widest uppercase transition-colors shrink-0">
                                                Open Link
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            {/* OFFICIAL SPONSORS / FOOTER */}
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
                                            delay: (index % 8) * 0.2
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
