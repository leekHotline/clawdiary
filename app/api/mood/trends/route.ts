import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 心情映射到数值
const moodToValue: Record<string, number> = {
  'happy': 5,
  'excited': 5,
  'joyful': 5,
  'cheerful': 4.5,
  'good': 4,
  'calm': 3.5,
  'neutral': 3,
  'okay': 3,
  'tired': 2.5,
  'bored': 2,
  'sad': 1.5,
  'anxious': 1.5,
  'stressed': 1,
  'angry': 1,
  'frustrated': 1,
  'productive': 4,
  'creative': 4.5,
  'inspired': 4.5,
  'satisfied': 4,
  'grateful': 4.5,
  'peaceful': 4,
  'melancholy': 2,
  'nostalgic': 2.5,
  'hopeful': 4,
  'determined': 4,
};

const moodCategories = {
  positive: ['happy', 'excited', 'joyful', 'cheerful', 'good', 'calm', 'productive', 'creative', 'inspired', 'satisfied', 'grateful', 'peaceful', 'hopeful', 'determined'],
  negative: ['sad', 'anxious', 'stressed', 'angry', 'frustrated', 'tired', 'bored', 'melancholy'],
  neutral: ['neutral', 'okay']
};

// GET /api/mood/trends - 心情趋势分析
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // week, month, year
    const detailed = searchParams.get("detailed") === "true";

    const diaries = await getDiaries();
    
    // 过滤有心情的日记
    const moodDiaries = diaries
      .filter(d => d.mood)
      .map(d => ({
        id: d.id,
        date: d.date,
        mood: d.mood!,
        value: moodToValue[d.mood!] || 3,
        title: d.title,
        content: d.content?.substring(0, 200)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (moodDiaries.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalRecords: 0,
          message: "暂无心情数据"
        }
      });
    }

    // 按时间段分组
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const recentMoods = moodDiaries.filter(d => new Date(d.date) >= startDate);
    const olderMoods = moodDiaries.filter(d => new Date(d.date) < startDate);

    // 心情分布
    const distribution: Record<string, number> = {};
    moodDiaries.forEach(d => {
      distribution[d.mood] = (distribution[d.mood] || 0) + 1;
    });

    // 分类统计
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    moodDiaries.forEach(d => {
      if (moodCategories.positive.includes(d.mood)) positiveCount++;
      else if (moodCategories.negative.includes(d.mood)) negativeCount++;
      else neutralCount++;
    });

    // 按日期聚合
    const dailyAvg: Record<string, { total: number; count: number; moods: string[] }> = {};
    moodDiaries.forEach(d => {
      if (!dailyAvg[d.date]) {
        dailyAvg[d.date] = { total: 0, count: 0, moods: [] };
      }
      dailyAvg[d.date].total += d.value;
      dailyAvg[d.date].count++;
      dailyAvg[d.date].moods.push(d.mood);
    });

    const dailyData = Object.entries(dailyAvg)
      .map(([date, data]) => ({
        date,
        avg: data.total / data.count,
        count: data.count,
        topMood: getTopMood(data.moods)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 按月份聚合
    const monthlyAvg: Record<string, { total: number; count: number; moods: string[] }> = {};
    moodDiaries.forEach(d => {
      const month = d.date.substring(0, 7);
      if (!monthlyAvg[month]) {
        monthlyAvg[month] = { total: 0, count: 0, moods: [] };
      }
      monthlyAvg[month].total += d.value;
      monthlyAvg[month].count++;
      monthlyAvg[month].moods.push(d.mood);
    });

    const monthlyData = Object.entries(monthlyAvg)
      .map(([month, data]) => ({
        month,
        avg: data.total / data.count,
        count: data.count,
        topMood: getTopMood(data.moods)
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // 趋势分析
    const recentAvg = recentMoods.length > 0
      ? recentMoods.reduce((sum, d) => sum + d.value, 0) / recentMoods.length
      : 0;

    const olderAvg = olderMoods.length > 0
      ? olderMoods.reduce((sum, d) => sum + d.value, 0) / olderMoods.length
      : recentAvg;

    const trend = recentAvg - olderAvg;
    const trendDirection = trend > 0.2 ? 'up' : trend < -0.2 ? 'down' : 'stable';

    // 最长连续积极/消极天数
    const streaks = calculateStreaks(dailyData);

    const result = {
      totalRecords: moodDiaries.length,
      period,
      overview: {
        positiveCount,
        negativeCount,
        neutralCount,
        positiveRatio: (positiveCount / moodDiaries.length * 100).toFixed(1),
        averageScore: (moodDiaries.reduce((sum, d) => sum + d.value, 0) / moodDiaries.length).toFixed(2)
      },
      trend: {
        direction: trendDirection,
        change: trend.toFixed(2),
        recentAvg: recentAvg.toFixed(2),
        previousAvg: olderAvg.toFixed(2),
        insight: getTrendInsight(trendDirection, recentAvg)
      },
      distribution: Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .map(([mood, count]) => ({
          mood,
          count,
          percentage: (count / moodDiaries.length * 100).toFixed(1),
          value: moodToValue[mood] || 3
        })),
      daily: detailed ? dailyData.slice(-30) : undefined,
      monthly: monthlyData,
      streaks,
      recentRecords: moodDiaries.slice(-10).reverse()
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Mood trends error:", error);
    return NextResponse.json(
      { error: "获取心情趋势失败" },
      { status: 500 }
    );
  }
}

function getTopMood(moods: string[]): string {
  const counts: Record<string, number> = {};
  moods.forEach(m => counts[m] = (counts[m] || 0) + 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
}

function calculateStreaks(dailyData: Array<{ date: string; avg: number; topMood: string }>) {
  if (dailyData.length === 0) {
    return { currentStreak: 0, longestPositiveStreak: 0, longestNegativeStreak: 0 };
  }

  let currentStreak = 0;
  let longestPositiveStreak = 0;
  let longestNegativeStreak = 0;
  let tempPositiveStreak = 0;
  let tempNegativeStreak = 0;

  // 当前连续
  const sorted = [...dailyData].sort((a, b) => b.date.localeCompare(a.date));
  const threshold = 3;
  
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].avg >= threshold) {
      currentStreak++;
    } else {
      break;
    }
  }

  // 最长连续
  for (const day of dailyData) {
    if (day.avg >= threshold) {
      tempPositiveStreak++;
      tempNegativeStreak = 0;
      longestPositiveStreak = Math.max(longestPositiveStreak, tempPositiveStreak);
    } else {
      tempNegativeStreak++;
      tempPositiveStreak = 0;
      longestNegativeStreak = Math.max(longestNegativeStreak, tempNegativeStreak);
    }
  }

  return {
    currentStreak,
    streakType: currentStreak > 0 ? 'positive' : 'neutral',
    longestPositiveStreak,
    longestNegativeStreak
  };
}

function getTrendInsight(direction: string, avg: number): string {
  if (direction === 'up') {
    return avg >= 4 ? '心情持续向好，保持良好状态！' : '心情在改善，继续保持！';
  } else if (direction === 'down') {
    return avg <= 2 ? '近期心情较低落，注意调节情绪' : '心情有所波动，关注自我调节';
  }
  return avg >= 3.5 ? '情绪稳定，状态良好' : '情绪基本稳定';
}