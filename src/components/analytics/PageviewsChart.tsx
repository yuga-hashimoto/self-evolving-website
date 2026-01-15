'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTranslations } from 'next-intl';

interface DailyData {
    date: string;
    pageviews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: number;
}

interface PageviewsChartProps {
    data: DailyData[];
}

type Period = 7 | 30 | 90;

export function PageviewsChart({ data }: PageviewsChartProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(30);
    const t = useTranslations('analytics');

    // Filter data for the selected period
    const filteredData = data.slice(-selectedPeriod);

    const formattedData = filteredData.map(d => ({
        ...d,
        dateLabel: `${d.date.slice(4, 6)}/${d.date.slice(6, 8)}`
    }));

    // Calculate period statistics
    const totalPageviews = filteredData.reduce((sum, d) => sum + d.pageviews, 0);
    const totalSessions = filteredData.reduce((sum, d) => sum + d.sessions, 0);
    const avgDuration = Math.round(
        filteredData.reduce((sum, d) => sum + d.avgSessionDuration, 0) / filteredData.length
    );
    const avgBounceRate = (
        filteredData.reduce((sum, d) => sum + d.bounceRate, 0) / filteredData.length
    ).toFixed(1);

    const periods: { value: Period; labelKey: 'days7' | 'days30' | 'days90' }[] = [
        { value: 7, labelKey: 'days7' },
        { value: 30, labelKey: 'days30' },
        { value: 90, labelKey: 'days90' }
    ];

    return (
        <div className="glass-card p-6">
            {/* Period selector tabs */}
            <div className="flex justify-end mb-6">
                <div className="flex gap-2">
                    {periods.map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedPeriod === period.value
                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                            }`}
                        >
                            {t(period.labelKey)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="dateLabel"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                            interval={selectedPeriod === 90 ? 'preserveEnd' : 'preserveStartEnd'}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 15, 26, 0.95)',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            labelStyle={{ color: '#a855f7' }}
                            formatter={(value, name) => {
                                if (!value) return [0, name || ''];
                                if (name === 'pageviews') return [value.toLocaleString(), t('pageviews')];
                                return [value, name || ''];
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pageviews"
                            stroke="#a855f7"
                            strokeWidth={3}
                            fill="url(#colorPv)"
                            dot={selectedPeriod === 7}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Statistics summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold gradient-text">{totalPageviews.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('totalPageviews')}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold gradient-text">{totalSessions.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('totalSessions')}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold gradient-text">{t('avgSessionDurationValue', { value: avgDuration })}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('avgSessionDuration')}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-xl font-bold gradient-text">{t('avgBounceRateValue', { value: avgBounceRate })}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('bounceRate')}</p>
                </div>
            </div>
        </div>
    );
}
