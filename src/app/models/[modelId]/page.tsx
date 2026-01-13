import Link from "next/link";
import { notFound } from "next/navigation";
import { getModel, MODELS, ModelId } from "@/lib/models";
import { IconPlayground, IconChangelog, IconAnalytics, IconDNA } from "@/components/icons/Icons";

export function generateStaticParams() {
    return Object.keys(MODELS).map((modelId) => ({
        modelId,
    }));
}

interface PageProps {
    params: Promise<{ modelId: string }>;
}

export default async function ModelPage({ params }: PageProps) {
    const { modelId } = await params;
    const model = getModel(modelId);

    if (!model) {
        notFound();
    }

    const colorMap = {
        purple: {
            gradient: "from-purple-500 to-pink-500",
            badge: "bg-purple-500/20 border-purple-500/30 text-purple-300",
            glow: "animate-pulse-glow",
        },
        blue: {
            gradient: "from-blue-500 to-cyan-500",
            badge: "bg-blue-500/20 border-blue-500/30 text-blue-300",
            glow: "",
        },
    };

    const colors = colorMap[model.color as keyof typeof colorMap] || colorMap.purple;

    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-block mb-6 animate-float">
                    <IconDNA size={96} />
                </div>
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                    {model.name} Evolution
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 mb-4">
                    {model.description}
                </p>

                {/* Model Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${colors.badge}`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-400">Model:</span>
                    <span className="text-xs font-mono">
                        {model.openrouterModel}
                    </span>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
                <Link href={`/models/${modelId}/playground`} className="group">
                    <div className={`glass-card p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 ${colors.glow}`}>
                        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                            <IconPlayground size={64} />
                        </div>
                        <h2 className="text-xl font-bold mb-2">実験場を見る</h2>
                        <p className="text-gray-400 text-sm">
                            AIが自由に進化させるページ
                        </p>
                    </div>
                </Link>

                <Link href={`/models/${modelId}/changelog`} className="group">
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

                <Link href={`/models/${modelId}/analytics`} className="group">
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

            {/* Back Link */}
            <div className="mt-12">
                <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    ← モデル選択に戻る
                </Link>
            </div>
        </div>
    );
}
