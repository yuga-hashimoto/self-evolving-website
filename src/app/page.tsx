import Link from "next/link";
import { IconDNA, IconPlayground, IconChangelog, IconAnalytics } from "@/components/icons/Icons";

export default function Home() {
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

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
