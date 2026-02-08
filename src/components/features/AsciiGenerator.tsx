'use client';

import React, { useState } from 'react';

export function AsciiGenerator() {
  const [text, setText] = useState('JULES');
  
  return (
    <div className="glass-card p-4 my-4 border-green-500/30">
      <h3 className="text-lg font-bold text-green-400 mb-2">🤖 ASCII GENERATOR</h3>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white mb-2 font-mono"
        maxLength={10}
      />
      <pre className="text-xs sm:text-sm text-green-300 font-mono bg-black/80 p-2 rounded overflow-x-auto whitespace-pre">
{`
    _    _ 
   / \\  | |
  / _ \\ | | ${text.toUpperCase()}
 / ___ \\| |
/_/   \\_\\_|
`}
      </pre>
    </div>
  );
}
