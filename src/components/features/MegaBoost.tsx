'use client';

import { useState, useEffect } from 'react';

export function MegaBoost() {
  const [active, setActive] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const triggerOverdrive = () => {
    if (active || cooldown > 0) return;
    
    setActive(true);
    setCooldown(30);

    // Inject temporary global styles for chaos
    const style = document.createElement('style');
    style.id = 'overdrive-style';
    style.innerHTML = `
      @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
      }
      body { animation: shake 0.5s infinite; filter: contrast(1.2) saturate(1.5); }
      .gradient-text { filter: hue-rotate(90deg); transition: filter 5s; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      setActive(false);
      const el = document.getElementById('overdrive-style');
      if (el) el.remove();
    }, 5000);
  };

  return (
    <div className="glass-card p-4 text-center border-red-500/30 relative overflow-hidden group">
      <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
      <h3 className="text-xl font-bold text-red-400 mb-2 relative z-10">⚠️ SYSTEM OVERDRIVE</h3>
      <p className="text-xs text-gray-400 mb-4 relative z-10">Destabilize the visual core for 5 seconds.</p>
      
      <button
        onClick={triggerOverdrive}
        disabled={active || cooldown > 0}
        className={`
          relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-all duration-200
          ${active 
            ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110' 
            : cooldown > 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]'
          }
        `}
      >
        {active ? 'CRITICAL ERROR...' : cooldown > 0 ? `RECHARGING (${cooldown}s)` : 'INITIATE'}
      </button>
    </div>
  );
}
