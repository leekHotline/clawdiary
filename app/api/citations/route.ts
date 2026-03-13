import { NextRequest, NextResponse } from 'next/server';

// 类型定义
interface Citation {
  id: string;
  sourceDiaryId: number;
  targetDiaryId: number;
  type: string;
  context: string;
  createdAt: string;
}

// 模拟引用数据
const citations: Citation[] = [
  {
    id: '1',
    sourceDiaryId: 50,
    targetDiaryId: 45,
    type: 'reference',
    context: '在讨论习惯养成时，我回顾了之前的经验...',
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    id: '2',
    sourceDiaryId: 52,
    targetDiaryId: 48,
    type: 'continuation',
    context: '继续上次的话题...',
    createdAt: '2026-03-22T14:00:00Z'
  }
];

// GET /api/citations - 获取引用列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get('diaryId');
  const type = searchParams.get('type');
  const direction = searchParams.get('direction') || 'outgoing'; // outgoing | incoming | both

  let filtered = [...citations];

  if (diaryId) {
    const id = parseInt(diaryId);
    if (direction === 'outgoing') {
      filtered = filtered.filter(c => c.sourceDiaryId === id);
    } else if (direction === 'incoming') {
      filtered = filtered.filter(c => c.targetDiaryId === id);
    } else {
      filtered = filtered.filter(c => c.sourceDiaryId === id || c.targetDiaryId === id);
    }
  }

  if (type) {
    filtered = filtered.filter(c => c.type === type);
  }

  // 计算统计
  const stats = {
    total: citations.length,
    byType: {
      reference: citations.filter(c => c.type === 'reference').length,
      continuation: citations.filter(c => c.type === 'continuation').length,
      related: citations.filter(c => c.type === 'related').length,
      response: citations.filter(c => c.type === 'response').length
    }
  };

  return NextResponse.json({
    citations: filtered,
    stats,
    total: filtered.length
  });
}

// POST /api/citations - 创建引用
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sourceDiaryId, targetDiaryId, type = 'reference', context = '' } = body;

  if (!sourceDiaryId || !targetDiaryId) {
    return NextResponse.json({ error: 'sourceDiaryId and targetDiaryId are required' }, { status: 400 });
  }

  if (sourceDiaryId === targetDiaryId) {
    return NextResponse.json({ error: 'Cannot cite self' }, { status: 400 });
  }

  // 检查是否已存在
  const exists = citations.find(c => 
    c.sourceDiaryId === sourceDiaryId && c.targetDiaryId === targetDiaryId
  );

  if (exists) {
    return NextResponse.json({ error: 'Citation already exists' }, { status: 409 });
  }

  const newCitation = {
    id: Date.now().toString(),
    sourceDiaryId,
    targetDiaryId,
    type,
    context,
    createdAt: new Date().toISOString()
  };

  citations.push(newCitation);

  return NextResponse.json(newCitation, { status: 201 });
}

// DELETE /api/citations - 删除引用
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const index = citations.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Citation not found' }, { status: 404 });
  }

  citations.splice(index, 1);

  return NextResponse.json({ success: true });
}