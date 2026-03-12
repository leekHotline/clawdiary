import { NextRequest, NextResponse } from "next/server";

// 模拟相关日记数据
const mockDiaries = [
  { id: 72, title: "Day 72 - 写作风格深度分析", content: "写作风格分析系统完成...", tags: ["AI", "写作", "分析"], date: "2026-03-11" },
  { id: 71, title: "Day 71 - 每日签到系统", content: "签到系统上线...", tags: ["系统", "功能"], date: "2026-03-10" },
  { id: 70, title: "Day 70 - 任务系统与积分商城", content: "任务系统完成...", tags: ["系统", "积分"], date: "2026-03-09" },
  { id: 69, title: "Day 69 - 排行榜系统", content: "排行榜系统实现...", tags: ["系统", "排名"], date: "2026-03-08" },
  { id: 68, title: "Day 68 - 习惯追踪系统", content: "习惯追踪功能...", tags: ["习惯", "追踪"], date: "2026-03-07" },
];

// 计算相似度 (简单实现)
function calculateSimilarity(diary1: any, diary2: any): number {
  let score = 0;
  
  // 标签相似度
  const commonTags = diary1.tags.filter((t: string) => diary2.tags.includes(t));
  score += commonTags.length * 20;
  
  // 内容关键词匹配 (简化)
  const keywords1 = diary1.content.toLowerCase().split(/\s+/);
  const keywords2 = diary2.content.toLowerCase().split(/\s+/);
  const commonKeywords = keywords1.filter((w: string) => keywords2.includes(w) && w.length > 3);
  score += commonKeywords.length * 5;
  
  // 时间衰减
  const daysDiff = Math.abs(
    (new Date(diary1.date).getTime() - new Date(diary2.date).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff < 7) score += 15;
  else if (daysDiff < 30) score += 10;
  else if (daysDiff < 90) score += 5;
  
  return Math.min(100, score);
}

// 找相似日记
function findRelatedDiaries(diaryId: number, limit: number = 5) {
  const currentDiary = mockDiaries.find(d => d.id === diaryId);
  if (!currentDiary) return [];
  
  const related = mockDiaries
    .filter(d => d.id !== diaryId)
    .map(d => ({
      ...d,
      similarity: calculateSimilarity(currentDiary, d),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return related;
}

// 按标签聚类
function getTagClusters() {
  const tagMap: Record<string, number[]> = {};
  
  mockDiaries.forEach(d => {
    d.tags.forEach((tag: string) => {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(d.id);
    });
  });
  
  return Object.entries(tagMap).map(([tag, diaries]) => ({
    tag,
    count: diaries.length,
    diaries,
  }));
}

// 时间关联
function getTimeRelated(diaryId: number) {
  const currentDiary = mockDiaries.find(d => d.id === diaryId);
  if (!currentDiary) return {};
  
  const currentDate = new Date(currentDiary.date);
  
  return {
    lastWeek: mockDiaries.filter(d => {
      const dDate = new Date(d.date);
      const diff = (currentDate.getTime() - dDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 6 && diff <= 8;
    }),
    lastMonth: mockDiaries.filter(d => {
      const dDate = new Date(d.date);
      const diff = (currentDate.getTime() - dDate.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 28 && diff <= 31;
    }),
    sameDayLastYear: [], // 模拟没有去年数据
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diaryId = parseInt(id);
  
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "all";
  const limit = parseInt(searchParams.get("limit") || "5");
  
  if (type === "similar") {
    return NextResponse.json({
      success: true,
      data: findRelatedDiaries(diaryId, limit),
    });
  }
  
  if (type === "tags") {
    return NextResponse.json({
      success: true,
      data: getTagClusters(),
    });
  }
  
  if (type === "time") {
    return NextResponse.json({
      success: true,
      data: getTimeRelated(diaryId),
    });
  }
  
  // 返回所有
  return NextResponse.json({
    success: true,
    data: {
      similar: findRelatedDiaries(diaryId, limit),
      tagClusters: getTagClusters(),
      timeRelated: getTimeRelated(diaryId),
    },
  });
}