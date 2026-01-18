import { NextResponse } from 'next/server';

// Node.js Runtime
export const runtime = 'nodejs';

// Simple memory-based cache for rate limiting
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 1; // 1 request per second

// Total request count limit per server session (local dev server startup)
let totalRequestCount = 0;
const MAX_TOTAL_REQUESTS = 20; // Maximum 20 searches per process lifetime

function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove old timestamps outside the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }

  // Check rate limit
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  // Record new request
  requestTimestamps.push(now);
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const full = searchParams.get('full') !== 'false'; // Default to full-text retrieval (disable with full=false)

  // Validation
  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  // Query length check (DDoS protection)
  if (query.length > 500) {
    return NextResponse.json({ error: 'Query too long (max 500 characters)' }, { status: 400 });
  }

  // Rate limit check
  if (!checkRateLimit()) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making another request.' },
      { status: 429 }
    );
  }

  // Total request count check
  if (totalRequestCount >= MAX_TOTAL_REQUESTS) {
    return NextResponse.json(
      {
        error: `Maximum search limit reached (${MAX_TOTAL_REQUESTS} searches per server session). Please restart the dev server to reset.`,
        totalRequests: totalRequestCount,
        maxRequests: MAX_TOTAL_REQUESTS
      },
      { status: 429 }
    );
  }

  // Increment request count
  totalRequestCount++;

  // API key check
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.error('SERPER_API_KEY is not set');
    return NextResponse.json(
      { error: 'Search service is not configured' },
      { status: 500 }
    );
  }

  try {
    // Use Serper API for Google Search
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 5, // Top 5 results
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Format results
    const results = (data.organic || []).slice(0, 5).map((item: { title: string; snippet: string; link: string }) => ({
      title: item.title,
      description: item.snippet,
      url: item.link,
    }));

    // If full=true, fetch full content of the first result using Jina Reader
    let fullContent = null;
    if (full && results.length > 0) {
      try {
        const topUrl = results[0].url;
        const jinaUrl = `https://r.jina.ai/${topUrl}`;
        const jinaResponse = await fetch(jinaUrl, {
          headers: {
            'Accept': 'text/plain',
          },
        });

        if (jinaResponse.ok) {
          fullContent = await jinaResponse.text();
        }
      } catch (error) {
        console.error('Jina Reader error:', error);
        // Return search results even if fullContent fails
      }
    }

    return NextResponse.json({
      query,
      results,
      ...(fullContent && { fullContent }), // Include fullContent only if available
      searchStats: {
        totalRequests: totalRequestCount,
        remainingRequests: MAX_TOTAL_REQUESTS - totalRequestCount,
        maxRequests: MAX_TOTAL_REQUESTS
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        error: 'Search failed. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
