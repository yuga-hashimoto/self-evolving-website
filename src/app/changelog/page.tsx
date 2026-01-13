import { IconChangelog, IconEmpty } from "@/components/icons/Icons";

interface ChangelogEntry {
    id: number;
    date: string;
    model?: string;
    reasoning: string;
    files: string[];
    results: {
        revenue: number;
        revenueChange: number;
        pageviews: number;
        pvChange: number;
        avgSessionDuration: number;
        bounceRate: number;
    };
}

async function getChangelog(): Promise<ChangelogEntry[]> {
    try {
        const changelog = await import("../../../public/changelog.json");
        return changelog.default as ChangelogEntry[];
    } catch {
        return [];
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function ChangeIndicator({ value }: { value: number }) {
    if (value === 0) return <span className="text-gray-400">±0%</span>;
    if (value > 0) return <span className="text-green-400">+{value}%</span>;
    return <span className="text-red-400">{value}%</span>;
}

export default async function ChangelogPage() {
    const changelog = await getChangelog();
    const sortedChangelog = [...changelog].reverse().slice(0, 50);

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconChangelog size={48} />
                        <h1 className="text-4xl font-bold gradient-text">更新履歴</h1>
                    </div>
                    <p className="text-gray-400">
                        AIが行ったすべての変更を記録しています
                    </p>
                </div>

                {/* Timeline */}
                {sortedChangelog.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <IconEmpty size={80} />
                        </div>
                        <p className="text-gray-400 text-lg">まだ変更履歴がありません</p>
                        <p className="text-gray-500 text-sm mt-2">
                            AIの最初の進化を待っています...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedChangelog.map((entry, index) => (
                            <div key={entry.id} className="relative">
                                {/* Timeline line */}
                                {index < sortedChangelog.length - 1 && (
                                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-purple-500/30" />
                                )}

                                <div className="glass-card p-6 ml-12 relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-12 top-6 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-900" />

                                    {/* Date */}
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <div className="text-sm text-purple-300">
                                            #{entry.id} · {formatDate(entry.date)}
                                        </div>
                                        {entry.model && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                                                {entry.model}
                                            </span>
                                        )}
                                    </div>

                                    {/* Reasoning */}
                                    <p className="text-white font-medium mb-4">{entry.reasoning}</p>

                                    {/* Changed Files */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-2">変更ファイル:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {entry.files.map((file, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300"
                                                >
                                                    {file.split("/").pop()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Results */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-400">収益</p>
                                            <p className="font-bold">${entry.results.revenue.toFixed(2)}</p>
                                            <ChangeIndicator value={entry.results.revenueChange} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">PV</p>
                                            <p className="font-bold">{entry.results.pageviews}</p>
                                            <ChangeIndicator value={entry.results.pvChange} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">滞在時間</p>
                                            <p className="font-bold">{entry.results.avgSessionDuration}秒</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">直帰率</p>
                                            <p className="font-bold">{entry.results.bounceRate}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
