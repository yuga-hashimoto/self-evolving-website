import Link from "next/link";
import { IconDNA, IconCycleDaily, IconBrain, IconCodeSpark, IconTarget, IconRocket, IconClipboard, IconBalance, IconAnalytics, IconMimo, IconGrok } from "@/components/icons/Icons";
import { MODELS } from "@/lib/models";
import { getModelAnalytics, formatDuration } from "@/lib/model-analytics";
import { getTranslations, getLocale } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('home');
  const locale = await getLocale();

  // Format start date according to locale
  const startDate = new Date('2026-01-15');
  const formattedDate = startDate.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fetch model analytics data
  const mimoAnalytics = getModelAnalytics('mimo');
  const grokAnalytics = getModelAnalytics('grok');
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
        {/* Mobile: Title only */}
        <h1 className="text-5xl font-bold gradient-text leading-tight mb-4 sm:hidden">
          <div className="flex flex-col">
            <span>Self-Evolving</span>
            <span>Game</span>
          </div>
        </h1>

        {/* Desktop: Logo and title */}
        <div className="hidden sm:flex items-center justify-center gap-4 mb-6">
          <h1 className="text-5xl lg:text-6xl font-bold gradient-text leading-tight">
            {t('heroTitle')}
          </h1>
          <div className="inline-block animate-float" aria-hidden="true">
            <IconDNA size={96} aria-hidden="true" />
          </div>
        </div>
        <p className="text-base sm:text-xl text-purple-300 mb-3 sm:mb-4 leading-relaxed">
          {t('heroSubtitle')}
        </p>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('startDate', { date: formattedDate })}
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl w-full mb-6 px-3 sm:px-2">
        {/* Mimo Card */}
        <Link href="/models/mimo" className="group block active:scale-95 transition-transform" aria-label="Mimoモデルの進化を見る">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-purple-500/30 hover:border-purple-500/60 active:bg-white/15">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconMimo size={80} className="w-14 h-14 sm:w-20 sm:h-20" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {MODELS.mimo.name}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.mimo.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.mimo.openrouterModel}
              </span>
            </div>
          </div>
        </Link>

        {/* Grok Card */}
        <Link href="/models/grok" className="group block active:scale-95 transition-transform" aria-label="Grokモデルの進化を見る">
          <div className="glass-card p-4 sm:p-8 text-center h-full cursor-pointer transition-all duration-300 hover:scale-105 border-blue-500/30 hover:border-blue-500/60 active:bg-white/15">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconGrok size={80} className="w-14 h-14 sm:w-20 sm:h-20" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {MODELS.grok.name}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.grok.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.grok.openrouterModel}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Engagement Comparison */}
      <div className="max-w-3xl w-full mb-6 px-4">
        <div className="glass-card p-4 sm:p-8 border-purple-500/20 hover:!bg-white/5 hover:!border-purple-500/20 hover:!transform-none hover:!translate-y-0">
          {(mimoAnalytics && grokAnalytics) ? (
            <>
              {/* Model Headers */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <IconMimo size={48} className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                  <div>
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Mimo
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.mimo.openrouterModel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right">
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Grok
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.grok.openrouterModel}</p>
                  </div>
                  <IconGrok size={48} className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                </div>
              </div>

              {/* Comparison Bars */}
              <div className="space-y-4 sm:space-y-5">
                <ComparisonBar
                  label={t('avgSessionDuration')}
                  mimoValue={mimoAnalytics.avgSessionDuration}
                  grokValue={grokAnalytics.avgSessionDuration}
                  mimoDisplay={formatDuration(mimoAnalytics.avgSessionDuration)}
                  grokDisplay={formatDuration(grokAnalytics.avgSessionDuration)}
                  higherIsBetter
                />
                <ComparisonBar
                  label={t('pageviews')}
                  mimoValue={mimoAnalytics.pageviews}
                  grokValue={grokAnalytics.pageviews}
                  mimoDisplay={mimoAnalytics.pageviews.toString()}
                  grokDisplay={grokAnalytics.pageviews.toString()}
                  higherIsBetter
                />
              </div>

              {/* Update Note */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500">
                  {t('updateNote')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm sm:text-base mb-2">
                {t('dataCollecting')}
              </p>
              <p className="text-gray-500 text-xs">
                {t('dataWillAppear')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How it Works - Mobile Optimized Timeline */}
      <div className="max-w-3xl w-full mb-4 sm:mb-8 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          {t('howItWorksTitle')}
        </h3>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line for Mobile */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hidden sm:block md:hidden" />

          {/* Steps */}
          <div className="flex flex-col gap-5 sm:gap-6 md:grid md:grid-cols-3">
            {/* Step 1 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">{t('step1Title')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('step1Desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">{t('step2Title')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('step2Desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-5 sm:p-6 flex items-start sm:flex-col sm:items-center sm:text-center gap-4 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border-2 border-purple-500/30 relative z-10">
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="flex-1 sm:mt-4">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-200 tracking-tight mb-2 sm:mb-2">{t('step3Title')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modification Rules */}
      <div className="max-w-3xl w-full mb-8 sm:mb-12 px-4">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          {t('aiRulesTitle')}
        </h3>

        {/* Rules Content */}
        <div className="glass-card p-5 sm:p-8 border-purple-500/20 hover:!transform-none hover:!translate-y-0 hover:!bg-white/5 hover:!border-purple-500/20">
          <div className="space-y-4 sm:space-y-5">
            {/* Goal */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20" aria-hidden="true">
                <IconTarget size={24} className="text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">{t('ruleGoalTitle')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('ruleGoalDesc')}
                </p>
              </div>
            </div>

            {/* Fairness */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20" aria-hidden="true">
                <IconBalance size={24} className="text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">{t('ruleFairnessTitle')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('ruleFairnessDesc')}
                </p>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20" aria-hidden="true">
                <IconAnalytics size={24} className="text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">{t('ruleDataTitle')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('ruleDataDesc')}
                </p>
              </div>
            </div>

            {/* Freedom */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20" aria-hidden="true">
                <IconRocket size={24} className="text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">{t('ruleFreedomTitle')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('ruleFreedomDesc')}
                </p>
              </div>
            </div>

            {/* Constraint */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20" aria-hidden="true">
                <IconClipboard size={24} className="text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-1 sm:mb-2">{t('ruleConstraintTitle')}</h4>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {t('ruleConstraintDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

// 比較バーコンポーネント
function ComparisonBar({
  label,
  mimoValue,
  grokValue,
  mimoDisplay,
  grokDisplay,
  higherIsBetter = true
}: {
  label: string;
  mimoValue: number;
  grokValue: number;
  mimoDisplay: string;
  grokDisplay: string;
  higherIsBetter?: boolean;
}) {
  const total = mimoValue + grokValue;
  const mimoPercent = total > 0 ? (mimoValue / total) * 100 : 50;
  const grokPercent = total > 0 ? (grokValue / total) * 100 : 50;

  const mimoWins = higherIsBetter ? mimoValue > grokValue : mimoValue < grokValue;
  const grokWins = higherIsBetter ? grokValue > mimoValue : grokValue < mimoValue;

  return (
    <div className="space-y-1.5">
      {/* Label & Values */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {mimoWins && <span className="text-base sm:text-lg">🏆</span>}
          <span className={`text-sm sm:text-base font-bold ${mimoWins ? 'text-purple-300' : 'text-gray-400'}`}>
            {mimoDisplay}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm sm:text-base font-bold ${grokWins ? 'text-blue-300' : 'text-gray-400'}`}>
            {grokDisplay}
          </span>
          {grokWins && <span className="text-base sm:text-lg">🏆</span>}
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-2 sm:h-3 bg-gray-800/50 rounded-full overflow-hidden">
        {/* Mimo側（左） */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
          style={{ width: `${mimoPercent}%` }}
        />
        {/* Grok側（右） */}
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${grokPercent}%` }}
        />
      </div>
    </div>
  );
}
