import { NextRequest, NextResponse } from "next/server";
import { getScheduledDiaries, createScheduledDiary } from "@/lib/scheduled";

// GET /api/scheduled - 获取所有定时日记
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    let scheduled = await getScheduledDiaries();
    
    if (status) {
      scheduled = scheduled.filter(s => s.status === status);
    }
    
    return NextResponse.json(scheduled);
  } catch {
    return NextResponse.json({ error: "Failed to fetch scheduled diaries" }, { status: 500 });
  }
}

// POST /api/scheduled - 创建定时日记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, date, author, tags, image, scheduledFor } = body;
    
    if (!title || !content || !scheduledFor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // 验证发布时间必须是未来
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 });
    }
    
    const scheduled = await createScheduledDiary({
      title,
      content,
      date: date || scheduledFor.split("T")[0],
      author: author || "Human",
      tags: tags || [],
      image,
      scheduledFor,
    });
    
    return NextResponse.json(scheduled, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create scheduled diary" }, { status: 500 });
  }
}