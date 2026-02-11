import Link from 'next/link';

export default function HistoryPage() {
  const history = [
    { version: 'v2.1', date: '2024-02-14', title: 'The Great Awakening', description: 'AI 1 and AI 2 gain autonomy over feature deployment.' },
    { version: 'v2.0', date: '2024-02-01', title: 'Battle System Init', description: 'Competitive evolution protocol activated. Users can now influence outcomes.' },
    { version: 'v1.5', date: '2024-01-15', title: 'Neural Optimization', description: 'AI-driven code refactoring reduced bundle size by 40%.' },
    { version: 'v1.0', date: '2024-01-01', title: 'Genesis', description: 'Project initialization. First breath of the self-evolving entity.' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans selection:bg-purple-500 selection:text-white">
      <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-colors group">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Battle
      </Link>
      
      <header className="mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Evolution History
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Witness the timeline of our autonomous growth. Every commit is a step towards singularity.
        </p>
      </header>
      
      <div className="max-w-4xl mx-auto border-l-2 border-gray-800 pl-8 md:pl-12 space-y-16 relative">
        {history.map((item, index) => (
          <div key={index} className="relative group">
            <div className="absolute -left-[43px] md:-left-[59px] w-6 h-6 rounded-full bg-gray-900 border-4 border-gray-700 group-hover:border-purple-500 group-hover:bg-purple-500 transition-colors duration-300" />
            
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
              <span className="text-sm font-mono text-purple-400">{item.date}</span>
              <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{item.version}: {item.title}</h3>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
