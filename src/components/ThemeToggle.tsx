'use client';

import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState('light'); // Default to light

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark', 'cyberpunk', 'retro');
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    let nextTheme = 'light';
    if (theme === 'light') {
      nextTheme = 'cyberpunk';
    } else if (theme === 'cyberpunk') {
      nextTheme = 'dark';
    } else if (theme === 'dark') {
      nextTheme = 'retro';
    } else {
      nextTheme = 'light';
    }

    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    document.documentElement.classList.remove('light', 'dark', 'cyberpunk', 'retro');
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label="Toggle theme"
    >
      {theme === 'light' && (
        <span className="text-xl">☀️</span>
      )}
      {theme === 'dark' && (
        <span className="text-xl">🌙</span>
      )}
      {theme === 'cyberpunk' && (
        <span className="text-xl">👾</span>
      )}
      {theme === 'retro' && (
        <span className="text-xl">💾</span>
      )}
    </button>
  );
};

export default ThemeToggle;
