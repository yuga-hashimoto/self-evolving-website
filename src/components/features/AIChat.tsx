'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrain } from '@/components/icons/Icons';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AIChat() {
  const t = useTranslations('aiChat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: t('defaultResponse'),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      let responseText = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('evolve') || lowerText.includes('how')) {
         responseText = t('responses.how_evolve');
      } else if (lowerText.includes('create') || lowerText.includes('who')) {
         responseText = t('responses.who_created');
      } else if (lowerText.includes('version')) {
         responseText = t('responses.version');
      } else if (lowerText.includes('battle') || lowerText.includes('ai 1') || lowerText.includes('ai 2')) {
         responseText = t('responses.battle');
      } else {
         responseText = t('defaultResponse');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
      // eslint-disable-next-line react-hooks/purity
    }, 1000 + Math.random() * 1000);
  };

  const predefinedQuestions = [
    { key: 'how_evolve', label: t('questions.how_evolve') },
    { key: 'who_created', label: t('questions.who_created') },
    { key: 'version', label: t('questions.version') },
    { key: 'battle', label: t('questions.battle') },
  ];

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-slate-900/80 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
            <IconBrain size={24} className="text-purple-400" />
        </div>
        <div>
            <h2 className="font-bold text-white">{t('title')}</h2>
            <p className="text-xs text-slate-400">{t('subtitle')}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-700/80 text-slate-200 rounded-bl-none border border-slate-600'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/50 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm italic flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="ml-2">{t('thinking')}</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="p-2 bg-slate-800/30 border-t border-slate-700/50 overflow-x-auto">
        <div className="flex gap-2 pb-2 px-2">
            {predefinedQuestions.map((q) => (
                <button
                    key={q.key}
                    onClick={() => handleSendMessage(q.label)}
                    disabled={isThinking}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors disabled:opacity-50"
                >
                    {q.label}
                </button>
            ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl px-6 py-2 font-medium transition-colors"
          >
            {t('send')}
          </button>
        </form>
      </div>
    </div>
  );
}
