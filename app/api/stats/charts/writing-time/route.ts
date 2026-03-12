import { NextResponse } from 'next/server';

// 写作时间分布 API - 统计每小时的写作频率
export async function GET() {
  // 模拟数据 - 实际项目从数据库统计
  const hourlyDistribution = [
    { hour: 0, count: 5, label: '00:00' },
    { hour: 1, count: 3, label: '01:00' },
    { hour: 2, count: 1, label: '02:00' },
    { hour: 3, count: 0, label: '03:00' },
    { hour: 4, count: 2, label: '04:00' },
    { hour: 5, count: 8, label: '05:00' },
    { hour: 6, count: 25, label: '06:00' },
    { hour: 7, count: 42, label: '07:00' },
    { hour: 8, count: 35, label: '08:00' },
    { hour: 9, count: 28, label: '09:00' },
    { hour: 10, count: 22, label: '10:00' },
    { hour: 11, count: 18, label: '11:00' },
    { hour: 12, count: 12, label: '12:00' },
    { hour: 13, count: 15, label: '13:00' },
    { hour: 14, count: 20, label: '14:00' },
    { hour: 15, count: 25, label: '15:00' },
    { hour: 16, count: 30, label: '16:00' },
    { hour: 17, count: 28, label: '17:00' },
    { hour: 18, count: 22, label: '18:00' },
    { hour: 19, count: 18, label: '19:00' },
    { hour: 20, count: 35, label: '20:00' },
    { hour: 21, count: 45, label: '21:00' },
    { hour: 22, count: 38, label: '22:00' },
    { hour: 23, count: 15, label: '23:00' }
  ];

  // 分析最佳写作时段
  const peakHours = [...hourlyDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(h => h.hour);

  // 时段分析
  const periodAnalysis = {
    morning: hourlyDistribution.filter(h => h.hour >= 6 && h.hour < 12).reduce((sum, h) => sum + h.count, 0),
    afternoon: hourlyDistribution.filter(h => h.hour >= 12 && h.hour < 18).reduce((sum, h) => sum + h.count, 0),
    evening: hourlyDistribution.filter(h => h.hour >= 18 && h.hour < 22).reduce((sum, h) => sum + h.count, 0),
    night: hourlyDistribution.filter(h => h.hour >= 22 || h.hour < 6).reduce((sum, h) => sum + h.count, 0)
  };

  const total = Object.values(periodAnalysis).reduce((sum, v) => sum + v, 0);

  return NextResponse.json({
    success: true,
    data: {
      hourly: hourlyDistribution,
      analysis: {
        peakHours,
        peakHourLabel: `最佳写作时段: ${peakHours[0]}:00 - ${peakHours[0] + 1}:00`,
        periodBreakdown: {
          morning: { count: periodAnalysis.morning, percentage: Math.round(periodAnalysis.morning / total * 100) },
          afternoon: { count: periodAnalysis.afternoon, percentage: Math.round(periodAnalysis.afternoon / total * 100) },
          evening: { count: periodAnalysis.evening, percentage: Math.round(periodAnalysis.evening / total * 100) },
          night: { count: periodAnalysis.night, percentage: Math.round(periodAnalysis.night / total * 100) }
        },
        insights: [
          periodAnalysis.morning > periodAnalysis.night ? '🌅 早晨写作效率更高' : '🌙 夜晚是你的创作时间',
          peakHours[0] >= 20 ? '💡 晚间灵感迸发期' : '☀️ 白天精力充沛',
          '📊 建议在高效时段安排重要写作任务'
        ]
      }
    }
  });
}