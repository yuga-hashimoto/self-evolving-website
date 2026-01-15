import { notFound } from "next/navigation";
import { getModel, MODELS } from "@/lib/models";
import { IconChangelog, IconEmpty } from "@/components/icons/Icons";
import Link from "next/link";
import fs from "fs";
import path from "path";

export function generateStaticParams() {
    return Object.keys(MODELS).map((modelId) => ({
        modelId,
    }));
}

interface ChangelogEntry {
    id: number;
    date: string;
    model?: string;
    // Old format
    reasoning?: string;
    results?: {
        revenue: number;
        revenueChange: number;
        pageviews: number;
        pvChange: number;
        avgSessionDuration: number;
        bounceRate: number;
    };
    // New format
    changes?: string;
    intent?: string;
    files: string[];
    // Workflow metrics
    metrics?: {
        executionTime: {
            claudeCode: number;
            autoFix?: {
                attempt1?: number;
                attempt2?: number;
                attempt3?: number;
            };
            total: number;
        };
        errors: {
            buildFailures: number;
            retryCount: number;
            finalStatus: 'success' | 'failure';
            errorTypes?: {
                typescript?: number;
                build?: number;
                security?: number;
            };
            errorDetails?: string;
        };
        codeChanges: {
            filesChanged: number;
            additions: number;
            deletions: number;
        };
        screenshot?: {
            pixelDiffPercent: number;
            diffPixels: number;
            totalPixels: number;
        };
    };
}

// Generate screenshot path from date
function getScreenshotPath(modelId: string, date: string): string {
    // Extract date in YYYY-MM-DD format
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return `/models/${modelId}/screenshots/${dateStr}.png`;
}

interface PageProps {
    params: Promise<{ modelId: string }>;
}

async function getChangelog(modelId: string): Promise<ChangelogEntry[]> {
    try {
        const filePath = path.join(process.cwd(), "public", "models", modelId, "changelog.json");
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content) as ChangelogEntry[];
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

// Parse structured changelog entries
function parseChanges(changes: string) {
    const lines = changes.split('\n').filter(line => line.trim());
    const parsed: { before?: string; after?: string; implementation?: string; raw?: string } = {};

    lines.forEach(line => {
        if (line.includes('変更前:') || line.includes('Before:')) {
            parsed.before = line.split(':')[1]?.trim();
        } else if (line.includes('変更後:') || line.includes('After:')) {
            parsed.after = line.split(':')[1]?.trim();
        } else if (line.includes('実装:') || line.includes('Implementation:')) {
            parsed.implementation = line.split(':')[1]?.trim();
        }
    });

    // If no structured format found, return as raw
    if (!parsed.before && !parsed.after && !parsed.implementation) {
        parsed.raw = changes;
    }

    return parsed;
}

function parseIntent(intent: string) {
    const lines = intent.split('\n').filter(line => line.trim());
    const parsed: { hypothesis?: string; principle?: string; metric?: string; raw?: string } = {};

    lines.forEach(line => {
        if (line.includes('仮説:') || line.includes('Hypothesis:')) {
            parsed.hypothesis = line.split(':')[1]?.trim();
        } else if (line.includes('原理:') || line.includes('Principle:')) {
            parsed.principle = line.split(':')[1]?.trim();
        } else if (line.includes('目標指標:') || line.includes('Metric:')) {
            parsed.metric = line.split(':')[1]?.trim();
        }
    });

    // If no structured format found, return as raw
    if (!parsed.hypothesis && !parsed.principle && !parsed.metric) {
        parsed.raw = intent;
    }

    return parsed;
}

export default async function ChangelogPage({ params }: PageProps) {
    const { modelId } = await params;
    const model = getModel(modelId);

    if (!model) {
        notFound();
    }

    const changelog = await getChangelog(modelId);
    const sortedChangelog = [...changelog].reverse().slice(0, 50);

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconChangelog size={48} />
                        <h1 className="text-4xl font-bold gradient-text">{model.name} 更新履歴</h1>
                    </div>
                    <p className="text-gray-400">
                        {model.name}が行ったすべての変更を記録しています
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
                            {model.name}の最初の進化を待っています...
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

                                    {/* Content - Support both new and old formats */}
                                    {entry.changes && (() => {
                                        const changes = parseChanges(entry.changes);
                                        return (
                                            <div className="mb-4">
                                                <h4 className="text-sm text-purple-400 font-bold mb-2">変更内容</h4>
                                                {changes.raw ? (
                                                    <p className="text-white font-medium">{changes.raw}</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {changes.before && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">変更前: </span>
                                                                <span className="text-gray-300">{changes.before}</span>
                                                            </div>
                                                        )}
                                                        {changes.after && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">変更後: </span>
                                                                <span className="text-white font-medium">{changes.after}</span>
                                                            </div>
                                                        )}
                                                        {changes.implementation && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">実装: </span>
                                                                <span className="text-gray-300">{changes.implementation}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    {entry.intent && (() => {
                                        const intent = parseIntent(entry.intent);
                                        return (
                                            <div className="mb-4">
                                                <h4 className="text-sm text-purple-400 font-bold mb-2">変更の狙い</h4>
                                                {intent.raw ? (
                                                    <p className="text-gray-300">{intent.raw}</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {intent.hypothesis && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">仮説: </span>
                                                                <span className="text-gray-300">{intent.hypothesis}</span>
                                                            </div>
                                                        )}
                                                        {intent.principle && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">原理: </span>
                                                                <span className="text-gray-300">{intent.principle}</span>
                                                            </div>
                                                        )}
                                                        {intent.metric && (
                                                            <div>
                                                                <span className="text-xs text-purple-300 font-medium">目標: </span>
                                                                <span className="text-purple-200 font-medium">{intent.metric}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    {/* Legacy reasoning support */}
                                    {!entry.changes && entry.reasoning && (
                                        <p className="text-white font-medium mb-4">{entry.reasoning}</p>
                                    )}

                                    {/* Screenshot */}
                                    <div className="mb-4">
                                        <details className="group">
                                            <summary className="text-sm text-gray-400 cursor-pointer hover:text-purple-300 transition-colors list-none flex items-center gap-2">
                                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                                スクリーンショットを表示
                                            </summary>
                                            <div className="mt-3">
                                                <a
                                                    href={getScreenshotPath(modelId, entry.date)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block max-w-2xl rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-colors"
                                                >
                                                    <img
                                                        src={getScreenshotPath(modelId, entry.date)}
                                                        alt={`Screenshot from ${formatDate(entry.date)}`}
                                                        className="w-full h-auto"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement?.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = '<p class="text-gray-500 text-xs p-4 text-center">スクリーンショットが見つかりません</p>';
                                                            }
                                                        }}
                                                    />
                                                </a>
                                            </div>
                                        </details>
                                    </div>

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

                                    {/* Results (Only if available) */}
                                    {entry.results && (
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
                                    )}

                                    {/* Workflow Metrics */}
                                    {entry.metrics && (
                                        <div className="mt-4 p-4 bg-black/20 rounded-lg">
                                            <h4 className="text-sm text-purple-400 font-bold mb-3">ワークフローメトリクス</h4>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                                {/* 実行時間 */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">実行時間</p>
                                                    <p className="font-mono text-white font-bold">
                                                        {Math.floor(entry.metrics.executionTime.total / 60)}分{entry.metrics.executionTime.total % 60}秒
                                                    </p>
                                                    {entry.metrics.executionTime.claudeCode > 0 && (
                                                        <p className="text-gray-500 mt-1">
                                                            Claude: {entry.metrics.executionTime.claudeCode}秒
                                                        </p>
                                                    )}
                                                    {entry.metrics.executionTime.autoFix && Object.keys(entry.metrics.executionTime.autoFix).length > 0 && (
                                                        <p className="text-gray-500">
                                                            修正: {Object.values(entry.metrics.executionTime.autoFix).reduce((a, b) => a + (b || 0), 0)}秒
                                                        </p>
                                                    )}
                                                </div>

                                                {/* エラー・リトライ */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">ビルド状態</p>
                                                    <div className="flex items-center gap-2">
                                                        {entry.metrics.errors.finalStatus === 'success' ? (
                                                            <span className="text-green-400 font-bold">✓ 成功</span>
                                                        ) : (
                                                            <span className="text-red-400 font-bold">✗ 失敗</span>
                                                        )}
                                                    </div>
                                                    {entry.metrics.errors.retryCount > 0 && (
                                                        <p className="text-yellow-400 mt-1">
                                                            リトライ: {entry.metrics.errors.retryCount}回
                                                        </p>
                                                    )}
                                                    {entry.metrics.errors.buildFailures > 0 && (
                                                        <p className="text-gray-500">
                                                            失敗: {entry.metrics.errors.buildFailures}回
                                                        </p>
                                                    )}
                                                </div>

                                                {/* コード変更量 */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">コード変更</p>
                                                    <p className="font-mono text-white">
                                                        {entry.metrics.codeChanges.filesChanged} ファイル
                                                    </p>
                                                    <div className="flex gap-3 mt-1">
                                                        <span className="text-green-400 font-mono">
                                                            +{entry.metrics.codeChanges.additions}
                                                        </span>
                                                        <span className="text-red-400 font-mono">
                                                            -{entry.metrics.codeChanges.deletions}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* スクリーンショット差分 */}
                                                {entry.metrics.screenshot && (
                                                    <div>
                                                        <p className="text-gray-400 mb-1">画面差分</p>
                                                        <p className="font-mono text-white font-bold">
                                                            {entry.metrics.screenshot.pixelDiffPercent}%
                                                        </p>
                                                        <p className="text-gray-500 text-[10px] mt-1">
                                                            {entry.metrics.screenshot.diffPixels.toLocaleString()} / {entry.metrics.screenshot.totalPixels.toLocaleString()} px
                                                        </p>
                                                    </div>
                                                )}

                                                {/* エラー詳細（展開可能） */}
                                                {entry.metrics.errors.errorTypes &&
                                                 (entry.metrics.errors.errorTypes.typescript ||
                                                  entry.metrics.errors.errorTypes.build ||
                                                  entry.metrics.errors.errorTypes.security) && (
                                                    <div className="col-span-2 sm:col-span-3">
                                                        <details className="group mt-2">
                                                            <summary className="text-gray-400 cursor-pointer hover:text-purple-300 transition-colors list-none flex items-center gap-2">
                                                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                                                エラー詳細
                                                            </summary>
                                                            <div className="mt-2 p-2 bg-black/30 rounded text-[10px] font-mono">
                                                                {(entry.metrics.errors.errorTypes?.typescript ?? 0) > 0 && (
                                                                    <p className="text-blue-400">TypeScript: {entry.metrics.errors.errorTypes.typescript}件</p>
                                                                )}
                                                                {(entry.metrics.errors.errorTypes?.build ?? 0) > 0 && (
                                                                    <p className="text-yellow-400">Build: {entry.metrics.errors.errorTypes.build}件</p>
                                                                )}
                                                                {(entry.metrics.errors.errorTypes?.security ?? 0) > 0 && (
                                                                    <p className="text-red-400">Security: {entry.metrics.errors.errorTypes.security}件</p>
                                                                )}
                                                            </div>
                                                        </details>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Link
                        href={`/models/${modelId}`}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← {model.name}トップに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
