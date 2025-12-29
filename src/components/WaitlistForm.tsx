import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const WaitlistForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [realCount, setRealCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch('https://zp2p756qze.execute-api.us-east-1.amazonaws.com/prod/waitlist', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });
                const data = await response.json();
                if (data.success && typeof data.count === 'number') {
                    setRealCount(data.count);
                }
            } catch (error) {
                console.error('Error fetching waitlist count:', error);
            }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://zp2p756qze.execute-api.us-east-1.amazonaws.com/prod/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                if (realCount !== null) setRealCount(prev => (prev || 0) + 1);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glassmorphism rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-cyan-electric/30 shadow-2xl shadow-cyan-electric/20"
            >
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                    You're on the list!
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    We've saved your spot. You'll be among the first to know when we launch and receive exclusive early access invites.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-electric/10 rounded-full text-cyan-electric font-medium">
                        <span className="w-2 h-2 bg-cyan-electric rounded-full animate-pulse"></span>
                        Status: Confirmed
                    </div>
                    <button
                        onClick={() => { setSubmitted(false); setEmail(''); }}
                        className="text-gray-500 hover:text-white transition-colors text-sm underline underline-offset-4"
                    >
                        Return to launch page
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism rounded-3xl p-8 md:p-12 border border-white/5 hover:border-cyan-electric/30 transition-all duration-500 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join the Waitlist</h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Be the first to experience the future of career management.
                        Limited early access spots available.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-dark-lighter/50 border border-white/10 px-8 py-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-electric/50 rounded-2xl transition-all text-lg"
                            required
                        />
                        <div className="absolute inset-0 rounded-2xl bg-cyan-electric/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                    </div>
                    {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-cyan-electric to-purple-vibrant text-white font-bold text-xl rounded-2xl shadow-xl shadow-cyan-electric/20 hover:shadow-cyan-electric/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Reserve Your Early Access'}
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-4">
                        By joining, you agree to our terms and will receive occasional updates.
                    </p>
                </form>

                {/* Scarcity / Trust */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 pt-10 border-t border-white/5">
                    <div className="px-6 py-2 bg-white/5 rounded-full text-sm border border-white/5">
                        <span className="text-cyan-electric font-mono text-lg font-bold">{realCount !== null ? (realCount + 300) : '...'}</span> ambitious pros waiting
                    </div>
                    <div className="flex gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-dark-lighter overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i + 15}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <span className="text-gray-400 text-sm self-center">+ 50 joined today</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
