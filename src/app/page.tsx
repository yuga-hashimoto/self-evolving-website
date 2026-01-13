import Link from "next/link";
import { IconDNA, IconPlayground, IconChangelog, IconAnalytics, IconBrain, IconCodeSpark, IconCycleDaily } from "@/components/icons/Icons";

async function getLatestChangelog() {
  try {
    const changelog = await import("../../public/changelog.json");
    const entries = changelog.default as any[];
    return entries[entries.length - 1];
  } catch {
    return null;
  }
}

export default async function Home() {
  const latestEntry = await getLatestChangelog();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-block mb-6 animate-float">
          <IconDNA size={96} />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
          Self-Evolving Website Experiment
        </h1>
        <p className="text-xl sm:text-2xl text-purple-300 mb-4">
          AIが毎日自動で改善を続ける実験的プロジェクト
        </p>

        {/* Current Model Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8 animate-pulse-glow">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">Current Architect:</span>
          <span className="text-xs font-mono text-purple-300">
            {latestEntry?.model || process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "anthropic/claude-3.7-sonnet"}
          </span>
        </div>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          このサイトのコードは、AIが毎日分析・改善し、自動的にデプロイされます。
          <br />
          <span className="text-purple-400 font-medium">
            どんなサイトになるか、誰にも予測できません。
          </span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <Link href="/playground" className="group">
          <div className="glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 animate-pulse-glow">
            <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
              <IconPlayground size={64} />
            </div>
            <h2 className="text-xl font-bold mb-2">実験場を見る</h2>
            <p className="text-gray-400 text-sm">
              AIが自由に進化させるページ
            </p>
          </div>
        </Link>

        <Link href="/changelog" className="group">
          <div className="glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
              <IconChangelog size={64} />
            </div>
            <h2 className="text-xl font-bold mb-2">更新履歴</h2>
            <p className="text-gray-400 text-sm">
              AIが行った変更の記録
            </p>
          </div>
        </Link>

        <Link href="/analytics" className="group">
          <div className="glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
              <IconAnalytics size={64} />
            </div>
            <h2 className="text-xl font-bold mb-2">アナリティクス</h2>
            <p className="text-gray-400 text-sm">
              リアルタイム統計データ
            </p>
          </div>
        </Link>
      </div>

      {/* Mechanism Section */}
      <div className="mt-24 max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          AI自動進化の仕組み
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 -translate-y-1/2 -z-10"></div>

          {/* Step 1 */}
          <div className="glass-card p-6 text-center relative hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/30">
              <IconBrain size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-purple-300">Step 1: 分析</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AIがサイトのアクセス解析データと過去の変更履歴を読み込み、
              <br />
              ユーザーの行動パターンを学習します。
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-6 text-center relative hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
              <IconCodeSpark size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-300">Step 2: 生成</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              「収益とエンゲージメントの最大化」を目的に、AIが自らコードを書き換えます。
              <br />
              デザインから機能まで予測不能です。
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-6 text-center relative hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/30">
              <IconCycleDaily size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-pink-300">Step 3: 検証</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              変更結果は再びデータとして蓄積され、次回の進化の糧となります。
              <br />
              <span className="text-pink-400 font-bold">この改善は1日1回行われます。</span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div >
  );
}
