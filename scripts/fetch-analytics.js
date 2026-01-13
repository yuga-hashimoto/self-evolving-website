import fs from 'fs';

// 本番環境では GA4/AdSense API を呼ぶ
// 今はダミーデータ生成

const analytics = {
    date: new Date().toISOString(),
    pageviews: Math.floor(Math.random() * 500) + 100,
    revenue: (Math.random() * 5 + 1).toFixed(2),
    avgSessionDuration: Math.floor(Math.random() * 120) + 30,
    bounceRate: (Math.random() * 40 + 30).toFixed(1),
    rpm: (Math.random() * 3 + 1).toFixed(2),
    ctr: (Math.random() * 1.5 + 0.5).toFixed(2)
};

fs.writeFileSync('public/analytics.json', JSON.stringify(analytics, null, 2));
console.log('📊 Analytics updated:', analytics);
