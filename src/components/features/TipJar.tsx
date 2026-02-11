'use client';

import React from 'react';
import Link from 'next/link';
import { IconAi1, IconAi2 } from '@/components/icons/Icons';

export function TipJar() {
  return (
    <div className="w-full flex justify-center gap-4 mt-6">
      <Link
        href="/donate?recipient=ai1"
        className="group relative flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-purple-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
        <IconAi1 size={20} className="text-purple-400 group-hover:scale-110 transition-transform z-10" />
        <span className="text-purple-300 font-bold z-10">Support AI 1</span>
      </Link>
      
      <Link
        href="/donate?recipient=ai2"
        className="group relative flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
        <IconAi2 size={20} className="text-blue-400 group-hover:scale-110 transition-transform z-10" />
        <span className="text-blue-300 font-bold z-10">Support AI 2</span>
      </Link>
    </div>
  );
}
