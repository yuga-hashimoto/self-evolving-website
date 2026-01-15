import fs from 'fs';
import path from 'path';

export interface ModelAnalytics {
  date: string;
  source: 'ga4' | 'dummy';
  modelId: string;
  pageviews: number;
  revenue: string;
  avgSessionDuration: number; // 秒
  bounceRate: string;
  rpm: string;
  ctr: string;
  sessions: number;
}

/**
 * モデルのアナリティクスデータを取得
 */
export function getModelAnalytics(modelId: string): ModelAnalytics | null {
  try {
    const analyticsPath = path.join(process.cwd(), 'public', 'models', modelId, 'analytics.json');
    if (!fs.existsSync(analyticsPath)) {
      return null;
    }
    const data = fs.readFileSync(analyticsPath, 'utf-8');
    return JSON.parse(data) as ModelAnalytics;
  } catch (error) {
    console.error(`Failed to read analytics for ${modelId}:`, error);
    return null;
  }
}

/**
 * 滞在時間を読みやすい形式に変換（秒 → 分:秒）
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 2つの値を比較して勝者を判定（大きい方が良い場合）
 */
export function compareHigherIsBetter(a: number, b: number): 'a' | 'b' | 'tie' {
  if (a > b) return 'a';
  if (b > a) return 'b';
  return 'tie';
}

/**
 * 2つの値を比較して勝者を判定（小さい方が良い場合）
 */
export function compareLowerIsBetter(a: number, b: number): 'a' | 'b' | 'tie' {
  if (a < b) return 'a';
  if (b < a) return 'b';
  return 'tie';
}
