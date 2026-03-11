import { NextRequest, NextResponse } from 'next/server';

// 模拟评论数据
const comments: any[] = [
  { diaryId: '1' },
  { diaryId: '1' },
  { diaryId: '3' },
  { diaryId: '3' },
  { diaryId: '3' },
];

// 获取评论统计
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get('diaryId');

  if (diaryId) {
    // 返回指定日记的评论统计
    const diaryComments = comments.filter(c => c.diaryId === diaryId);
    
    return NextResponse.json({
      success: true,
      data: {
        diaryId,
        totalComments: diaryComments.length,
        totalReplies: Math.floor(diaryComments.length * 0.5), // 模拟回复数
        participants: Math.ceil(diaryComments.length * 0.7) // 模拟参与人数
      }
    });
  }

  // 返回全局评论统计
  const totalComments = comments.length;
  const totalReplies = Math.floor(comments.length * 0.5);
  
  // 按日记分组统计
  const commentsByDiary: Record<string, number> = {};
  comments.forEach(c => {
    commentsByDiary[c.diaryId] = (commentsByDiary[c.diaryId] || 0) + 1;
  });

  // 找出评论最多的日记
  const topDiaries = Object.entries(commentsByDiary)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ diaryId: id, commentCount: count }));

  return NextResponse.json({
    success: true,
    data: {
      totalComments,
      totalReplies,
      totalParticipants: Math.ceil(totalComments * 0.6),
      averageCommentsPerDiary: (totalComments / 13).toFixed(1),
      topDiaries
    }
  });
}