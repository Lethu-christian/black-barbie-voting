import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, ArrowLeft, Trophy, Star, Crown, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

                                return (
                                    <div key={category.id} className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{category.label}</h2>
                                            <div className="flex-1 h-px bg-pink-200"></div>
                                        </div>
                                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                            {categoryImages.map((img, idx) => (
                                                <motion.div
                                                    key={img.id || idx}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    viewport={{ once: true }}
                                                    className="relative group break-inside-avoid"
                                                >
                                                    <div className="bg-white p-3 rounded-[2rem] shadow-xl border border-white hover:shadow-2xl transition-all duration-500">
                                                        <div className="relative rounded-[1.5rem] overflow-hidden">
                                                            <img src={img.url} alt={img.title} className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                                                <h4 className="text-white font-bold text-lg">{img.title}</h4>
                                                                <p className="text-white/80 text-xs mt-1">{img.desc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
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
