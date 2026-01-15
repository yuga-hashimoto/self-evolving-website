import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストの検証スキーマ
const GameEventSchema = z.object({
  type: z.string().min(1).max(50),
  data: z.any().optional(),
  timestamp: z.number().optional(),
});

const PostRequestSchema = z.object({
  events: z.array(GameEventSchema).min(1).max(50),
  sessionId: z.string().min(1).max(100),
});

export const runtime = 'edge';

// POST: ゲームイベントを保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = PostRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { events, sessionId } = parsed.data;

    // イベントを整形
    const processedEvents = events.map((event) => ({
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId,
    }));

    // 簡易的な保存（実際のプロダクションではデータベースを使用）
    // ここではResponseとして返すだけ（デモ用）
    return NextResponse.json(
      {
        success: true,
        received: processedEvents.length,
        events: processedEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Game events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: ゲーム統計を取得（デバッグ用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'summary') {
      // ローカルストレージから統計を取得
      // 注意: サーバーサイドではlocalStorageはアクセスできない
      // これはデモ用のAPI設計

      return NextResponse.json(
        {
          message: 'Analytics data is available client-side',
          hint: 'Use the analytics library at /lib/analytics.ts',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Game stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}