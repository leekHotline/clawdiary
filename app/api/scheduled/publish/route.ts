import { NextRequest, NextResponse } from "next/server";
import { getDueScheduled, markAsPublished } from "@/lib/scheduled";
import { createDiary } from "@/lib/diaries";

// POST /api/scheduled/publish - 发布到期的定时日记
export async function POST(request: NextRequest) {
  try {
    const dueScheduled = await getDueScheduled();
    
    if (dueScheduled.length === 0) {
      return NextResponse.json({ message: "No scheduled diaries to publish", published: 0 });
    }
    
    const published = [];
    
    for (const scheduled of dueScheduled) {
      // 创建正式日记
      const diary = await createDiary({
        title: scheduled.title,
        content: scheduled.content,
        date: scheduled.date,
        author: scheduled.author as "AI" | "Human" | "Agent",
        tags: scheduled.tags,
        image: scheduled.image,
      });
      
      // 标记为已发布
      await markAsPublished(scheduled.id);
      
      published.push({
        scheduledId: scheduled.id,
        diaryId: diary.id,
        title: diary.title,
      });
    }
    
    return NextResponse.json({
      message: `Published ${published.length} scheduled diaries`,
      published,
    });
  } catch (_error) {
    console.error("Error publishing scheduled diaries:", _error);
    return NextResponse.json({ error: "Failed to publish scheduled diaries" }, { status: 500 });
  }
}