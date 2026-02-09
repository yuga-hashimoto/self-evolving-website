import React from 'react';

interface AdBannerProps {
  slotId: string;
  format?: 'rectangle' | 'banner';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotId, format = 'banner' }) => {
  return (
    <div className={`my-8 mx-auto bg-gray-800/50 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden group ${format === 'banner' ? 'w-full max-w-4xl h-24' : 'w-full max-w-[300px] h-[250px]'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="text-center z-10">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Advertisement</p>
        <p className="text-sm text-gray-400 font-mono">Slot: {slotId}</p>
      </div>
    </div>
  );
};
