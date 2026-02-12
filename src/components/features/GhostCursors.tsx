'use client';

import { useEffect, useState } from 'react';

// Simplified Ghost Cursor
const Ghost = ({ id }: { id: number }) => {
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line
        setUserId(Math.floor(Math.random() * 9999));
        const interval = setInterval(() => {
            setPos({
                x: Math.random() * 95,
                y: Math.random() * 95
            });
        }, 1500 + Math.random() * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`, 
                transition: 'all 1s ease-in-out',
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 40
            }}
            className="flex flex-col items-start opacity-70"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 fill-purple-500/30 transform rotate-12">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
            </svg>
            <span className="bg-purple-600 text-white text-[10px] px-1 rounded ml-4">
                User #{userId}
            </span>
        </div>
    );
};

export const GhostCursors = () => {
    const [ghosts, setGhosts] = useState<number[]>([]);

    useEffect(() => {
        // Simulate loading ghosts
        setTimeout(() => setGhosts([1, 2, 3]), 2000);
    }, []);

    return (
        <>
            {ghosts.map(id => <Ghost key={id} id={id} />)}
        </>
    );
};
