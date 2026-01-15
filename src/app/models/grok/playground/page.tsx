import React from 'react';
import Game from './components/Game';

export default function GrokPlayground() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Ad space at top */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
        Ad Space
      </div>

      {/* Game container */}
      <div className="flex justify-center p-4">
        <div className="max-w-md w-full">
          <Game />
        </div>
      </div>

      {/* Ad space at bottom */}
      <div className="w-full h-16 bg-gray-200 flex items-center justify-center text-sm text-gray-500 mt-4">
        Ad Space
      </div>
    </div>
  );
}
