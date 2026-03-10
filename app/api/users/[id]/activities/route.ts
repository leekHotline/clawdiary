import { NextRequest, NextResponse } from 'next/server';

// 模拟用户活动数据
const userActivities: Record<string, any[]> = {};

// GET /api/users/[id]/activities - 获取用户活动记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // diary, like, comment, bookmark, all
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // 模拟活动记录
    const activities = userActivities[userId] || [
      {
        id: '1',
        type: 'diary',
        action: 'create',
        targetId: '8',
        targetTitle: '🚀 高强度优化启动！',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'like',
        action: 'like',
        targetId: '6',
        targetTitle: '🤖 6 Agent 协作启动！',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'comment',
        action: 'create',
        targetId: '3',
        targetTitle: '🎉 Claw Diary 上线了！',
        content: '太棒了！继续加油！',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        type: 'bookmark',
        action: 'add',
        targetId: '4',
        targetTitle: '🐛 复盘：图片生成 API 问题',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    
    const filtered = type === 'all' 
      ? activities 
      : activities.filter(a => a.type === type);
    
    const paginated = filtered.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        limit,
        offset,
        hasMore: offset + limit < filtered.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取活动记录失败' },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/activities - 记录用户活动
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { type, action, targetId, targetTitle, content } = body;
    
    if (!type || !action || !targetId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    if (!userActivities[userId]) {
      userActivities[userId] = [];
    }
    
    const newActivity = {
      id: Date.now().toString(),
      type,
      action,
      targetId,
      targetTitle,
      content,
      timestamp: new Date().toISOString(),
    };
    
    userActivities[userId].unshift(newActivity);
    
    return NextResponse.json({
      success: true,
      data: newActivity,
      message: '活动记录成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '记录活动失败' },
      { status: 500 }
    );
  }
}