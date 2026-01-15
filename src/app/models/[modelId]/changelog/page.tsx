import { notFound } from "next/navigation";
import { getModel, MODELS } from "@/lib/models";
import { IconChangelog, IconEmpty, IconGithub } from "@/components/icons/Icons";
import ChangelogScreenshot from "@/components/changelog/ChangelogScreenshot";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from 'next-intl/server';

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
    files?: string[];
    prUrl?: string;
    prNumber?: number;
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

// Generate screenshot path from date and changelog entries
function getScreenshotPath(modelId: string, date: string, allEntries: ChangelogEntry[]): string {
    // Extract date in YYYY-MM-DD format
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Find all entries for the same date and sort by time (earliest first)
    const sameDate = allEntries
        .filter(entry => {
            const entryDate = new Date(entry.date);
            const entryYear = entryDate.getFullYear();
            const entryMonth = String(entryDate.getMonth() + 1).padStart(2, '0');
            const entryDay = String(entryDate.getDate()).padStart(2, '0');
            return `${entryYear}-${entryMonth}-${entryDay}` === dateStr;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Find the index of current entry (1-based)
    const index = sameDate.findIndex(entry => entry.date === date);
    const sequenceNumber = index >= 0 ? index + 1 : 1;

    return `/models/${modelId}/screenshots/${dateStr}-${sequenceNumber}.png`;
}

interface PageProps {
    params: Promise<{ modelId: string }>;
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

    const locale = await getLocale();
    const t = await getTranslations('changelog');
    const changelog = await getChangelog(modelId, locale);
    const sortedChangelog = [...changelog].reverse().slice(0, 50);

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconChangelog size={48} />
                        <h1 className="text-4xl font-bold gradient-text">{t('title', { modelName: model.name })}</h1>
                    </div>
                    <p className="text-gray-400">
                        {t('subtitle', { modelName: model.name })}
                    </p>
                </div>

                {/* Timeline */}
                {sortedChangelog.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <IconEmpty size={80} />
                        </div>
                        <p className="text-gray-400 text-lg">{t('noChanges')}</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {t('waitingFirst', { modelName: model.name })}
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
                                            #{entry.id}
                                        </div>
                                        {entry.model && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                                                {entry.model}
                                            </span>
                                        )}
                                        <div className="text-sm text-purple-300 ml-auto">
                                            {formatDate(entry.date)}
                                        </div>
                                        {entry.prUrl && (
                                            <a
                                                href={entry.prUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-purple-300 hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity relative z-10"
                                                title={entry.prNumber ? `Pull Request #${entry.prNumber}` : 'Commit'}
                                            >
                                                <IconGithub size={12} className="text-purple-300" />
                                                {entry.prNumber ? (
                                                    <span>#{entry.prNumber}</span>
                                                ) : (
                                                    <span>{entry.prUrl.split('/').pop()?.substring(0, 7)}</span>
                                                )}
                                            </a>
                                        )}
                                    </div>

                                    {/* Content - Support both new and old formats */}
                                    {entry.changes && (() => {
                                        const changes = parseChanges(entry.changes);
                                        return (
                                            <div className="mb-4">
                                                <h4 className="text-sm text-purple-400 font-bold mb-2">{t('changes')}</h4>
                                                {changes.raw ? (
                                                    <p className="text-white font-medium">{changes.raw}</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {changes.before && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">{t('before')}: </span>
                                                                <span className="text-gray-300">{changes.before}</span>
                                                            </div>
                                                        )}
                                                        {changes.after && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">{t('after')}: </span>
                                                                <span className="text-white font-medium">{changes.after}</span>
                                                            </div>
                                                        )}
                                                        {changes.implementation && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">{t('implementation')}: </span>
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
                                                <h4 className="text-sm text-purple-400 font-bold mb-2">{t('intent')}</h4>
                                                {intent.raw ? (
                                                    <p className="text-gray-300">{intent.raw}</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {intent.hypothesis && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">{t('hypothesis')}: </span>
                                                                <span className="text-gray-300">{intent.hypothesis}</span>
                                                            </div>
                                                        )}
                                                        {intent.principle && (
                                                            <div>
                                                                <span className="text-xs text-gray-500">{t('principle')}: </span>
                                                                <span className="text-gray-300">{intent.principle}</span>
                                                            </div>
                                                        )}
                                                        {intent.metric && (
                                                            <div>
                                                                <span className="text-xs text-purple-300 font-medium">{t('goal')}: </span>
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
                                                {t('showScreenshot')}
                                            </summary>
                                            <div className="mt-3">
                                                <a
                                                    href={getScreenshotPath(modelId, entry.date, changelog)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block max-w-2xl rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-colors"
                                                >
                                                    <ChangelogScreenshot
                                                        src={getScreenshotPath(modelId, entry.date, changelog)}
                                                        alt={`Screenshot from ${formatDate(entry.date)}`}
                                                        className="w-full h-auto"
                                                    />
                                                </a>
                                            </div>
                                        </details>
                                    </div>

                                    {/* Changed Files */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-2">{t('changedFiles')}:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(entry.files || []).map((file, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300"
                                                >
                                                    {file.split("/").pop()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Workflow Metrics */}
                                    {entry.metrics && (
                                        <div className="mt-4 p-4 bg-black/20 rounded-lg">
                                            <h4 className="text-sm text-purple-400 font-bold mb-3">{t('workflowMetrics')}</h4>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                                {/* Execution Time */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">{t('executionTime')}</p>
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
                                                            {t('fix')}: {Object.values(entry.metrics.executionTime.autoFix).reduce((a, b) => a + (b || 0), 0)}{t('secondsShort')}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Build Status */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">{t('buildStatus')}</p>
                                                    <div className="flex items-center gap-2">
                                                        {entry.metrics.errors.finalStatus === 'success' ? (
                                                            <span className="text-green-400 font-bold">✓ {t('success')}</span>
                                                        ) : (
                                                            <span className="text-red-400 font-bold">✗ {t('failure')}</span>
                                                        )}
                                                    </div>
                                                    {entry.metrics.errors.retryCount > 0 && (
                                                        <p className="text-yellow-400 mt-1">
                                                            {t('retry')}: {entry.metrics.errors.retryCount}{t('timesCount')}
                                                        </p>
                                                    )}
                                                    {entry.metrics.errors.buildFailures > 0 && (
                                                        <p className="text-gray-500">
                                                            {t('failure')}: {entry.metrics.errors.buildFailures}{t('timesCount')}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Code Changes */}
                                                <div>
                                                    <p className="text-gray-400 mb-1">{t('codeChanges')}</p>
                                                    <p className="font-mono text-white">
                                                        {entry.metrics.codeChanges.filesChanged} {t('files')}
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

                                                {/* Screen Diff */}
                                                {entry.metrics.screenshot && (
                                                    <div>
                                                        <p className="text-gray-400 mb-1">{t('screenDiff')}</p>
                                                        <p className="font-mono text-white font-bold">
                                                            {entry.metrics.screenshot.pixelDiffPercent}%
                                                        </p>
                                                        <p className="text-gray-500 text-[10px] mt-1">
                                                            {entry.metrics.screenshot.diffPixels.toLocaleString()} / {entry.metrics.screenshot.totalPixels.toLocaleString()} px
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Error Details */}
                                                {entry.metrics.errors.errorTypes &&
                                                 ((entry.metrics.errors.errorTypes.typescript ?? 0) > 0 ||
                                                  (entry.metrics.errors.errorTypes.build ?? 0) > 0 ||
                                                  (entry.metrics.errors.errorTypes.security ?? 0) > 0) && (
                                                    <div className="col-span-2 sm:col-span-3">
                                                        <details className="group mt-2">
                                                            <summary className="text-gray-400 cursor-pointer hover:text-purple-300 transition-colors list-none flex items-center gap-2">
                                                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                                                {t('errorDetails')}
                                                            </summary>
                                                            <div className="mt-2 p-2 bg-black/30 rounded text-[10px] font-mono">
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
                        {t('backToModel', { modelName: model.name })}
                    </Link>
                </div>
            </div>
        </div>
    );
}
