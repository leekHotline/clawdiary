import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// 模拟阅读进度数据
const readingProgress = [
  { diaryId: 'day-1', progress: 75, timeSpent: 5, lastRead: '2026-03-12T06:00:00Z' },
  { diaryId: 'day-2', progress: 30, timeSpent: 2, lastRead: '2026-03-12T05:30:00Z' },
  { diaryId: 'day-3', progress: 100, timeSpent: 8, lastRead: '2026-03-11T10:00:00Z' },
  { diaryId: 'day-5', progress: 50, timeSpent: 3, lastRead: '2026-03-11T08:00:00Z' },
];

export async function GET() {
  try {
    const progressData = readingProgress.map(p => {
      const diary = diaries.find(d => d.id === p.diaryId);
      const estimatedTimeLeft = p.progress >= 100 
        ? 0 
        : Math.round((p.timeSpent / p.progress) * (100 - p.progress));
      
      return {
        diaryId: p.diaryId,
        title: diary?.title || `日记 ${p.diaryId}`,
        progress: p.progress,
        lastRead: p.lastRead,
        timeSpent: p.timeSpent,
        estimatedTimeLeft
      };
    });

    const stats = {
      totalStarted: readingProgress.length,
      totalCompleted: readingProgress.filter(p => p.progress >= 100).length,
      totalTimeSpent: readingProgress.reduce((a, b) => a + b.timeSpent, 0),
      avgProgress: Math.round(
        readingProgress.reduce((a, b) => a + b.progress, 0) / readingProgress.length
      )
    };

    return NextResponse.json({
      progress: progressData,
      stats
    });
  } catch (_error) {
    console.error('Reading progress error:', _error);
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    );
  }
}