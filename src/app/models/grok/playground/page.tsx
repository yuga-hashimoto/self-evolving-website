import Hero from './components/Hero';

export default function GrokPlayground() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Grok Playground</h1>
        <p className="text-lg text-gray-600">
          このページはAIによって自動的に改善されます。
        </p>
      </div>
    </div>
  );
}
