import React from 'react';
import { motion } from 'framer-motion';
import { CountdownTimer } from './components/CountdownTimer';
import { WaitlistForm } from './components/WaitlistForm';
import { FeatureTeasers } from './components/FeatureTeasers';
import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-gradient-mesh relative overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-electric rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header/Logo */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8 pb-4 text-center"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <img
                            src="/images/logo.png"
                            alt="AI Career Agent Coach"
                            className="h-16 md:h-24 mx-auto drop-shadow-2xl"
                        />
                    </motion.div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 glassmorphism rounded-full text-sm text-gray-400">
                        <span className="w-2 h-2 bg-cyan-electric rounded-full animate-pulse"></span>
                        Currently in Development
                    </div>
                </motion.header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16 md:mb-24"
                    >
                        {/* Main Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
                            <span className="block text-white mb-2">Stop Applying.</span>
                            <span className="block gradient-text glow-text">Start Conquering.</span>
                        </h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
                        >
                            Your Personal AI Career Architect is Being Trained.
                            <br className="hidden md:block" />
                            <span className="text-cyan-electric/80">The old way of job hunting dies here.</span>
                        </motion.p>

                        {/* Tech Stack Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center gap-3 mb-12"
                        >
                            <div className="px-4 py-2 bg-dark-lighter/50 border border-cyan-electric/30 rounded-full text-xs md:text-sm text-gray-300">
                                🤖 Powered by AWS + Claude AI
                            </div>
                            <div className="px-4 py-2 bg-dark-lighter/50 border border-purple-vibrant/30 rounded-full text-xs md:text-sm text-gray-300">
                                🎓 Built at Northeastern University
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Countdown Timer */}
                    <div className="mb-20 md:mb-32">
                        <CountdownTimer />
                    </div>

                    {/* Feature Teasers */}
                    <div className="mb-20 md:mb-32">
                        <FeatureTeasers />
                    </div>

                    {/* Waitlist Form */}
                    <div className="mb-20">
                        <WaitlistForm />
                    </div>
                </section>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center py-12 text-gray-500 text-sm"
                >
                    <p className="mb-4">
                        Built by students, for the ambitious.
                    </p>
                    <div className="flex justify-center gap-6 mb-8">
                        <a href="#" className="hover:text-cyan-electric transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-cyan-electric transition-colors">
                            Terms
                        </a>
                    </div>
                    <p className="text-xs text-gray-600">
                        © 2025 AI Career Agent Coach. All rights reserved.
                    </p>
                </motion.footer>
            </div>
        </div>
    );
}

export default App;
