import Link from "next/link";
import { IconDNA, IconCycleDaily, IconBrain, IconCodeSpark } from "@/components/icons/Icons";
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
      <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-4xl w-full mb-16 px-2">
        {/* Mimo Card */}
        <Link href="/models/mimo" className="group">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-purple-500/30 hover:border-purple-500/60">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl sm:text-4xl">🟣</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {MODELS.mimo.name}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.mimo.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.mimo.openrouterModel}
              </span>
            </div>
          </div>
        </Link>

        {/* Grok Card */}
        <Link href="/models/grok" className="group">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-blue-500/30 hover:border-blue-500/60">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl sm:text-4xl">🔵</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {MODELS.grok.name}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.grok.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.grok.openrouterModel}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* How it Works - Mobile Optimized Timeline */}
      <div className="max-w-4xl w-full mb-16 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          🔄 How it Works
        </h3>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line for Mobile */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-green-500 to-blue-500 hidden sm:block md:hidden" />

          {/* Steps */}
          <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-3">
            {/* Step 1 */}
            <div className="glass-card p-4 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-yellow-500/20">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border-2 border-yellow-500/30 relative z-10">
                <span className="text-lg sm:hidden font-bold">1</span>
                <IconCycleDaily size={28} className="hidden sm:block" />
              </div>
              <div className="flex-1 sm:mt-4">
                <div className="flex items-center gap-2 sm:justify-center mb-1 sm:mb-2">
                  <IconCycleDaily size={16} className="sm:hidden text-yellow-500" />
                  <h4 className="text-base sm:text-lg font-semibold text-yellow-400">毎日18時に自動起動</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  GitHub Actionsが毎日定刻に実行。人間の介入は一切なし。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-4 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-green-500/20">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border-2 border-green-500/30 relative z-10">
                <span className="text-lg sm:hidden font-bold">2</span>
                <IconBrain size={28} className="hidden sm:block" />
              </div>
              <div className="flex-1 sm:mt-4">
                <div className="flex items-center gap-2 sm:justify-center mb-1 sm:mb-2">
                  <IconBrain size={16} className="sm:hidden text-green-500" />
                  <h4 className="text-base sm:text-lg font-semibold text-green-400">AIがサイトを分析</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  アクセス解析とコードを読み込み、改善ポイントを特定。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-4 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-blue-500/20">
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border-2 border-blue-500/30 relative z-10">
                <span className="text-lg sm:hidden font-bold">3</span>
                <IconCodeSpark size={28} className="hidden sm:block" />
              </div>
              <div className="flex-1 sm:mt-4">
                <div className="flex items-center gap-2 sm:justify-center mb-1 sm:mb-2">
                  <IconCodeSpark size={16} className="sm:hidden text-blue-500" />
                  <h4 className="text-base sm:text-lg font-semibold text-blue-400">コードを書いてデプロイ</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  テスト通過後、自動でサイトに反映。継続的に進化。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Note */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            💡 各モデルは独自の判断で改善を続けます。変更履歴とアナリティクスで進化を追跡できます。
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
