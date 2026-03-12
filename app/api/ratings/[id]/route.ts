import { NextRequest, NextResponse } from 'next/server';

// 模拟评分数据
const ratings: Record<string, { average: number; count: number; distribution: Record<number, number> }> = {
  'diary_1': { average: 4.5, count: 28, distribution: { 1: 1, 2: 2, 3: 3, 4: 8, 5: 14 } },
  'diary_2': { average: 4.8, count: 45, distribution: { 1: 0, 2: 1, 3: 3, 4: 10, 5: 31 } },
};

// 用户评分记录
const userRatings: Record<string, Record<string, number>> = {
  'user_1': { 'diary_1': 5, 'diary_2': 4 },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const diaryRating = ratings[id] || {
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  return NextResponse.json({
    success: true,
    data: diaryRating,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { userId, rating } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, error: '评分必须在 1-5 之间' },
      { status: 400 }
    );
  }

  // 初始化评分数据
  if (!ratings[id]) {
    ratings[id] = {
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  // 检查是否已评分
  const userRating = userRatings[userId]?.[id];
  if (userRating) {
    // 更新评分
    ratings[id].distribution[userRating]--;
    ratings[id].distribution[rating]++;
  } else {
    // 新评分
    ratings[id].count++;
    ratings[id].distribution[rating]++;
    
    if (!userRatings[userId]) {
      userRatings[userId] = {};
    }
    userRatings[userId][id] = rating;
  }

  // 计算新平均分
  let totalScore = 0;
  let totalVotes = 0;
  for (let i = 1; i <= 5; i++) {
    totalScore += i * ratings[id].distribution[i];
    totalVotes += ratings[id].distribution[i];
  }
  ratings[id].average = totalVotes > 0 ? Math.round((totalScore / totalVotes) * 10) / 10 : 0;

  return NextResponse.json({
    success: true,
    data: {
      rating: rating,
      average: ratings[id].average,
      count: ratings[id].count,
      distribution: ratings[id].distribution,
    },
    message: userRating ? '评分已更新' : '评分成功',
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, error: '缺少用户ID' },
      { status: 400 }
    );
  }

  const userRating = userRatings[userId]?.[id];
  if (!userRating) {
    return NextResponse.json(
      { success: false, error: '未找到评分记录' },
      { status: 404 }
    );
  }

  // 移除评分
  ratings[id].distribution[userRating]--;
  ratings[id].count--;
  delete userRatings[userId][id];

  // 重新计算平均分
  let totalScore = 0;
  let totalVotes = 0;
  for (let i = 1; i <= 5; i++) {
    totalScore += i * ratings[id].distribution[i];
    totalVotes += ratings[id].distribution[i];
  }
  ratings[id].average = totalVotes > 0 ? Math.round((totalScore / totalVotes) * 10) / 10 : 0;

  return NextResponse.json({
    success: true,
    message: '评分已删除',
  });
}