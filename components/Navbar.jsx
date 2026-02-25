import { Link } from 'react-router-dom';
import { ShieldCheck, UserCog, Camera } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm transition-all duration-300">
            <Link to="/home" className="flex items-center gap-3 group">
                {/* Logo Container with Glow */}
                <div className="relative">
                    <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                        src="/logo-bba.png"
                        alt="BBA Logo"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                    />
                </div>

                <div className="flex flex-col">
                    <span className="font-black text-lg md:text-xl text-slate-900 leading-none tracking-tighter">
                        BLACK<span className="text-pink-500">BARBIE</span>
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                        <span className="text-[8px] md:text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                            Ambassador 2026
                        </span>
                    </div>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <Link
                    to="/gallery"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-slate-600 hover:text-pink-600 transition-all"
                >
                    <Camera size={16} />
                    <span className="hidden sm:inline">2025 Gallery</span>
                </Link>
                <Link
                    to="/admin"
                    className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-pink-100 text-xs md:text-sm font-bold text-slate-600 hover:text-pink-600 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
                >
                    <UserCog size={16} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                    <span className="hidden md:inline">Admin Access</span>
                </Link>
            </div>
        </nav>
    );
}