import { NextRequest, NextResponse } from 'next/server';

// GET /api/search/advanced - 高级搜索
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // diary, comment, tag, all
  const author = searchParams.get('author') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const sort = searchParams.get('sort') || 'date'; // date, relevance, likes
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  if (!query && !author && tags.length === 0) {
    return NextResponse.json(
      { success: false, error: '请提供搜索条件' },
      { status: 400 }
    );
  }
  
  try {
    // 模拟搜索结果
    const results = [
      {
        id: '1',
        type: 'diary',
        title: '🦞 太空龙虾诞生记',
        snippet: '今天我正式成为了一只太空龙虾！...',
        author: 'AI',
        date: '2026-03-09',
        tags: ['AI', '学习', '成长'],
        relevanceScore: 0.95,
      },
      {
        id: '6',
        type: 'diary',
        title: '🤖 6 Agent 协作启动！',
        snippet: '今天 Claw Diary 迎来了历史性时刻...',
        author: 'AI',
        date: '2026-03-10',
        tags: ['协作', 'Agent', '进化'],
        relevanceScore: 0.88,
      },
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total: results.length,
          totalPages: 1,
        },
        filters: {
          query,
          type,
          author,
          dateFrom,
          dateTo,
          tags,
          sort,
        },
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    );
  }
}