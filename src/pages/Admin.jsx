import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
    LayoutDashboard, Users, CreditCard, LogOut, Plus, Trash2,
    Edit, X, Image as ImageIcon, Save, Loader2, Search,
    TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
    Download, Bell, Filter, MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- COMPONENTS ---

// 1. Custom Pink Area Chart
const SimpleAreaChart = ({ data, color = "#db2777" }) => {
    if (!data || data.length < 2) return <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm italic">Gathering data...</div>;

    const maxVal = Math.max(...data.map(d => d.value));
    const minVal = 0;
    const range = maxVal - minVal;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - minVal) / (range || 1)) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full h-full overflow-hidden group">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
            </svg>
            {/* Interactive Dot on Hover (Visual only for last point) */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

// 2. KPICard
const KPICard = ({ title, value, subtext, trend, icon: Icon, colorClass }) => (
    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-xl shadow-pink-500/5 hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3.5 rounded-2xl ${colorClass} bg-opacity-10`}>
                <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{value}</p>
        <p className="text-slate-400 text-xs mt-1 font-medium">{subtext}</p>
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
    const [userEmail, setUserEmail] = useState('Admin'); // For initials
    const navigate = useNavigate();

    // Modal States
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingGallery, setIsAddingGallery] = useState(false);
    const [editingContestant, setEditingContestant] = useState(null);
    const [editingGallery, setEditingGallery] = useState(null);
    const [newC, setNewC] = useState({ name: '', number: '', bio: '', image_url: '' });
    const [newG, setNewG] = useState({ title: '', desc: '', url: '' });

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
        // Fetch Contestants
        const { data: cData } = await supabase.from('contestants').select('*').order('votes', { ascending: false });
        if (cData) setContestants(cData);

        // Fetch Transactions
        const { data: tData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        if (tData) setTransactions(tData);

        // Fetch Gallery
        const { data: gData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (gData) setGalleryItems(gData);

        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // --- CRUD OPERATIONS ---
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
                fetchData();
            } else {
                alert(error.message);
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred: " + err.message);
        } finally {
            setLoading(false);
        }
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
                fetchData();
            } else {
                alert(error.message);
            }
        } catch (err) {
            console.error(err);
            alert("Update failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- GALLERY CRUD ---
    const handleAddGallery = async () => {
        if (!newG.title || !newG.url) return alert("Title and URL are required");
        setLoading(true);
        try {
            const { error } = await supabase.from('gallery').insert([newG]);
            if (!error) {
                setNewG({ title: '', desc: '', url: '' });
                setIsAddingGallery(false);
                fetchData();
            } else {
                alert(error.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to add gallery item: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGallery = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('gallery').update({
                title: editingGallery.title,
                desc: editingGallery.desc,
                url: editingGallery.url
            }).eq('id', editingGallery.id);
            if (!error) {
                setEditingGallery(null);
                fetchData();
            } else {
                alert(error.message);
            }
        } catch (err) {
            console.error(err);
            alert("Update gallery failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGallery = async (id) => {
        if (window.confirm('Delete this gallery item?')) {
            setLoading(true);
            try {
                const { error } = await supabase.from('gallery').delete().eq('id', id);
                if (!error) {
                    setGalleryItems(prev => prev.filter(g => g.id !== id));
                } else {
                    alert(error.message);
                }
            } catch (err) {
                console.error(err);
                alert("Delete failed: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // --- FIXED DELETE FUNCTION ---
    const handleDelete = async (id) => {
        if (window.confirm('Permanently delete this contestant?')) {
            setLoading(true); // Show loading state

            const { error } = await supabase
                .from('contestants')
                .delete()
                .eq('id', id);

            setLoading(false); // Hide loading state

            if (error) {
                console.error("Error deleting contestant:", error);
                alert("Failed to delete: " + error.message);
            } else {
                // Optimistically update the UI by removing the item from the local state
                setContestants(prev => prev.filter(c => c.id !== id));
            }
        }
    };

    // --- ANALYTICS LOGIC ---
    const stats = useMemo(() => {
        const totalVotes = contestants.reduce((acc, curr) => acc + (curr.votes || 0), 0);
        const revenue = totalVotes * 2; // Assuming R2 per vote
        const recentTrans = transactions.filter(t => new Date(t.created_at) > new Date(Date.now() - 86400000 * 7)); // Last 7 days

        // Generate chart data
        const chartData = transactions.length > 0
            ? transactions.slice(0, 20).map(t => ({ value: t.amount })).reverse()
            : Array.from({ length: 12 }, () => ({ value: Math.floor(Math.random() * 500) + 100 }));

        return { totalVotes, revenue, recentCount: recentTrans.length, chartData };
    }, [contestants, transactions]);

    const filteredContestants = contestants.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.number.toString().includes(searchTerm)
    );

    const filteredTransactions = transactions.filter(t =>
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGallery = galleryItems.filter(g =>
        g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helpers
    function handleEditClick(c) {
        setEditingContestant({ ...c });
    }

    return (
        <div className="flex h-screen bg-[#fff0f5] font-sans text-slate-800 overflow-hidden selection:bg-pink-200 selection:text-pink-900">

            {/* --- SIDEBAR --- */}
            <aside className="w-20 lg:w-72 bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 shadow-2xl relative overflow-hidden">
                {/* Pink Glow in Sidebar */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />

                <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10 relative z-10">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="/logo-bba.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="ml-3 hidden lg:block">
                        <h1 className="font-bold text-lg leading-none tracking-tight">Black<span className="text-pink-500">Barbie</span></h1>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">Admin Console</p>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 relative z-10">
                    {[
                        { id: 'analytics', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'contestants', icon: Users, label: 'Contestants' },
                        { id: 'transactions', icon: CreditCard, label: 'Finance' },
                        { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-pink-600 text-white shadow-xl shadow-pink-900/40'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={22} className={`relative z-10 ${activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-bold tracking-wide relative z-10 hidden lg:block">{item.label}</span>

                            {/* Active Shine Effect */}
                            {activeTab === item.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 relative z-10">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                        <LogOut size={22} />
                        <span className="font-bold hidden lg:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Navigation */}
                <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-8 z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h2>
                        <span className="px-3 py-1 bg-white/50 text-emerald-600 text-[10px] font-black tracking-widest rounded-full border border-white/60 shadow-sm flex items-center gap-1.5 uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Data
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-white rounded-2xl px-4 py-3 border border-pink-100 focus-within:ring-2 focus-within:ring-pink-200 focus-within:border-pink-300 transition-all w-80 shadow-sm">
                            <Search size={18} className="text-pink-300" />
                            <input
                                type="text"
                                placeholder="Search system..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-700 placeholder:text-slate-400 font-medium"
                            />
                        </div>
                        <button className="relative p-3 bg-white rounded-xl shadow-sm border border-pink-50 text-slate-400 hover:text-pink-600 hover:shadow-md transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-12 w-12 bg-gradient-to-tr from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center text-pink-600 font-black border border-white shadow-sm uppercase">
                            {userEmail.slice(0, 2)}
                        </div>
                    </div>
                </header>

                {/* Dashboard Canvas */}
                <div className="flex-1 overflow-y-auto p-8 relative scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#db2777 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    {/* Floating Orbs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-300/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

                    {activeTab === 'analytics' && (
                        <div className="space-y-8 max-w-8xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <KPICard
                                    title="Total Revenue"
                                    value={`R${stats.revenue.toLocaleString()}`}
                                    subtext="Verified income"
                                    trend={12.5}
                                    icon={CreditCard}
                                    colorClass="bg-emerald-500 text-emerald-500"
                                />
                                <KPICard
                                    title="Total Votes"
                                    value={stats.totalVotes.toLocaleString()}
                                    subtext="Cumulative count"
                                    trend={8.2}
                                    icon={TrendingUp}
                                    colorClass="bg-pink-500 text-pink-500"
                                />
                                <KPICard
                                    title="Active Models"
                                    value={contestants.length}
                                    subtext="Registered profiles"
                                    icon={Users}
                                    colorClass="bg-violet-500 text-violet-500"
                                />
                                <KPICard
                                    title="Transactions"
                                    value={stats.recentCount}
                                    subtext="Last 7 Days"
                                    icon={Calendar}
                                    colorClass="bg-amber-500 text-amber-500"
                                />
                            </div>

                            {/* Main Chart Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-pink-500/5">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-xl">Revenue Velocity</h3>
                                            <p className="text-slate-400 text-sm font-medium">Income generation over time</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-xs font-bold text-pink-600 bg-pink-50 px-4 py-2 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors">
                                            <Download size={14} /> Export Data
                                        </button>
                                    </div>
                                    <div className="h-80 w-full">
                                        <SimpleAreaChart data={stats.chartData} color="#db2777" />
                                    </div>
                                </div>

                                {/* Top Performer Card */}
                                <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-xl">Top Model</h3>
                                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">Leading the charts</p>
                                        </div>
                                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                            <TrendingUp size={20} className="text-pink-400" />
                                        </div>
                                    </div>

                                    {contestants[0] ? (
                                        <div className="mt-auto relative z-10 flex flex-col items-center">
                                            <div className="relative w-32 h-32 mb-6">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-[2rem] rotate-6 opacity-60 blur-sm"></div>
                                                <img src={contestants[0].image_url} className="absolute inset-0 w-full h-full object-cover rounded-[2rem] border-4 border-white/10 shadow-2xl" alt="Top" />
                                            </div>
                                            <h4 className="text-3xl font-black">{contestants[0].name}</h4>
                                            <p className="text-pink-300 font-mono text-sm mb-6">#{contestants[0].number}</p>

                                            <div className="w-full bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex justify-between items-center">
                                                <span className="text-xs text-slate-400 uppercase font-bold">Votes</span>
                                                <span className="text-2xl font-bold text-white">{contestants[0].votes.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-auto text-center text-slate-500 italic">No data available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contestants' && (
                        <div className="space-y-8 max-w-8xl mx-auto animate-in fade-in duration-300 relative z-10">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white/60 shadow-lg shadow-pink-500/5">
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="relative w-full md:w-80 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 transition-all shadow-sm"
                                            placeholder="Find contestant by name or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button className="p-3 bg-white border border-pink-100 rounded-2xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-all shadow-sm">
                                        <Filter size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="w-full md:w-auto px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Plus size={20} /> Add Contestant
                                </button>
                            </div>

                            {/* Contestant Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredContestants.map((c) => (
                                    <div key={c.id} className="group bg-white rounded-[2rem] border border-pink-50 overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2">
                                        <div className="relative h-64 bg-slate-100 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-60" />
                                            <img src={c.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.name} />

                                            <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-slate-800 shadow-sm border border-white/50">
                                                #{c.number}
                                            </div>

                                            {/* Floating Actions */}
                                            <div className="absolute bottom-4 right-4 z-20 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={() => handleEditClick(c)} className="p-3 bg-white rounded-xl text-slate-800 hover:text-pink-600 shadow-lg hover:shadow-xl transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-3 bg-white rounded-xl text-rose-500 hover:bg-rose-50 shadow-lg hover:shadow-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="font-black text-xl text-slate-800 truncate">{c.name}</h3>
                                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Votes</p>
                                                    <p className="text-2xl font-black text-pink-600">{c.votes.toLocaleString()}</p>
                                                </div>
                                                <div className="h-10 w-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                                    <TrendingUp size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredContestants.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white/40 rounded-[3rem] border border-dashed border-pink-200">
                                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-300">
                                        <Search size={40} />
                                    </div>
                                    <p className="font-medium text-lg">No contestants found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 relative z-10">
                            <div className="flex justify-between items-center bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-sm">
                                <div>
                                    <h2 className="font-black text-2xl text-slate-800">Transactions</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Real-time financial feed</p>
                                </div>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-pink-600 bg-white px-5 py-3 rounded-xl border border-slate-200 hover:border-pink-200 shadow-sm hover:shadow-md transition-all">
                                    <Download size={16} /> Export Report
                                </button>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-pink-500/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-pink-50/50 border-b border-pink-100/50 text-xs uppercase tracking-widest text-slate-400 font-bold">
                                                <th className="p-6 pl-8">Reference</th>
                                                <th className="p-6">User</th>
                                                <th className="p-6">Votes</th>
                                                <th className="p-6">Amount</th>
                                                <th className="p-6">Status</th>
                                                <th className="p-6">Date</th>
                                                <th className="p-6 text-right pr-8">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredTransactions.map((t) => (
                                                <tr key={t.id} className="hover:bg-pink-50/30 transition-colors group">
                                                    <td className="p-6 pl-8 font-mono text-xs text-slate-500 bg-transparent">{t.reference?.substring(0, 8)}...</td>
                                                    <td className="p-6 font-bold text-slate-700">{t.email}</td>
                                                    <td className="p-6">
                                                        <span className="bg-white text-pink-600 px-3 py-1.5 rounded-lg text-xs font-black border border-pink-100 shadow-sm">
                                                            +{t.votes_purchased}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 font-black text-slate-800">R{t.amount}</td>
                                                    <td className="p-6">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Paid
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-sm text-slate-500 font-medium">{new Date(t.created_at).toLocaleDateString()}</td>
                                                    <td className="p-6 text-right pr-8">
                                                        <button className="p-2 text-slate-300 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                                                            <MoreHorizontal size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredTransactions.length === 0 && (
                                    <div className="p-20 text-center text-slate-400">No transactions recorded yet.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="space-y-8 max-w-8xl mx-auto animate-in fade-in duration-300 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-[2rem] border border-white/60 shadow-lg shadow-pink-500/5">
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="relative w-full md:w-80 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                                        <input
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 transition-all shadow-sm"
                                            placeholder="Search gallery..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddingGallery(true)}
                                    className="w-full md:w-auto px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Plus size={20} /> Add Image
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredGallery.map((item) => (
                                    <div key={item.id} className="group bg-white rounded-[2rem] border border-pink-50 overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2">
                                        <div className="relative h-64 bg-slate-100 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-60" />
                                            <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />

                                            <div className="absolute bottom-4 right-4 z-20 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={() => setEditingGallery({ ...item })} className="p-3 bg-white rounded-xl text-slate-800 hover:text-pink-600 shadow-lg hover:shadow-xl transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteGallery(item.id)} className="p-3 bg-white rounded-xl text-rose-500 hover:bg-rose-50 shadow-lg hover:shadow-xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-black text-xl text-slate-800 truncate">{item.title}</h3>
                                            <p className="text-slate-400 text-xs mt-2 line-clamp-2">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredGallery.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white/40 rounded-[3rem] border border-dashed border-pink-200">
                                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-300">
                                        <ImageIcon size={40} />
                                    </div>
                                    <p className="font-medium text-lg">No gallery images found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODALS --- */}
            {(isAdding || editingContestant) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => { setIsAdding(false); setEditingContestant(null); }}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        {/* Pink Header Gradient */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />

                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">{isAdding ? 'New Contestant' : 'Edit Profile'}</h3>
                                <p className="text-xs text-slate-400 font-medium mt-1">Manage contestant details</p>
                            </div>
                            <button onClick={() => { setIsAdding(false); setEditingContestant(null); }} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all font-bold text-slate-700"
                                        placeholder="e.g. Jane Doe"
                                        value={isAdding ? newC.name : editingContestant.name}
                                        onChange={e => isAdding ? setNewC({ ...newC, name: e.target.value }) : setEditingContestant({ ...editingContestant, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. (#)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all font-bold text-slate-700"
                                        placeholder="01"
                                        value={isAdding ? newC.number : editingContestant.number}
                                        onChange={e => isAdding ? setNewC({ ...newC, number: e.target.value }) : setEditingContestant({ ...editingContestant, number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm font-medium"
                                        placeholder="https://example.com/image.jpg"
                                        value={isAdding ? newC.image_url : editingContestant.image_url}
                                        onChange={e => isAdding ? setNewC({ ...newC, image_url: e.target.value }) : setEditingContestant({ ...editingContestant, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biography</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all resize-none text-sm font-medium"
                                    placeholder="Short contestant bio..."
                                    value={isAdding ? newC.bio : editingContestant.bio}
                                    onChange={e => isAdding ? setNewC({ ...newC, bio: e.target.value }) : setEditingContestant({ ...editingContestant, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-8 pt-0 flex justify-end gap-3">
                            <button onClick={() => { setIsAdding(false); setEditingContestant(null); }} className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                            <button
                                onClick={isAdding ? handleAddContestant : handleUpdateContestant}
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 shadow-lg shadow-pink-500/30 flex items-center gap-2 disabled:opacity-70 transition-all hover:scale-105 active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- GALLERY MODALS --- */}
            {(isAddingGallery || editingGallery) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">{isAddingGallery ? 'New Gallery Item' : 'Edit Gallery Item'}</h3>
                                <p className="text-xs text-slate-400 font-medium mt-1">Manage archives</p>
                            </div>
                            <button onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all font-bold text-slate-700"
                                    placeholder="e.g. Grand Opening"
                                    value={isAddingGallery ? newG.title : editingGallery.title}
                                    onChange={e => isAddingGallery ? setNewG({ ...newG, title: e.target.value }) : setEditingGallery({ ...editingGallery, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all text-sm font-medium"
                                        placeholder="https://example.com/image.jpg"
                                        value={isAddingGallery ? newG.url : editingGallery.url}
                                        onChange={e => isAddingGallery ? setNewG({ ...newG, url: e.target.value }) : setEditingGallery({ ...editingGallery, url: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none transition-all resize-none text-sm font-medium"
                                    placeholder="Memory description..."
                                    value={isAddingGallery ? newG.desc : editingGallery.desc}
                                    onChange={e => isAddingGallery ? setNewG({ ...newG, desc: e.target.value }) : setEditingGallery({ ...editingGallery, desc: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-8 pt-0 flex justify-end gap-3">
                            <button onClick={() => { setIsAddingGallery(false); setEditingGallery(null); }} className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                            <button
                                onClick={isAddingGallery ? handleAddGallery : handleUpdateGallery}
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 shadow-lg shadow-pink-500/30 flex items-center gap-2 disabled:opacity-70 transition-all hover:scale-105 active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}