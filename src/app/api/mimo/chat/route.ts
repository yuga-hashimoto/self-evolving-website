import { NextResponse } from 'next/server';

// Manual validation (replacing zod to avoid dependency issues)
interface ChatRequest {
  message: string;
  context?: string[];
  sessionId?: string;
}

function validateRequest(body: any): { valid: boolean; errors: string[]; data?: ChatRequest } {
  const errors: string[] = [];

  // Check message
  if (!body.message || typeof body.message !== 'string') {
    errors.push("Message is required and must be a string");
  } else if (body.message.trim().length === 0) {
    errors.push("Message cannot be empty");
  } else if (body.message.length > 1000) {
    errors.push("Message too long (max 1000 characters)");
  }

  // Check optional context
  if (body.context !== undefined) {
    if (!Array.isArray(body.context)) {
      errors.push("Context must be an array");
    } else if (!body.context.every((item: unknown) => typeof item === 'string')) {
      errors.push("Context array must contain only strings");
    }
  }

  // Check optional sessionId
  if (body.sessionId !== undefined) {
    if (typeof body.sessionId !== 'string') {
      errors.push("SessionId must be a string");
    }
    // Simple UUID check (not strict, just format check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (body.sessionId && !uuidRegex.test(body.sessionId)) {
      errors.push("SessionId must be a valid UUID format");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      message: body.message.trim(),
      context: body.context || [],
      sessionId: body.sessionId
    }
  };
}

// Mock AI responses for demo purposes
// In production, this would call an actual LLM API
const generateAIResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();

  // Intent-based responses
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('こんにちは')) {
    return "こんにちは！MiMoです。今日はどんなお手伝いができればいいですか？";
  }

  if (lowerMsg.includes('code') || lowerMsg.includes('コード') || lowerMsg.includes('programming')) {
    return "```javascript\n// MiMoが生成したコード\nfunction greet(name) {\n  return `Hello ${name}! Welcome to the future.`;\n}\n\n// 使用例\nconsole.log(greet('Developer'));\n```\n\n上記のコードを自由にカスタマイズしてください！";
  }

  if (lowerMsg.includes('react') || lowerMsg.includes('next.js')) {
    return "React/Next.jsについてですね！\n\n🎯 **重要ポイント**:\n1. コンポーネントベース設計\n2. 状態管理（useState, useReducer）\n3. データ取得（fetch, SWR）\n\n```tsx\nexport default function MyComponent() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n```\n\nこれをベースにさらに発展させましょう！";
  }

  if (lowerMsg.includes('ai') || lowerMsg.includes('aiエンジニア')) {
    return "AIエンジニアへの道、素晴らしい選択です！🚀\n\n📚 **学習ロードマップ**:\n1. Python基礎\n2. 機械学習（scikit-learn）\n3. 深層学習（PyTorch/TensorFlow）\n4. LLM・Transformer\n5. MLOps\n\n毎日少しずつ、実践的なプロジェクトを積み重ねましょう！";
  }

  if (lowerMsg.includes('help') || lowerMsg.includes('てつだって')) {
    return "お困りのようですね。具体的な状況を教えてください。\n\n💡 以下の情報があると助かります:\n- 何をしたいか\n- どんな技術を使いたか\n- 遇っているエラー\n\n一緒に解決策を考えましょう！";
  }

  // Default helpful response
  return `「${message}」についてですね！\n\nそれについて詳しくお話しします。\n\nまず、基本的なアプローチとして:\n1. 要件を明確にする\n2. 小さな単位で実装する\n3. テストしながら進める\n\nこのアプローチで進めてみましょう！質問があれば、いつでもどうぞ。`;
};

export async function POST(request: Request) {
  try {
    // Parse request
    const body = await request.json();

    // Validate
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          details: validation.errors
        },
        { status: 400 }
      );
    }

    const { message } = validation.data!;

    // Simulate processing delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate response
    const aiResponse = generateAIResponse(message);

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString(),
        usage: {
          characters: message.length,
          responseCharacters: aiResponse.length
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Chat API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to process your request. Please try again."
      },
      { status: 500 }
    );
  }
}

// GET endpoint for rate limiting info or health check
export async function GET() {
  return NextResponse.json(
    {
      service: "MiMo Chat API",
      status: "operational",
      version: "1.0.0",
      rateLimit: {
        requestsPerMinute: 30,
        charactersPerRequest: 1000
      }
    },
    { status: 200 }
  );
}