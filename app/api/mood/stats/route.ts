import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface MoodEntry {
  id: string;
  userId: string;
  mood: "great" | "good" | "okay" | "bad" | "terrible";
  note?: string;
  date: string;
  createdAt: string;
}

const MOOD_FILE = path.join(process.cwd(), "data", "moods.json");

const moodScores: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
};

// GET /api/mood/stats - 获取心情统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "30");
    
    if (!fs.existsSync(MOOD_FILE)) {
      return NextResponse.json({
        total: 0,
        averageScore: 0,
        distribution: { great: 0, good: 0, okay: 0, bad: 0, terrible: 0 },
        trend: [],
      });
    }
    
    const data = fs.readFileSync(MOOD_FILE, "utf-8");
    let moods: MoodEntry[] = JSON.parse(data);
    
    if (userId) {
      moods = moods.filter(m => m.userId === userId);
    }
    
    // 计算日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const recentMoods = moods.filter(m => {
      const moodDate = new Date(m.date);
      return moodDate >= startDate && moodDate <= endDate;
    });
    
    // 心情分布
    const distribution: Record<string, number> = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };
    recentMoods.forEach(m => distribution[m.mood]++);
    
    // 平均分
    const avgScore = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + moodScores[m.mood], 0) / recentMoods.length
      : 0;
    
    // 按日期分组（用于趋势图）
    const dailyScores: Record<string, { total: number; count: number }> = {};
    recentMoods.forEach(m => {
      if (!dailyScores[m.date]) {
        dailyScores[m.date] = { total: 0, count: 0 };
      }
      dailyScores[m.date].total += moodScores[m.mood];
      dailyScores[m.date].count++;
    });
    
    const trend = Object.entries(dailyScores)
      .map(([date, data]) => ({
        date,
        avgScore: Math.round((data.total / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return NextResponse.json({
      total: recentMoods.length,
      days,
      averageScore: Math.round(avgScore * 10) / 10,
      distribution,
      trend,
      mostCommon: Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mood stats" }, { status: 500 });
  }
}