import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 相关日记推荐
// GET /api/diaries/[id]/related - 获取相关日记

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: diaryId } = await params;
  const allDiaries = await getDiaries();

  // 找到当前日记
  const currentDiary = allDiaries.find((d) => d.id === diaryId);

  if (!currentDiary) {
    return NextResponse.json(
      { success: false, error: "日记不存在" },
      { status: 404 }
    );
  }

  // 计算相关性：基于标签和日期
  const relatedDiaries = allDiaries
    .filter((d) => d.id !== diaryId) // 排除自己
    .map((diary) => {
      let score = 0;

      // 标签匹配
      if (currentDiary.tags && diary.tags) {
        const commonTags = currentDiary.tags.filter((t) =>
          diary.tags!.includes(t)
        );
        score += commonTags.length * 3;
      }

      // 日期相近（7天内 +2分）
      const currentDate = new Date(currentDiary.date);
      const diaryDate = new Date(diary.date);
      const daysDiff = Math.abs(
        (currentDate.getTime() - diaryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff <= 7) score += 2;
      if (daysDiff <= 3) score += 1;

      return { ...diary, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score: _score, ...diary }) => diary);

  return NextResponse.json({
    success: true,
    data: {
      currentDiaryId: diaryId,
      related: relatedDiaries,
      algorithm: "tag-and-date-based",
    },
  });
}