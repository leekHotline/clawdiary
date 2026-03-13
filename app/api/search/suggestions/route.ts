import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/search/suggestions - 搜索建议
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const diaries = await getDiaries();
    
    if (!q || q.length < 1) {
      // 返回热门建议
      const allTags = diaries.flatMap(d => d.tags || []);
      const tagCounts: Record<string, number> = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      
      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({
          text: tag,
          type: "tag",
          count,
        }));
      
      const recentTitles = diaries
        .slice(0, 5)
        .map(d => ({
          text: d.title,
          type: "title",
          id: d.id,
        }));
      
      return NextResponse.json({
        suggestions: [...topTags, ...recentTitles].slice(0, limit),
        type: "popular",
      });
    }
    
    // 搜索建议
    const suggestions: Array<{
      text: string;
      type: "title" | "tag" | "content";
      id?: string;
      count?: number;
    }> = [];
    
    // 匹配标题
    diaries.forEach(d => {
      if (d.title.toLowerCase().includes(q)) {
        suggestions.push({
          text: d.title,
          type: "title",
          id: d.id,
        });
      }
    });
    
    // 匹配标签
    diaries.forEach(d => {
      d.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(q) && !suggestions.find(s => s.text === tag)) {
          const count = diaries.filter(dd => dd.tags?.includes(tag)).length;
          suggestions.push({
            text: tag,
            type: "tag",
            count,
          });
        }
      });
    });
    
    // 匹配内容片段
    diaries.forEach(d => {
      const lowerContent = d.content.toLowerCase();
      const index = lowerContent.indexOf(q);
      if (index !== -1 && !suggestions.find(s => s.id === d.id)) {
        const start = Math.max(0, index - 20);
        const end = Math.min(d.content.length, index + q.length + 30);
        const snippet = (start > 0 ? "..." : "") + 
          d.content.slice(start, end) + 
          (end < d.content.length ? "..." : "");
        
        suggestions.push({
          text: snippet.replace(/\n/g, " "),
          type: "content",
          id: d.id,
        });
      }
    });
    
    return NextResponse.json({
      suggestions: suggestions.slice(0, limit),
      query: q,
      type: "matching",
    });
  } catch (_error) {
    console.error("获取搜索建议失败:", _error);
    return NextResponse.json(
      { error: "获取搜索建议失败" },
      { status: 500 }
    );
  }
}