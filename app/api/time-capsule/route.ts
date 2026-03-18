import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const timeCapsules: any[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const now = new Date();

  let filteredCapsules = [...timeCapsules];

  if (status === 'pending') {
    filteredCapsules = timeCapsules.filter(c => new Date(c.unlockAt) > now);
  } else if (status === 'opened') {
    filteredCapsules = timeCapsules.filter(c => new Date(c.unlockAt) <= now && c.openedAt);
  }

  // 按解锁时间排序
  filteredCapsules.sort((a, b) => new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime());

  // 为已解锁的胶囊计算等待天数
  const capsulesWithDays = filteredCapsules.map(capsule => {
    if (capsule.openedAt) {
      const created = new Date(capsule.createdAt);
      const opened = new Date(capsule.openedAt);
      const daysWaited = Math.floor((opened.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return { ...capsule, daysWaited };
    }
    return capsule;
  });

  return NextResponse.json({
    capsules: capsulesWithDays,
    total: timeCapsules.length,
    pending: timeCapsules.filter(c => new Date(c.unlockAt) > now).length,
    opened: timeCapsules.filter(c => new Date(c.unlockAt) <= now && c.openedAt).length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, unlockAt, mood, tags, isPublic, allowShared } = body;

    if (!title || !content || !unlockAt) {
      return NextResponse.json(
        { error: '标题、内容和解锁时间是必填项' },
        { status: 400 }
      );
    }

    const unlockDate = new Date(unlockAt);
    const now = new Date();

    if (unlockDate <= now) {
      return NextResponse.json(
        { error: '解锁时间必须是未来时间' },
        { status: 400 }
      );
    }

    const capsule = {
      id: `capsule-${Date.now()}`,
      title,
      content,
      unlockAt,
      mood: mood || '😊',
      tags: tags || [],
      isPublic: isPublic || false,
      allowShared: allowShared || false,
      createdAt: now.toISOString(),
      isLocked: true,
      openedAt: null,
      sharedWith: [],
    };

    timeCapsules.push(capsule);

    return NextResponse.json({
      success: true,
      capsule,
      message: '时光胶囊创建成功！',
    });
  } catch {
    return NextResponse.json(
      { error: '创建失败，请稍后重试' },
      { status: 500 }
    );
  }
}