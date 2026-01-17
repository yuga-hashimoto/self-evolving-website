import { MODELS } from "@/lib/models";
import { IconChangelog, IconEmpty, IconGithub } from "@/components/icons/Icons";
import ChangelogScreenshot from "@/components/changelog/ChangelogScreenshot";
import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from 'next-intl/server';

interface ChangelogEntry {
    id: number;
    date: string;
    model?: string;
    changes?: string;
    intent?: string;
    reasoning?: string;
    files?: string[];
    prUrl?: string;
    prNumber?: number;
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

async function getChangelog(modelId: string, locale: string): Promise<ChangelogEntry[]> {
    try {
        // Select changelog file based on locale
        const fileName = locale === 'en' ? 'changelog-en.json' : 'changelog-jp.json';
        const filePath = path.join(process.cwd(), "public", "models", modelId, fileName);
        const content = fs.readFileSync(filePath, "utf-8");
        const entries = JSON.parse(content) as ChangelogEntry[];

        // Set empty array as default if files property is undefined
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
        timeZone: "Asia/Tokyo",
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
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
    });
    // 00:00の場合も時刻不明として扱う
    if (timeString === '00:00') {
        return '時刻不明';
    }
    return timeString;
}

// Helper function to extract JST date string from ISO date
function getJSTDateString(isoDate: string): string {
    const dateObj = new Date(isoDate);
    const formatter = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(dateObj);
    const getVal = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value || '00';
    return `${getVal('year')}-${getVal('month')}-${getVal('day')}`;
}

// Generate screenshot path from date and changelog entries
function getScreenshotPath(modelId: string, date: string, allEntries: ChangelogEntry[]): string {
    // Extract date in YYYY-MM-DD format (JST)
    const dateStr = getJSTDateString(date);

    // Find all entries for the same date and sort by time (earliest first)
    const sameDate = allEntries
        .filter(entry => getJSTDateString(entry.date) === dateStr)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Find the index of current entry (1-based)
    const index = sameDate.findIndex(entry => entry.date === date);
    const sequenceNumber = index >= 0 ? index + 1 : 1;

    return `/models/${modelId}/screenshots/${dateStr}-${sequenceNumber}.png`;
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
    const locale = await getLocale();
    const t = await getTranslations('compare');
    const tChangelog = await getTranslations('changelog');
    const mimoChangelog = await getChangelog("mimo", locale);
    const grokChangelog = await getChangelog("grok", locale);

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
                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('title')}</h1>
                    </div>
                    <p className="text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>

                {sortedDates.length === 0 ? (
                    <div className="glass-card p-12 text-center max-w-lg mx-auto">
                        <IconEmpty size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">{t('noHistory')}</p>
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

                                    <div className="space-y-4">
                                        {/* Mimo Content */}
                                        <div className="flex flex-col items-end w-full">
                                            {group.mimo.length === 0 ? (
                                                <EmptyModelCard modelId="mimo" align="right" t={t} />
                                            ) : group.mimo.length === 1 ? (
                                                <ModelCard entry={group.mimo[0]} modelId="mimo" align="right" allEntries={mimoChangelog} t={t} tChangelog={tChangelog} />
                                            ) : (
                                                <details className="w-full" open={false}>
                                                    <summary className="glass-card p-3 cursor-pointer hover:bg-white/10 list-none flex items-center justify-between transition-colors border border-purple-500/30 rounded-2xl">
                                                        <div className="flex-1 text-right mr-3">
                                                            <span className="text-sm font-bold text-purple-400">{t('updatesCount', { count: group.mimo.length })}</span>
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
                                                            <ModelCard key={entry.id} entry={entry} modelId="mimo" align="right" allEntries={mimoChangelog} t={t} tChangelog={tChangelog} />
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                        </div>

                                        {/* Grok Content */}
                                        <div className="flex flex-col items-end w-full">
                                            {group.grok.length === 0 ? (
                                                <EmptyModelCard modelId="grok" align="right" t={t} />
                                            ) : group.grok.length === 1 ? (
                                                <ModelCard entry={group.grok[0]} modelId="grok" align="right" allEntries={grokChangelog} t={t} tChangelog={tChangelog} />
                                            ) : (
                                                <details className="w-full" open={false}>
                                                    <summary className="glass-card p-3 cursor-pointer hover:bg-white/10 list-none flex items-center justify-between transition-colors border border-blue-500/30 rounded-2xl">
                                                        <div className="flex-1 text-right mr-3">
                                                            <span className="text-sm font-bold text-blue-400">{t('updatesCount', { count: group.grok.length })}</span>
                                                            {group.grok[0].changes && (
                                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                                    {parseChanges(group.grok[0].changes).after || parseChanges(group.grok[0].changes).raw}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="group-open:rotate-90 transition-transform text-blue-400">▶</span>
                                                    </summary>
                                                    <div className="mt-4 space-y-4">
                                                        {group.grok.map(entry => (
                                                            <ModelCard key={entry.id} entry={entry} modelId="grok" align="right" allEntries={grokChangelog} t={t} tChangelog={tChangelog} />
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

function ModelCard({ entry, modelId, align, allEntries, t, tChangelog }: { entry: ChangelogEntry; modelId: "mimo" | "grok"; align: "left" | "right"; allEntries: ChangelogEntry[]; t: any; tChangelog: any }) {
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
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{isMimo ? "🟣" : "🔵"}</span>
                <span className={`text-sm font-bold ${colorClass}`}>{model.name}</span>
                <span className="text-[10px] text-gray-500 ml-auto">{formatTimeDisplay(entry.date)}</span>
                {entry.prUrl && (
                    <a
                        href={entry.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[10px] hover:underline flex items-center gap-1 ${colorClass} opacity-70 hover:opacity-100 transition-opacity relative z-10`}
                        title={entry.prNumber ? `Pull Request #${entry.prNumber}` : 'Commit'}
                    >
                        <IconGithub size={12} className={colorClass} />
                        {entry.prNumber ? (
                            <span>#{entry.prNumber}</span>
                        ) : (
                            <span>{entry.prUrl.split('/').pop()?.substring(0, 7)}</span>
                        )}
                    </a>
                )}
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
                            <h4 className={`text-[10px] uppercase font-bold mb-1 opacity-70 ${colorClass}`}>{tChangelog('intent')}</h4>
                            {intent.raw ? (
                                <p className="text-xs text-gray-400 italic">"{intent.raw}"</p>
                            ) : (
                                <div className="space-y-1">
                                    {intent.hypothesis && (
                                        <p className="text-xs text-gray-300">{intent.hypothesis}</p>
                                    )}
                                    {intent.metric && (
                                        <p className="text-xs text-purple-300 font-medium">{tChangelog('goal')}: {intent.metric}</p>
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
                            {t('screenshot')}
                        </summary>
                        <div className="mt-2">
                            <a
                                href={getScreenshotPath(modelId, entry.date, allEntries)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block max-w-md rounded overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                            >
                                <ChangelogScreenshot
                                    src={getScreenshotPath(modelId, entry.date, allEntries)}
                                    alt={`Screenshot ${formatTimeDisplay(entry.date)}`}
                                    className="w-full h-auto"
                                />
                            </a>
                        </div>
                    </details>
                </div>

                {/* Workflow Metrics */}
                {entry.metrics && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <details className="group">
                            <summary className={`text-[10px] text-gray-500 cursor-pointer hover:text-${isMimo ? 'purple' : 'blue'}-300 transition-colors list-none flex items-center gap-1 ${align === "right" ? "md:justify-end" : "justify-start"}`}>
                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                <span className="flex items-center gap-2">
                                    <span className="opacity-50">⏱️</span>
                                    <span>{Math.floor(entry.metrics.executionTime.total / 60)}{t('minutesShort')}</span>
                                    {entry.metrics.errors.finalStatus === 'success' ? (
                                        <span className="text-green-400">✓</span>
                                    ) : (
                                        <span className="text-red-400">✗</span>
                                    )}
                                    <span className="text-green-400 font-mono">+{entry.metrics.codeChanges.additions}</span>
                                    <span className="text-red-400 font-mono">-{entry.metrics.codeChanges.deletions}</span>
                                </span>
                            </summary>
                            <div className="mt-3 p-3 bg-black/20 rounded-lg">
                                <div className="grid grid-cols-2 gap-3 text-[10px]">
                                    {/* Execution Time */}
                                    <div>
                                        <p className="text-gray-400 mb-1">{tChangelog('executionTime')}</p>
                                        <p className="font-mono text-white font-bold">
                                            {Math.floor(entry.metrics.executionTime.total / 60)}{t('minutesShort')}{entry.metrics.executionTime.total % 60}{t('secondsShort')}
                                        </p>
                                        {entry.metrics.executionTime.claudeCode > 0 && (
                                            <p className="text-gray-500 mt-1">
                                                Claude: {entry.metrics.executionTime.claudeCode}{t('secondsShort')}
                                            </p>
                                        )}
                                        {entry.metrics.executionTime.autoFix && Object.keys(entry.metrics.executionTime.autoFix).length > 0 && (
                                            <p className="text-gray-500">
                                                Fix: {Object.values(entry.metrics.executionTime.autoFix).reduce((a, b) => a + (b || 0), 0)}{t('secondsShort')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Build Status */}
                                    <div>
                                        <p className="text-gray-400 mb-1">{tChangelog('buildStatus')}</p>
                                        <div className="flex items-center gap-2">
                                            {entry.metrics.errors.finalStatus === 'success' ? (
                                                <span className="text-green-400 font-bold">✓ {tChangelog('success')}</span>
                                            ) : (
                                                <span className="text-red-400 font-bold">✗ {tChangelog('failure')}</span>
                                            )}
                                        </div>
                                        {entry.metrics.errors.retryCount > 0 && (
                                            <p className="text-yellow-400 mt-1">
                                                {tChangelog('retry')}: {entry.metrics.errors.retryCount}{t('timesCount')}
                                            </p>
                                        )}
                                        {entry.metrics.errors.buildFailures > 0 && (
                                            <p className="text-gray-500">
                                                {tChangelog('failure')}: {entry.metrics.errors.buildFailures}{t('timesCount')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Code Changes */}
                                    <div>
                                        <p className="text-gray-400 mb-1">{tChangelog('codeChanges')}</p>
                                        <p className="font-mono text-white">
                                            {entry.metrics.codeChanges.filesChanged} {tChangelog('files')}
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
                                </div>

                                {/* Error Details */}
                                {entry.metrics.errors.errorTypes &&
                                 ((entry.metrics.errors.errorTypes.typescript ?? 0) > 0 ||
                                  (entry.metrics.errors.errorTypes.build ?? 0) > 0 ||
                                  (entry.metrics.errors.errorTypes.security ?? 0) > 0) && (
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <p className="text-gray-400 text-[9px] mb-2">{tChangelog('errorDetails')}</p>
                                        <div className="space-y-1 text-[9px] font-mono">
                                            {(entry.metrics.errors.errorTypes?.typescript ?? 0) > 0 && (
                                                <p className="text-blue-400">TypeScript: {entry.metrics.errors.errorTypes.typescript}</p>
                                            )}
                                            {(entry.metrics.errors.errorTypes?.build ?? 0) > 0 && (
                                                <p className="text-yellow-400">Build: {entry.metrics.errors.errorTypes.build}</p>
                                            )}
                                            {(entry.metrics.errors.errorTypes?.security ?? 0) > 0 && (
                                                <p className="text-red-400">Security: {entry.metrics.errors.errorTypes.security}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </details>
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

function EmptyModelCard({ modelId, align, t }: { modelId: "mimo" | "grok"; align: "left" | "right"; t: any }) {
    const isMimo = modelId === "mimo";
    return (
        <div className={`w-full p-5 border border-dashed border-white/5 rounded-2xl flex items-center justify-center opacity-30 h-full min-h-[100px] ${align === "right" ? "md:text-right" : "text-left"}`}>
            <p className="text-[10px] text-gray-500 italic">{t('noUpdatesThisDay', { modelName: MODELS[modelId].name })}</p>
        </div>
    );
}
