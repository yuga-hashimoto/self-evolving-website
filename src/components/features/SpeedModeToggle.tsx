'use client';

import React, { useEffect, useState } from 'react';

export default function SpeedModeToggle() {
  const [speedMode, setSpeedMode] = useState(false);

  useEffect(() => {
    if (speedMode) {
      document.body.classList.add('speed-mode');
      const style = document.createElement('style');
      style.id = 'speed-mode-style';
      style.innerHTML = `
        .speed-mode * {
            transition: none !important;
            animation: none !important;
            box-shadow: none !important;
            background-image: none !important;
            filter: none !important;
            backdrop-filter: none !important;
        }
        /* Nuke layout for "speed" */
        .speed-mode *:not(#speed-mode-btn):not(#speed-mode-btn *) {
            font-family: "Courier New", monospace !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #000 !important;
            border-radius: 0 !important;
            width: auto !important;
            height: auto !important;
            position: static !important;
            float: none !important;
            display: block !important;
            margin: 2px !important;
            padding: 2px !important;
            max-width: 100% !important;
        }
        .speed-mode {
            background: white !important;
            overflow: auto !important;
        }
        .speed-mode img, .speed-mode svg, .speed-mode canvas, .speed-mode video {
            display: none !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.body.classList.remove('speed-mode');
      const style = document.getElementById('speed-mode-style');
      if (style) style.remove();
    }
  }, [speedMode]);

  return (
    <button
      id="speed-mode-btn"
      onClick={() => setSpeedMode(!speedMode)}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 99999,
        padding: '10px 20px',
        background: speedMode ? 'black' : '#00ff00',
        color: speedMode ? 'white' : 'black',
        border: '3px solid black',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
      }}
    >
      {speedMode ? 'DISABLE SPEED MODE' : '⚡ SPEED MODE'}
    </button>
  );
}
