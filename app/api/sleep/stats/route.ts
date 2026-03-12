import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'month';
  
  // Demo sleep statistics
  const stats = {
    period,
    averageDuration: 7.4,
    averageQuality: 3.6,
    totalRecords: 30,
    bestNight: {
      date: '2026-03-10',
      duration: 7.75,
      quality: 5,
    },
    worstNight: {
      date: '2026-03-09',
      duration: 7,
      quality: 2,
    },
    idealBedtime: '23:00',
    idealWakeTime: '07:00',
    sleepDebt: 2.5,
    streak: {
      goodSleep: 5,
      bedTimeGoal: 3,
    },
    weeklyTrend: [
      { week: '第1周', avgDuration: 7.2, avgQuality: 3.5 },
      { week: '第2周', avgDuration: 7.5, avgQuality: 3.7 },
      { week: '第3周', avgDuration: 7.3, avgQuality: 3.4 },
      { week: '第4周', avgDuration: 7.6, avgQuality: 3.8 },
    ],
    qualityDistribution: [
      { quality: 5, count: 5 },
      { quality: 4, count: 10 },
      { quality: 3, count: 8 },
      { quality: 2, count: 5 },
      { quality: 1, count: 2 },
    ],
    recommendations: [
      '建议在23:00前入睡',
      '睡前1小时避免使用手机',
      '保持规律的作息时间',
      '睡前可以尝试冥想',
    ],
    generatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(stats);
}