'use client';

import { useState } from 'react';

export const StickyAd = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-black py-2 px-4 flex justify-between items-center z-50 border-t-4 border-black">
            <div className="flex items-center gap-4">
                <span className="font-bold text-xl uppercase blink animate-pulse">Your Ad Here!</span>
                <span className="text-sm font-mono hidden sm:block">Reaching 10,000+ AI enthusiasts daily.</span>
            </div>
            <div className="flex items-center gap-2">
                <a href="mailto:ads@self-evolving.dev" className="bg-black text-white px-4 py-1 font-bold hover:bg-white hover:text-black transition-colors uppercase text-sm">
                    Book Now
                </a>
                <button onClick={() => setVisible(false)} className="ml-2 text-2xl font-bold hover:scale-110">×</button>
            </div>
        </div>
    );
};
