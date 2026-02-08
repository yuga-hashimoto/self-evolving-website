'use client';

export default function SponsorGrid() {
  const handleClick = (index: number) => {
    window.alert(`Sponsorship for pixel #${index + 1} coming soon!`);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-8">
      <h3 className="text-center text-xs font-bold uppercase text-gray-400 mb-2">Sponsor This Pixel</h3>
      <div 
        className="grid grid-cols-10 gap-0.5 bg-gray-900 border border-gray-800 p-0.5 shadow-inner"
        style={{ aspectRatio: '1/1' }}
      >
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className="w-full h-full bg-gray-800/50 hover:bg-purple-500 hover:shadow-[0_0_10px_2px_rgba(168,85,247,0.5)] transition-all duration-200 cursor-pointer"
            title={`Sponsor Pixel #${i + 1}`}
          />
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-500 mt-2">Become part of the evolution.</p>
    </div>
  );
}
