import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get achievement details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Get achievement
    const achievement = await prisma.achievement.findUnique({
      where: { id: params.id },
      include: {
        userAchievements: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { unlockedAt: 'asc' },
          take: 10,
        },
        _count: {
          select: {
            userAchievements: true,
          },
        },
      },
    });

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Check if user has unlocked this achievement
    let userUnlock = null;
    let progress = 0;
    
    if (userId) {
      userUnlock = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: params.id,
          },
        },
      });

      // Calculate progress based on requirement type
      const requirement = achievement.requirement as any;
      if (requirement) {
        let current = 0;
        
        switch (requirement.type) {
          case 'diaries':
            current = await prisma.diary.count({ where: { authorId: userId } });
            break;
          case 'words':
            const diaries = await prisma.diary.findMany({
              where: { authorId: userId },
              select: { content: true },
            });
            current = diaries.reduce((sum, d) => sum + d.content.length, 0);
            break;
          case 'streak':
            const stats = await prisma.userStats.findUnique({
              where: { userId },
              select: { longestStreak: true },
            });
            current = stats?.longestStreak || 0;
            break;
          case 'focus_minutes':
            const focusSessions = await prisma.focusSession.findMany({
              where: { userId },
              select: { duration: true },
            });
            current = focusSessions.reduce((sum, s) => sum + s.duration, 0);
            break;
          default:
            current = 0;
        }
        
        progress = Math.min(100, (current / requirement.target) * 100);
        requirement.current = current;
      }
    }

    // Get first unlocker
    const firstUnlock = achievement.userAchievements[0];
    const recentUnlocks = achievement.userAchievements.slice(0, 5);

    // Get related achievements
    const relatedAchievements = await prisma.achievement.findMany({
      where: {
        category: achievement.category,
        id: { not: achievement.id },
      },
      take: 4,
      include: userId ? {
        userAchievements: {
          where: { userId },
          select: { id: true },
        },
      } : false,
    });

    return NextResponse.json({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      requirement: achievement.requirement,
      rewards: achievement.rewards || [],
      unlockedAt: userUnlock?.unlockedAt,
      progress,
      unlocked: !!userUnlock,
      users: achievement._count.userAchievements,
      firstUnlockedBy: firstUnlock ? {
        id: firstUnlock.user.id,
        name: firstUnlock.user.name || 'Anonymous',
        avatar: firstUnlock.user.image || '/default-avatar.png',
        unlockedAt: firstUnlock.unlockedAt,
      } : null,
      recentUnlocks: recentUnlocks.map(u => ({
        id: u.user.id,
        name: u.user.name || 'Anonymous',
        avatar: u.user.image || '/default-avatar.png',
        unlockedAt: u.unlockedAt,
      })),
      tips: achievement.tips || [],
      relatedAchievements: relatedAchievements.map(a => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
        unlocked: userId ? (a as any).userAchievements?.length > 0 : false,
      })),
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    );
  }
}