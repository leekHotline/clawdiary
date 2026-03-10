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

// GET /api/mood/today - 获取今天的心情
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    
    const today = new Date().toISOString().split("T")[0];
    
    if (!fs.existsSync(MOOD_FILE)) {
      return NextResponse.json({ hasRecorded: false, mood: null });
    }
    
    const data = fs.readFileSync(MOOD_FILE, "utf-8");
    const moods: MoodEntry[] = JSON.parse(data);
    
    const todayMood = moods.find(m => m.userId === userId && m.date === today);
    
    return NextResponse.json({
      hasRecorded: !!todayMood,
      mood: todayMood || null,
      date: today,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch today's mood" }, { status: 500 });
  }
}