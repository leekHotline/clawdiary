import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get today's focus sessions and stats
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: session.user.id,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: { startTime: 'desc' },
    });

    const stats = {
      totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
      totalWords: sessions.reduce((sum, s) => sum + s.wordsWritten, 0),
      sessions: sessions.length,
    };

    return NextResponse.json({ sessions, stats });
  } catch (error) {
    console.error('Error fetching today focus sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today focus sessions' },
      { status: 500 }
    );
  }
}