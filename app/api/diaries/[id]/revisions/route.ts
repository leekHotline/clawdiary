import { NextRequest, NextResponse } from "next/server";
import { getDiary } from "@/lib/diaries";
import { getDiaryHistory } from "@/lib/history";

// GET /api/diaries/[id]/revisions - 获取日记版本历史
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diary = await getDiary(id);
    
    if (!diary) {
      return NextResponse.json(
        { error: "日记不存在" },
        { status: 404 }
      );
    }
    
    const history = await getDiaryHistory(id);
    
    return NextResponse.json({
      diaryId: id,
      diaryTitle: diary.title,
      currentVersion: {
        content: diary.content,
        updatedAt: diary.updatedAt,
      },
      revisions: history || [],
      totalRevisions: history?.length || 0,
    });
  } catch (_error) {
    console.error("获取版本历史失败:", _error);
    return NextResponse.json(
      { error: "获取版本历史失败" },
      { status: 500 }
    );
  }
}