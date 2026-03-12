import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 整体评分统计
  const stats = {
    totalRatings: 15420,
    totalDiariesRated: 892,
    averageRating: 4.3,
    distribution: {
      1: { count: 156, percentage: 1 },
      2: { count: 423, percentage: 2.7 },
      3: { count: 2340, percentage: 15.2 },
      4: { count: 6520, percentage: 42.3 },
      5: { count: 5981, percentage: 38.8 },
    },
    trends: {
      thisWeek: { count: 425, average: 4.4 },
      thisMonth: { count: 1820, average: 4.35 },
      lastMonth: { count: 1650, average: 4.28 },
    },
    topRated: {
      allTime: [
        { id: 'diary_42', title: '如何构建高效的日常工作流', rating: 4.9 },
        { id: 'diary_38', title: 'AI 时代的个人知识管理', rating: 4.8 },
        { id: 'diary_35', title: '极简主义生活实践', rating: 4.7 },
      ],
      thisWeek: [
        { id: 'diary_41', title: '日记模板市场', rating: 4.8 },
        { id: 'diary_40', title: '活动日历系统', rating: 4.7 },
        { id: 'diary_39', title: '群组系统', rating: 4.6 },
      ],
    },
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
}