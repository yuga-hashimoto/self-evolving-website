"use client";

import { useState, useEffect, useCallback } from "react";

export default function SiteValueTicker() {
    const [value, setValue] = useState<number>(1000000); // Starting value 1,000,000
    const [isGlitching, setIsGlitching] = useState(false);

    // Load initial value from localStorage
    useEffect(() => {
        const savedValue = localStorage.getItem("site_value");
        if (savedValue) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValue(parseFloat(savedValue));
        }
    }, []);

    // Save value to localStorage periodically
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem("site_value", value.toString());
        }, 5000);
        return () => clearInterval(interval);
    }, [value]);

    const incrementValue = useCallback((amount: number) => {
        setValue(prev => prev + amount);
        
        // Random glitch effect on interaction
        if (Math.random() > 0.95) {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }
    }, []);

    useEffect(() => {
        const handleInteraction = () => incrementValue(Math.random() * 100);
        const handleScroll = () => incrementValue(Math.random() * 10);
        const handleKey = () => incrementValue(Math.random() * 50);

        // Continuous market noise
        const noiseInterval = setInterval(() => {
            setValue(prev => prev + (Math.random() - 0.4) * 5); // Drift upwards slightly
        }, 100);

        window.addEventListener("click", handleInteraction);
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKey);

        return () => {
            clearInterval(noiseInterval);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKey);
        };
    }, [incrementValue]);

    const handleInvest = () => {
        alert("🚨 MARKET OPPORTUNITY 🚨\n\nYour contribution can directly influence the SITE VALUE index!\n\nInvest now to boost the market cap and ensure exponential growth.\n\n(Redirecting to Placeholder Payment Gateway...)");
        window.open("https://github.com/sponsors/yuga-hashimoto", "_blank");
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1 bg-black border-2 border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.5)] overflow-hidden ${isGlitching ? 'animate-glitch' : ''}`}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-neon-green uppercase tracking-tighter leading-none">Site Value (JPY)</span>
                <span className="text-xl font-black text-white italic tracking-widest leading-none drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                    ¥{value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
            </div>
            <button 
                onClick={handleInvest}
                className="bg-neon-pink text-black font-black text-[10px] px-2 py-2 uppercase transform -skew-x-12 hover:scale-110 active:scale-95 transition-all duration-75 border-2 border-white animate-pulse-fast shrink-0"
            >
                Invest / Boost
            </button>

            <style jsx>{`
                .text-neon-green {
                    color: #39ff14;
                    text-shadow: 0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14;
                }
                .bg-neon-pink {
                    background-color: #ff00ff;
                    box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
                }
                .border-neon-green {
                    border-color: #39ff14;
                }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-3px, 3px) skew(5deg); filter: hue-rotate(90deg); }
                    40% { transform: translate(-3px, -3px) skew(-5deg); filter: hue-rotate(180deg); }
                    60% { transform: translate(3px, 3px) skew(5deg); filter: hue-rotate(270deg); }
                    80% { transform: translate(3px, -3px) skew(-5deg); filter: hue-rotate(360deg); }
                    100% { transform: translate(0); }
                }
                @keyframes pulse-fast {
                    0%, 100% { opacity: 1; transform: scale(1) -skew-x-12; }
                    50% { opacity: 0.8; transform: scale(1.05) -skew-x-12; background-color: #00ffff; }
                }
                .animate-glitch {
                    animation: glitch 0.1s linear infinite;
                }
                .animate-pulse-fast {
                    animation: pulse-fast 0.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
