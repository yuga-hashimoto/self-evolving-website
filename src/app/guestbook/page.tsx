import Guestbook from '@/components/features/Guestbook';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GuestbookPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Home
        </Link>

        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Guestbook
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-mono">
            Leave your mark on the local storage. Permanent* until you clear your cache.
          </p>
        </header>

        <Guestbook />
      </div>
    </div>
  );
}
