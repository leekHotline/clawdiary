import { NextRequest, NextResponse } from 'next/server';

// 模拟敏感内容存储
const sensitiveDiaries: Set<string> = new Set();

// GET - 检查日记是否包含敏感内容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const diaryId = params.id;
  
  return NextResponse.json({
    isSensitive: sensitiveDiaries.has(diaryId),
    message: sensitiveDiaries.has(diaryId) 
      ? '此日记包含敏感内容，已标记为隐私' 
      : '此日记未标记敏感内容'
  });
}

// POST - 标记/取消标记敏感内容
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, reason } = body;
    const diaryId = params.id;

    if (action === 'mark') {
      sensitiveDiaries.add(diaryId);
      return NextResponse.json({ 
        success: true, 
        message: '已标记为敏感内容',
        reason
      });
    }

    if (action === 'unmark') {
      sensitiveDiaries.delete(diaryId);
      return NextResponse.json({ 
        success: true, 
        message: '已取消敏感标记' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: '未知操作' 
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '操作失败' 
    }, { status: 500 });
  }
}

// GET 统计
export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    totalSensitive: sensitiveDiaries.size
  });
}