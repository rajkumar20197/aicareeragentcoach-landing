import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const CountdownTimer: React.FC = () => {
    // FIXED: Target is March 15, 2026 (Month 2 is March)
    const TARGET_MS = new Date(2026, 2, 15, 0, 0, 0).getTime();

    const calculateTimeLeft = (): TimeLeft => {
        const now = Date.now();
        const diff = TARGET_MS - now;

        if (diff > 0) {
            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            };
        }
        // If date somehow passes, show a realistic 75-day starting point
        return { days: 75, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-electric/30 bg-cyan-electric/5 text-cyan-electric text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    <span className="w-1.5 h-1.5 bg-cyan-electric rounded-full animate-ping"></span>
                    System Calibration In Progress
                </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-3 md:gap-8">
                {timeUnits.map((unit) => (
                    <div
                        key={unit.label}
                        className="glassmorphism rounded-2xl p-6 md:p-8 text-center relative group"
                    >
                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={unit.value}
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -15, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="text-4xl md:text-6xl font-black font-mono text-cyan-electric glow-text leading-none"
                                >
                                    {String(unit.value).padStart(2, '0')}
                                </motion.div>
                            </AnimatePresence>
                            <div className="text-[10px] md:text-xs text-gray-500 mt-3 uppercase tracking-widest font-bold">
                                {unit.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-12 max-w-2xl mx-auto">
                <div className="flex justify-between text-[10px] text-gray-400 mb-3 font-mono tracking-widest uppercase">
                    <span>Neural Training</span>
                    <span className="text-cyan-electric">85.4%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85.4%' }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-cyan-electric to-purple-vibrant"
                    ></motion.div>
                </div>
            </div>
        </div>
    );
};
