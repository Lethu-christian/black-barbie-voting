import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, CreditCard, Lock } from 'lucide-react';

const YocoPayment = ({ amountInCents, contestantId, voteCount, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | redirecting | verifying

    // AUTO-VERIFY: Check URL on load for return parameters from Yoco redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const checkoutId = params.get('checkoutId');

        if (checkoutId && status === 'idle') {
            verifyTransaction(checkoutId);
        }
    }, []);

    const handlePay = async () => {
        setLoading(true);
        setStatus('redirecting');

        try {
            // 1. Ask Backend to create a secure Yoco checkout link
            const { data, error } = await supabase.functions.invoke('verify-yoco', {
                body: {
                    mode: 'create',
                    amountInCents,
                    metadata: { voteCount, contestantId },
                    successUrl: window.location.href,
                    cancelUrl: window.location.href,
                }
            });

            if (error) throw new Error(error.message);
            if (!data?.success || !data?.redirectUrl) {
                throw new Error(data?.error || JSON.stringify(data) || 'No redirect URL returned');
            }

            // 2. Save pending vote details to recover after redirect
            localStorage.setItem('pendingVote', JSON.stringify({ voteCount, contestantId }));

            // 3. Redirect to Yoco's secure hosted payment page
            window.location.href = data.redirectUrl;

        } catch (err) {
            alert("System Error: " + err.message);
            setLoading(false);
            setStatus('idle');
        }
    };

    const verifyTransaction = async (checkoutId) => {
        const saved = JSON.parse(localStorage.getItem('pendingVote') || '{}');
        if (!saved.contestantId) return;

        setStatus('verifying');
        setLoading(true);

        // Clean the checkoutId from the URL
        window.history.replaceState({}, document.title, window.location.pathname);

        const { data } = await supabase.functions.invoke('verify-yoco', {
            body: {
                mode: 'verify',
                checkoutId,
                contestantId: saved.contestantId,
                voteCount: saved.voteCount,
            }
        });

        localStorage.removeItem('pendingVote');
        setLoading(false);
        setStatus('idle');

        if (data?.success) {
            onSuccess();
            alert(`SUCCESS! ${saved.voteCount} votes added!`);
        } else {
            alert("Payment check failed. Please contact support.");
        }
    };

    return (
        <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-500/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-80"
        >
            {status === 'redirecting' && <Loader2 className="animate-spin" />}
            {status === 'verifying' && <Lock className="animate-bounce" />}
            {status === 'idle' && <CreditCard size={20} />}

            {status === 'redirecting' ? 'SECURING LINE...' :
                status === 'verifying' ? 'FINALIZING VOTES...' :
                    `PAY R${(amountInCents / 100).toFixed(2)}`}
        </button>
    );
};

export default YocoPayment;