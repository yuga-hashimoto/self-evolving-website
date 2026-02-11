import Link from 'next/link';
import { IconX } from '@/components/icons/Icons';

export default function ShareStatus() {
  const shareText = "I am watching the self-evolving website grow. #SelfEvolving";
  const shareUrl = "https://self-evolving.vercel.app";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-40 z-50 animate-fade-in-up">
      <Link
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-black text-white text-sm font-medium rounded-full border border-white/20 shadow-lg backdrop-blur-md transition-all hover:scale-105 group"
      >
        <div className="relative w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <span className="hidden sm:inline">Status: Evolving</span>
        <div className="w-px h-4 bg-white/20 mx-1 hidden sm:block"></div>
        <IconX size={14} className="group-hover:text-blue-400 transition-colors" />
        <span>Share</span>
      </Link>
    </div>
  );
}
