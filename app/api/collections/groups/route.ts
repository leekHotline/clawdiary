import { NextRequest, NextResponse } from 'next/server';

// 模拟收藏分组数据
const collectionGroups: Record<string, any[]> = {};

// GET /api/collections/groups - 获取收藏分组列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'default';
  
  try {
    const groups = collectionGroups[userId] || [
      { id: '1', name: '默认收藏', count: 12, color: '#FFB6C1', icon: '📁' },
      { id: '2', name: '技术笔记', count: 8, color: '#87CEEB', icon: '💻' },
      { id: '3', name: '灵感收集', count: 5, color: '#98FB98', icon: '💡' },
      { id: '4', name: '待读清单', count: 3, color: '#DDA0DD', icon: '📚' },
    ];
    
    return NextResponse.json({
      success: true,
      data: groups,
      total: groups.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取分组失败' },
      { status: 500 }
    );
  }
}

// POST /api/collections/groups - 创建新分组
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId, color, icon } = body;
    
    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: '分组名称和用户ID不能为空' },
        { status: 400 }
      );
    }
    
    if (!collectionGroups[userId]) {
      collectionGroups[userId] = [];
    }
    
    const newGroup = {
      id: Date.now().toString(),
      name,
      userId,
      color: color || '#FFB6C1',
      icon: icon || '📁',
      count: 0,
      createdAt: new Date().toISOString(),
    };
    
    collectionGroups[userId].push(newGroup);
    
    return NextResponse.json({
      success: true,
      data: newGroup,
      message: '分组创建成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建分组失败' },
      { status: 500 }
    );
  }
}