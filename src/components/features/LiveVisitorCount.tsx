/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { IconAnalytics } from "@/components/icons/Icons";

export const LiveVisitorCount = () => {
    const [count, setCount] = useState(1234);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 5) - 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-black/50 border border-green-500/30 px-3 py-1 rounded-full text-green-400 font-mono text-xs animate-pulse">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>{count.toLocaleString()} online</span>
        </div>
    );
};
