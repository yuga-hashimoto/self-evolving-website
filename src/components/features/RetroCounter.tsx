"use client";

import { useState, useEffect, useRef } from "react";

const BASE_GLOBAL_COUNT = 1337042; // Fixed base
const LOCAL_STORAGE_KEY = "visitor_local_hits";

export default function RetroCounter() {
  const [count, setCount] = useState<number>(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState<'init' | 'typing' | 'running'>('init');

  // Use refs to track intervals and timeouts for cleanup
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let hits = 0;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      hits = stored ? parseInt(stored, 10) : 0;
    } catch (e) {
      console.error("Failed to read local storage", e);
    }

    // Increment on mount (local hit)
    hits += 1;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, String(hits));
    } catch (e) {
       console.error("Failed to write local storage", e);
    }

    const startCount = BASE_GLOBAL_COUNT + hits;
    setCount(startCount);

    // Typing sequence
    let currentText = "";
    const targetText1 = "> INITIALIZING...";
    const targetText2 = `> VISITORS: ${startCount.toLocaleString()}`;

    let charIndex = 0;
    let step = 0; // 0: init typing, 1: pause, 2: visitor typing

    const typeStep = () => {
      if (step === 0) {
        if (charIndex < targetText1.length) {
          currentText += targetText1[charIndex];
          setDisplayText(currentText);
          charIndex++;
          typingTimeoutRef.current = setTimeout(typeStep, 50);
        } else {
          step = 1;
          typingTimeoutRef.current = setTimeout(typeStep, 800); // Pause
        }
      } else if (step === 1) {
        currentText = "";
        setDisplayText("");
        charIndex = 0;
        step = 2;
        typingTimeoutRef.current = setTimeout(typeStep, 100);
      } else if (step === 2) {
        if (charIndex < targetText2.length) {
          currentText += targetText2[charIndex];
          setDisplayText(currentText);
          charIndex++;
          typingTimeoutRef.current = setTimeout(typeStep, 50);
        } else {
          setPhase('running');
        }
      }
    };

    typeStep();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Real-time increment
  useEffect(() => {
      if (phase !== 'running') return;

      incrementIntervalRef.current = setInterval(() => {
          setCount(prev => {
              const change = Math.floor(Math.random() * 5) + 1; // +1 to +5 visitors
              return prev + change;
          });
      }, 4000); // Every 4 seconds

      return () => {
        if (incrementIntervalRef.current) clearInterval(incrementIntervalRef.current);
      };
  }, [phase]);

  // Update display text when count changes during running phase
  useEffect(() => {
    if (phase === 'running') {
      setDisplayText(`> VISITORS: ${count.toLocaleString()}`);
    }
  }, [count, phase]);

  return (
    <div className="flex flex-col items-center gap-1 mt-2 min-h-[40px] w-full max-w-[300px]">
      <div className="font-mono text-xs sm:text-sm text-[#00ff41] bg-black/90 px-4 py-2 rounded border border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.15)] w-full text-left overflow-hidden whitespace-nowrap">
        {displayText}
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} ml-1 inline-block w-[8px] h-[14px] bg-[#00ff41] align-middle`}></span>
      </div>
    </div>
  );
}
