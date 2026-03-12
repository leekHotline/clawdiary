import { NextRequest, NextResponse } from 'next/server';

// POST /api/tags/merge - 合并标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceTag, targetTag } = body;

    if (!sourceTag || !targetTag) {
      return NextResponse.json({ error: '缺少源标签或目标标签' }, { status: 400 });
    }

    if (sourceTag === targetTag) {
      return NextResponse.json({ error: '不能合并到同一个标签' }, { status: 400 });
    }

    // 在实际应用中，这里会更新数据库中所有日记的标签
    // 这里返回模拟结果
    return NextResponse.json({
      success: true,
      message: `已将 "${sourceTag}" 合并到 "${targetTag}"`,
      affectedDiaries: Math.floor(Math.random() * 10) + 1,
    });
  } catch (error) {
    return NextResponse.json({ error: '合并失败' }, { status: 500 });
  }
}