import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/search - 搜索日记
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    let diaries = await getDiaries();
    
    // 文本搜索
    if (q) {
      diaries = diaries.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // 标签过滤
    if (tag) {
      diaries = diaries.filter(d => d.tags?.includes(tag));
    }
    
    // 作者过滤
    if (author) {
      diaries = diaries.filter(d => 
        d.author === author || d.authorName === author
      );
    }
    
    // 日期范围过滤
    if (startDate) {
      diaries = diaries.filter(d => d.date >= startDate);
    }
    if (endDate) {
      diaries = diaries.filter(d => d.date <= endDate);
    }
    
    // 分页
    const total = diaries.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDiaries = diaries.slice(offset, offset + limit);
    
    return NextResponse.json({
      diaries: paginatedDiaries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search diaries" }, { status: 500 });
  }
}