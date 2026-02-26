import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowLeft, Loader2, Sparkles, ChevronRight } from 'lucide-react';

export default function VoterAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes('Email not confirmed')) {
                        throw new Error('Please verify your email or turn off "Confirm email" in your Supabase Dashboard.');
                    }
                    throw error;
                }
                navigate('/home');
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;

                if (data?.user?.identities?.length === 0) {
                    setMessage({ type: 'error', text: 'This email is already registered. Try signing in!' });
                } else {
                    setMessage({ type: 'success', text: 'Registration successful! If you do not receive an email, check your Supabase "Confirm email" settings.' });
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF2F8] text-slate-900 font-sans selection:bg-pink-500 selection:text-white flex flex-col relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-300/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-300/20 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <Link to="/home" className="group flex items-center gap-3 bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                    <ArrowLeft size={16} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Back to Arena</span>
                </Link>
                <Link to="/home" className="text-xs font-bold text-pink-600 hover:text-pink-700 tracking-widest uppercase">
                    Vote as Guest
                </Link>
            </header>

            <main className="relative z-10 flex-grow flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-100 shadow-inner"
                            >
                                <Sparkles className="text-pink-600" size={32} />
                            </motion.div>
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                {isLogin
                                    ? 'Sign in to track your votes and profiles.'
                                    : 'Join the community to manage your pageant experience.'}
                            </p>
                        </div>

                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mb-6 p-4 rounded-2xl text-xs font-bold ${message.type === 'error'
                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                    : 'bg-green-50 text-green-600 border border-green-100'
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white focus:border-pink-200 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white focus:border-pink-200 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="voter@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white focus:border-pink-200 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {isLogin ? 'VERIFY & ENTER' : 'CREATE PROFILE'}
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-xs font-bold text-slate-400 hover:text-pink-600 transition-colors uppercase tracking-widest"
                            >
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>

            <footer className="relative z-10 p-8 text-center">
                <p className="text-[10px] font-mono font-bold text-slate-400 tracking-[0.3em] uppercase opacity-50">
                    BLACK BARBIE AUTH_CORE_V.2.0
                </p>
            </footer>
        </div>
    );
}
