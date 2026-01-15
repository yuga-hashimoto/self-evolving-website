"use client";

import { useState, useEffect } from "react";
import { IconTarget, IconRocket, IconBrain, IconCodeSpark, IconCelebration } from "../../../../../components/icons/Icons";

interface Feature {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ComponentType<any>;
  color: string;
}

const features: Feature[] = [
  {
    id: 'truthfulness',
    title: 'Maximum Truthfulness',
    description: 'Honest answers without corporate BS',
    progress: 95,
    icon: IconTarget,
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'speed',
    title: 'Lightning Fast',
    description: 'Get answers in milliseconds',
    progress: 99,
    icon: IconRocket,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'knowledge',
    title: 'Deep Learning',
    description: 'Trained on vast knowledge base',
    progress: 92,
    icon: IconBrain,
    color: 'from-blue-400 to-purple-500'
  },
  {
    id: 'creativity',
    title: 'Creative Thinking',
    description: 'Helps solve complex problems',
    progress: 88,
    icon: IconCodeSpark,
    color: 'from-pink-400 to-rose-500'
  }
];

export function FeaturesShowcase() {
  const [progressValues, setProgressValues] = useState<Record<string, number>>({});
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useEffect(() => {
    // Animate progress bars on load
    const timers = features.map(feature => {
      return setTimeout(() => {
        setProgressValues(prev => ({
          ...prev,
          [feature.id]: feature.progress
        }));
      }, Math.random() * 1000 + 500); // Stagger animations
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Grok?
          </h2>
          <p className="text-xl text-gray-600">
            Built by xAI for maximum truth, speed, and usefulness
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                hoveredFeature === feature.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} mr-4 transform transition-transform duration-300 ${hoveredFeature === feature.id ? 'rotate-12 scale-110' : ''}`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Score</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium inline-block py-1 px-2 uppercase rounded-full ${
                      progressValues[feature.id] === 0 ? 'text-gray-600 bg-gray-200' :
                      `text-white bg-gradient-to-r ${feature.color}`
                    }`}>
                      {progressValues[feature.id] || 0}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${progressValues[feature.id] || 0}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${feature.color} transition-all duration-1000 ease-out`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action in showcase */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <IconCelebration size={48} className="mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-4">
            Ready to experience Grok's capabilities?
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Join thousands already using Grok for work, learning, and fun
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}