import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const [status, setStatus] = useState({ session: undefined, role: null });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setStatus({ session, role: profile?.role || 'voter' });
            } else {
                setStatus({ session: null, role: null });
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setStatus({ session, role: profile?.role || 'voter' });
            } else {
                setStatus({ session: null, role: null });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (status.session === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!status.session) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && status.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return children;
}
