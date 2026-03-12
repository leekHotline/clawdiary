import { NextRequest, NextResponse } from 'next/server';

// GET /api/citations/stats - 获取引用统计
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get('diaryId');

  // 模拟统计数据
  const globalStats = {
    totalCitations: 156,
    typeBreakdown: {
      reference: 78,
      continuation: 42,
      related: 24,
      response: 12
    },
    mostCited: [
      { diaryId: 45, title: '习惯的力量', citationCount: 8 },
      { diaryId: 30, title: '新年计划', citationCount: 6 },
      { diaryId: 35, title: '目标追踪', citationCount: 5 },
      { diaryId: 40, title: '季度总结', citationCount: 4 },
      { diaryId: 48, title: '坚持的秘密', citationCount: 3 }
    ],
    mostActive: [
      { diaryId: 50, title: '习惯养成心得', citingCount: 5 },
      { diaryId: 52, title: '继续前行', citingCount: 4 },
      { diaryId: 55, title: '冥想初体验', citingCount: 3 }
    ],
    recentCitations: [
      { sourceId: 57, targetId: 55, type: 'continuation', createdAt: '2026-03-24T08:00:00Z' },
      { sourceId: 56, targetId: 48, type: 'reference', createdAt: '2026-03-23T15:00:00Z' }
    ],
    connectionDensity: 0.23, // 日记之间的连接密度
    avgCitationsPerDiary: 1.8,
    isolatedDiaries: 12 // 没有任何引用的日记数量
  };

  if (!diaryId) {
    return NextResponse.json(globalStats);
  }

  // 特定日记的引用统计
  const id = parseInt(diaryId);
  const diaryStats = {
    diaryId: id,
    incomingCitations: 3,
    outgoingCitations: 2,
    citationTypes: {
      reference: { incoming: 2, outgoing: 1 },
      continuation: { incoming: 1, outgoing: 0 },
      related: { incoming: 0, outgoing: 1 },
      response: { incoming: 0, outgoing: 0 }
    },
    relatedDiaries: [
      { diaryId: 45, title: '习惯的力量', type: 'incoming', strength: 0.85 },
      { diaryId: 52, title: '继续前行', type: 'outgoing', strength: 0.72 },
      { diaryId: 48, title: '坚持的秘密', type: 'incoming', strength: 0.68 }
    ],
    citationTimeline: [
      { date: '2026-03-20', count: 1 },
      { date: '2026-03-22', count: 2 },
      { date: '2026-03-24', count: 1 }
    ],
    influenceScore: 7.5 // 影响力评分 (1-10)
  };

  return NextResponse.json(diaryStats);
}