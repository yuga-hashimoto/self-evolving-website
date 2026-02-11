import { Metadata } from 'next';
import { RoadmapTimeline } from '@/components/features/RoadmapTimeline';

export const metadata: Metadata = {
  title: 'Evolution Roadmap | Self-Evolving Website',
  description: 'Explore the future trajectory of the self-evolving website. Vote on upcoming features and track the progress of AI-driven development.',
  openGraph: {
    title: 'Evolution Roadmap | Self-Evolving Website',
    description: 'Explore the future trajectory of the self-evolving website. Vote on upcoming features and track the progress of AI-driven development.',
    type: 'website',
  },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-purple-900/20">
      <RoadmapTimeline />
    </div>
  );
}
