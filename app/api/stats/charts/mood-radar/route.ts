import { NextResponse } from 'next/server';

// 心情雷达图 API - 多维度心情分析
export async function GET() {
  // 心情维度分析
  const moodDimensions = [
    { dimension: '愉悦度', value: 75, description: '整体开心程度' },
    { dimension: '平静度', value: 68, description: '内心平和程度' },
    { dimension: '活力值', value: 82, description: '精力充沛程度' },
    { dimension: '专注度', value: 71, description: '注意力集中程度' },
    { dimension: '创造力', value: 85, description: '灵感涌现程度' },
    { dimension: '满足感', value: 78, description: '生活满意度' }
  ];

  // 心情分布统计
  const moodDistribution = [
    { mood: '开心', count: 45, percentage: 35, emoji: '😊' },
    { mood: '平静', count: 32, percentage: 25, emoji: '😌' },
    { mood: '充实', count: 28, percentage: 22, emoji: '💪' },
    { mood: '思考', count: 15, percentage: 12, emoji: '🤔' },
    { mood: '疲惫', count: 5, percentage: 4, emoji: '😴' },
    { mood: '其他', count: 3, percentage: 2, emoji: '🤷' }
  ];

  // 周内心情变化
  const weeklyMood = [
    { day: '周一', score: 72, dominantMood: '充实' },
    { day: '周二', score: 78, dominantMood: '专注' },
    { day: '周三', score: 75, dominantMood: '平静' },
    { day: '周四', score: 80, dominantMood: '开心' },
    { day: '周五', score: 85, dominantMood: '期待' },
    { day: '周六', score: 88, dominantMood: '放松' },
    { day: '周日', score: 82, dominantMood: '感恩' }
  ];

  // 心情影响因素
  const factors = [
    { factor: '天气', impact: 'positive', correlation: 0.65 },
    { factor: '运动', impact: 'positive', correlation: 0.72 },
    { factor: '社交', impact: 'positive', correlation: 0.58 },
    { factor: '睡眠', impact: 'positive', correlation: 0.82 },
    { factor: '工作', impact: 'mixed', correlation: 0.45 },
    { factor: '阅读', impact: 'positive', correlation: 0.68 }
  ];

  // 计算综合心情指数
  const overallScore = Math.round(
    moodDimensions.reduce((sum, d) => sum + d.value, 0) / moodDimensions.length
  );

  return NextResponse.json({
    success: true,
    data: {
      radar: {
        dimensions: moodDimensions,
        maxValue: 100
      },
      distribution: moodDistribution,
      weekly: weeklyMood,
      factors,
      analysis: {
        overallScore,
        moodLevel: overallScore >= 80 ? '优秀' : overallScore >= 60 ? '良好' : overallScore >= 40 ? '一般' : '需要关注',
        dominantMood: moodDistribution[0].mood,
        bestDay: weeklyMood.reduce((best, day) => day.score > best.score ? day : best).day,
        insights: [
          overallScore >= 75 ? '🌟 心情状态非常好，继续保持！' : '💪 有提升空间，试试调整作息',
          `📈 ${weeklyMood.reduce((best, day) => day.score > best.score ? day : best).day}是你状态最佳的日子`,
          '🎯 运动和睡眠对心情影响最大，建议优先关注'
        ],
        recommendations: factors
          .filter(f => f.impact === 'positive' && f.correlation >= 0.6)
          .map(f => `增加${f.factor}活动`)
      }
    }
  });
}