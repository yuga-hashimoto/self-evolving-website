import Link from "next/link";
import { notFound } from "next/navigation";
import { getModel, MODELS } from "@/lib/models";
import { IconPlayground, IconChangelog, IconAnalytics, IconMimo, IconGrok } from "@/components/icons/Icons";

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

    // モデルごとのアイコンを選択
    const ModelIcon = modelId === 'mimo' ? IconMimo : IconGrok;

    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-4 sm:py-16">
            <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-16">
                <div className="inline-block mb-2 sm:mb-6 animate-float">
                    <ModelIcon size={96} className="w-12 h-12 sm:w-24 sm:h-24" />
                </div>
                <h1 className={`text-2xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-8 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                    {model.name} Evolution
                </h1>

                {/* Model Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full border mb-4 sm:mb-8 ${colors.badge}`}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-gray-400">Model:</span>
                    <span className="text-[10px] sm:text-xs font-mono">
                        {model.openrouterModel}
                    </span>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full">
                <Link href={`/models/${modelId}/playground`} className="group col-span-2 sm:col-span-1">
                    <div className={`glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 ${colors.glow}`}>
                        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                            <IconPlayground className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">実験場</h2>
                        <p className="text-gray-400 text-sm">
                            AIが自由に進化させるページ
                        </p>
                    </div>
                </Link>

                <Link href={`/models/${modelId}/changelog`} className="group col-span-1">
                    <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105">
                        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                            <IconChangelog className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold mb-2">更新履歴</h2>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            AIが行った変更の記録
                        </p>
                    </div>
                </Link>

                <Link href={`/models/${modelId}/analytics`} className="group col-span-1">
                    <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105">
                        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                            <IconAnalytics className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold mb-2">アナリティクス</h2>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            リアルタイム統計データ
                        </p>
                    </div>
                </Link>
            </div>

            {/* Back Link */}
            <div className="mt-8 sm:mt-12">
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
