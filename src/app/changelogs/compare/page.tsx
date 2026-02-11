import { IconChangelog } from "@/components/icons/Icons";
import { ChangelogCompareView, ChangelogEntry } from "@/components/changelog/ChangelogCompareView";
import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from 'next-intl/server';

async function getChangelog(modelId: string, locale: string): Promise<ChangelogEntry[]> {
    try {
        const fileName = locale === 'en' ? 'changelog-en.json' : 'changelog-jp.json';
        const filePath = path.join(process.cwd(), "public", "models", modelId, fileName);
        const content = fs.readFileSync(filePath, "utf-8");
        const entries = JSON.parse(content) as ChangelogEntry[];

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

export default async function CompareChangelogPage() {
    const locale = await getLocale();
    const t = await getTranslations('compare');
    const tChangelog = await getTranslations('changelog');
    const ai1Changelog = await getChangelog("ai1", locale);
    const ai2Changelog = await getChangelog("ai2", locale);

    const translations = {
        noHistory: t('noHistory'),
        screenshot: t('screenshot'),
        updatesCountTemplate: t.raw('updatesCount'),
        noUpdatesThisDayTemplate: t.raw('noUpdatesThisDay'),
        minutesShort: t('minutesShort'),
        secondsShort: t('secondsShort'),
        timesCount: t('timesCount'),
        filterAll: t('filterAll'),
        filterAI1: t('filterAI 1'),
        filterAI2: t('filterAI 2'),
    };

    const changelogTranslations = {
        intent: tChangelog('intent'),
        goal: tChangelog('goal'),
        executionTime: tChangelog('executionTime'),
        buildStatus: tChangelog('buildStatus'),
        success: tChangelog('success'),
        failure: tChangelog('failure'),
        retry: tChangelog('retry'),
        codeChanges: tChangelog('codeChanges'),
        files: tChangelog('files'),
        errorDetails: tChangelog('errorDetails'),
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconChangelog size={48} />
                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('title')}</h1>
                    </div>
                    <p className="text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>

                <ChangelogCompareView
                    ai1Changelog={ai1Changelog}
                    ai2Changelog={ai2Changelog}
                    translations={translations}
                    changelogTranslations={changelogTranslations}
                />
            </div>
        </div>
    );
}
