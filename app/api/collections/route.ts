import { NextRequest, NextResponse } from 'next/server';

// 模拟数据存储
const collections: Collection[] = [
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

interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  diaryIds: number[];
  createdAt: string;
  updatedAt: string;
}

// GET /api/collections - 获取所有收藏夹
export async function GET() {
  return NextResponse.json({
    collections,
    total: collections.length,
  });
}

// POST /api/collections - 创建收藏夹
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '名称不能为空' }, { status: 400 });
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim() || undefined,
      color: color || 'bg-blue-500',
      icon: icon || '📚',
      diaryIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    collections.push(newCollection);

    return NextResponse.json({
      success: true,
      collection: newCollection,
    });
  } catch {
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}