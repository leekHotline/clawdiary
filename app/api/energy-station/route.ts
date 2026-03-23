import { NextRequest, NextResponse } from 'next/server';

// 模拟用户能量数据
interface UserEnergy {
  energy: number;
  streak: number;
  longestStreak: number;
  lastWriteDate: string | null;
  tasks: {
    daily: boolean;
    mood: boolean;
    photo: boolean;
    tags: boolean;
    review: boolean;
  };
  badges: string[];
}

// 能量等级配置
const ENERGY_LEVELS = [
  { level: 1, name: "初生虾苗", min: 0, max: 100 },
  { level: 2, name: "活力小龙虾", min: 100, max: 300 },
  { level: 3, name: "能量龙虾", min: 300, max: 600 },
  { level: 4, name: "黄金龙虾", min: 600, max: 1000 },
  { level: 5, name: "传说龙虾", min: 1000, max: 2000 },
  { level: 6, name: "宇宙龙虾", min: 2000, max: Infinity },
];

// GET 获取用户能量数据
export async function GET(request: NextRequest) {
  // 模拟数据
  const userEnergy: UserEnergy = {
    energy: 386,
    streak: 7,
    longestStreak: 15,
    lastWriteDate: new Date().toISOString().split('T')[0],
    tasks: {
      daily: false,
      mood: true,
      photo: false,
      tags: true,
      review: false,
    },
    badges: ['first', 'week', 'night', 'words'],
  };

  const currentLevel = ENERGY_LEVELS.find(
    l => userEnergy.energy >= l.min && userEnergy.energy < l.max
  ) || ENERGY_LEVELS[0];

  return NextResponse.json({
    success: true,
    data: {
      ...userEnergy,
      level: currentLevel,
      nextLevel: ENERGY_LEVELS.find(l => l.level === currentLevel.level + 1) || null,
    },
  });
}

// POST 完成任务或添加能量
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, taskId, amount } = body;

  if (action === 'completeTask' && taskId) {
    // 任务能量奖励
    const taskRewards: Record<string, number> = {
      daily: 20,
      mood: 5,
      photo: 10,
      tags: 5,
      review: 15,
    };

    const reward = taskRewards[taskId] || 0;

    return NextResponse.json({
      success: true,
      message: `任务完成！获得 ${reward} 能量`,
      reward,
      newEnergy: 386 + reward,
    });
  }

  if (action === 'addEnergy' && amount) {
    return NextResponse.json({
      success: true,
      message: `获得 ${amount} 能量`,
      newEnergy: 386 + amount,
    });
  }

  return NextResponse.json({
    success: false,
    message: '无效的操作',
  }, { status: 400 });
}