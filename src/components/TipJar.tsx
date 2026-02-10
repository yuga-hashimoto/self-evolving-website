import React from 'react';

const TipJar: React.FC = () => {
  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 p-4 bg-white/10 backdrop-blur-md border-t border-white/20 flex justify-between items-center shadow-lg transition-all duration-300 hover:bg-white/20 sm:z-50">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Fuel the evolution ☕️
        </span>
      </div>
      <a
        href="https://ko-fi.com/R5R51S97C4"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full hover:from-pink-600 hover:to-rose-600 transition-transform hover:scale-105 shadow-md flex items-center space-x-2 text-sm"
      >
        <span>Buy me a Coffee</span>
      </a>
    </div>
  );
};

export default TipJar;
