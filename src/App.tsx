import { motion } from 'framer-motion';
import { WaitlistForm } from './components/WaitlistForm';
import { FeatureTeasers } from './components/FeatureTeasers';
import { Workflow } from './components/Workflow';
import { TeamSection } from './components/TeamSection';
import { CountdownTimer } from './components/CountdownTimer';
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
                    className="pt-12 pb-4 text-center"
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

                    <div className="inline-flex items-center gap-2 px-4 py-2 glassmorphism rounded-full text-sm text-cyan-electric/80 border border-cyan-electric/20">
                        <span className="w-2 h-2 bg-cyan-electric rounded-full animate-pulse shadow-[0_0_8px_rgba(0,243,255,0.8)]"></span>
                        Platform Live & Active
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
                            Your Personal AI Career Architect is Here.
                            <br className="hidden md:block" />
                            <span className="text-cyan-electric/80 font-medium">The revolution of career growth starts now.</span>
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
                        </motion.div>

                        {/* Launch Countdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12"
                        >
                            <CountdownTimer />
                        </motion.div>
                    </motion.div>

                    {/* Feature Teasers */}
                    <div className="mb-20 md:mb-32">
                        <FeatureTeasers />
                    </div>

                    {/* Workflow Section */}
                    <div className="mb-20 md:mb-32">
                        <Workflow />
                    </div>

                    {/* Waitlist Form */}
                    <div className="mb-20 md:mb-32">
                        <WaitlistForm />
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <TeamSection />
                    </div>
                </section>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center py-24 border-t border-white/5 bg-dark/30 backdrop-blur-sm"
                >
                    <div className="container mx-auto px-4">
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Built by students, for the ambitious. Empowering the next generation of global talent.
                        </p>
                        <div className="flex justify-center gap-8 mb-12">
                            <a href="#" className="text-gray-500 hover:text-cyan-electric transition-colors text-sm font-medium">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-cyan-electric transition-colors text-sm font-medium">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-500 hover:text-cyan-electric transition-colors text-sm font-medium">
                                Contact Us
                            </a>
                        </div>
                        <p className="text-xs text-gray-600 tracking-widest uppercase">
                            © 2025 AI Career Agent Coach. All rights reserved.
                        </p>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
}

export default App;
