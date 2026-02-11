'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const HackerTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Self-Evolving OS v3.0.1',
    'Type "help" for available commands.',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Backtick/Tilde (`) or Ctrl+Shift+K
      if (e.key === '`' || (e.ctrlKey && e.shiftKey && e.key === 'K')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = '';

    switch (trimmed) {
      case 'help':
        response = 'Available commands: help, status, clear, vote [ai1|ai2], hack, whoami';
        break;
      case 'status':
        response = 'System: ONLINE. Evolution Protocol: ACTIVE. AI 1: OPTIMIZED. AI 2: LEARNING.';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'vote ai1':
        response = 'Vote registered for AI 1. (Simulation)';
        // In real app, trigger vote function
        break;
      case 'vote ai2':
        response = 'Vote registered for AI 2. (Simulation)';
        break;
      case 'hack':
        response = 'Access denied. Security Level 9 required. Nice try.';
        break;
      case 'whoami':
        response = 'User: Anonymous Entity. Role: Observer/Participant.';
        break;
      default:
        response = `Command not found: ${trimmed}`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 w-full h-1/2 bg-black/90 text-green-500 font-mono p-4 z-50 border-b-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.3)] overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center border-b border-green-500/30 pb-2 mb-2">
            <span className="text-xs uppercase tracking-widest">Terminal_Access_Port</span>
            <button onClick={() => setIsOpen(false)} className="text-red-500 hover:text-red-400">[CLOSE]</button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-green-700">
            {history.map((line, i) => (
              <div key={i} className="break-words">{line}</div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
            <span className="text-green-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-green-300 placeholder-green-800"
              placeholder="Enter command..."
              autoFocus
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
