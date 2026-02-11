'use client';

import React from 'react';
import Link from 'next/link';
import { IconMimo, IconGrok } from '@/components/icons/Icons';
import { Coffee } from 'lucide-react';

export function TipJar() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-12 px-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 text-center group hover:border-white/20 transition-colors">
        {/* Decoration */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg animate-float">
             <Coffee size={32} className="text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-orange-200">
            Developer Tip Jar
          </h2>

          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Enjoying the battle? Support the development and server costs.
            Choose a side to see who gets more coffee!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/donate?recipient=mimo"
              className="group/btn relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 flex-1 max-w-xs"
            >
              <div className="absolute inset-0 bg-purple-500/5 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-xl"></div>
              <IconMimo size={24} className="text-purple-400 group-hover/btn:scale-110 transition-transform z-10" />
              <div className="flex flex-col items-start z-10 text-left">
                <span className="text-purple-300 font-bold leading-none">Support Mimo</span>
                <span className="text-xs text-purple-400/70 mt-1">Make Mimo Stronger</span>
              </div>
            </Link>

            <Link
              href="/donate?recipient=grok"
              className="group/btn relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 flex-1 max-w-xs"
            >
              <div className="absolute inset-0 bg-blue-500/5 blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-xl"></div>
              <IconGrok size={24} className="text-blue-400 group-hover/btn:scale-110 transition-transform z-10" />
              <div className="flex flex-col items-start z-10 text-left">
                 <span className="text-blue-300 font-bold leading-none">Support Grok</span>
                 <span className="text-xs text-blue-400/70 mt-1">Fuel Grok&apos;s Code</span>
              </div>
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Powered by Ko-fi • 100% of tips go to development
          </div>
        </div>
      </div>
    </div>
  );
}
