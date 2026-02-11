'use client';

import { useEffect, useState } from 'react';

export default function GlitchTrigger() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      document.body.classList.add('glitch-mode');
      const timer = setTimeout(() => {
        setIsActive(false);
      }, 5000);

      // Cleanup function ensures class is removed on unmount or when isActive changes
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('glitch-mode');
      };
    }
  }, [isActive]);

  return (
    <div
      onClick={() => setIsActive(true)}
      className="absolute bottom-0 right-0 w-[10px] h-[10px] cursor-pointer z-50 opacity-0"
      aria-hidden="true"
      role="button"
      tabIndex={-1}
      title="???"
    />
  );
}
