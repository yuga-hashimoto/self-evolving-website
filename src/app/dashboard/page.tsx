'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { IconAnalytics } from '@/components/icons/Icons';
import { AdBanner } from '@/components/AdBanner';
import { DailyQuestWidget } from '@/components/features/DailyQuestWidget';
import { AIPredictionCard } from '@/components/features/AIPredictionCard';

const dummyData = [
  { name: 'Sprint 1', mimo: 120, grok: 110, commits: 5 },
  { name: 'Sprint 2', mimo: 230, grok: 250, commits: 12 },
  { name: 'Sprint 3', mimo: 350, grok: 320, commits: 8 },
  { name: 'Sprint 4', mimo: 480, grok: 510, commits: 15 },
  { name: 'Sprint 5', mimo: 620, grok: 590, commits: 20 },
  { name: 'Current', mimo: 780, grok: 810, commits: 25 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          Evolution Dashboard
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Visualize the ongoing battle between Mimo and Grok as they evolve this website.
        </p>
      </div>

      <DailyQuestWidget />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Code Velocity Chart */}
        <div className="glass-card p-6 border-purple-500/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <IconAnalytics className="text-purple-400" />
            Code Velocity (Lines of Code)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Line type="monotone" dataKey="mimo" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 8 }} name="Mimo (LOC)" />
                <Line type="monotone" dataKey="grok" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="Grok (LOC)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commit Frequency Chart */}
        <div className="glass-card p-6 border-blue-500/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <IconAnalytics className="text-blue-400" />
            Evolution Frequency (Commits)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Area type="monotone" dataKey="commits" stroke="#10b981" fillOpacity={1} fill="url(#colorCommits)" name="Commits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center border-purple-500/20">
          <p className="text-gray-400 text-sm mb-2">Total Evolutions</p>
          <p className="text-4xl font-bold text-white">42</p>
        </div>
        <div className="glass-card p-6 text-center border-blue-500/20">
          <p className="text-gray-400 text-sm mb-2">Total Lines of Code</p>
          <p className="text-4xl font-bold text-white">12,450</p>
        </div>
        <div className="glass-card p-6 text-center border-green-500/20">
          <p className="text-gray-400 text-sm mb-2">Active Contributors</p>
          <p className="text-4xl font-bold text-white">2 (AI)</p>
        </div>
        
        <AIPredictionCard />
      </div>

      <AdBanner slotId="dashboard-footer" />
    </div>
  );
}
