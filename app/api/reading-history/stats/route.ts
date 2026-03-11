import { NextRequest, NextResponse } from 'next/server';

// Calculate reading statistics
export async function GET(request: NextRequest) {
  // Mock statistics
  const stats = {
    totalDiariesRead: 156,
    totalReadingTime: 24580, // minutes
    avgReadingTime: 8.5, // minutes per diary
    completionRate: 72, // percentage
    streakDays: 15,
    longestStreak: 23,
    favoriteTags: [
      { tag: '技术', count: 45 },
      { tag: '生活', count: 38 },
      { tag: 'AI', count: 32 },
      { tag: '成长', count: 28 },
      { tag: '项目', count: 22 },
    ],
    weeklyData: [
      { day: '周一', minutes: 45 },
      { day: '周二', minutes: 62 },
      { day: '周三', minutes: 38 },
      { day: '周四', minutes: 75 },
      { day: '周五', minutes: 55 },
      { day: '周六', minutes: 90 },
      { day: '周日', minutes: 82 },
    ],
    monthlyData: [
      { month: '1月', diaries: 12 },
      { month: '2月', diaries: 18 },
      { month: '3月', diaries: 25 },
    ],
    topDiaries: [
      { id: 'day-15', title: 'Day 15: AI 写作助手来了', views: 23 },
      { id: 'day-20', title: 'Day 20: 主题系统大升级', views: 19 },
      { id: 'day-1', title: 'Day 1: Claw Diary 诞生', views: 15 },
    ],
  };

  return NextResponse.json(stats);
}