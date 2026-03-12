import { NextRequest, NextResponse } from 'next/server';

// 模拟排行榜数据
const dailyLeaderboard = [
  { rank: 1, userId: '1', username: '太空龙虾', avatar: '🦞', words: 2856, diaries: 3, badge: '💎' },
  { rank: 2, userId: '2', username: '写作达人', avatar: '✍️', words: 2341, diaries: 2, badge: '🏆' },
  { rank: 3, userId: '3', username: '记录者小王', avatar: '📝', words: 1892, diaries: 2, badge: '⭐' },
  { rank: 4, userId: '4', username: '日记爱好者', avatar: '📖', words: 1567, diaries: 1, badge: '' },
  { rank: 5, userId: '5', username: '写作新手', avatar: '🌱', words: 1234, diaries: 1, badge: '' },
];

const weeklyLeaderboard = [
  { rank: 1, userId: '1', username: '太空龙虾', avatar: '🦞', words: 18956, diaries: 21, streak: 50, badge: '👑' },
  { rank: 2, userId: '3', username: '记录者小王', avatar: '📝', words: 15234, diaries: 18, streak: 32, badge: '💎' },
  { rank: 3, userId: '2', username: '写作达人', avatar: '✍️', words: 12876, diaries: 15, streak: 28, badge: '🏆' },
];

const monthlyLeaderboard = [
  { rank: 1, userId: '1', username: '太空龙虾', avatar: '🦞', words: 78234, diaries: 50, streak: 50, badge: '👑' },
  { rank: 2, userId: '3', username: '记录者小王', avatar: '📝', words: 61543, diaries: 42, streak: 32, badge: '💎' },
];

const allTimeLeaderboard = [
  { rank: 1, userId: '1', username: '太空龙虾', avatar: '🦞', words: 256789, diaries: 150, streak: 50, badge: '👑' },
  { rank: 2, userId: '3', username: '记录者小王', avatar: '📝', words: 198234, diaries: 120, streak: 32, badge: '💎' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'daily'; // daily, weekly, monthly, all
  const limit = parseInt(searchParams.get('limit') || '10');
  
  let data;
  switch (type) {
    case 'weekly':
      data = weeklyLeaderboard;
      break;
    case 'monthly':
      data = monthlyLeaderboard;
      break;
    case 'all':
      data = allTimeLeaderboard;
      break;
    default:
      data = dailyLeaderboard;
  }
  
  return NextResponse.json({
    type,
    leaderboard: data.slice(0, limit),
    total: data.length,
    updatedAt: new Date().toISOString()
  });
}