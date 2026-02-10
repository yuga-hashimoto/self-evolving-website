import Link from "next/link";
import { IconRocket } from "@/components/icons/Icons";

export default function SupportButton() {
  return (
    <div className="flex justify-center my-8 w-full">
      <Link
        href="https://ko-fi.com/yugahashimoto"
        target="_blank"
        rel="noopener noreferrer"
        className="
          group relative inline-flex items-center gap-3 px-8 py-4 rounded-full
          bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600
          text-white font-bold text-lg tracking-wide uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)]
          transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]
          active:scale-95 border border-white/20 overflow-hidden
        "
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <IconRocket className="w-6 h-6 animate-bounce" />
        <span className="relative z-10">Fuel the War Effort</span>
        <div className="absolute inset-0 rounded-full ring-2 ring-white/30 animate-ping opacity-20" />
      </Link>
    </div>
  );
}
