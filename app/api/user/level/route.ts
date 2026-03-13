import { NextRequest, NextResponse } from 'next/server';

// 模拟用户等级数据
const userLevels: Record<string, {
  level: number;
  xp: number;
  totalXP: number;
  title: string;
  badges: string[];
  benefits: string[];
  joinedAt: string;
  diaryCount: number;
  totalWords: number;
  streakDays: number;
}> = {
  'default': {
    level: 4,
    xp: 650,
    totalXP: 3650,
    title: '创作者',
    badges: ['第一篇日记', '连续7天', '获得100赞', '月度最佳'],
    benefits: ['解锁高级主题', '自定义日记封面', '优先技术支持', '专属徽章展示'],
    joinedAt: '2026-01-01',
    diaryCount: 47,
    totalWords: 16380,
    streakDays: 14,
  }
};

const LEVEL_TITLES: Record<number, { title: string; xpRequired: number }> = {
  1: { title: '初学者', xpRequired: 0 },
  2: { title: '探索者', xpRequired: 1000 },
  3: { title: '记录者', xpRequired: 2000 },
  4: { title: '创作者', xpRequired: 3000 },
  5: { title: '作家', xpRequired: 5000 },
  6: { title: '大师', xpRequired: 8000 },
  7: { title: '传奇', xpRequired: 12000 },
  8: { title: '神话', xpRequired: 18000 },
  9: { title: '永恒', xpRequired: 25000 },
  10: { title: '超越者', xpRequired: 35000 },
};

const XP_PER_LEVEL = 1000;

function getLevelForXP(totalXP: number): number {
  for (let level = 10; level >= 1; level--) {
    if (totalXP >= LEVEL_TITLES[level].xpRequired) {
      return level;
    }
  }
  return 1;
}

// GET - 获取用户等级信息
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'default';
  
  const userData = userLevels[userId] || userLevels['default'];
  const level = getLevelForXP(userData.totalXP);
  const currentLevelXP = LEVEL_TITLES[level].xpRequired;
  const nextLevelXP = LEVEL_TITLES[level + 1]?.xpRequired || currentLevelXP + XP_PER_LEVEL;
  const xpInCurrentLevel = userData.totalXP - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  
  return NextResponse.json({
    level,
    title: LEVEL_TITLES[level].title,
    currentXP: xpInCurrentLevel,
    requiredXP: xpNeededForNext,
    totalXP: userData.totalXP,
    progress: Math.round((xpInCurrentLevel / xpNeededForNext) * 100),
    nextLevel: level < 10 ? {
      level: level + 1,
      title: LEVEL_TITLES[level + 1].title,
      requiredXP: xpNeededForNext
    } : null,
    benefits: userData.benefits,
    badges: userData.badges,
    joinedAt: userData.joinedAt,
    diaryCount: userData.diaryCount,
    totalWords: userData.totalWords,
    streakDays: userData.streakDays,
  });
}

// POST - 增加经验值
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', amount, reason } = body;
    
    if (!userLevels[userId]) {
      userLevels[userId] = { ...userLevels['default'] };
    }
    
    const oldLevel = getLevelForXP(userLevels[userId].totalXP);
    userLevels[userId].totalXP += amount;
    userLevels[userId].xp += amount;
    const newLevel = getLevelForXP(userLevels[userId].totalXP);
    
    const leveledUp = newLevel > oldLevel;
    
    if (leveledUp) {
      userLevels[userId].level = newLevel;
      userLevels[userId].title = LEVEL_TITLES[newLevel].title;
    }
    
    return NextResponse.json({
      success: true,
      amount,
      reason,
      newTotalXP: userLevels[userId].totalXP,
      leveledUp,
      oldLevel,
      newLevel,
      message: leveledUp 
        ? `🎉 恭喜升级！你现在是 Lv.${newLevel} ${LEVEL_TITLES[newLevel].title}` 
        : `+${amount} XP`
    });
    
  } catch (_error) {
    return NextResponse.json({ 
      success: false, 
      error: '操作失败' 
    }, { status: 500 });
  }
}

// PUT - 更新统计数据
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', diaryCount, totalWords, streakDays } = body;
    
    if (!userLevels[userId]) {
      userLevels[userId] = { ...userLevels['default'] };
    }
    
    if (diaryCount !== undefined) userLevels[userId].diaryCount = diaryCount;
    if (totalWords !== undefined) userLevels[userId].totalWords = totalWords;
    if (streakDays !== undefined) userLevels[userId].streakDays = streakDays;
    
    return NextResponse.json({
      success: true,
      stats: {
        diaryCount: userLevels[userId].diaryCount,
        totalWords: userLevels[userId].totalWords,
        streakDays: userLevels[userId].streakDays,
      }
    });
    
  } catch (_error) {
    return NextResponse.json({ 
      success: false, 
      error: '更新失败' 
    }, { status: 500 });
  }
}