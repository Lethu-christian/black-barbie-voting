import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);

        if (error) {
            alert(error.message);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-brand-100">
                <div className="text-center mb-8">
                    <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                        <Lock size={32} />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-brand-900">Admin Access</h1>
                    <p className="text-gray-500 mt-1">Enter your credentials to manage the pageant.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50 focus:bg-white transition-all"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-gray-50 focus:bg-white transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-200/50 hover:bg-brand-700 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
