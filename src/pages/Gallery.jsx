import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Camera, ArrowLeft, Trophy, Star, Crown, Sparkles, Image as ImageIcon, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CategorySlideshow = ({ category, images }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds interval
        return () => clearInterval(timer);
    }, [images.length]);

    if (images.length === 0) return null;

    const currentImg = images[index];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{category.label}</h2>
                <div className="flex-1 h-px bg-pink-200"></div>
                <div className="flex gap-2">
                    <button onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)} className="p-2 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setIndex((prev) => (prev + 1) % images.length)} className="p-2 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="relative w-full h-[400px] md:h-[600px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl md:shadow-2xl overflow-hidden border-4 border-white group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full origin-center"
                    >
                        <img src={currentImg.url} alt={currentImg.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 pb-16 md:pb-20">
                            <motion.h4
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-white font-black text-3xl md:text-5xl mb-3 tracking-tight drop-shadow-lg"
                            >
                                {currentImg.title}
                            </motion.h4>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="text-white/90 md:text-lg max-w-2xl font-medium drop-shadow-md line-clamp-3"
                            >
                                {currentImg.desc}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="absolute bottom-6 inset-x-0 flex gap-2 justify-center z-10">
                    {images.map((_, i) => (
                        <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-pink-500' : 'w-2 bg-white/50 hover:bg-white'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Top3Podium = () => {
    return (
        <div className="w-full mb-32 relative pt-20">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-pink-300/30 via-purple-300/30 to-pink-300/30 blur-3xl -z-10 rounded-full" />

            <div className="text-center mb-16">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full shadow-lg shadow-yellow-500/20 mb-6"
                >
                    <Crown size={32} className="text-amber-700 fill-amber-700" />
                </motion.div>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4"
                >
                    CONGRATULATIONS TO THE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        TOP 3 WINNERS OF 2025
                    </span>
                </motion.h2>
                <div className="flex items-center justify-center gap-2 text-slate-500 font-bold tracking-widest uppercase text-xs">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>A Year of Excellence</span>
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                </div>
            </div>

            <div className="flex justify-center items-end gap-4 md:gap-8 h-[500px] md:h-[600px] max-w-5xl mx-auto px-2">

                {/* 2nd Place (Left) */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    className="w-1/3 flex flex-col items-center relative z-10"
                >
                    <div className="relative w-full aspect-[3/4] rounded-t-[2rem] rounded-b-xl overflow-hidden border-4 border-slate-200 shadow-xl mb-4 group">
                        <img src="/B.jpeg" alt="2nd Place" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end justify-center pb-4">
                            <span className="text-white font-black text-xl md:text-2xl drop-shadow-md">2ND</span>
                        </div>
                    </div>
                    {/* Podium Base */}
                    <div className="w-full h-32 md:h-48 bg-gradient-to-b from-slate-200 to-slate-100 rounded-t-2xl border-t border-x border-white shadow-inner relative overflow-hidden flex items-start justify-center pt-4 md:pt-8">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                        <span className="font-black text-slate-400 text-3xl md:text-5xl opacity-50">2</span>
                    </div>
                </motion.div>

                {/* 1st Place / Queen (Middle) */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0, type: 'spring', stiffness: 100 }}
                    className="w-[40%] flex flex-col items-center relative z-20 -mb-6"
                >
                    <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-16 z-30"
                    >
                        <Crown size={48} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    </motion.div>
                    <div className="relative w-full aspect-[3/4] rounded-t-[2.5rem] rounded-b-2xl overflow-hidden border-[6px] border-amber-300 shadow-2xl shadow-yellow-500/30 mb-4 group ring-4 ring-white/50">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/20 to-transparent z-10 pointer-events-none mix-blend-overlay" />
                        <img src="/C.jpeg" alt="1st Place Queen" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end justify-center pb-6 z-20">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-500 font-black text-3xl md:text-5xl drop-shadow-lg tracking-tighter">QUEEN</span>
                        </div>
                    </div>
                    {/* Podium Base */}
                    <div className="w-full h-40 md:h-64 bg-gradient-to-b from-amber-100 to-amber-50 rounded-t-[2rem] border-t border-x border-white shadow-inner relative overflow-hidden flex items-start justify-center pt-6 md:pt-10">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent blur-md pointer-events-none" />
                        <span className="font-black text-amber-500/40 text-5xl md:text-7xl">1</span>
                    </div>
                </motion.div>

                {/* 3rd Place (Right) */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="w-1/3 flex flex-col items-center relative z-10"
                >
                    <div className="relative w-full aspect-[3/4] rounded-t-[2rem] rounded-b-xl overflow-hidden border-4 border-orange-200 shadow-xl mb-4 group">
                        <img src="/A.jpeg" alt="3rd Place" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end justify-center pb-4">
                            <span className="text-white font-black text-xl md:text-2xl drop-shadow-md">3RD</span>
                        </div>
                    </div>
                    {/* Podium Base */}
                    <div className="w-full h-24 md:h-36 bg-gradient-to-b from-orange-100 to-orange-50 rounded-t-2xl border-t border-x border-white shadow-inner relative overflow-hidden flex items-start justify-center pt-4 md:pt-6">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                        <span className="font-black text-orange-400/30 text-3xl md:text-5xl">3</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setImages(data);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] text-slate-900 font-sans selection:bg-pink-300 relative overflow-x-hidden">

            {/* Background Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-300/20 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10">
                {/* HUD Header */}
                <header className="px-6 py-6 flex justify-between items-center sticky top-0 bg-white/60 backdrop-blur-xl border-b border-white z-50">
                    <Link to="/home" className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition-colors font-bold tracking-tight">
                        <ArrowLeft size={20} /> <span className="text-sm">BACK TO ARENA</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Crown size={24} className="text-pink-500 fill-pink-500/10" />
                        <span className="font-black text-xl tracking-tighter uppercase">2025 Season</span>
                    </div>
                    <div className="w-24 md:block hidden" /> {/* spacer */}
                </header>

                <main className="max-w-7xl mx-auto px-6 py-16">
                    {/* Hero Title */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 font-black text-[10px] tracking-widest uppercase mb-6 border border-pink-200"
                        >
                            <Sparkles size={14} /> Memories of Excellence
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-none"
                        >
                            HALL OF <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">FAME.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium"
                        >
                            Relive the magic of the Black Barbie Ambassador 2025 Grand Finale. A celebration of beauty, power, and heritage.
                        </motion.p>
                    </div>

                    {/* DYNAMIC 2025 TOP 3 PODIUM */}
                    <Top3Podium />

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-pink-500">
                            <Loader2 className="animate-spin mb-4" size={48} />
                            <p className="font-bold tracking-widest uppercase text-xs">Loading Archives...</p>
                        </div>
                    ) : (
                        <div className="space-y-24">
                            {[
                                { id: 'top_winners', label: 'Top Winners of 2025' },
                                { id: 'models', label: 'Models' },
                                { id: 'stage_moments', label: 'Stage Moments' },
                                { id: 'host', label: 'Host' },
                                { id: 'director', label: 'Director' },
                                { id: 'ceo', label: 'Blackbarbiebytk CEO' }
                            ].map(category => {
                                const categoryImages = images.filter(img => (img.category || 'models') === category.id);
                                if (categoryImages.length === 0) return null;

                                return <CategorySlideshow key={category.id} category={category} images={categoryImages} />;
                            })}
                        </div>
                    )}

                    {!loading && images.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium italic">The archive is currently empty.</p>
                        </div>
                    )}

                    {/* Final CTA */}
                    <div className="mt-32 text-center">
                        <div className="h-20 w-px bg-pink-200 mx-auto mb-10" />
                        <h3 className="text-2xl font-black text-slate-900 mb-8">WANT TO VOTE FOR YOUR NEXT AMBASSADOR?</h3>
                        <Link
                            to="/home"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black tracking-widest hover:bg-pink-600 transition-colors shadow-2xl shadow-pink-200"
                        >
                            ENTER 2026 ARENA <ImageIcon size={20} />
                        </Link>
                    </div>
                </main>

                <footer className="py-20 text-center opacity-30 select-none">
                    <Crown size={40} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-xs font-mono font-bold tracking-widest">BLACK BARBIE AMBASSADOR • 2025 ARCHIVE</p>
                </footer>
            </div>
        </div>
    );
}
