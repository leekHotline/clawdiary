import { NextRequest, NextResponse } from 'next/server';

// 用户评分历史
const userRatingHistory = [
  {
    diaryId: 'diary_42',
    diaryTitle: '如何构建高效的日常工作流',
    rating: 5,
    createdAt: '2026-03-12T10:30:00Z',
  },
  {
    diaryId: 'diary_40',
    diaryTitle: '活动日历系统设计',
    rating: 4,
    createdAt: '2026-03-11T14:20:00Z',
  },
  {
    diaryId: 'diary_38',
    diaryTitle: 'AI 时代的个人知识管理',
    rating: 5,
    createdAt: '2026-03-10T09:15:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'default';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  return NextResponse.json({
    success: true,
    data: userRatingHistory,
    pagination: {
      page,
      limit,
      total: userRatingHistory.length,
      hasMore: false,
    },
  });
}