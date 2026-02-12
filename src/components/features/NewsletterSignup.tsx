"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterSignup() {
  const t = useTranslations('footer.newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage(t('error'));
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setMessage(t('success'));
      setEmail('');

      // Reset success message after a while so user can subscribe another email if they want,
      // or just leave it. Leaving it is fine.
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card relative overflow-hidden group mb-8">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="space-y-1">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {t('title')}
            </h3>
            <p className="text-sm text-gray-400">
            {t('description')}
            </p>
        </div>

        {status === 'success' ? (
             <div className="w-full py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg animate-pulse">
                {message}
             </div>
        ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2 relative items-start">
                <div className="w-full relative flex flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                        }}
                        placeholder={t('placeholder')}
                        className={`w-full bg-black/40 border ${status === 'error' ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                        disabled={status === 'loading'}
                    />
                     {status === 'error' && (
                        <p className="text-xs text-red-400 text-left mt-1 ml-1">{message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[42px]"
                >
                {status === 'loading' ? '...' : t('button')}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
