import React, { useState } from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: "Rajkumar T.",
        role: "Founder & CTO",
        description: "Visionary architect leading the integration of AI agents into the modern career landscape.",
        image: "/images/team/founder.png",
        position: "center top",
        isLeader: true
    },
    {
        name: "Raj. S",
        role: "Backend Architect",
        description: "Designing the high-performance engines and data structures that power our AI agents.",
        image: "/images/team/raj-s.jpg",
        position: "center top"
    },
    {
        name: "Dharun",
        role: "AI/ML Engineer",
        description: "Crafting the intelligence behind the coach, focusing on LLM orchestration and career matching.",
        image: "/images/team/dharun.jpg",
        position: "center top"
    },
    {
        name: "Rahul. L",
        role: "Growth & Marketing",
        description: "Driving global expansion and building the community around the future of career automation.",
        image: "/images/team/rahul-l.jpg",
        position: "center left"
    },
    {
        name: "Krish. P",
        role: "DevOps Engineer",
        description: "Ensuring 99.9% reliability and scaling our AWS infrastructure for thousands of users.",
        image: "/images/team/krish-p.jpg",
        position: "center left"
    },
    {
        name: "Ventak. K",
        role: "UI/UX Designer",
        description: "Iterating on the premium, intuitive interface that makes career management effortless.",
        image: "/images/team/ventak-k.jpg",
        position: "65% 50%" // Adjusted for the new landscape/wide photo
    },
    {
        name: "Rohan. B",
        role: "Data Analyst",
        description: "Analyzing global job trends and success metrics to optimize agent performance.",
        image: "/images/team/rohan-b.png",
        position: "center top"
    },
    {
        name: "Navin",
        role: "SDE 1",
        description: "Building scalable features and ensuring the technical robustness of the AI agent infrastructure.",
        image: "/images/team/navin.png",
        position: "center top"
    },
    {
        name: "Koti",
        role: "Marketing",
        description: "Driving growth and engagement strategies to expand our reach in the AI career space.",
        image: "/images/team/koti.png",
        position: "center top"
    },
    {
        name: "Enterprise Partner",
        role: "Strategic Sponsorship",
        description: "Join our mission to democratize elite career cycle with AI. We're looking for partners who share our vision for the future of AI career cycle.",
        image: "",
        isSponsor: true
    }
];

export const TeamSection: React.FC = () => {
    const [partnerEmail, setPartnerEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handlePartnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partnerEmail || !partnerEmail.includes('@')) {
            alert('Please enter a valid email');
            return;
        }

        setStatus('loading');
        try {
            const response = await fetch('https://zp2p756qze.execute-api.us-east-1.amazonaws.com/prod/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: partnerEmail.toLowerCase().trim(),
                    action: 'partnership'
                }),
            });
            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setPartnerEmail('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Partner submission error:', error);
            setStatus('error');
        }
    };
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Meet the <span className="gradient-text">Architects</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        The dedicated team of experts building the platform that will redefine
                        how you approach your career journey.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`glassmorphism rounded-3xl p-8 border hover:border-cyan-electric/30 transition-all duration-500 group flex flex-col items-center ${member.isSponsor
                                ? 'border-dashed border-white/20 bg-white/5 opacity-80 hover:opacity-100'
                                : 'border-white/5'
                                } ${member.isLeader ? 'ring-2 ring-cyan-electric/20' : ''}`}
                        >
                            <div className="relative mb-6">
                                <div className={`w-32 h-32 rounded-3xl overflow-hidden mb-4 border-2 group-hover:border-cyan-electric/50 transition-colors shadow-lg shadow-cyan-electric/10 flex items-center justify-center ${member.isSponsor ? 'bg-dark-lighter/50 border-dashed border-white/10' : 'border-cyan-electric/20'
                                    }`}>
                                    {member.isSponsor ? (
                                        <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all opacity-30 group-hover:opacity-100">🤝</div>
                                    ) : (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                            style={{ objectPosition: member.position || 'center' }}
                                        />
                                    )}
                                </div>
                                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 backdrop-blur-md border px-3 py-1 rounded-full ${member.isSponsor
                                    ? 'bg-purple-vibrant/20 border-purple-vibrant/30'
                                    : 'bg-cyan-electric/20 border-cyan-electric/30'
                                    }`}>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${member.isSponsor ? 'text-purple-vibrant' : 'text-cyan-electric'
                                        }`}>
                                        {member.role}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center flex flex-col h-full w-full">
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${member.isSponsor ? 'text-white' : 'text-white group-hover:text-cyan-electric'
                                    }`}>
                                    {member.name}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    {member.description}
                                </p>

                                {member.isSponsor && (
                                    <div className="mt-auto">
                                        {status === 'success' ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-purple-vibrant font-bold text-sm bg-purple-vibrant/10 py-2 rounded-xl"
                                            >
                                                ✨ Inquiry Sent!
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handlePartnerSubmit} className="space-y-3">
                                                <input
                                                    type="email"
                                                    value={partnerEmail}
                                                    onChange={(e) => setPartnerEmail(e.target.value)}
                                                    placeholder="partner@company.com"
                                                    className="w-full bg-dark-lighter/30 border border-purple-vibrant/20 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-vibrant/50 rounded-xl transition-all text-xs"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={status === 'loading'}
                                                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white text-[10px] font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50"
                                                >
                                                    {status === 'loading' ? 'SUBMITTING...' : 'PARTNER WITH US →'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-500 italic">
                        Want to join our mission? <a href="#" className="text-cyan-electric hover:underline">Apply Here</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
