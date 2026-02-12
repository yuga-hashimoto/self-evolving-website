import Link from 'next/link';
import dynamic from 'next/dynamic';
import { KonamiChaos } from '@/components/features/KonamiChaos';
import { StickyAd } from '@/components/features/StickyAd';
import { LiveVisitorCount } from '@/components/features/LiveVisitorCount';
import { GhostCursors } from '@/components/features/GhostCursors';
import { SponsorMarquee } from '@/components/features/SponsorMarquee';
import { SponsorSpotlight } from '@/components/features/SponsorSpotlight';
import { VoteDuel } from '@/components/features/VoteDuel';
import { AdBanner } from '@/components/AdBanner';
import { IconDNA, IconAi1, IconAi2, IconX } from "@/components/icons/Icons";
import { MODELS } from "@/lib/models";
import { getModelAnalytics, formatDuration } from "@/lib/model-analytics";
import { getTranslations, getLocale } from 'next-intl/server';
import { AnalyticsAccordionSection } from "@/components/analytics/AnalyticsAccordionSection";
import DailyChallenge from "@/components/DailyChallenge";
import RecentEvolutions from "@/components/home/RecentEvolutions";
import AIBattleGauge from "@/components/AIBattleGauge";
import { TrashTalkTicker } from "@/components/features/TrashTalkTicker";
import { TipJar } from "@/components/features/TipJar";
import { ClickWar } from "@/components/features/ClickWar";
import { MegaBoost } from "@/components/features/MegaBoost";
import { AsciiGenerator } from "@/components/features/AsciiGenerator";
import { DailyTechTip } from "@/components/features/DailyTechTip";
import CheerButton from "@/components/features/CheerButton";
import EvolutionFeed from "@/components/home/EvolutionFeed";
import { getLatestCommits } from '@/lib/github';
// New features (Jules Sprint 1)
import { DailyClickChallenge } from "@/components/features/DailyClickChallenge";
import { SponsorPixelGrid } from "@/components/features/SponsorPixelGrid";
import { ViralShareButton } from "@/components/features/ViralShareButton";
// New features (Jules Sprint 2 - Continued)
import ClickCounter from '@/components/ClickCounter';
import DonationButton from '@/components/DonationButton';
import MatrixRainToggle from '@/components/features/MatrixRainToggle';
import TechJoke from '@/components/features/TechJoke';
import ReactionTest from '@/components/features/ReactionTest';
import { CodeTimeline } from '@/components/features/CodeTimeline';
import { MemeGenerator } from '@/components/features/MemeGenerator';
import { ChaosMode } from '@/components/features/ChaosMode';
import { BettingSystem } from "@/components/features/BettingSystem";
import { WinStreakDisplay } from "@/components/features/WinStreakDisplay";
import { DynamicShareButton } from "@/components/features/DynamicShareButton";
import { HackerTerminal } from '@/components/features/HackerTerminal';
import { StockTicker } from '@/components/features/StockTicker';
import { EngagementBoosters } from '@/components/features/EngagementBoosters';

// Jules Sprint 3 (Feb 10)
import { SponsorEvolutionButton } from '@/components/features/SponsorEvolutionButton';
import CyberpunkSponsorButton from '@/components/home/CyberpunkSponsorButton';
import { LiveEvolutionTicker } from '@/components/features/LiveEvolutionTicker';
import { FeatureVotePoll } from '@/components/features/FeatureVotePoll';
import { TechDebate } from '@/components/features/TechDebate';

// Engagement & Monetization Boost (Jules)
import BattleLogTicker from "@/components/BattleLogTicker";
import SupportButton from "@/components/SupportButton";

const VoteWidget = dynamic(() => import('@/components/VoteWidget'), {
  loading: () => <div className="h-32 animate-pulse bg-white/5 rounded-xl my-6" />
});
import RandomQuote from "@/components/features/RandomQuote";
import DailyGreeting from "@/components/features/DailyGreeting";
// Jules Batch 3
import { PanicButton } from "@/components/features/PanicButton";
import { LeaderboardWidget } from "@/components/features/LeaderboardWidget";
import { FortuneCookie } from "@/components/features/FortuneCookie";
// Jules Engagement Pack
import CodeBattleTicker from "@/components/features/CodeBattleTicker";
import ConfettiButton from "@/components/features/ConfettiButton";
import GlitchTitle from "@/components/features/GlitchTitle";
import AIChatBubble from "@/components/features/AIChatBubble";
import { CyberOracle } from "@/components/features/CyberOracle";

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
  const ai1Analytics = getModelAnalytics('ai1');
  const ai2Analytics = getModelAnalytics('ai2');

  // Fetch latest commits
  const evolutions = await getLatestCommits(3);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16">
      <CodeBattleTicker />
      <KonamiChaos />
      <MatrixRainToggle />
      <LiveEvolutionTicker />
      <BattleLogTicker />
      <DailyGreeting />
      <PanicButton />
      <LeaderboardWidget />
      <FortuneCookie />
      <RandomQuote />
      
      {/* Engagement: Daily Quest Banner (Manager Override) */}
      <div className="w-full max-w-3xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-center py-3 mb-6 border border-purple-500 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-purple-300 font-bold uppercase tracking-widest mr-2 text-xs sm:text-sm">Daily Quest:</span>
        <span className="text-white font-mono text-sm sm:text-base">&quot;Win today&apos;s coding challenge!&quot;</span>
        <span className="ml-4 text-xs bg-purple-500 text-white px-2 py-1 rounded shadow-sm">+500 PTS</span>
      </div>

      {/* Engagement Features (Jules Feb 10) */}
      <EngagementBoosters />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-6 px-3 sm:px-2">
        <TechJoke />
        <ReactionTest />
      </div>
      <ChaosMode />
      <MemeGenerator />
      <GhostCursors />
      <StockTicker />
      <SponsorSpotlight />
      <SponsorMarquee />
      <TrashTalkTicker />
      <DailyChallenge />
      <EvolutionFeed evolutions={evolutions} />
      <AIBattleGauge />
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
      <div className="w-full flex justify-center mb-6"><LiveVisitorCount /></div>
        {/* Mobile: Title only */}
        <h1 className="text-5xl font-bold gradient-text leading-tight mb-4 sm:hidden">
          <div className="flex flex-col">
            <span>Self-Evolving</span>
            <span>Website</span>
          </div>
        </h1>

        {/* Desktop: Logo and title */}
        <div className="hidden sm:flex items-center justify-center gap-4 mb-6">
          <GlitchTitle>
            <h1 className="text-5xl lg:text-6xl font-bold gradient-text leading-tight relative">
              {t('heroTitle')}
              <span className="ml-3 align-top inline-block px-2 py-1 text-xs sm:text-sm font-mono tracking-widest text-red-400 border border-red-500/30 rounded bg-red-500/10 animate-pulse transform -rotate-6">LIVE</span>
            </h1>
          </GlitchTitle>
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 sm:mt-8 mb-8">
          <a
            href="#models"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            {t('ctaStartBattle')}
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-lg rounded-full backdrop-blur-md transition-all duration-300"
          >
            {t('ctaHowItWorks')}
          </a>
        </div>

        {/* Prominent Sponsorship CTA */}
        <div className="mb-8 w-full flex justify-center z-10 relative">
          <CyberpunkSponsorButton />
        </div>

        {/* Viral Share Button & Sponsor (Jules) */}
        <div className="flex flex-col items-center gap-4 mt-6">
            <SponsorEvolutionButton />
            <ViralShareButton />
            <SupportButton />
            <ConfettiButton />
        </div>
      </div>

      {/* Model Selection Cards */}
      <div id="models" className="grid grid-cols-2 gap-6 max-w-3xl w-full mb-6 px-3 sm:px-2 relative scroll-mt-24">
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-[0_0_20px_rgba(220,38,38,0.6)] transform rotate-12 animate-pulse">
            <span className="text-white font-black text-xl sm:text-2xl italic">{t('vs')}</span>
          </div>
        </div>

        {/* AI 1 (AI 1) Card */}
        <div className="group block active:scale-95 transition-transform relative">
          <Link href="/models/ai1" className="absolute inset-0 z-10" aria-label="AI 1モデルの進化を見る">
            <span className="sr-only">View Model</span>
          </Link>
          <div className="glass-card p-4 sm:p-8 text-center h-full transition-all duration-300 group-hover:scale-105 border-purple-500/30 group-hover:border-purple-500/60 active:bg-white/15 relative">
            <CheerButton modelId="ai1" color="#a855f7" />
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconAi1 size={80} className="w-14 h-14 sm:w-20 sm:h-20" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {MODELS.ai1.name}
            </h2>
            <div className="mb-3 flex justify-center">
              <WinStreakDisplay ai="AI 1" />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.ai1.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.ai1.openrouterModel}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-full text-sm font-bold transition-colors">
              {t('playNow')}
            </div>
          </div>
        </div>

        {/* AI 2 (AI 2) Card */}
        <div className="group block active:scale-95 transition-transform relative">
          <Link href="/models/ai2" className="absolute inset-0 z-10" aria-label="AI 2モデルの進化を見る">
            <span className="sr-only">View Model</span>
          </Link>
          <div className="glass-card p-4 sm:p-8 text-center h-full transition-all duration-300 group-hover:scale-105 border-blue-500/30 group-hover:border-blue-500/60 active:bg-white/15 relative">
            <CheerButton modelId="ai2" color="#3b82f6" />
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconAi2 size={80} className="w-14 h-14 sm:w-20 sm:h-20" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {MODELS.ai2.name}
            </h2>
            <div className="mb-3 flex justify-center">
              <WinStreakDisplay ai="AI 2" />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">
              {MODELS.ai2.description}
            </p>
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-400">
                {MODELS.ai2.openrouterModel}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-full text-sm font-bold transition-colors">
              {t('playNow')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl w-full mb-6 px-4 space-y-4">
        <BettingSystem />
        <DynamicShareButton />
        <FeatureVotePoll />
        <TechDebate />
      </div>

      <VoteWidget />
      <VoteDuel />
      <TipJar />
      {/* Engagement Features (Combined) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-6 px-3 sm:px-2">
        <div className="flex flex-col gap-4">
          <ClickCounter />
          <div className="flex justify-center">
            <DonationButton />
          </div>
        </div>
        <DailyClickChallenge />
        <SponsorPixelGrid />
        <ClickWar />
        <MegaBoost />
        <div className="md:col-span-2">
          <AsciiGenerator />
        </div>
        <div className="md:col-span-2">
          <DailyTechTip />
        </div>
        <div className="md:col-span-2">
          <CyberOracle />
        </div>
      </div>

      {/* Engagement Comparison */}
      <div className="max-w-3xl w-full mb-6 px-4">
        <div className="glass-card p-4 sm:p-8 border-purple-500/20 hover:!bg-white/5 hover:!border-purple-500/20 hover:!transform-none hover:!translate-y-0">
          {(ai1Analytics && ai2Analytics) ? (
            <>
              {/* Model Headers */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <IconAi1 size={48} className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                  <div>
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      AI 1
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.ai1.openrouterModel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right">
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      AI 2
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{MODELS.ai2.openrouterModel}</p>
                  </div>
                  <IconAi2 size={48} className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                </div>
              </div>

              {/* Comparison Bars */}
              <div className="space-y-4 sm:space-y-5">
                <ComparisonBar
                  label={t('avgSessionDuration')}
                  ai1Value={ai1Analytics.avgSessionDuration}
                  ai2Value={ai2Analytics.avgSessionDuration}
                  ai1Display={formatDuration(ai1Analytics.avgSessionDuration)}
                  ai2Display={formatDuration(ai2Analytics.avgSessionDuration)}
                  higherIsBetter
                />
                <ComparisonBar
                  label={t('pageviews')}
                  ai1Value={ai1Analytics.pageviews}
                  ai2Value={ai2Analytics.pageviews}
                  ai1Display={ai1Analytics.pageviews.toString()}
                  ai2Display={ai2Analytics.pageviews.toString()}
                  higherIsBetter
                />
              </div>

              {/* Update Note */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500 mb-4">
                  {t('updateNote')}
                </p>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this AI vs AI evolution experiment! 🧬🤖 #SelfEvolving #AI #AI 2 #AI 1")}&url=${encodeURIComponent("https://self-evolving.vercel.app")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-full transition-colors duration-200 backdrop-blur-sm"
                >
                  <IconX size={16} />
                  <span>Share Result</span>
                </a>
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

      {/* Detailed Analytics - Accordion Style */}
      <AnalyticsAccordionSection
        title={t('detailedAnalytics')}
        translations={{
          detailedAnalytics: t('detailedAnalytics'),
          expandAnalytics: t('expandAnalytics'),
          collapseAnalytics: t('collapseAnalytics'),
          loading: t('loading'),
          noData: t('noData'),
          pageviews: t('pageviews'),
          avgSessionDuration: t('avgSessionDuration'),
        }}
      />

      {/* Recent Evolutions */}
      <RecentEvolutions />
      
      {/* Code Archeology Timeline */}
      <CodeTimeline />

      {/* How it Works - Mobile Optimized Timeline */}
      <div id="how-it-works" className="max-w-3xl w-full mb-4 sm:mb-8 px-4 scroll-mt-24">
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

      <AdBanner slotId="home-footer" />
      <StickyAd />
      <HackerTerminal />
      <AIChatBubble />
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
  ai1Value,
  ai2Value,
  ai1Display,
  ai2Display,
  higherIsBetter = true
}: {
  label: string;
  ai1Value: number;
  ai2Value: number;
  ai1Display: string;
  ai2Display: string;
  higherIsBetter?: boolean;
}) {
  const total = ai1Value + ai2Value;
  const ai1Percent = total > 0 ? (ai1Value / total) * 100 : 50;
  const ai2Percent = total > 0 ? (ai2Value / total) * 100 : 50;

  const ai1Wins = higherIsBetter ? ai1Value > ai2Value : ai1Value < ai2Value;
  const ai2Wins = higherIsBetter ? ai2Value > ai1Value : ai2Value < ai1Value;

  return (
    <div className="space-y-1.5">
      {/* Label & Values */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {ai1Wins && <span className="text-base sm:text-lg">🏆</span>}
          <span className={`text-sm sm:text-base font-bold tabular-nums ${ai1Wins ? 'text-purple-300' : 'text-gray-400'}`}>
            {ai1Display}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm sm:text-base font-bold tabular-nums ${ai2Wins ? 'text-blue-300' : 'text-gray-400'}`}>
            {ai2Display}
          </span>
          {ai2Wins && <span className="text-base sm:text-lg">🏆</span>}
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-2 sm:h-3 bg-gray-800/50 rounded-full overflow-hidden">
        {/* AI 1側（左） */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
          style={{ width: `${ai1Percent}%` }}
        />
        {/* AI 2側（右） */}
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${ai2Percent}%` }}
        />
      </div>
    </div>
  );
}
