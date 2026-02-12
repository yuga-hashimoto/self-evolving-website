'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare } from 'lucide-react';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = 'guestbook_entries';
const MAX_ENTRIES = 10;

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse guestbook entries', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
    };

    const newEntries = [newEntry, ...entries].slice(0, MAX_ENTRIES);
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    setName('');
    setMessage('');
  };

  if (!mounted) return <div className="animate-pulse h-96 bg-white/5 rounded-xl"></div>;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Input Form */}
      <div className="glass-card p-6 border-purple-500/20">
        <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
          <MessageSquare className="text-purple-400" size={20} />
          Sign the Guestbook
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-gray-400 flex items-center gap-2">
              <User size={14} /> Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Your cyber alias..."
              maxLength={30}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm text-gray-400 flex items-center gap-2">
              <MessageSquare size={14} /> Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
              placeholder="Leave a message for the future..."
              maxLength={140}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Sign Guestbook</span>
            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        <h3 className="text-lg font-mono text-purple-400 mb-4">
          &gt; LATEST_SIGNATURES [{entries.length}]
        </h3>

        {entries.length === 0 ? (
          <div className="text-center p-8 text-gray-500 italic border border-dashed border-gray-700 rounded-xl">
            No signatures yet. Be the first!
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 border-l-4 border-l-purple-500 flex flex-col gap-2 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-purple-300 font-mono text-lg">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed break-words">
                  {entry.message}
                </p>
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare size={48} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
