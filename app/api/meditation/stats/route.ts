import { NextRequest, NextResponse } from 'next/server';

// Mock data (in production, use database)
const generateMockData = () => {
  const meditations: any[] = [];
  const types = ['mindfulness', 'breathing', 'guided', 'body-scan', 'loving-kindness', 'walking', 'zen'];
  const moods = ['calm', 'refreshed', 'focused', 'relaxed', 'peaceful', 'energized', 'grateful', 'neutral'];
  const techniques = ['深呼吸', '数息法', '观呼吸', '身体觉察', '念头观察', '慈悲观'];
  
  // Generate 60 days of data
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random number of meditations per day (0-3)
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0;
    
    for (let j = 0; j < count; j++) {
      meditations.push({
        id: `${i}-${j}`,
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.floor(Math.random() * 45) + 5,
        date: date.toISOString().split('T')[0],
        mood: moods[Math.floor(Math.random() * moods.length)],
        focus_level: Math.floor(Math.random() * 5) + 5,
        techniques: techniques.slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }
  }
  
  return meditations;
};

// GET - Meditation statistics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'month';
  
  // Generate or get meditations
  const meditations = globalThis.meditationsData || generateMockData();
  
  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  if (range === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (range === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }
  
  const filteredMeditations = meditations.filter((m: any) => 
    new Date(m.date) >= startDate && new Date(m.date) <= now
  );
  
  // Basic stats
  const totalSessions = filteredMeditations.length;
  const totalMinutes = filteredMeditations.reduce((sum: number, m: any) => sum + m.duration, 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  // Calculate streaks
  const dates = [...new Set(meditations.map((m: any) => m.date))].sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (dates.includes(expectedDateStr)) {
      tempStreak++;
      if (i === 0 && (dates[0] === today || dates[0] === yesterday)) {
        currentStreak = tempStreak;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // This week and month
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  const thisWeek = meditations.filter((m: any) => new Date(m.date) >= weekAgo).length;
  const thisMonth = meditations.filter((m: any) => new Date(m.date) >= monthAgo).length;
  
  // Daily trend
  const daily: any[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayMeditations = meditations.filter((m: any) => m.date === dateStr);
    daily.push({
      date: dateStr,
      count: dayMeditations.length,
      minutes: dayMeditations.reduce((sum: number, m: any) => sum + m.duration, 0)
    });
  }
  
  // By type
  const typeCounts: Record<string, { count: number; minutes: number }> = {};
  filteredMeditations.forEach((m: any) => {
    if (!typeCounts[m.type]) {
      typeCounts[m.type] = { count: 0, minutes: 0 };
    }
    typeCounts[m.type].count++;
    typeCounts[m.type].minutes += m.duration;
  });
  const byType = Object.entries(typeCounts)
    .map(([type, data]) => ({ type, ...data }))
    .sort((a, b) => b.minutes - a.minutes);
  
  // By mood
  const moodCounts: Record<string, number> = {};
  filteredMeditations.forEach((m: any) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  const byMood = Object.entries(moodCounts)
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count);
  
  // By time of day
  const hourCounts: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = Math.floor(Math.random() * 10); // Mock data
  }
  // Peak hours: 6-8am, 12-1pm, 9-10pm
  hourCounts[6] = 15 + Math.floor(Math.random() * 10);
  hourCounts[7] = 20 + Math.floor(Math.random() * 10);
  hourCounts[8] = 10 + Math.floor(Math.random() * 5);
  hourCounts[12] = 8 + Math.floor(Math.random() * 5);
  hourCounts[21] = 12 + Math.floor(Math.random() * 8);
  hourCounts[22] = 18 + Math.floor(Math.random() * 10);
  
  const byTimeOfDay = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
  
  // Generate insights
  const insights: string[] = [];
  
  if (currentStreak >= 7) {
    insights.push(`🎉 你已连续冥想 ${currentStreak} 天，继续保持！`);
  }
  
  const mostCommonType = byType[0];
  if (mostCommonType) {
    insights.push(`📊 你最喜欢的冥想类型是 ${mostCommonType.type}，共练习了 ${mostCommonType.count} 次`);
  }
  
  if (avgDuration >= 20) {
    insights.push(`⏱️ 你的平均冥想时长为 ${avgDuration} 分钟，超过大多数初学者！`);
  }
  
  const peakHours = byTimeOfDay.filter(h => h.count >= 15).map(h => `${h.hour}:00`);
  if (peakHours.length > 0) {
    insights.push(`🌅 你通常在 ${peakHours.join('、')} 进行冥想，这是很好的习惯`);
  }
  
  if (longestStreak >= 30) {
    insights.push(`🏆 你的最长连续冥想记录是 ${longestStreak} 天，非常了不起！`);
  }
  
  return NextResponse.json({
    stats: {
      totalSessions,
      totalMinutes,
      avgDuration,
      streak: currentStreak,
      thisWeek,
      thisMonth
    },
    streaks: {
      current: currentStreak,
      longest: longestStreak
    },
    daily,
    byType,
    byMood,
    byTimeOfDay,
    insights
  });
}