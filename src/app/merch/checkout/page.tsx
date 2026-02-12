"use client";

import Link from "next/link";
import { IconMerch } from "@/components/icons/Icons";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-8 pt-24 flex flex-col items-center justify-center">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-6 animate-fade-in-up">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
            <IconMerch size={40} className="text-purple-400" />
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Checkout Offline
        </h1>

        <p className="text-gray-400">
          The commerce module is currently under active evolution. Our payment processors are being recalibrated by the AI.
        </p>

        <div className="w-full h-px bg-white/10 my-4"></div>

        <Link href="/merch" className="w-full py-3 rounded-lg font-bold text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 text-white flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Return to Store</span>
        </Link>
      </div>
    </div>
  );
}
