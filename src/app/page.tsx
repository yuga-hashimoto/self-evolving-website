import Link from "next/link";
import { IconDNA } from "@/components/icons/Icons";
import { MODELS } from "@/lib/models";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-block mb-6 animate-float">
          <IconDNA size={96} />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
          Self-Evolving Website
        </h1>
        <p className="text-xl sm:text-2xl text-purple-300 mb-4">
          AIが毎日自動で改善を続ける実験的プロジェクト
        </p>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          2つのAIモデルがそれぞれ独自の進化を遂げています。
          <br />
          <span className="text-purple-400 font-medium">
            どちらがより良いサイトを作るでしょうか？
          </span>
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        {/* Mimo Card */}
        <Link href="/models/mimo" className="group">
          <div className="glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 animate-pulse-glow border-purple-500/30 hover:border-purple-500/60">
            <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🟣</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {MODELS.mimo.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {MODELS.mimo.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.mimo.openrouterModel}
              </span>
            </div>
          </div>
        </Link>

        {/* Grok Card */}
        <Link href="/models/grok" className="group">
          <div className="glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-blue-500/30 hover:border-blue-500/60">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🔵</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {MODELS.grok.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {MODELS.grok.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.grok.openrouterModel}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Explanation */}
      <div className="text-center text-gray-500 text-sm max-w-2xl">
        <p>
          各モデルは毎日アナリティクスを分析し、独自の判断でサイトを改善します。
          <br />
          進化の過程は変更履歴とアナリティクスで確認できます。
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
