import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined); // undefined = still checking

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // Listen for auth changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Still checking — don't flash login page
    if (session === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-50">
                <div className="w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Logged in → render the protected page
    return children;
}
