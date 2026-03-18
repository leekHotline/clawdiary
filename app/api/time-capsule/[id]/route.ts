import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库（与主路由共享）
const timeCapsules: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const capsule = timeCapsules.find(c => c.id === id);

  if (!capsule) {
    return NextResponse.json(
      { error: '胶囊不存在' },
      { status: 404 }
    );
  }

  const now = new Date();
  const unlockDate = new Date(capsule.unlockAt);
  const isUnlocked = unlockDate <= now;

  // 如果胶囊未解锁，隐藏内容
  if (!isUnlocked) {
    return NextResponse.json({
      ...capsule,
      content: '🔒 内容将在解锁时间后可见',
      isLocked: true,
      remainingTime: unlockDate.getTime() - now.getTime(),
    });
  }

  // 计算等待天数
  const created = new Date(capsule.createdAt);
  const daysWaited = Math.floor((unlockDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  return NextResponse.json({
    ...capsule,
    isLocked: false,
    daysWaited,
    openedAt: capsule.openedAt || now.toISOString(),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const capsuleIndex = timeCapsules.findIndex(c => c.id === id);

  if (capsuleIndex === -1) {
    return NextResponse.json(
      { error: '胶囊不存在' },
      { status: 404 }
    );
  }

  const capsule = timeCapsules[capsuleIndex];
  const now = new Date();
  const unlockDate = new Date(capsule.unlockAt);

  // 如果胶囊已解锁，不允许修改
  if (unlockDate <= now) {
    return NextResponse.json(
      { error: '已解锁的胶囊无法修改' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, unlockAt, mood, tags, isPublic, allowShared } = body;

    // 更新胶囊（不允许修改内容）
    timeCapsules[capsuleIndex] = {
      ...capsule,
      title: title || capsule.title,
      unlockAt: unlockAt || capsule.unlockAt,
      mood: mood || capsule.mood,
      tags: tags || capsule.tags,
      isPublic: isPublic ?? capsule.isPublic,
      allowShared: allowShared ?? capsule.allowShared,
      updatedAt: now.toISOString(),
    };

    return NextResponse.json({
      success: true,
      capsule: timeCapsules[capsuleIndex],
    });
  } catch {
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const capsuleIndex = timeCapsules.findIndex(c => c.id === id);

  if (capsuleIndex === -1) {
    return NextResponse.json(
      { error: '胶囊不存在' },
      { status: 404 }
    );
  }

  const capsule = timeCapsules[capsuleIndex];
  const now = new Date();
  const unlockDate = new Date(capsule.unlockAt);

  // 如果胶囊已解锁，不允许删除（建议保留回忆）
  if (unlockDate <= now) {
    return NextResponse.json(
      { error: '已解锁的胶囊无法删除，建议保留这段回忆' },
      { status: 400 }
    );
  }

  timeCapsules.splice(capsuleIndex, 1);

  return NextResponse.json({
    success: true,
    message: '胶囊已删除',
  });
}