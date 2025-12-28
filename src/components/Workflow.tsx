import React from 'react';
import { motion } from 'framer-motion';

const workflowItems = [
    {
        title: "1. Smart Profile Ingestion",
        description: "We don't just 'upload' your resume. Our AI Agent syncs your LinkedIn, Indeed, and Resume into a unified 'Agent Knowledge Base' using AWS Bedrock. It understands your hidden potential beyond keywords.",
        icon: "🧠",
        color: "from-cyan-400 to-blue-500"
    },
    {
        title: "2. Precision Agent Matching",
        description: "While you're asleep, your agent uses Claude 3.5 Haiku intelligence to scan global markets. It filters roles not just by title, but by culture fit, salary trajectory, and long-term career growth.",
        icon: "🎯",
        color: "from-purple-400 to-pink-500"
    },
    {
        title: "3. Auto-Apply & Outbound",
        description: "The agent doesn't just 'click' apply. It drafts personalized, high-conversion cover letters and emails, manages follow-ups via Gmail integration, and lands the interview in your Google Calendar.",
        icon: "⚡",
        color: "from-orange-400 to-red-500"
    }
];

export const Workflow: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-electric/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric text-xs font-bold tracking-widest uppercase mb-4"
                    >
                        The Process
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        How Your <span className="gradient-text">Agent Wins</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We've distilled our complex AWS architecture into a simple, high-performance workflow designed to get you hired.
                    </p>
                </div>

                <div className="space-y-12">
                    {workflowItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Visual Side */}
                            <div className="w-full md:w-1/2">
                                <div className={`relative aspect-video rounded-3xl overflow-hidden glassmorphism flex items-center justify-center group`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                                    <span className="text-8xl md:text-9xl group-hover:scale-110 transition-transform duration-500">{item.icon}</span>

                                    {/* Tech Tag */}
                                    <div className="absolute bottom-6 left-6 flex gap-2">
                                        <div className="px-3 py-1 glassmorphism rounded-full text-[10px] font-mono text-cyan-electric">AWS_BEDROCK_v1.0</div>
                                        <div className="px-3 py-1 glassmorphism rounded-full text-[10px] font-mono text-purple-vibrant">CLAUDE_3.5_HAIKU</div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Side */}
                            <div className="w-full md:w-1/2 text-left">
                                <div className="text-cyan-electric font-mono text-xl mb-4 italic">0{index + 1}.</div>
                                <h3 className="text-2xl md:text-4xl font-bold mb-6 text-white leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Closing Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-12 rounded-[40px] glassmorphism bg-gradient-to-br from-cyan-electric/5 to-purple-vibrant/5 text-center border-t border-white/10"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">The Mission is Clear</h3>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                        By integrating directly with Gmail, LinkedIn, Indeed, and Google Calendar, your agent creates a seamless loop:
                        <span className="text-white"> Constant Search → Smart Applying → Interview Scheduled.</span>
                        <br />Your only job is to show up and close the deal.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
