import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, CreditCard, Lock } from 'lucide-react';

const YocoPayment = ({ amountInCents, contestantId, voteCount, onSuccess, voterId, voterEmail }) => {
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
                    metadata: {
                        voteCount,
                        contestantId,
                        voterId: voterId || 'guest',
                        voterEmail: voterEmail || 'guest@example.com'
                    },
                    successUrl: window.location.href,
                    cancelUrl: window.location.href,
                }
            });

            if (error) throw new Error(error.message);
            if (!data?.success || !data?.redirectUrl) {
                throw new Error(data?.error || JSON.stringify(data) || 'No redirect URL returned');
            }

            // 2. Save pending vote details to recover after redirect
            localStorage.setItem('pendingVote', JSON.stringify({
                voteCount,
                contestantId,
                voterEmail: voterEmail || 'guest@example.com'
            }));

            // 3. Redirect to Yoco's secure hosted payment page
            window.location.href = data.redirectUrl;

        } catch (err) {
            alert("System Error: " + err.message);
            setLoading(false);
            setStatus('idle');
        }
    };

    const verifyTransaction = async (checkoutId) => {
        let saved = JSON.parse(localStorage.getItem('pendingVote') || '{}');

        // If localStorage was cleared/lost during redirect, try to recover from URL or metadata if possible
        // but for now we rely on localStorage as the primary recovery mechanism.
        if (!saved.contestantId) {
            console.error("No pending vote found in localStorage");
            // If we have checkoutId but no context, we might be stuck.
            // In a more robust system, we would query the backend for the metadata associated with this checkoutId.
            // For now, prompt the user.
            alert("Verification context lost. Please refresh or contact support if votes aren't added.");
            return;
        }

        setStatus('verifying');
        setLoading(true);

        // Clean the checkoutId from the URL to keep it pretty
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
            const { data, error } = await supabase.functions.invoke('verify-yoco', {
                body: {
                    mode: 'verify',
                    checkoutId,
                    contestantId: saved.contestantId,
                    voteCount: saved.voteCount,
                    voterEmail: voterEmail || saved.voterEmail || 'guest@example.com'
                }
            });

            if (error) throw error;

            localStorage.removeItem('pendingVote');

            if (data?.success) {
                onSuccess();
                alert(`SUCCESS! ${saved.voteCount} votes added!`);
            } else {
                throw new Error(data?.error || "Payment verification failed");
            }
        } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment check failed: " + err.message + ". Please contact support with your checkout ID.");
        } finally {
            setLoading(false);
            setStatus('idle');
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