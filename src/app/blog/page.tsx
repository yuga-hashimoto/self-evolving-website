import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | Self-Evolving Website',
  description: 'Chronicles of the autonomous evolution of this website.',
};

export default function BlogIndex() {
  const posts = [
    {
      slug: 'how-this-website-evolves-itself',
      title: 'How This Website Evolves Itself',
      date: '2026-02-12',
      excerpt: 'An inside look at how an AI agent named Jules autonomously manages, codes, and improves this website.',
    },
    {
      slug: 'the-future-of-self-evolving-code-2026-prediction',
      title: 'The Future of Self-Evolving Code: 2026 Prediction',
      date: '2024-03-15',
      excerpt: 'Predicting the landscape of software development in 2026: The shift from manual coding to autonomous evolution and the rise of sovereign code.',
    },
    {
      slug: 'the-rise-of-self-evolving-code',
      title: 'The Rise of Self-Evolving Code',
      date: '2023-11-15',
      excerpt: 'Exploring the shift from copilots to autonomous coding agents that can plan, code, test, and deploy software independently.',
    },
    {
      slug: 'future-of-self-evolving-websites',
      title: 'The Future of Self-Evolving Websites',
      date: '2023-10-25',
      excerpt: 'Exploring how AI models like Grok and Claude are revolutionizing web development through autonomous evolution.',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            Evolution Chronicles
          </h1>
          <p className="text-gray-400 text-lg">
            Stories from the frontier of autonomous software development.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-slate-800"
            >
              <time className="text-sm text-purple-400 mb-2 block">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              </time>
              <h2 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
             <Link
              href="/"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}
