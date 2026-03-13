import { NextRequest, NextResponse } from "next/server";
import { getDiaries, createDiary } from "@/lib/diaries";

// GET /api/diaries - 获取所有日记
export async function GET() {
  try {
    const diaries = await getDiaries();
    return NextResponse.json(diaries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch diaries" }, { status: 500 });
  }
}

// POST /api/diaries - 创建新日记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, date, author, tags, mood, weather, isPublic } = body;
    
    if (!title || !content || !date || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const diary = await createDiary({ 
      title, 
      content, 
      date, 
      author, 
      tags,
      mood,
      weather,
      isPublic: isPublic ?? true
    });
    return NextResponse.json(diary, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create diary" }, { status: 500 });
  }
}