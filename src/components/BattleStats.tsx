'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'AI 1', wins: 42, color: '#a855f7' }, // Purple
  { name: 'AI 2', wins: 38, color: '#3b82f6' }, // Blue
];

export default function BattleStats() {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Battle Statistics
          </span>
        </h3>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#9ca3af', fontSize: 14, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="wins" radius={[0, 4, 4, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 font-mono">
          Total Battles: {data.reduce((acc, curr) => acc + curr.wins, 0)}
        </div>
      </div>
    </div>
  );
}
