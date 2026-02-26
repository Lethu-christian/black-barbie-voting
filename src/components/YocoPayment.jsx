import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';

const YocoPayment = ({ amountInCents, contestantId, voteCount, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | initializing | verifying

    // AUTO-VERIFY: Check URL on load for Yoco return parameters
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const isReturning = params.get('yoco_return') === '1';
        const saved = JSON.parse(localStorage.getItem('pendingYocoVote') || '{}');

        if (isReturning && saved.checkoutId && status === 'idle') {
            verifyTransaction(saved.checkoutId);
        }
    }, []);

    const handlePay = async () => {
        setLoading(true);
        setStatus('initializing');

        try {
            // 1. Initialize Yoco checkout via Edge Function
            const returnUrl = window.location.origin + window.location.pathname + '?yoco_return=1';

            const { data, error } = await supabase.functions.invoke('verify-yoco', {
                body: {
                    mode: 'create',
                    amountInCents,
                    successUrl: returnUrl
                }
            });

            // If Supabase returns an error (non-2xx), try to get the body
            if (error) {
                console.error("Edge function error object:", error);
                let errorMsg = error.message;

                // Try to see if it's a response error we can parse
                if (error.context && typeof error.context.json === 'function') {
                    try {
                        const errData = await error.context.json();
                        errorMsg = errData.error || errData.message || errorMsg;
                    } catch (e) {
                        console.error("Could not parse error context:", e);
                    }
                }
                throw new Error(errorMsg);
            }

            if (!data?.success || !data?.redirectUrl) {
                const fullError = data ? JSON.stringify(data, null, 2) : 'No response data';
                throw new Error(data?.error || `Failed to initialize payment. Details: ${fullError}`);
            }

            // 2. Save pending vote details to recover after redirect
            localStorage.setItem('pendingYocoVote', JSON.stringify({
                voteCount,
                contestantId,
                checkoutId: data.checkoutId
            }));

            // 3. Redirect to Yoco
            window.location.href = data.redirectUrl;

        } catch (err) {
            console.error("Payment initialization error:", err);
            alert("Payment initialization error: " + err.message);
            setLoading(false);
            setStatus('idle');
        }
    };

    const verifyTransaction = async (checkoutId) => {
        const saved = JSON.parse(localStorage.getItem('pendingYocoVote') || '{}');
        if (!saved.contestantId) {
            console.warn("No pending vote found in localStorage");
        }

        setStatus('verifying');
        setLoading(true);

        // Clean the checkoutId from the URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        try {
            const { data, error } = await supabase.functions.invoke('verify-yoco', {
                body: {
                    mode: 'verify',
                    checkoutId,
                    contestantId: saved.contestantId,
                    voteCount: saved.voteCount,
                }
            });

            if (error) throw error;

            localStorage.removeItem('pendingYocoVote');
            setLoading(false);
            setStatus('idle');

            if (data?.success) {
                onSuccess();
                alert(`SUCCESS! Your votes have been recorded.`);
            } else {
                alert("Payment verification failed: " + (data?.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Verification error:", err);
            alert("Verification Error: " + err.message);
            setLoading(false);
            setStatus('idle');
        }
    };

    return (
        <div className="w-full space-y-4">
            <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-500/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-80"
            >
                {loading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <CreditCard size={20} />
                )}

                {status === 'initializing' ? 'INITIALIZING...' :
                    status === 'verifying' ? 'VERIFYING...' :
                        `VOTE NOW (R${(amountInCents / 100).toFixed(2)})`}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
                <ShieldCheck size={12} className="text-emerald-500" />
                SECURE YOCO GATEWAY
            </div>
        </div>
    );
};

export default YocoPayment;
