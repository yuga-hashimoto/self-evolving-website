import Link from "next/link";
import { IconDNA, IconCycleDaily, IconBrain, IconCodeSpark, IconTarget, IconRocket, IconClipboard, IconBalance, IconAnalytics, IconMimo, IconGrok } from "@/components/icons/Icons";
import { MODELS } from "@/lib/models";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-16">
        {/* Mobile: タイトルのみ */}
        <h1 className="text-5xl font-bold gradient-text leading-tight mb-4 sm:hidden">
          <div className="flex flex-col">
            <span>Self-Evolving</span>
            <span>Website</span>
          </div>
        </h1>

        {/* Desktop: ロゴとタイトル */}
        <div className="hidden sm:flex items-center justify-center gap-4 mb-6">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text leading-tight">
            Self-Evolving Website
          </h1>
          <div className="inline-block animate-float">
            <IconDNA size={96} />
          </div>
        </div>
        <p className="text-base sm:text-xl text-purple-300 mb-3 sm:mb-4 leading-relaxed">
          2つのAIがまっさらな画面から修正をスタート。<br className="sm:hidden" />
          同じ指示で、エンゲージメント向上を競っています。
        </p>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          <span className="text-purple-400 font-medium">2026年1月14日</span>から改善を開始。<br className="sm:hidden" />
          どちらがより良いサイトを作るでしょうか？
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-8 max-w-4xl w-full mb-12 sm:mb-16 px-3 sm:px-2">
        {/* Mimo Card */}
        <Link href="/models/mimo" className="group block active:scale-95 transition-transform" aria-label="Mimoモデルの進化を見る">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-purple-500/30 hover:border-purple-500/60 active:bg-white/15">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconMimo size={80} className="w-14 h-14 sm:w-20 sm:h-20" />
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
        <Link href="/models/grok" className="group block active:scale-95 transition-transform" aria-label="Grokモデルの進化を見る">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-blue-500/30 hover:border-blue-500/60 active:bg-white/15">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconGrok size={80} className="w-14 h-14 sm:w-20 sm:h-20" />
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
      <div className="max-w-4xl w-full mb-4 sm:mb-8 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          How it Works
        </h3>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line for Mobile */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hidden sm:block md:hidden" />

          {/* Steps */}
          <div className="flex flex-col gap-5 sm:gap-6 md:grid md:grid-cols-3">
            {/* Step 1 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">1日2回自動起動</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  GitHub Actionsが6時・18時に実行。人間の介入は一切なし。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">AIがサイトを分析</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  <a href="https://openrouter.ai/docs/guides/guides/claude-code-integration" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Claude Code (OpenRouter)</a> がアクセス解析とコードを読み込み、改善ポイントを特定。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">コードを書いてデプロイ</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  テスト通過後、自動でサイトに反映。継続的に進化。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Note */}
        <div className="mt-6 sm:mt-8 text-center px-2">
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            💡 各モデルは独自の判断で改善を続けます。<br className="sm:hidden" />
            変更履歴とアナリティクスで進化を追跡できます。
          </p>
        </div>
      </div>

      {/* AI Modification Rules */}
      <div className="max-w-4xl w-full mb-8 sm:mb-12 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          AIが修正する際のルール
        </h3>

        {/* Rules Content */}
        <div className="glass-card p-5 sm:p-8 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
          <div className="space-y-4 sm:space-y-5">
            {/* Goal */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <IconTarget size={24} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">目標</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  エンゲージメントと収益化の最大化
                </p>
              </div>
            </div>

            {/* Fairness */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <IconBalance size={24} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">公平性</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  両AIへの指示は完全に同一。同じ条件で競争
                </p>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <IconAnalytics size={24} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">提供データ</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  変更履歴とアナリティクスデータを1日2回提供
                </p>
              </div>
            </div>

            {/* Freedom */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <IconRocket size={24} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">修正範囲</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  フロントエンド・バックエンド両方の修正が可能。既存コンテンツの修正、追加、削除すべて自由。
                </p>
              </div>
            </div>

            {/* Constraint */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <IconClipboard size={24} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">制約</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  1回の実行で3-5ファイルの改善を行いリスクを最小化
                </p>
              </div>
            </div>
          </div>
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
