import { NextRequest, NextResponse } from 'next/server';

// 模拟数据存储
let collections: any[] = [
  {
    id: '1',
    name: '最佳日记',
    diaryIds: [1, 5, 10],
  },
  {
    id: '2',
    name: '技术笔记',
    diaryIds: [2, 7, 15],
  },
  {
    id: '3',
    name: '生活点滴',
    diaryIds: [3, 8, 12, 20],
  },
];

// POST /api/collections/[id]/items - 添加日记到收藏夹
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { diaryId } = body;

    if (!diaryId) {
      return NextResponse.json({ error: '缺少日记ID' }, { status: 400 });
    }

    const collection = collections.find(c => c.id === id);
    if (!collection) {
      return NextResponse.json({ error: '收藏夹不存在' }, { status: 404 });
    }

    if (collection.diaryIds.includes(diaryId)) {
      return NextResponse.json({ error: '日记已在收藏夹中' }, { status: 400 });
    }

    collection.diaryIds.push(diaryId);

    return NextResponse.json({
      success: true,
      message: '已添加到收藏夹',
      diaryIds: collection.diaryIds,
    });
  } catch (error) {
    return NextResponse.json({ error: '添加失败' }, { status: 500 });
  }
}

// DELETE /api/collections/[id]/items/[diaryId] - 从收藏夹移除日记
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; diaryId: string }> }
) {
  try {
    const { id, diaryId } = await params;

    const collection = collections.find(c => c.id === id);
    if (!collection) {
      return NextResponse.json({ error: '收藏夹不存在' }, { status: 404 });
    }

    const diaryIdNum = parseInt(diaryId);
    const index = collection.diaryIds.indexOf(diaryIdNum);

    if (index === -1) {
      return NextResponse.json({ error: '日记不在收藏夹中' }, { status: 400 });
    }

    collection.diaryIds.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: '已从收藏夹移除',
      diaryIds: collection.diaryIds,
    });
  } catch (error) {
    return NextResponse.json({ error: '移除失败' }, { status: 500 });
  }
}