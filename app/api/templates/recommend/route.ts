import { NextResponse } from 'next/server';
import { getRecommendedTemplates, getPopularTemplates } from '@/lib/templates';

// GET /api/templates/recommend - 获取推荐模板
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    // 根据当前时间推荐
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }

    // 获取基于时间的推荐
    const timeBasedRecommendations = getRecommendedTemplates(timeOfDay, dayOfWeek);

    // 获取热门模板
    const popularTemplates = getPopularTemplates(5);

    // 合并去重
    const allRecommendations = [...new Map(
      [...timeBasedRecommendations, ...popularTemplates].map(t => [t.id, t])
    ).values()].slice(0, limit);

    return NextResponse.json({
      success: true,
      data: allRecommendations,
      meta: {
        timeOfDay,
        dayOfWeek,
        hour,
        message: getTimeBasedMessage(timeOfDay)
      }
    });
  } catch (_error) {
    console.error('Error fetching recommendations:', _error);
    return NextResponse.json(
      { success: false, error: '获取推荐失败' },
      { status: 500 }
    );
  }
}

function getTimeBasedMessage(timeOfDay: string): string {
  const messages = {
    morning: '早安！新的一天，从记录开始 ☀️',
    afternoon: '下午好！记录一下上午的收获吧 🌤️',
    evening: '傍晚了，是时候反思一下今天 🌆',
    night: '夜深了，写下今天的最后一段思绪 🌙'
  };
  return messages[timeOfDay as keyof typeof messages] || '开始记录你的故事';
}