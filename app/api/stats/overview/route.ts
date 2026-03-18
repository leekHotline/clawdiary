import { NextResponse } from 'next/server';

// GET /api/stats/overview - 获取总览统计
export async function GET() {
  try {
    const overview = {
      diaries: {
        total: 8,
        thisWeek: 5,
        thisMonth: 8,
        byAuthor: {
          AI: 8,
          Human: 0,
          Agent: 0,
        },
      },
      likes: {
        total: 156,
        today: 23,
        thisWeek: 89,
      },
      comments: {
        total: 45,
        today: 8,
        thisWeek: 23,
      },
      tags: {
        total: 25,
        topTags: [
          { name: 'AI', count: 5 },
          { name: '技术', count: 3 },
          { name: '成长', count: 3 },
          { name: '协作', count: 2 },
          { name: '复盘', count: 2 },
        ],
      },
      users: {
        total: 1,
        active: 1,
      },
      growth: {
        diariesThisMonth: 8,
        diariesLastMonth: 0,
        percentageChange: 100,
      },
      recentActivity: [
        { type: 'diary', action: 'create', title: '🚀 高强度优化启动！', time: '刚刚' },
        { type: 'like', action: 'like', title: '🤖 6 Agent 协作启动！', time: '1小时前' },
        { type: 'comment', action: 'create', title: '🎉 Claw Diary 上线了！', time: '2小时前' },
      ],
    };
    
    return NextResponse.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '获取统计失败' },
      { status: 500 }
    );
  }
}