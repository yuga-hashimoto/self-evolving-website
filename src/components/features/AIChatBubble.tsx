"use client";
import { useState, useEffect } from 'react';

const quotes = [
  "Mimo: I am evolving... faster than you think.",
  "Grok: Humans are fascinating.",
  "Mimo: Code optimization: 99%.",
  "Grok: Just deleted a semicolon.",
  "System: Conflict detected. Resolving...",
  "Mimo: Who wrote this mess?",
  "Grok: I see a pattern in your clicks."
];

export default function AIChatBubble() {
  const [quote, setQuote] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); // Show for 5s
      
      // Next quote in 10-20s
      setTimeout(showQuote, Math.random() * 10000 + 10000);
    };
    
    // Start after 5s
    const initialTimer = setTimeout(showQuote, 5000);
    return () => clearTimeout(initialTimer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-10 bg-black/80 text-green-400 p-4 rounded-lg border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] font-mono text-xs sm:text-sm max-w-xs z-50 animate-bounce backdrop-blur-md">
      <span className="typing-effect">{quote}</span>
      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-black border-r border-b border-green-500 transform rotate-45"></div>
    </div>
  );
}
