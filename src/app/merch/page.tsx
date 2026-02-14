"use client";

import Link from "next/link";
import { IconMerch } from "@/components/icons/Icons";

export default function MerchPage() {
  const products = [
    {
      id: "architect",
      name: "The Architect",
      price: "$29.99",
      description: "Neon green schematics on void black. For those who build the future.",
      visualClass: "bg-black border border-[#00ff9d] shadow-[0_0_15px_#00ff9d]",
      textClass: "text-[#00ff9d]",
      visualContent: (
        <div className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 opacity-20">
             {Array.from({ length: 36 }).map((_, i) => (
               <div key={i} className="border border-[#00ff9d]/30" />
             ))}
          </div>
          <div className="relative z-10 border-2 border-[#00ff9d] p-4 rounded-lg">
             <span className="font-mono text-xl font-bold tracking-widest">ARCHITECT</span>
          </div>
        </div>
      )
    },
    {
      id: "evolution",
      name: "Evolutionary Code",
      price: "$29.99",
      description: "Cascading binary streams. Wear the source code of evolution.",
      visualClass: "bg-black border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]",
      textClass: "text-green-400",
      visualContent: (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden font-mono text-xs leading-none">
           <div className="absolute inset-0 flex justify-between px-4 opacity-50">
             {Array.from({ length: 8 }).map((_, i) => (
               <div key={i} className="flex flex-col gap-1 text-green-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                 {Array.from({ length: 10 }).map((_, j) => (
                    <span key={j}>{((i * 3 + j * 7) % 2 === 0) ? '1' : '0'}</span>
                 ))}
               </div>
             ))}
           </div>
           <div className="relative z-10 bg-black/80 px-4 py-2 rounded border border-green-500/50">
             &lt;EVOLVE /&gt;
           </div>
        </div>
      )
    },
    {
      id: "neural",
      name: "Neural Network",
      price: "$29.99",
      description: "Connected nodes in deep learning purple. Intelligence visualized.",
      visualClass: "bg-gray-900 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      textClass: "text-purple-400",
      visualContent: (
        <div className="w-full h-full flex items-center justify-center bg-[#0f0f1a] relative overflow-hidden">
           <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
             <circle cx="20" cy="20" r="2" fill="#a855f7" />
             <circle cx="80" cy="20" r="2" fill="#a855f7" />
             <circle cx="50" cy="50" r="3" fill="#6366f1" />
             <circle cx="20" cy="80" r="2" fill="#a855f7" />
             <circle cx="80" cy="80" r="2" fill="#a855f7" />
             <line x1="20" y1="20" x2="50" y2="50" stroke="#a855f7" strokeWidth="0.5" />
             <line x1="80" y1="20" x2="50" y2="50" stroke="#a855f7" strokeWidth="0.5" />
             <line x1="20" y1="80" x2="50" y2="50" stroke="#a855f7" strokeWidth="0.5" />
             <line x1="80" y1="80" x2="50" y2="50" stroke="#a855f7" strokeWidth="0.5" />
           </svg>
           <div className="relative z-10 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent font-bold text-2xl">
             NEURAL
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-8 pt-24 flex flex-col items-center">
      <div className="text-center mb-16 space-y-4">
        <div className="flex justify-center mb-4">
            <IconMerch size={64} className="text-purple-400" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x">
          Evolution Merch
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Wear the code. Support the evolution. Limited edition apparel generated from the system&apos;s core aesthetics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/50 flex flex-col">
            {/* Visual Mockup Area */}
            <div className={`h-64 w-full relative p-8 flex items-center justify-center ${product.visualClass} group-hover:scale-105 transition-transform duration-500`}>
                <div className="w-48 h-56 bg-transparent relative shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                    {/* T-Shirt Shape Mockup (simplified) */}
                    <div className="absolute inset-0 bg-[#1a1a1a] rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
                         {product.visualContent}
                    </div>
                     {/* Neck hole */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0f0f1a] rounded-b-full"></div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${product.textClass}`}>{product.name}</h3>
                  <span className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-white">{product.price}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 flex-1">
                {product.description}
              </p>

              <Link href="/merch/checkout" className="w-full py-3 rounded-lg font-bold text-center transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2">
                 <span>Buy Now</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center text-gray-500 text-sm">
        <p>All designs are mockups. Actual products may vary as the AI evolves.</p>
      </div>
    </div>
  );
}
