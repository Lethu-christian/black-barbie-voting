import React, { useEffect, useState } from 'react';
import { Home, Users, BarChart3, Settings, Shield, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminSidebar = () => {
    const [userEmail, setUserEmail] = useState('Admin');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserEmail(data.user.email);
        });
    }, []);

    const menuItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true },
        { icon: <Users className="w-5 h-5" />, label: 'Contestants', active: false },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Add Contestant', active: false },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Voting Stats', active: false },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: false },
    ];

    return (
        <aside className="w-72 bg-luxury-slate h-screen sticky top-0 flex flex-col p-6 text-slate-300">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                    <img src="/logo-bba.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white leading-none">Admin Panel</h2>
                    <p className="text-[10px] uppercase tracking-widest text-luxury-pink font-bold mt-1">PinkBallot v1.0</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${item.active
                                ? 'bg-luxury-deep text-white shadow-lg shadow-luxury-deep/20'
                                : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <span className={`${item.active ? 'text-white' : 'text-slate-500 group-hover:text-luxury-pink'}`}>
                            {item.icon}
                        </span>
                        <span className="font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <div className="p-4 bg-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-1">Signed in as</p>
                    <p className="font-bold text-white truncate text-sm">{userEmail}</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
