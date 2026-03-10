import { NextResponse } from 'next/server';

// In-memory search history (would be database in production)
let searchHistory: Array<{
  id: string;
  query: string;
  type: 'text' | 'tag' | 'date' | 'advanced';
  timestamp: string;
  resultsCount: number;
}> = [];

// Helper to generate ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// GET - Retrieve search history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const type = searchParams.get('type');

  let filtered = searchHistory;
  if (type) {
    filtered = filtered.filter((h) => h.type === type);
  }

  const limited = filtered.slice(0, limit);

  // Get popular searches
  const queryCounts: Record<string, number> = {};
  searchHistory.forEach((h) => {
    queryCounts[h.query] = (queryCounts[h.query] || 0) + 1;
  });

  const popularSearches = Object.entries(queryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  // Get recent unique searches
  const recentUnique: string[] = [];
  for (const h of searchHistory) {
    if (!recentUnique.includes(h.query)) {
      recentUnique.push(h.query);
    }
    if (recentUnique.length >= 10) break;
  }

  return NextResponse.json({
    success: true,
    data: {
      history: limited,
      popular: popularSearches,
      recentUnique,
    },
    meta: {
      total: searchHistory.length,
      limit,
    },
  });
}

// POST - Add search to history
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, type = 'text', resultsCount = 0 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    // Don't save empty or too short queries
    if (query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        message: 'Query too short, not saved to history',
      });
    }

    const entry = {
      id: generateId(),
      query: query.trim(),
      type: type as 'text' | 'tag' | 'date' | 'advanced',
      timestamp: new Date().toISOString(),
      resultsCount,
    };

    // Keep only last 100 entries
    searchHistory = [entry, ...searchHistory].slice(0, 100);

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE - Clear search history
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    // Delete specific entry
    searchHistory = searchHistory.filter((h) => h.id !== id);
    return NextResponse.json({
      success: true,
      message: 'Search entry deleted',
    });
  }

  // Clear all history
  searchHistory = [];
  return NextResponse.json({
    success: true,
    message: 'All search history cleared',
  });
}