import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const WaitlistForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://zp2p756qze.execute-api.us-east-1.amazonaws.com/prod/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                console.log('Email submitted successfully:', email);
            } else {
                alert(data.error || 'Failed to join waitlist. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            alert('Network error. Please check your connection and try again.');
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glassmorphism rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
                    You're on the List!
                </h3>
                <p className="text-gray-400 mb-6">
                    Check your inbox for a confirmation email. We'll notify you the moment we launch.
                </p>
                <div className="inline-flex items-center gap-2 text-cyan-electric text-sm">
                    <span className="w-2 h-2 bg-cyan-electric rounded-full animate-pulse"></span>
                    Founding Member Status: Activated
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Headline */}
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-3">
                    Join the <span className="gradient-text">Launch List</span>
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                    Get notified + exclusive founding member benefits
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="glassmorphism rounded-2xl p-2 flex flex-col md:flex-row gap-2 group hover:shadow-lg hover:shadow-cyan-electric/20 transition-shadow duration-300">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 bg-transparent px-4 md:px-6 py-4 md:py-5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-electric/50 rounded-xl transition-all duration-300"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-cyan-electric to-purple-vibrant text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-electric/50 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {loading ? 'Joining...' : 'Get Early Access'}
                    </button>
                </div>
            </form>

            {/* Scarcity Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center gap-3 mt-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-vibrant/20 border border-purple-vibrant/30 rounded-full text-sm">
                    <span className="w-2 h-2 bg-purple-vibrant rounded-full animate-pulse"></span>
                    <span className="text-gray-300">Limited to first 500 members</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-electric/10 border border-cyan-electric/20 rounded-full text-xs">
                    <span className="text-cyan-electric">🎓</span>
                    <span className="text-gray-400">Priority access for <span className="text-cyan-electric">.edu</span> emails</span>
                </div>

                <div className="text-sm text-gray-500">
                    <span className="text-cyan-electric font-mono">267</span> waiting
                </div>
            </motion.div>

            {/* Trust Indicators */}
            <div className="text-center mt-8 text-xs text-gray-500">
                🔒 We respect your privacy. No spam, ever.
            </div>
        </motion.div>
    );
};
