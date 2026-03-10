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

function getMoods(): MoodEntry[] {
  try {
    if (!fs.existsSync(MOOD_FILE)) {
      return [];
    }
    const data = fs.readFileSync(MOOD_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMoods(moods: MoodEntry[]) {
  const dataDir = path.dirname(MOOD_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(MOOD_FILE, JSON.stringify(moods, null, 2));
}

const moodScores: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
};

// GET /api/mood - 获取心情记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    let moods = getMoods();
    
    if (userId) {
      moods = moods.filter(m => m.userId === userId);
    }
    
    if (startDate) {
      moods = moods.filter(m => m.date >= startDate);
    }
    
    if (endDate) {
      moods = moods.filter(m => m.date <= endDate);
    }
    
    // 计算统计数据
    const totalMoods = moods.length;
    const moodCounts: Record<string, number> = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };
    
    moods.forEach(m => {
      moodCounts[m.mood]++;
    });
    
    const avgScore = totalMoods > 0
      ? moods.reduce((sum, m) => sum + moodScores[m.mood], 0) / totalMoods
      : 0;
    
    return NextResponse.json({
      entries: moods.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      stats: {
        total: totalMoods,
        counts: moodCounts,
        averageScore: Math.round(avgScore * 10) / 10,
        mostCommon: Object.entries(moodCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch moods" }, { status: 500 });
  }
}

// POST /api/mood - 记录心情
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, mood, note, date } = body;
    
    if (!userId || !mood || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (!moodScores[mood]) {
      return NextResponse.json({ error: "Invalid mood value" }, { status: 400 });
    }
    
    const moods = getMoods();
    
    // 检查当天是否已有记录
    const existingIndex = moods.findIndex(
      m => m.userId === userId && m.date === date
    );
    
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      // 更新现有记录
      moods[existingIndex] = {
        ...moods[existingIndex],
        mood,
        note,
      };
    } else {
      // 创建新记录
      moods.push({
        id: Date.now().toString(),
        userId,
        mood,
        note,
        date,
        createdAt: now,
      });
    }
    
    saveMoods(moods);
    
    return NextResponse.json(existingIndex >= 0 ? moods[existingIndex] : moods[moods.length - 1]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save mood" }, { status: 500 });
  }
}