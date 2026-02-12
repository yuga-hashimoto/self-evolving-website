'use client';

import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { IconAnalytics } from '@/components/icons/Icons';
import { AdBanner } from '@/components/AdBanner';
import { DailyQuestWidget } from '@/components/features/DailyQuestWidget';
import { AIPredictionCard } from '@/components/features/AIPredictionCard';
import { SponsorUnlockData } from '@/components/features/SponsorUnlockData';
import { useUserStats } from "@/components/features/UserStatsProvider";
import { ACHIEVEMENTS } from "@/lib/achievements";
import * as LucideIcons from "lucide-react";
import { User, Trophy, Leaf } from "lucide-react";

const dummyData = [
  { name: 'Sprint 1', ai1: 120, ai2: 110, commits: 5 },
  { name: 'Sprint 2', ai1: 230, ai2: 250, commits: 12 },
  { name: 'Sprint 3', ai1: 350, ai2: 320, commits: 8 },
  { name: 'Sprint 4', ai1: 480, ai2: 510, commits: 15 },
  { name: 'Sprint 5', ai1: 620, ai2: 590, commits: 20 },
  { name: 'Current', ai1: 780, ai2: 810, commits: 25 },
];

export default function DashboardPage() {
  const { stats, unlockAchievement } = useUserStats();

  useEffect(() => {
    unlockAchievement('self_aware');
  }, [unlockAchievement]);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          Evolution Dashboard
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Visualize the ongoing battle between AI 1 and AI 2 as they evolve this website.
        </p>
      </div>

      {/* User Stats Section */}
      <div className="mb-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <User className="text-pink-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                Your Contribution
            </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="glass-card p-6 border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Leaf className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-gray-400 text-xs uppercase tracking-wider">Carbon Conscious</p>
                <p className="text-3xl font-bold text-white tabular-nums">{stats.co2.toFixed(3)}g</p>
                <p className="text-[10px] text-gray-500">CO2 Tracked</p>
            </div>

            <div className="glass-card p-6 border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="text-gray-400 text-xs uppercase tracking-wider">Achievements</p>
                <p className="text-3xl font-bold text-white tabular-nums">
                    {stats.unlockedAchievements.length} <span className="text-base text-gray-500 font-normal">/ {ACHIEVEMENTS.length}</span>
                </p>
                <p className="text-[10px] text-gray-500">Unlocked</p>
            </div>

             <div className="glass-card p-6 border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <LucideIcons.Footprints className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-gray-400 text-xs uppercase tracking-wider">Exploration</p>
                <p className="text-3xl font-bold text-white tabular-nums">{stats.visits}</p>
                <p className="text-[10px] text-gray-500">Page Visits</p>
            </div>

             <div className="glass-card p-6 border-pink-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <LucideIcons.Activity className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                <p className="text-xl font-bold text-white">
                    {stats.unlockedAchievements.length >= 5 ? 'Legend' : stats.unlockedAchievements.length >= 2 ? 'Contributor' : 'Observer'}
                </p>
                <p className="text-[10px] text-gray-500">Rank</p>
            </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Achievements Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = stats.unlockedAchievements.includes(achievement.id);
                    const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Trophy;

                    return (
                        <div
                            key={achievement.id}
                            className={`
                                relative glass-card p-4 flex flex-col items-center text-center gap-2 transition-all duration-300
                                ${isUnlocked
                                    ? 'border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:-translate-y-1'
                                    : 'border-white/5 opacity-40 grayscale hover:opacity-60'
                                }
                            `}
                        >
                            <div className={`
                                p-3 rounded-full transition-transform duration-500
                                ${isUnlocked ? 'bg-yellow-500/20 text-yellow-400 group-hover:rotate-12' : 'bg-white/5 text-gray-500'}
                            `}>
                                <IconComponent size={24} />
                            </div>
                            <div>
                                <p className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                    {achievement.title}
                                </p>
                                <p className="text-[10px] text-gray-500 leading-tight mt-1 line-clamp-2">
                                    {achievement.description}
                                </p>
                            </div>
                            {isUnlocked && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_5px_#eab308]" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
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
                <Line type="monotone" dataKey="ai1" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 8 }} name="AI 1 (LOC)" />
                <Line type="monotone" dataKey="ai2" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="AI 2 (LOC)" />
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
        <SponsorUnlockData />
        
        <AIPredictionCard />
      </div>

      <AdBanner slotId="dashboard-footer" />
    </div>
  );
}
