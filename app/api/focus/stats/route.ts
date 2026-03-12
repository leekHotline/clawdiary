import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get focus session statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // day, week, month, year

    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: startDate,
        },
      },
      orderBy: { startTime: 'asc' },
    });

    // Calculate statistics
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalWords = sessions.reduce((sum, s) => sum + s.wordsWritten, 0);
    const avgDuration = sessions.length > 0 ? totalMinutes / sessions.length : 0;
    const avgWords = sessions.length > 0 ? totalWords / sessions.length : 0;

    // Group by date
    const byDate: Record<string, { minutes: number; words: number; sessions: number }> = {};
    sessions.forEach((s) => {
      const dateKey = new Date(s.startTime).toISOString().split('T')[0];
      if (!byDate[dateKey]) {
        byDate[dateKey] = { minutes: 0, words: 0, sessions: 0 };
      }
      byDate[dateKey].minutes += s.duration;
      byDate[dateKey].words += s.wordsWritten;
      byDate[dateKey].sessions += 1;
    });

    // Best day
    let bestDay = { date: '', minutes: 0, words: 0, sessions: 0 };
    Object.entries(byDate).forEach(([date, stats]) => {
      if (stats.minutes > bestDay.minutes) {
        bestDay = { date, ...stats };
      }
    });

    // Current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      if (byDate[dateKey] && byDate[dateKey].sessions > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Hour distribution
    const hourDistribution = new Array(24).fill(0);
    sessions.forEach((s) => {
      const hour = new Date(s.startTime).getHours();
      hourDistribution[hour] += s.duration;
    });

    return NextResponse.json({
      period,
      overview: {
        totalMinutes,
        totalWords,
        totalSessions: sessions.length,
        avgDuration: Math.round(avgDuration),
        avgWords: Math.round(avgWords),
        streak,
      },
      bestDay: bestDay.date ? bestDay : null,
      byDate,
      hourDistribution,
      dailyAverage: {
        minutes: Object.keys(byDate).length > 0 
          ? Math.round(totalMinutes / Object.keys(byDate).length)
          : 0,
        words: Object.keys(byDate).length > 0
          ? Math.round(totalWords / Object.keys(byDate).length)
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching focus stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch focus stats' },
      { status: 500 }
    );
  }
}