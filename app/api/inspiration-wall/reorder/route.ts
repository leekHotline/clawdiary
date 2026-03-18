import { NextRequest, NextResponse } from 'next/server';

// POST - 批量重排序
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardIds } = body;

    if (!Array.isArray(cardIds)) {
      return NextResponse.json(
        { success: false, error: '无效的卡片列表' },
        { status: 400 }
      );
    }

    // 这里应该更新数据库，简化示例
    return NextResponse.json({
      success: true,
      message: '排序更新成功',
      data: cardIds.map((id: string, index: number) => ({ id, order: index }))
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '排序更新失败' },
      { status: 500 }
    );
  }
}