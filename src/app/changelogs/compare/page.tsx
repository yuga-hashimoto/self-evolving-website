import { MODELS } from "@/lib/models";
import { IconChangelog, IconEmpty } from "@/components/icons/Icons";
import ChangelogScreenshot from "@/components/changelog/ChangelogScreenshot";
import fs from "fs";
import path from "path";

interface ChangelogEntry {
    id: number;
    date: string;
    model?: string;
    changes?: string;
    intent?: string;
    reasoning?: string;
    files?: string[];
    results?: {
        revenue: number;
        revenueChange: number;
        pageviews: number;
        pvChange: number;
        avgSessionDuration: number;
        bounceRate: number;
    };
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
        };
        codeChanges: {
            filesChanged: number;
            additions: number;
            deletions: number;
        };
    };
}

interface GroupedEntry {
    date: string; // YYYY-MM-DD
    displayDate: string; // 日本語フォーマット
    mimo: ChangelogEntry[]; // 配列に変更
    grok: ChangelogEntry[]; // 配列に変更
}

async function getChangelog(modelId: string): Promise<ChangelogEntry[]> {
    try {
        const filePath = path.join(process.cwd(), "public", "models", modelId, "changelog.json");
        const content = fs.readFileSync(filePath, "utf-8");
        const entries = JSON.parse(content) as ChangelogEntry[];

        // files プロパティが undefined の場合は空配列をデフォルトとして設定
        return entries.map((entry, index) => {
            if (!entry.files) {
                console.warn(`⚠️  Changelog entry ${index} for ${modelId} is missing 'files' property (date: ${entry.date})`);
            }
            return {
                ...entry,
                files: entry.files ?? []
            };
        });
    } catch (error) {
        console.warn(`⚠️  Failed to load changelog for ${modelId}:`, error);
        return [];
    }
}

function formatDateDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function formatTimeDisplay(dateString: string): string {
    // 日付のみの場合を検出（Tがない、または時刻が00:00:00の場合）
    if (!dateString.includes('T')) {
        return '時刻不明';
    }
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
    });
    // 00:00の場合も時刻不明として扱う
    if (timeString === '00:00') {
        return '時刻不明';
    }
    return timeString;
}

// Generate screenshot path from date
function getScreenshotPath(modelId: string, date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return `/models/${modelId}/screenshots/${dateStr}.png`;
}

// Parse structured changelog entries (same as in individual changelog page)
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

export default async function CompareChangelogPage() {
    const mimoChangelog = await getChangelog("mimo");
    const grokChangelog = await getChangelog("grok");

    // 日付ごとにグループ化
    const groups: Record<string, GroupedEntry> = {};

    mimoChangelog.forEach(entry => {
        const dateKey = entry.date.split("T")[0];
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: dateKey,
                displayDate: formatDateDisplay(entry.date),
                mimo: [entry],
                grok: []
            };
        } else {
            // 配列に追加
            groups[dateKey].mimo.push(entry);
        }
    });

    // 各グループ内で時刻順にソート（新しい順）
    Object.values(groups).forEach(group => {
        group.mimo.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    });

    grokChangelog.forEach(entry => {
        const dateKey = entry.date.split("T")[0];
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: dateKey,
                displayDate: formatDateDisplay(entry.date),
                mimo: [],
                grok: [entry]
            };
        } else {
            // 配列に追加
            groups[dateKey].grok.push(entry);
        }
    });

    // 各グループ内で時刻順にソート（新しい順）
    Object.values(groups).forEach(group => {
        group.grok.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    });

    // 日付の降順でソート
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a)).slice(0, 30);

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconChangelog size={48} />
                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">進化のタイムライン</h1>
                    </div>
                    <p className="text-gray-400">
                        日付ごとにMimoとGrokの成長を比較します
                    </p>
                </div>

                {sortedDates.length === 0 ? (
                    <div className="glass-card p-12 text-center max-w-lg mx-auto">
                        <IconEmpty size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">比較できる履歴がまだありません</p>
                    </div>
                ) : (
                    <div className="space-y-12 relative">
                        {/* Vertical center line for desktop */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

                        {sortedDates.map((dateKey) => {
                            const group = groups[dateKey];
                            return (
                                <div key={dateKey} className="relative">
                                    {/* Date Label (Center sticky-ish) */}
                                    <div className="flex justify-center mb-6 sticky top-20 z-10">
                                        <span className="bg-slate-900 border border-white/20 px-4 py-1 rounded-full text-xs font-bold text-gray-300 shadow-xl backdrop-blur-md">
                                            {group.displayDate}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                                        {/* Mimo Content */}
                                        <div className="flex flex-col items-end w-full">
                                            {group.mimo.length === 0 ? (
                                                <EmptyModelCard modelId="mimo" align="right" />
                                            ) : group.mimo.length === 1 ? (
                                                <ModelCard entry={group.mimo[0]} modelId="mimo" align="right" />
                                            ) : (
                                                <details className="w-full" open={false}>
                                                    <summary className="glass-card p-3 cursor-pointer hover:bg-white/10 list-none flex items-center justify-between transition-colors border border-purple-500/30 rounded-2xl">
                                                        <div className="flex-1 text-right mr-3">
                                                            <span className="text-sm font-bold text-purple-400">{group.mimo.length}件の更新</span>
                                                            {group.mimo[0].changes && (
                                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                                    {parseChanges(group.mimo[0].changes).after || parseChanges(group.mimo[0].changes).raw}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="group-open:rotate-90 transition-transform text-purple-400">▶</span>
                                                    </summary>
                                                    <div className="mt-4 space-y-4">
                                                        {group.mimo.map(entry => (
                                                            <ModelCard key={entry.id} entry={entry} modelId="mimo" align="right" />
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                        </div>

                                        {/* Grok Content */}
                                        <div className="flex flex-col items-start w-full">
                                            {group.grok.length === 0 ? (
                                                <EmptyModelCard modelId="grok" align="left" />
                                            ) : group.grok.length === 1 ? (
                                                <ModelCard entry={group.grok[0]} modelId="grok" align="left" />
                                            ) : (
                                                <details className="w-full" open={false}>
                                                    <summary className="glass-card p-3 cursor-pointer hover:bg-white/10 list-none flex items-center justify-between transition-colors border border-blue-500/30 rounded-2xl">
                                                        <span className="group-open:rotate-90 transition-transform text-blue-400">▶</span>
                                                        <div className="flex-1 text-left ml-3">
                                                            <span className="text-sm font-bold text-blue-400">{group.grok.length}件の更新</span>
                                                            {group.grok[0].changes && (
                                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                                    {parseChanges(group.grok[0].changes).after || parseChanges(group.grok[0].changes).raw}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </summary>
                                                    <div className="mt-4 space-y-4">
                                                        {group.grok.map(entry => (
                                                            <ModelCard key={entry.id} entry={entry} modelId="grok" align="left" />
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function ModelCard({ entry, modelId, align }: { entry: ChangelogEntry; modelId: "mimo" | "grok"; align: "left" | "right" }) {
    const model = MODELS[modelId];
    const isMimo = modelId === "mimo";
    const colorClass = isMimo ? "text-purple-400" : "text-blue-400";
    const bgClass = isMimo ? "bg-purple-500/10" : "bg-blue-500/10";
    const borderClass = isMimo ? "border-purple-500/30" : "border-blue-500/30";
    const accentBorder = isMimo ? "order-l-purple-500 md:border-r-purple-500 md:border-l-0" : "border-l-blue-500";

    // For Mimo (align right) on desktop, we flip border to right. For Mobile, always left.
    const finalAccentBorder = align === "right"
        ? "border-l-4 border-l-purple-500 md:border-l-0 md:border-r-4 md:border-r-purple-500"
        : "border-l-4 border-l-blue-500";

    return (
        <div className={`w-full glass-card p-5 ${finalAccentBorder} ${bgClass} ${borderClass} shadow-lg transition-transform hover:scale-[1.02] duration-300`}>
            <div className={`flex items-center gap-2 mb-3 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
                <span className="text-xl">{isMimo ? "🟣" : "🔵"}</span>
                <span className={`text-sm font-bold ${colorClass}`}>{model.name}</span>
                <span className="text-[10px] text-gray-500 ml-auto md:ml-0 md:mx-2">{formatTimeDisplay(entry.date)}</span>
            </div>

            <div className={align === "right" ? "md:text-right" : "text-left"}>
                {entry.changes && (() => {
                    const changes = parseChanges(entry.changes);
                    return (
                        <div className="mb-3">
                            {changes.raw ? (
                                <p className="text-white text-sm font-semibold leading-relaxed">{changes.raw}</p>
                            ) : (
                                <div className="space-y-1 text-sm">
                                    {changes.after && (
                                        <p className="text-white font-semibold">{changes.after}</p>
                                    )}
                                    {changes.before && (
                                        <p className="text-gray-400 text-xs">← {changes.before}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {entry.intent && (() => {
                    const intent = parseIntent(entry.intent);
                    return (
                        <div className="mb-3 bg-black/20 p-2 rounded-lg">
                            <h4 className={`text-[10px] uppercase font-bold mb-1 opacity-70 ${colorClass}`}>狙い</h4>
                            {intent.raw ? (
                                <p className="text-xs text-gray-400 italic">"{intent.raw}"</p>
                            ) : (
                                <div className="space-y-1">
                                    {intent.hypothesis && (
                                        <p className="text-xs text-gray-300">{intent.hypothesis}</p>
                                    )}
                                    {intent.metric && (
                                        <p className="text-xs text-purple-300 font-medium">目標: {intent.metric}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {!entry.changes && entry.reasoning && (
                    <p className="text-sm text-gray-200 mb-3 leading-relaxed">{entry.reasoning}</p>
                )}

                {/* Screenshot */}
                <div className="mb-3">
                    <details className="group">
                        <summary className={`text-[10px] text-gray-500 cursor-pointer hover:text-${isMimo ? 'purple' : 'blue'}-300 transition-colors list-none flex items-center gap-1 ${align === "right" ? "md:justify-end" : "justify-start"}`}>
                            <span className="group-open:rotate-90 transition-transform">▶</span>
                            スクショ
                        </summary>
                        <div className="mt-2">
                            <a
                                href={getScreenshotPath(modelId, entry.date)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block max-w-md rounded overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                            >
                                <ChangelogScreenshot
                                    src={getScreenshotPath(modelId, entry.date)}
                                    alt={`Screenshot ${formatTimeDisplay(entry.date)}`}
                                    className="w-full h-auto"
                                />
                            </a>
                        </div>
                    </details>
                </div>

                {/* Metrics - Compact Display */}
                {entry.metrics && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <div className={`flex flex-wrap gap-3 text-[10px] ${align === "right" ? "md:justify-end" : "justify-start"}`}>
                            {/* Execution Time */}
                            <div className="flex items-center gap-1">
                                <span className="opacity-50">⏱️</span>
                                <span className="text-gray-400">
                                    {Math.floor(entry.metrics.executionTime.total / 60)}分
                                </span>
                            </div>

                            {/* Build Status */}
                            <div className="flex items-center gap-1">
                                {entry.metrics.errors.finalStatus === 'success' ? (
                                    <>
                                        <span className="text-green-400">✓</span>
                                        {entry.metrics.errors.retryCount > 0 && (
                                            <span className="text-yellow-400">({entry.metrics.errors.retryCount}回修正)</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-red-400">✗ 失敗</span>
                                )}
                            </div>

                            {/* Code Changes */}
                            <div className="flex items-center gap-1 font-mono">
                                <span className="text-green-400">+{entry.metrics.codeChanges.additions}</span>
                                <span className="text-red-400">-{entry.metrics.codeChanges.deletions}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`flex flex-wrap gap-1 mt-4 ${align === "right" ? "md:justify-end" : "justify-start"}`}>
                    {(entry.files || []).slice(0, 3).map((file, i) => (
                        <span key={i} className="px-2 py-0.5 bg-black/30 rounded text-[10px] text-gray-500 border border-white/5">
                            {file.split("/").pop()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EmptyModelCard({ modelId, align }: { modelId: "mimo" | "grok"; align: "left" | "right" }) {
    const isMimo = modelId === "mimo";
    return (
        <div className={`w-full p-5 border border-dashed border-white/5 rounded-2xl flex items-center justify-center opacity-30 h-full min-h-[100px] ${align === "right" ? "md:text-right" : "text-left"}`}>
            <p className="text-[10px] text-gray-500 italic">この日の{MODELS[modelId].name}による更新はありません</p>
        </div>
    );
}
