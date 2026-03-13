import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// 模拟心理健康数据
const mentalHealthData = {
  moodTrend: [
    { date: '2026-03-06', score: 75, mood: 'happy' },
    { date: '2026-03-07', score: 80, mood: 'excited' },
    { date: '2026-03-08', score: 65, mood: 'neutral' },
    { date: '2026-03-09', score: 70, mood: 'calm' },
    { date: '2026-03-10', score: 85, mood: 'happy' },
    { date: '2026-03-11', score: 60, mood: 'anxious' },
    { date: '2026-03-12', score: 78, mood: 'productive' },
  ],
  sentimentAnalysis: {
    overall: 73,
    positive: 45,
    neutral: 35,
    negative: 20,
    topEmotions: [
      { emotion: '开心', count: 28, percentage: 35 },
      { emotion: '平静', count: 22, percentage: 28 },
      { emotion: '专注', count: 18, percentage: 22 },
      { emotion: '焦虑', count: 8, percentage: 10 },
      { emotion: '疲惫', count: 4, percentage: 5 },
    ],
  },
  weeklyInsights: [
    {
      week: '2026年第11周',
      summary: '本周整体情绪稳定，有两天工作效率较高。',
      highlights: ['周二完成重要项目', '周五进行户外运动'],
      suggestions: ['保持规律作息', '适当增加户外活动'],
    },
  ],
  streaks: {
    currentWritingStreak: 60,
    longestWritingStreak: 60,
    moodTrackingStreak: 45,
    positiveDaysThisMonth: 18,
  },
  correlations: [
    { factor1: '运动', factor2: '心情', correlation: 0.75, note: '运动后心情明显提升' },
    { factor1: '睡眠', factor2: '专注度', correlation: 0.68, note: '睡眠充足时专注度更高' },
    { factor1: '天气', factor2: '情绪', correlation: 0.45, note: '晴天时情绪更积极' },
  ],
  riskFactors: [
    { factor: '连续熬夜', level: 'low', description: '本周有1天睡眠不足' },
    { factor: '压力累积', level: 'medium', description: '近期工作压力较大' },
  ],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || 'week'; // week, month, year

  try {
    // 根据日记计算心理健康指标
    const moodCounts: Record<string, number> = {};
    let totalWordCount = 0;
    let totalDiaries = 0;

    diaries.forEach(diary => {
      totalDiaries++;
      totalWordCount += (diary as any).wordCount || 0;
      if (diary.mood) {
        moodCounts[diary.mood] = (moodCounts[diary.mood] || 0) + 1;
      }
    });

    // 生成报告
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalDiaries,
        totalWords: totalWordCount,
        averageWordsPerDiary: Math.round(totalWordCount / totalDiaries) || 0,
        daysTracked: totalDiaries,
        consistency: Math.min(100, Math.round((totalDiaries / 60) * 100)),
      },
      moodAnalysis: {
        counts: moodCounts,
        dominantMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '未记录',
        moodDiversity: Object.keys(moodCounts).length,
      },
      ...mentalHealthData,
      recommendations: generateRecommendations(moodCounts, totalDiaries),
    };

    return NextResponse.json(report);
  } catch (_error) {
    console.error('Mental health report error:', _error);
    return NextResponse.json({ error: '生成报告失败' }, { status: 500 });
  }
}

function generateRecommendations(moodCounts: Record<string, number>, totalDiaries: number): string[] {
  const recommendations: string[] = [];
  
  const negativeMoods = ['sad', 'anxious', 'stressed', 'angry', 'tired'];
  const negativeCount = negativeMoods.reduce((sum, mood) => sum + (moodCounts[mood] || 0), 0);
  const negativeRatio = negativeCount / totalDiaries;

  if (negativeRatio > 0.3) {
    recommendations.push('💡 近期负面情绪较多，建议多进行户外活动或与朋友交流');
  }

  if (!moodCounts['happy'] && !moodCounts['excited']) {
    recommendations.push('💡 建议记录更多积极时刻，培养感恩习惯');
  }

  if (totalDiaries < 30) {
    recommendations.push('💡 继续坚持记录，30天后可以看到更明显的趋势分析');
  }

  if (Object.keys(moodCounts).length < 3) {
    recommendations.push('💡 尝试用更多样的心情标签记录，可以获得更丰富的心境洞察');
  }

  recommendations.push('💡 保持每日记录习惯，有助于更好地了解自己');

  return recommendations;
}