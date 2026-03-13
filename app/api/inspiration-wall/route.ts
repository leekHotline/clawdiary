import { NextRequest, NextResponse } from 'next/server';

// 灵感墙数据存储（实际项目应使用数据库）
const inspirationWall: InspirationCard[] = [
  {
    id: '1',
    title: '晨间写作习惯',
    content: '每天早上6点起床，写30分钟日记',
    color: '#FFE4B5',
    tags: ['习惯', '早晨'],
    pinned: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '感恩练习',
    content: '每天写下3件感恩的事',
    color: '#E6E6FA',
    tags: ['感恩', '心态'],
    pinned: false,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '月度回顾模板',
    content: '每个月底回顾本月成就与不足',
    color: '#B0E0E6',
    tags: ['回顾', '模板'],
    pinned: false,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface InspirationCard {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  pinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// GET - 获取灵感墙数据
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pinned = searchParams.get('pinned');
  const tag = searchParams.get('tag');

  let filtered = [...inspirationWall];

  if (pinned === 'true') {
    filtered = filtered.filter(card => card.pinned);
  }

  if (tag) {
    filtered = filtered.filter(card => card.tags.includes(tag));
  }

  // 按 order 排序，置顶的在前
  filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.order - b.order;
  });

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
    tags: [...new Set(filtered.flatMap(c => c.tags))],
    stats: {
      total: inspirationWall.length,
      pinned: inspirationWall.filter(c => c.pinned).length,
      byColor: inspirationWall.reduce((acc, c) => {
        acc[c.color] = (acc[c.color] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }
  });
}

// POST - 创建新的灵感卡片
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, color, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    const newCard: InspirationCard = {
      id: Date.now().toString(),
      title,
      content,
      color: color || '#FFFFFF',
      tags: tags || [],
      pinned: false,
      order: inspirationWall.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inspirationWall.push(newCard);

    return NextResponse.json({
      success: true,
      data: newCard,
      message: '灵感卡片创建成功'
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    );
  }
}

// PUT - 批量更新排序
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cardIds } = body;

    if (action === 'reorder' && Array.isArray(cardIds)) {
      cardIds.forEach((id: string, index: number) => {
        const card = inspirationWall.find(c => c.id === id);
        if (card) {
          card.order = index;
          card.updatedAt = new Date().toISOString();
        }
      });

      return NextResponse.json({
        success: true,
        message: '排序更新成功'
      });
    }

    return NextResponse.json(
      { success: false, error: '未知操作' },
      { status: 400 }
    );
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除灵感卡片
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: '缺少卡片ID' },
      { status: 400 }
    );
  }

  const index = inspirationWall.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json(
      { success: false, error: '卡片不存在' },
      { status: 404 }
    );
  }

  inspirationWall.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: '删除成功'
  });
}