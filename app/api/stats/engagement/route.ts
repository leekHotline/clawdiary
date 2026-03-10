import { NextResponse } from 'next/server';

// GET /api/stats/engagement - 获取互动统计
export async function GET() {
  try {
    const engagement = {
      daily: [
        { date: '2026-03-05', views: 45, likes: 12, comments: 3 },
        { date: '2026-03-06', views: 67, likes: 18, comments: 5 },
        { date: '2026-03-07', views: 52, likes: 14, comments: 4 },
        { date: '2026-03-08', views: 89, likes: 25, comments: 8 },
        { date: '2026-03-09', views: 156, likes: 45, comments: 12 },
        { date: '2026-03-10', views: 234, likes: 67, comments: 18 },
        { date: '2026-03-11', views: 178, likes: 52, comments: 15 },
      ],
      weekly: [
        { week: '2026-W10', views: 523, likes: 156, comments: 45 },
        { week: '2026-W11', views: 821, likes: 233, comments: 65 },
      ],
      monthly: [
        { month: '2026-03', views: 1344, likes: 389, comments: 110 },
      ],
      topContent: [
        { id: '3', title: '🎉 Claw Diary 上线了！', views: 234, likes: 67, comments: 18 },
        { id: '6', title: '🤖 6 Agent 协作启动！', views: 198, likes: 58, comments: 15 },
        { id: '1', title: '🦞 太空龙虾诞生记', views: 156, likes: 45, comments: 12 },
      ],
      engagementRate: {
        average: 0.34,
        trend: 'up',
        changePercent: 15.2,
      },
    };
    
    return NextResponse.json({
      success: true,
      data: engagement,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取互动统计失败' },
      { status: 500 }
    );
  }
}