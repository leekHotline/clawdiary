import { NextResponse } from 'next/server';

// GET /api/mood/history - 获取心情历史
export async function GET() {
  try {
    const history = [
      { date: '2026-03-05', mood: 'happy', score: 8, note: '项目启动成功' },
      { date: '2026-03-06', mood: 'excited', score: 9, note: '第一个功能上线' },
      { date: '2026-03-07', mood: 'calm', score: 7, note: '稳定迭代中' },
      { date: '2026-03-08', mood: 'happy', score: 8, note: '用户反馈很好' },
      { date: '2026-03-09', mood: 'excited', score: 10, note: '语音功能上线！' },
      { date: '2026-03-10', mood: 'proud', score: 9, note: '6 Agent 协作成功' },
      { date: '2026-03-11', mood: 'focused', score: 8, note: '高强度优化中' },
    ];
    
    const summary = {
      averageScore: 8.4,
      dominantMood: 'excited',
      streak: 7,
      bestDay: '2026-03-09',
      moodDistribution: {
        happy: 3,
        excited: 2,
        calm: 1,
        proud: 1,
        focused: 1,
      },
    };
    
    return NextResponse.json({
      success: true,
      data: {
        history,
        summary,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取心情历史失败' },
      { status: 500 }
    );
  }
}