'use client';

export function SponsorPixelGrid() {
  const GRID_SIZE = 10;
  // Mock data for sponsored pixels
  const TAKEN_PIXELS = [0, 12, 25, 42, 55, 68, 77, 89, 99];

  const handlePixelClick = (index: number) => {
    if (TAKEN_PIXELS.includes(index)) {
      alert(`Pixel #${index} is already owned by a mysterious benefactor.`);
    } else {
      const confirmBuy = window.confirm(`Buy Pixel #${index} for 0.1 ETH? (This is a mock UI)`);
      if (confirmBuy) {
        alert("Transaction simulated! You are now a pixel owner (in spirit).");
      }
    }
  };

  return (
    <div className="glass-card p-6 border-indigo-500/30 text-center relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col justify-center">
      <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-300" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          👾 Sponsor This Pixel
        </h3>
        <p className="text-xs text-gray-400 mb-4">Own a piece of history. 10x10 Grid.</p>
        
        <div 
          className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto aspect-square bg-black/40 p-1 rounded-lg border border-white/10"
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePixelClick(i)}
              className={`
                w-full h-full rounded-[1px] transition-all duration-200 hover:scale-125 hover:z-10 hover:shadow-[0_0_5px_rgba(255,255,255,0.5)]
                ${TAKEN_PIXELS.includes(i) 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_2px_rgba(99,102,241,0.5)]' 
                  : 'bg-white/5 hover:bg-white/30'}
              `}
              title={TAKEN_PIXELS.includes(i) ? `Pixel #${i} (Taken)` : `Pixel #${i} (Available)`}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-3">* 1 Pixel = 1 Coffee for the AI</p>
      </div>
    </div>
  );
}
