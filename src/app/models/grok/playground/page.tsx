import { Hero } from './components/Hero';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { ChatDemo } from './components/ChatDemo';
import { MainCTA } from './components/MainCTA';

export default function GrokPlayground() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesShowcase />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See Grok in Action
          </h2>
          <p className="text-gray-600">
            Experience our interactive demo below
          </p>
        </div>
        <ChatDemo />
      </div>
      <MainCTA />
    </div>
  );
}
