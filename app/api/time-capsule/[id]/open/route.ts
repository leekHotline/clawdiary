import { NextRequest, NextResponse } from 'next/server';

// 模拟数据库
const timeCapsules: any[] = [];

export async function POST(
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

  // 检查是否已到解锁时间
  if (unlockDate > now) {
    const remainingMs = unlockDate.getTime() - now.getTime();
    const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return NextResponse.json(
      { 
        error: '胶囊尚未到解锁时间',
        remainingTime: `${remainingDays} 天 ${remainingHours} 小时`,
        unlockAt: capsule.unlockAt,
      },
      { status: 400 }
    );
  }

  // 解锁胶囊
  const created = new Date(capsule.createdAt);
  const daysWaited = Math.floor((unlockDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  const openedCapsule = {
    ...capsule,
    isLocked: false,
    openedAt: now.toISOString(),
    daysWaited,
  };

  // 更新数据库
  const index = timeCapsules.findIndex(c => c.id === id);
  if (index !== -1) {
    timeCapsules[index] = openedCapsule;
  }

  return NextResponse.json({
    success: true,
    message: '🎉 恭喜！时光胶囊已解锁！',
    capsule: openedCapsule,
  });
}