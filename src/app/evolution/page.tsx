import { getLatestCommits } from "@/lib/github";
import { EvolutionTimeline } from "@/components/EvolutionTimeline";
import { getTranslations } from 'next-intl/server';
import { IconDNA } from "@/components/icons/Icons";
import Link from 'next/link';

export const metadata = {
  title: 'Evolution Log | Self-Evolving Website',
  description: 'Chronological history of all autonomous code modifications made by AI.',
};

export default async function EvolutionPage() {
    const t = await getTranslations('evolution');
    const evolutions = await getLatestCommits(100);

    const translations = {
        noCommits: t('noCommits'),
        commit: t('commit'),
        viewOnGithub: t('viewOnGithub'),
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6">
                        {t('backToHome')}
                    </Link>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <IconDNA size={48} className="animate-float" />
                        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">{t('title')}</h1>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <EvolutionTimeline
                    evolutions={evolutions}
                    translations={translations}
                />
            </div>
        </div>
    );
}
