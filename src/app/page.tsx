import Link from "next/link";
import { IconDNA, IconCycleDaily, IconBrain, IconCodeSpark, IconTarget, IconRocket, IconClipboard, IconBalance, IconAnalytics, IconMimo, IconGrok } from "@/components/icons/Icons";
import { MODELS } from "@/lib/models";
import { getModelAnalytics, formatDuration } from "@/lib/model-analytics";

export default function Home() {
  // モデルのアナリティクスデータを取得
  const mimoAnalytics = getModelAnalytics('mimo');
  const grokAnalytics = getModelAnalytics('grok');
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
        {/* Mobile: タイトルのみ */}
        <h1 className="text-5xl font-bold gradient-text leading-tight mb-4 sm:hidden">
          <div className="flex flex-col">
            <span>Self-Evolving</span>
            <span>Game</span>
          </div>
        </h1>

        {/* Desktop: ロゴとタイトル */}
        <div className="hidden sm:flex items-center justify-center gap-4 mb-6">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text leading-tight">
            Self-Evolving Game
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
          <span className="text-purple-400 font-medium">2026年1月15日</span>から改善を開始。<br className="sm:hidden" />
          どちらがより面白いゲームを作るでしょうか？
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl w-full mb-6 px-3 sm:px-2">
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

      {/* Engagement Comparison */}
      <div className="max-w-3xl w-full mb-6 px-4">
        <div className="glass-card p-4 sm:p-8 border-purple-500/20 hover:!bg-white/5 hover:!border-purple-500/20 hover:!transform-none hover:!translate-y-0">
          {(mimoAnalytics && grokAnalytics) ? (
            <>
              {/* Model Headers */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <IconMimo size={48} className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div>
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Mimo
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.mimo.openrouterModel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right">
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Grok
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.grok.openrouterModel}</p>
                  </div>
                  <IconGrok size={48} className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>

              {/* Comparison Bars */}
              <div className="space-y-4 sm:space-y-5">
                <ComparisonBar
                  label="平均滞在時間"
                  mimoValue={mimoAnalytics.avgSessionDuration}
                  grokValue={grokAnalytics.avgSessionDuration}
                  mimoDisplay={formatDuration(mimoAnalytics.avgSessionDuration)}
                  grokDisplay={formatDuration(grokAnalytics.avgSessionDuration)}
                  higherIsBetter
                />
                <ComparisonBar
                  label="ページビュー"
                  mimoValue={mimoAnalytics.pageviews}
                  grokValue={grokAnalytics.pageviews}
                  mimoDisplay={mimoAnalytics.pageviews.toString()}
                  grokDisplay={grokAnalytics.pageviews.toString()}
                  higherIsBetter
                />
              </div>

              {/* Update Note */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500">
                  1日2回更新（6時・18時）
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm sm:text-base mb-2">
                データを集計中です
              </p>
              <p className="text-gray-500 text-xs">
                1日2回（6時・18時）の自動実行後にデータが表示されます
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How it Works - Mobile Optimized Timeline */}
      <div className="max-w-3xl w-full mb-4 sm:mb-8 px-4">
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
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">AIがゲームを分析</h4>
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
                  テスト通過後、自動でゲームに反映。継続的に進化。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modification Rules */}
      <div className="max-w-3xl w-full mb-8 sm:mb-12 px-4">
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
                  ゲームの面白さと滞在時間の最大化
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

// 比較バーコンポーネント
function ComparisonBar({
  label,
  mimoValue,
  grokValue,
  mimoDisplay,
  grokDisplay,
  higherIsBetter = true
}: {
  label: string;
  mimoValue: number;
  grokValue: number;
  mimoDisplay: string;
  grokDisplay: string;
  higherIsBetter?: boolean;
}) {
  const total = mimoValue + grokValue;
  const mimoPercent = total > 0 ? (mimoValue / total) * 100 : 50;
  const grokPercent = total > 0 ? (grokValue / total) * 100 : 50;

  const mimoWins = higherIsBetter ? mimoValue > grokValue : mimoValue < grokValue;
  const grokWins = higherIsBetter ? grokValue > mimoValue : grokValue < mimoValue;

  return (
    <div className="space-y-1.5">
      {/* Label & Values */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {mimoWins && <span className="text-base sm:text-lg">🏆</span>}
          <span className={`text-sm sm:text-base font-bold ${mimoWins ? 'text-purple-300' : 'text-gray-400'}`}>
            {mimoDisplay}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm sm:text-base font-bold ${grokWins ? 'text-blue-300' : 'text-gray-400'}`}>
            {grokDisplay}
          </span>
          {grokWins && <span className="text-base sm:text-lg">🏆</span>}
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-2 sm:h-3 bg-gray-800/50 rounded-full overflow-hidden">
        {/* Mimo側（左） */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
          style={{ width: `${mimoPercent}%` }}
        />
        {/* Grok側（右） */}
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${grokPercent}%` }}
        />
      </div>
    </div>
  );
}
