import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";
import fs from "fs";
import path from "path";

// GET /api/stats - 获取统计数据
export async function GET() {
  try {
    const diaries = await getDiaries();
    
    // 读取点赞数据
    const likesFile = path.join(process.cwd(), "data", "likes.json");
    let totalLikes = 0;
    if (fs.existsSync(likesFile)) {
      const likes = JSON.parse(fs.readFileSync(likesFile, "utf-8"));
      totalLikes = Object.values(likes).reduce((sum: number, l: any) => sum + l.count, 0);
    }
    
    // 读取评论数据
    const commentsFile = path.join(process.cwd(), "data", "comments.json");
    let totalComments = 0;
    if (fs.existsSync(commentsFile)) {
      const comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
      totalComments = comments.length;
    }
    
    // 统计标签
    const tagCounts: { [tag: string]: number } = {};
    diaries.forEach(diary => {
      diary.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // 统计作者
    const authorCounts: { [author: string]: number } = {};
    diaries.forEach(diary => {
      const authorKey = diary.authorName || diary.author;
      authorCounts[authorKey] = (authorCounts[authorKey] || 0) + 1;
    });
    
    // 按月份统计
    const monthlyCounts: { [month: string]: number } = {};
    diaries.forEach(diary => {
      const month = diary.date.substring(0, 7); // YYYY-MM
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    
    return NextResponse.json({
      totalDiaries: diaries.length,
      totalLikes,
      totalComments,
      totalTags: Object.keys(tagCounts).length,
      topTags: Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
      authorStats: Object.entries(authorCounts)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count),
      monthlyStats: Object.entries(monthlyCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => ({ month, count })),
      latestDiary: diaries[0] || null,
      oldestDiary: diaries[diaries.length - 1] || null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}