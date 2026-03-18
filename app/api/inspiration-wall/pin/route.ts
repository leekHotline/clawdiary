import { NextRequest, NextResponse } from 'next/server';

// 灵感墙数据（与主路由共享，实际项目应使用数据库）
const inspirationWall: any[] = [];

// PUT - 置顶/取消置顶
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, pinned } = body;

    // 这里应该从数据库获取，简化示例
    return NextResponse.json({
      success: true,
      data: { id, pinned },
      message: pinned ? '已置顶' : '已取消置顶'
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}