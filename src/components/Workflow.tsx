import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        title: "1. Sync Your Profile",
        description: "Connect your LinkedIn, Indeed, and Resume. Our AI analyzes your experience to build a high-performance career baseline.",
        icon: "🔄"
    },
    {
        title: "2. Agent Search",
        description: "Your personal AI agent scans job boards 24/7, matching roles using AWS Bedrock and Claude 3.5 Haiku intelligence.",
        icon: "🤖"
    },
    {
        title: "3. Auto-Apply Magic",
        description: "The agent drafts custom cover letters and applies while you sleep. You only wake up to the interview invites.",
        icon: "⚡"
    }
];

export const Workflow: React.FC = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        How the <span className="gradient-text">Agent Works</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We've automated the most titanium parts of the job search.
                        Your career architect works while you live your life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-electric/20 to-transparent -translate-y-12"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 glassmorphism p-8 rounded-3xl group hover:border-cyan-electric/50 transition-all duration-300"
                        >
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-dark-lighter rounded-full border border-cyan-electric/30 flex items-center justify-center text-cyan-electric font-bold text-sm">
                                0{index + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
