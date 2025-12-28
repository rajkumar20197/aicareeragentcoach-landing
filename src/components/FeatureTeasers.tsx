import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: 'AI Job Matching',
        description: "Finds roles you didn't know existed",
        icon: '🎯',
    },
    {
        title: 'Auto-Apply Magic',
        description: 'Applies while you sleep',
        icon: '⚡',
    },
    {
        title: 'Career Roadmap',
        description: 'Your path to $200k+',
        icon: '🚀',
    },
];

export const FeatureTeasers: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-12"
            >
                <h3 className="text-xl md:text-2xl font-semibold text-gray-300 mb-2">
                    What's Coming
                </h3>
                <p className="text-gray-500 text-sm md:text-base">
                    Your personal AI career architect
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.15 }}
                        className="group relative"
                    >
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-electric/20 to-purple-vibrant/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

                        {/* Card */}
                        <div className="relative glassmorphism rounded-3xl p-8 hover:scale-105 transition-transform duration-300 h-full">
                            {/* Icon */}
                            <div className="text-5xl md:text-6xl mb-6 animate-float">
                                {feature.icon}
                            </div>

                            {/* Blurred Preview Image Placeholder */}
                            <div className="mb-6 rounded-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-electric/10 to-purple-vibrant/10 backdrop-blur-3xl"></div>
                                <div className="h-32 md:h-40 bg-gradient-to-br from-cyan-electric/5 to-purple-vibrant/5 flex items-center justify-center">
                                    <div className="text-6xl opacity-20">{feature.icon}</div>
                                </div>
                                {/* "Coming Soon" overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="glassmorphism px-4 py-2 rounded-full text-xs font-mono text-cyan-electric">
                                        CLASSIFIED
                                    </div>
                                </div>
                            </div>

                            {/* Text */}
                            <h4 className="text-lg md:text-xl font-bold mb-2 text-white">
                                {feature.title}
                            </h4>
                            <p className="text-sm md:text-base text-gray-400">
                                {feature.description}
                            </p>

                            {/* Progress indicator */}
                            <div className="mt-6 flex items-center gap-2">
                                <div className="w-full h-1 bg-dark-lighter rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-electric to-purple-vibrant w-3/4"></div>
                                </div>
                                <span className="text-xs text-gray-500 font-mono">75%</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
