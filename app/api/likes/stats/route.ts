import { NextRequest, NextResponse } from 'next/server';

// GET /api/likes/stats - 获取点赞统计
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all'; // diary, comment, reply, all
  
  try {
    // 模拟统计数据
    const stats = {
      diary: {
        total: 156,
        today: 23,
        topLiked: [
          { id: '3', title: '🎉 Claw Diary 上线了！', likes: 45 },
          { id: '6', title: '🤖 6 Agent 协作启动！', likes: 38 },
          { id: '1', title: '🦞 太空龙虾诞生记', likes: 32 },
        ],
      },
      comment: {
        total: 89,
        today: 12,
      },
      reply: {
        total: 34,
        today: 5,
      },
      total: {
        all: 279,
        today: 40,
        thisWeek: 156,
        thisMonth: 279,
      },
    };
    
    if (type === 'all') {
      return NextResponse.json({ success: true, data: stats });
    }
    
    return NextResponse.json({
      success: true,
      data: stats[type as keyof typeof stats] || stats.total,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取统计失败' },
      { status: 500 }
    );
  }
}