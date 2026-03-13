import { NextRequest, NextResponse } from 'next/server';

// 模拟数据存储（实际应该从数据库获取）
const collections: any[] = [
  {
    id: '1',
    name: '最佳日记',
    description: '我最喜欢的日记',
    color: 'bg-yellow-500',
    icon: '⭐',
    diaryIds: [1, 5, 10],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-10T00:00:00Z',
  },
  {
    id: '2',
    name: '技术笔记',
    description: '技术相关的日记',
    color: 'bg-blue-500',
    icon: '💻',
    diaryIds: [2, 7, 15],
    createdAt: '2026-03-05T00:00:00Z',
    updatedAt: '2026-03-12T00:00:00Z',
  },
  {
    id: '3',
    name: '生活点滴',
    description: '日常生活中的美好瞬间',
    color: 'bg-pink-500',
    icon: '❤️',
    diaryIds: [3, 8, 12, 20],
    createdAt: '2026-03-08T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z',
  },
];

// GET /api/collections/[id] - 获取单个收藏夹详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collection = collections.find(c => c.id === id);

  if (!collection) {
    return NextResponse.json({ error: '收藏夹不存在' }, { status: 404 });
  }

  return NextResponse.json({ collection });
}

// PUT /api/collections/[id] - 更新收藏夹
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, color, icon } = body;

    const index = collections.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '收藏夹不存在' }, { status: 404 });
    }

    collections[index] = {
      ...collections[index],
      name: name || collections[index].name,
      description: description !== undefined ? description : collections[index].description,
      color: color || collections[index].color,
      icon: icon || collections[index].icon,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      collection: collections[index],
    });
  } catch (_error) {
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// DELETE /api/collections/[id] - 删除收藏夹
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = collections.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '收藏夹不存在' }, { status: 404 });
    }

    collections.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}