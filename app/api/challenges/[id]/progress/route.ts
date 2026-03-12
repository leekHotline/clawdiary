import { NextRequest, NextResponse } from 'next/server';

// Mock challenge data
const CHALLENGES = [
  {
    id: '1',
    title: '30天写作挑战',
    description: '连续30天每天写至少200字的日记',
    type: 'streak',
    startDate: '2026-02-01',
    endDate: '2026-03-02',
    target: 30,
    progress: 25,
    status: 'active',
    participants: 156,
    reward: {
      badge: 'streak-master',
      points: 500,
      title: '坚持达人'
    },
    rules: [
      '每天至少写200字',
      '不可中断',
      '内容需原创'
    ],
    leaderboard: [
      { rank: 1, userId: 'user1', name: '小明', progress: 30, completedAt: '2026-03-02' },
      { rank: 2, userId: 'user2', name: '小红', progress: 28, completedAt: null },
      { rank: 3, userId: 'user3', name: '小龙', progress: 26, completedAt: null },
    ]
  },
  {
    id: '2',
    title: '万字冲刺',
    description: '一周内累计写满10,000字',
    type: 'words',
    startDate: '2026-03-10',
    endDate: '2026-03-17',
    target: 10000,
    progress: 3500,
    status: 'active',
    participants: 89,
    reward: {
      badge: 'word-sprinter',
      points: 300,
      title: '速度写手'
    },
    rules: [
      '字数统计以实际内容为准',
      '可以是多篇日记累计',
      '鼓励高质量内容'
    ],
    leaderboard: [
      { rank: 1, userId: 'user4', name: '阿华', progress: 8500, completedAt: null },
      { rank: 2, userId: 'user5', name: '小芳', progress: 6200, completedAt: null },
      { rank: 3, userId: 'user6', name: '大伟', progress: 5000, completedAt: null },
    ]
  },
  {
    id: '3',
    title: '情感大师',
    description: '在日记中使用10种不同的心情标签',
    type: 'mood',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    target: 10,
    progress: 6,
    status: 'active',
    participants: 234,
    reward: {
      badge: 'mood-master',
      points: 200,
      title: '情感大师'
    },
    rules: [
      '需要10种不同的心情',
      '每种心情至少记录一次',
      '鼓励真实表达'
    ],
    leaderboard: [
      { rank: 1, userId: 'user7', name: '小月', progress: 10, completedAt: '2026-03-08' },
      { rank: 2, userId: 'user8', name: '阿强', progress: 8, completedAt: null },
      { rank: 3, userId: 'user9', name: '小丽', progress: 7, completedAt: null },
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const challenge = CHALLENGES.find(c => c.id === id);
  
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }
  
  return NextResponse.json(challenge);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  // Handle join/complete actions
  if (body.action === 'join') {
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined challenge',
      challengeId: id 
    });
  }
  
  if (body.action === 'complete') {
    return NextResponse.json({ 
      success: true, 
      message: 'Challenge completed!',
      challengeId: id,
      reward: {
        badge: 'streak-master',
        points: 500
      }
    });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}