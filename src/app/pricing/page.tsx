"use client";

import { Check, X, Crown } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const handleCheckout = () => {
    alert("This is a fake checkout button, but your spirit is appreciated! 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-20 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Unlock Pro Features
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 w-full">
        {/* Free Plan */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-gray-300">Basic</h2>
          <p className="text-gray-400 mb-6">Start your coding journey.</p>
          <div className="text-4xl font-bold mb-6">$0<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 mr-3 text-green-400" />
              Access to Free Evolutions
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 mr-3 text-green-400" />
              Basic AI Code Snippets
            </li>
            <li className="flex items-center text-gray-300">
              <Check className="w-5 h-5 mr-3 text-green-400" />
              Community Support
            </li>
            <li className="flex items-center text-gray-500">
              <X className="w-5 h-5 mr-3" />
              AI Pair Programming
            </li>
             <li className="flex items-center text-gray-500">
              <X className="w-5 h-5 mr-3" />
              Advanced Analytics
            </li>
          </ul>
          <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-70">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-purple-500 relative transform hover:scale-105 transition-transform duration-300 flex flex-col">
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            MOST POPULAR
          </div>
          <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
            Pro <Crown className="w-5 h-5 ml-2 text-yellow-500" />
          </h2>
          <p className="text-gray-400 mb-6">Accelerate your learning.</p>
          <div className="text-4xl font-bold mb-6">$10<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-white">
              <Check className="w-5 h-5 mr-3 text-purple-400" />
              Unlimited Evolutions
            </li>
            <li className="flex items-center text-white">
              <Check className="w-5 h-5 mr-3 text-purple-400" />
              AI Pair Programming
            </li>
            <li className="flex items-center text-white">
              <Check className="w-5 h-5 mr-3 text-purple-400" />
              Priority Support
            </li>
            <li className="flex items-center text-white">
              <Check className="w-5 h-5 mr-3 text-purple-400" />
              Advanced Code Analytics
            </li>
            <li className="flex items-center text-white">
              <Check className="w-5 h-5 mr-3 text-purple-400" />
              Early Access to New Features
            </li>
          </ul>
          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          Compare Features
        </h3>
        <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="p-4 text-gray-300 font-semibold w-1/2">Feature</th>
                <th className="p-4 text-gray-300 font-semibold text-center w-1/4">Basic</th>
                <th className="p-4 text-purple-400 font-semibold text-center w-1/4">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">Daily Evolutions</td>
                <td className="p-4 text-center text-gray-400">Limited (3/day)</td>
                <td className="p-4 text-center text-white font-medium">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">AI Code Generation</td>
                <td className="p-4 text-center text-gray-400">Standard Model</td>
                <td className="p-4 text-center text-white font-medium">Premium Model (GPT-4/Claude 3.5)</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">Analytics History</td>
                <td className="p-4 text-center text-gray-400">7 Days</td>
                <td className="p-4 text-center text-white font-medium">Lifetime</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">Support Response</td>
                <td className="p-4 text-center text-gray-400">Community</td>
                <td className="p-4 text-center text-white font-medium">Priority (&lt; 24h)</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">Custom Themes</td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-gray-600 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="p-4 text-gray-300">API Access</td>
                <td className="p-4 text-center">
                  <X className="w-5 h-5 text-gray-600 mx-auto" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-12 mb-8">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center">
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
