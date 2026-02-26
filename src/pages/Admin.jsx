import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
    LayoutDashboard, Users, CreditCard, LogOut, Plus, Trash2,
    Edit, X, Image as ImageIcon, Save, Loader2, Search,
    TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
    Download, Bell, Filter, MoreHorizontal, ShieldCheck,
    Zap, Activity, Wallet, ChevronRight, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- VISUAL COMPONENTS ---

// 1. Enhanced "Neon" Area Chart
const SimpleAreaChart = ({ data, color = "#db2777" }) => {
    if (!data || data.length < 2) return (
        <div className="h-full w-full flex flex-col items-center justify-center text-pink-300/50 space-y-2 animate-pulse">
            <Activity size={24} />
            <span className="text-xs font-mono uppercase tracking-widest">Awaiting Data Signal...</span>
        </div>
    );

    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = 0;
    const range = maxVal - minVal;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - minVal) / (range || 1)) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full h-full group">
            {/* Chart Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-50 blur-xl" />

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible relative z-10">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <mask id="gridMask">
                        <rect width="100%" height="100%" fill="white" />
                        <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#gridPattern)" />
                    </mask>
                </defs>

                {/* Grid Lines Overlay */}
                <path d={`M0,100 ${points} 100,100`} fill="url(#chartGradient)" className="opacity-80" />

                {/* Main Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#neonGlow)"
                    className="drop-shadow-2xl"
                />
            </svg>

            {/* Interactive Cursor Line (Visual Simulation) */}
            <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};

// 2. Futuristic KPI Card
const KPICard = ({ title, value, subtext, trend, icon: Icon, colorClass, delay }) => (
    <div
        className="relative group overflow-hidden bg-white/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(236,72,153,0.15)] transition-all duration-500 hover:-translate-y-2"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Background Mesh Gradient */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 ${colorClass.replace('text-', 'bg-')} transition-all duration-700 group-hover:scale-150`} />

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${colorClass.replace('text-', 'bg-').replace('500', '100')} ${colorClass} bg-opacity-10 ring-1 ring-inset ring-black/5`}>
                    <Icon size={26} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/50 shadow-sm ${trend > 0 ? 'bg-emerald-400/10 text-emerald-700' : 'bg-rose-400/10 text-rose-700'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">{title}</h3>
                <p className="text-4xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                    {value}
                </p>
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    {subtext}
                </p>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function Admin() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [contestants, setContestants] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [userEmail, setUserEmail] = useState('Admin');
    const navigate = useNavigate();

    // Modal States
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingGallery, setIsAddingGallery] = useState(false);
    const [editingContestant, setEditingContestant] = useState(null);
    const [editingGallery, setEditingGallery] = useState(null);
    const [newC, setNewC] = useState({ name: '', number: '', bio: '', image_url: '' });
    const [newG, setNewG] = useState({ title: '', desc: '', url: '' });

    // --- LOGIC (UNCHANGED) ---
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return navigate('/login');
            setUserEmail(user.email);

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'admin') {
                alert("Unauthorized access. Admins only.");
                navigate('/home');
            } else {
                fetchData();
            }
        };
        checkAdmin();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: cData, error: cErr } = await supabase.from('contestants').select('*').order('votes', { ascending: false });
            if (cErr) throw new Error("Contestants: " + cErr.message);
            if (cData) setContestants(cData);

            const { data: tData, error: tErr } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
            if (tData) setTransactions(tData);

            const { data: gData, error: gErr } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
            if (gData) setGalleryItems(gData);

        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleAddContestant = async () => {
        if (!newC.name || !newC.number) return alert("Required fields missing");
        setLoading(true);
        try {
            const { error } = await supabase.from('contestants').insert({
                name: newC.name, number: parseInt(newC.number), bio: newC.bio,
                image_url: newC.image_url || 'https://via.placeholder.com/400', votes: 0
            });
            if (!error) {
                setNewC({ name: '', number: '', bio: '', image_url: '' });
                setIsAdding(false);
                await fetchData();
            } else {
                alert(error.message);
            }
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const handleUpdateContestant = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('contestants').update({
                name: editingContestant.name, number: parseInt(editingContestant.number),
                bio: editingContestant.bio, image_url: editingContestant.image_url
            }).eq('id', editingContestant.id);
            if (!error) {
                setEditingContestant(null);
                await fetchData();
            } else { alert(error.message); }
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this contestant?')) {
            setLoading(true);
            const { error } = await supabase.from('contestants').delete().eq('id', id);
            setLoading(false);
            if (!error) setContestants(prev => prev.filter(c => c.id !== id));
            else alert(error.message);
        }
    };

    const handleAddGallery = async () => {
        if (!newG.title || !newG.url) return alert("Title and URL required");
        setLoading(true);
        try {
            const { error } = await supabase.from('gallery').insert([newG]);
            if (!error) {
                setNewG({ title: '', desc: '', url: '' });
                setIsAddingGallery(false);
                await fetchData();
            } else { alert(error.message); }
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const handleUpdateGallery = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('gallery').update({
                title: editingGallery.title, desc: editingGallery.desc, url: editingGallery.url
            }).eq('id', editingGallery.id);
            if (!error) {
                setEditingGallery(null);
                await fetchData();
            } else { alert(error.message); }
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const handleDeleteGallery = async (id) => {
        if (window.confirm('Delete image?')) {
            setLoading(true);
            const { error } = await supabase.from('gallery').delete().eq('id', id);
            setLoading(false);
            if (!error) setGalleryItems(prev => prev.filter(g => g.id !== id));
            else alert(error.message);
        }
    };

    // Stats Memoization
    const stats = useMemo(() => {
        const totalVotes = contestants.reduce((acc, curr) => acc + (curr.votes || 0), 0);
        const revenue = totalVotes * 2;
        const recentTrans = transactions.filter(t => new Date(t.created_at) > new Date(Date.now() - 86400000 * 7));
        const chartData = transactions.length > 0
            ? transactions.slice(0, 20).map(t => ({ value: t.amount })).reverse()
            : Array.from({ length: 12 }, () => ({ value: Math.floor(Math.random() * 500) + 100 }));
        return { totalVotes, revenue, recentCount: recentTrans.length, chartData };
    }, [contestants, transactions]);

    const filteredContestants = contestants.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.number.toString().includes(searchTerm)
    );
    const filteredTransactions = transactions.filter(t =>
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredGallery = galleryItems.filter(g =>
        g.title?.toLowerCase().includes(searchTerm.toLowerCase()) || g.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- UI RENDER ---
    return (
        <div className="flex h-screen bg-[#fff0f5] font-sans text-slate-800 overflow-hidden selection:bg-pink-500 selection:text-white">

            {/* Global Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-rose-200/40 to-orange-100/40 blur-[120px]" />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-pink-300/20 blur-[80px]" />
            </div>

            {/* --- SIDEBAR --- */}
            <aside className="w-20 lg:w-80 bg-slate-900/95 backdrop-blur-xl text-white flex flex-col transition-all duration-300 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-white/5 relative">
                {/* Logo Area */}
                <div className="h-32 flex flex-col justify-center px-8 border-b border-white/5 bg-gradient-to-b from-slate-800/50 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30">
                            <span className="font-black text-xl italic">B</span>
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="font-bold text-xl tracking-tight text-white">Black<span className="text-pink-500">Barbie</span></h1>
                            <p className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase">System Admin</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-10 px-6 space-y-3">
                    {[
                        { id: 'analytics', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'contestants', icon: Users, label: 'Contestants' },
                        { id: 'transactions', icon: CreditCard, label: 'Finance' },
                        { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xl shadow-pink-600/20 ring-1 ring-white/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-6'
                                }`}
                        >
                            <item.icon size={20} className={`relative z-10 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={2} />
                            <span className="font-bold tracking-wide relative z-10 hidden lg:block text-sm">{item.label}</span>

                            {activeTab === item.id && (
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-6 border-t border-white/5 bg-slate-950/30">
                    <div className="flex items-center gap-4 mb-4 hidden lg:flex">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
                                {userEmail.slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{userEmail}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/20">
                        <LogOut size={18} />
                        <span className="font-bold text-xs uppercase tracking-wider hidden lg:block">Disconnect</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">

                {/* Glass Header */}
                <header className="h-28 flex items-center justify-between px-10 z-40 sticky top-0 transition-all duration-300">
                    <div className="flex flex-col">
                        <h2 className="text-4xl font-black text-slate-800 capitalize tracking-tight drop-shadow-sm">
                            {activeTab}
                        </h2>
                        <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                            Welcome back, Admin
                            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-wide border border-pink-200">
                                Super User
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-white/60 backdrop-blur-md rounded-[1.25rem] px-5 py-3.5 border border-white shadow-sm focus-within:ring-4 focus-within:ring-pink-500/10 focus-within:border-pink-300 transition-all w-96 group hover:shadow-lg hover:shadow-pink-500/5">
                            <Search size={20} className="text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search database..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-700 placeholder:text-slate-400 font-semibold"
                            />
                            <div className="h-6 px-2 rounded-md bg-slate-200/50 text-slate-500 text-[10px] font-bold flex items-center justify-center uppercase">Cmd+K</div>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-3.5 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white text-slate-400 hover:text-pink-600 hover:bg-white hover:scale-105 transition-all">
                            <Bell size={22} />
                            <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Canvas */}
                <div className="flex-1 overflow-y-auto p-10 pt-2 relative scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">

                    {activeTab === 'analytics' && (
                        <div className="space-y-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <KPICard title="Revenue" value={`R${stats.revenue.toLocaleString()}`} subtext="Total earnings" trend={12.5} icon={Wallet} colorClass="text-emerald-500" delay={0} />
                                <KPICard title="Total Votes" value={stats.totalVotes.toLocaleString()} subtext="All time cast" trend={8.2} icon={Zap} colorClass="text-pink-500" delay={100} />
                                <KPICard title="Models" value={contestants.length} subtext="Active profiles" icon={Users} colorClass="text-violet-500" delay={200} />
                                <KPICard title="Activity" value={stats.recentCount} subtext="Trans. (7d)" icon={Activity} colorClass="text-amber-500" delay={300} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                                {/* Chart Section */}
                                <div className="lg:col-span-2 bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/60 shadow-xl shadow-pink-900/5 flex flex-col relative overflow-hidden group">
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div>
                                            <h3 className="font-black text-2xl text-slate-800 tracking-tight">Financial Velocity</h3>
                                            <p className="text-slate-400 text-sm font-medium mt-1">Real-time transaction monitoring</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {['1W', '1M', '1Y', 'ALL'].map(range => (
                                                <button key={range} className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-100 text-slate-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all">
                                                    {range}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full relative z-10">
                                        <SimpleAreaChart data={stats.chartData} color="#ec4899" />
                                    </div>
                                </div>

                                {/* Top Performer Spotlight */}
                                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/30 flex flex-col relative overflow-hidden group">
                                    {/* Abstract Background Art */}
                                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse"></div>
                                    <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-purple-500 rounded-full blur-[80px] opacity-30"></div>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">#1 Ranked</span>
                                            </div>
                                            <h3 className="font-black text-3xl tracking-tight">Top Model</h3>
                                        </div>
                                        <button className="p-3 bg-white/10 rounded-2xl backdrop-blur-md hover:bg-white/20 transition-all border border-white/10">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    {contestants[0] ? (
                                        <div className="mt-auto relative z-10 flex flex-col items-center">
                                            <div className="relative w-40 h-40 mb-8 group-hover:scale-105 transition-transform duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-[2.5rem] rotate-6 opacity-60 blur-md"></div>
                                                <img src={contestants[0].image_url} className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] border-[6px] border-white/10 shadow-2xl" alt="Top" />
                                                <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                                                    #{contestants[0].number}
                                                </div>
                                            </div>
                                            <h4 className="text-4xl font-black text-center leading-none mb-1">{contestants[0].name}</h4>
                                            <p className="text-white/60 font-medium text-sm text-center line-clamp-2 max-w-[80%]">{contestants[0].bio || "Rising Star"}</p>

                                            <div className="w-full mt-8 bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 flex justify-between items-center hover:bg-white/15 transition-colors cursor-default">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Total Votes</span>
                                                    <span className="text-3xl font-black text-white">{contestants[0].votes.toLocaleString()}</span>
                                                </div>
                                                <div className="h-12 w-12 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/40">
                                                    <TrendingUp size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-auto text-center text-slate-500 font-mono text-sm opacity-50">Data unavailable</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contestants' && (
                        <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative z-10">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg shadow-pink-900/5">
                                <div className="flex items-center gap-3 w-full md:w-auto pl-2">
                                    <div className="p-2.5 bg-pink-100 rounded-xl text-pink-600">
                                        <Filter size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{filteredContestants.length} Profiles</span>
                                </div>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 flex items-center justify-center gap-3 transition-all"
                                >
                                    <Plus size={20} /> <span className="tracking-wide">Add New Model</span>
                                </button>
                            </div>

                            {/* Contestant Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredContestants.map((c, i) => (
                                    <div
                                        key={c.id}
                                        className="group bg-white rounded-[2.5rem] border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(236,72,153,0.2)] transition-all duration-500 hover:-translate-y-3 relative"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="relative h-80 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <img src={c.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={c.name} />

                                            <div className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-xs font-black text-slate-900 shadow-lg border border-white">
                                                #{c.number}
                                            </div>

                                            {/* Action Overlay */}
                                            <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                                <button onClick={() => setEditingContestant(c)} className="p-4 bg-white rounded-full text-slate-900 hover:text-pink-600 hover:scale-110 transition-all shadow-xl"><Edit size={20} /></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-4 bg-white rounded-full text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all shadow-xl"><Trash2 size={20} /></button>
                                            </div>

                                            <div className="absolute bottom-5 left-5 z-20 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="font-black text-2xl drop-shadow-md">{c.name}</h3>
                                                <p className="text-white/80 text-xs font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{c.bio || "No bio available"}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gradient-to-b from-white to-pink-50/30">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Current Votes</p>
                                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{c.votes.toLocaleString()}</p>
                                                </div>
                                                <div className="h-12 w-12 bg-pink-100/50 rounded-2xl flex items-center justify-center text-pink-600 border border-pink-100">
                                                    <TrendingUp size={22} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
                            <div className="flex justify-between items-center bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg shadow-pink-900/5">
                                <div>
                                    <h2 className="font-black text-3xl text-slate-800 tracking-tight">Financial Ledger</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Live transaction feed</p>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-pink-600 bg-white px-6 py-4 rounded-2xl border border-slate-200 hover:border-pink-200 shadow-sm hover:shadow-lg transition-all uppercase tracking-wider">
                                    <Download size={16} /> Export CSV
                                </button>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-bold">
                                                <th className="p-8 pl-10">Transaction Ref</th>
                                                <th className="p-8">Payer</th>
                                                <th className="p-8">Votes</th>
                                                <th className="p-8">Value</th>
                                                <th className="p-8">Status</th>
                                                <th className="p-8 text-right pr-10">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredTransactions.map((t) => (
                                                <tr key={t.id} className="hover:bg-pink-50/40 transition-colors group">
                                                    <td className="p-8 pl-10 font-mono text-xs font-bold text-slate-500">
                                                        <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">#{t.reference?.substring(0, 8)}</span>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
                                                                {t.email?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-slate-700">{t.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className="bg-white text-pink-600 px-4 py-1.5 rounded-lg text-xs font-black border border-pink-100 shadow-sm group-hover:scale-105 transition-transform inline-block">
                                                            +{t.votes_purchased}
                                                        </span>
                                                    </td>
                                                    <td className="p-8 font-black text-slate-800 text-lg">R{t.amount}</td>
                                                    <td className="p-8">
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100/50 text-emerald-700 border border-emerald-200/50">
                                                            <ShieldCheck size={12} /> Verified
                                                        </span>
                                                    </td>
                                                    <td className="p-8 text-right pr-10 text-sm text-slate-400 font-medium">
                                                        {new Date(t.created_at).toLocaleDateString()} <span className="text-slate-300 mx-1">•</span> {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative z-10">
                            {/* Gallery Toolbar - Matches Contestants */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg shadow-pink-900/5">
                                <div className="flex items-center gap-3 w-full md:w-auto pl-2">
                                    <div className="p-2.5 bg-pink-100 rounded-xl text-pink-600">
                                        <ImageIcon size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{filteredGallery.length} Items</span>
                                </div>
                                <button
                                    onClick={() => setIsAddingGallery(true)}
                                    className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 flex items-center justify-center gap-3 transition-all"
                                >
                                    <Plus size={20} /> <span className="tracking-wide">Add Image</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredGallery.map((item, i) => (
                                    <div key={item.id} className="group bg-white rounded-[2rem] border border-white/60 shadow-md overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2 relative">
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-slate-900/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />

                                            {/* Action Buttons */}
                                            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                                <button onClick={() => setEditingGallery({ ...item })} className="p-3 bg-white rounded-xl text-slate-800 hover:text-pink-600 shadow-lg hover:shadow-xl transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteGallery(item.id)} className="p-3 bg-white rounded-xl text-rose-500 hover:bg-rose-50 shadow-lg hover:shadow-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-black text-lg text-slate-800 truncate">{item.title}</h3>
                                            <p className="text-slate-400 text-xs mt-2 line-clamp-2 font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAL (Glassmorphic) --- */}
            {(isAdding || editingContestant || isAddingGallery || editingGallery) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                        onClick={() => { setIsAdding(false); setEditingContestant(null); setIsAddingGallery(false); setEditingGallery(null); }}
                    />

                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Modal Content - Dynamic Form Rendering */}
                        {((isAdding || editingContestant) ? (
                            <>
                                <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">{isAdding ? 'New Talent' : 'Edit Profile'}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Database Management</p>
                                    </div>
                                    <button onClick={() => { setIsAdding(false); setEditingContestant(null); }} className="p-2.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shadow-sm border border-slate-100"><X size={20} /></button>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-slate-700"
                                                placeholder="e.g. Jane Doe"
                                                value={isAdding ? newC.name : editingContestant.name}
                                                onChange={e => isAdding ? setNewC({ ...newC, name: e.target.value }) : setEditingContestant({ ...editingContestant, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">No. (#)</label>
                                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-slate-700 text-center"
                                                placeholder="00"
                                                value={isAdding ? newC.number : editingContestant.number}
                                                onChange={e => isAdding ? setNewC({ ...newC, number: e.target.value }) : setEditingContestant({ ...editingContestant, number: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all text-sm font-semibold text-slate-600"
                                                placeholder="https://..."
                                                value={isAdding ? newC.image_url : editingContestant.image_url}
                                                onChange={e => isAdding ? setNewC({ ...newC, image_url: e.target.value }) : setEditingContestant({ ...editingContestant, image_url: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Biography</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all resize-none text-sm font-medium text-slate-600"
                                            placeholder="Bio details..."
                                            value={isAdding ? newC.bio : editingContestant.bio}
                                            onChange={e => isAdding ? setNewC({ ...newC, bio: e.target.value }) : setEditingContestant({ ...editingContestant, bio: e.target.value })} />
                                    </div>
                                    <button onClick={isAdding ? handleAddContestant : handleUpdateContestant} disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} {loading ? 'Processing...' : 'Save Record'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Gallery Modal Content (Reusing structure for consistency) */}
                                <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">{isAddingGallery ? 'New Image' : 'Edit Image'}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gallery System</p>
                                    </div>
                                    <button onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }} className="p-2.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shadow-sm border border-slate-100"><X size={20} /></button>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all font-bold text-slate-700"
                                            value={isAddingGallery ? newG.title : editingGallery.title}
                                            onChange={e => isAddingGallery ? setNewG({ ...newG, title: e.target.value }) : setEditingGallery({ ...editingGallery, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all text-sm font-semibold text-slate-600"
                                            value={isAddingGallery ? newG.url : editingGallery.url}
                                            onChange={e => isAddingGallery ? setNewG({ ...newG, url: e.target.value }) : setEditingGallery({ ...editingGallery, url: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all resize-none text-sm font-medium text-slate-600"
                                            value={isAddingGallery ? newG.desc : editingGallery.desc}
                                            onChange={e => isAddingGallery ? setNewG({ ...newG, desc: e.target.value }) : setEditingGallery({ ...editingGallery, desc: e.target.value })} />
                                    </div>
                                    <button onClick={isAddingGallery ? handleAddGallery : handleUpdateGallery} disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-xl shadow-pink-600/30 hover:shadow-pink-600/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} {loading ? 'Processing...' : 'Save to Gallery'}
                                    </button>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}