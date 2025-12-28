import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const CountdownTimer: React.FC = () => {
    // Set launch date to 30 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    function calculateTimeLeft(): TimeLeft {
        const difference = +launchDate - +new Date();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

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
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
            >
                <p className="text-cyan-electric text-sm font-mono tracking-wider mb-2">
                    AI CALIBRATION COMPLETE IN:
                </p>
            </motion.div>

            <div className="grid grid-cols-4 gap-4 md:gap-8">
                {timeUnits.map((unit, index) => (
                    <motion.div
                        key={unit.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="glassmorphism rounded-2xl p-6 md:p-8 text-center relative group hover:scale-105 transition-transform duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-electric/10 to-purple-vibrant/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative">
                            <div className="text-4xl md:text-6xl font-bold font-mono text-cyan-electric glow-text animate-pulse-glow">
                                {String(unit.value).padStart(2, '0')}
                            </div>
                            <div className="text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-wider">
                                {unit.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8"
            >
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Training Progress</span>
                    <span className="text-cyan-electric">85%</span>
                </div>
                <div className="w-full h-2 bg-dark-lighter rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2, delay: 1.2 }}
                        className="h-full bg-gradient-to-r from-cyan-electric to-purple-vibrant"
                    ></motion.div>
                </div>
                <p className="text-xs text-cyan-electric/70 mt-2 font-mono text-center">
                    Final Training Epochs Running...
                </p>
            </motion.div>
        </div>
    );
};
