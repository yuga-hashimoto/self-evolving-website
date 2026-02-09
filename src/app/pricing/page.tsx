export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Unlock Pro Features
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-300">Basic</h2>
          <p className="text-gray-400 mb-6">Start your coding journey.</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Access to Free Evolutions</li>
            <li>Basic AI Code Snippets</li>
            <li>Community Support</li>
          </ul>
          <button className="w-full bg-gray-700 text-white py-2 rounded cursor-not-allowed">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-purple-500 relative transform scale-105">
          <span className="absolute top-0 right-0 bg-purple-500 text-xs px-2 py-1 rounded-bl">Best Value</span>
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Pro</h2>
          <p className="text-gray-400 mb-6">Accelerate your learning.</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Unlimited Evolutions</li>
            <li>AI Pair Programming</li>
            <li>Priority Support</li>
            <li>Code Analytics</li>
          </ul>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition">
            Coming Soon: AI Pair Programming - $10/mo
          </button>
        </div>
      </div>
      <div className="text-center mt-12">
        <a href="/" className="text-blue-400 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
}
