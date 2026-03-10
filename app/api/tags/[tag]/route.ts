import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/tags/[tag] - 获取特定标签的日记
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const diaries = await getDiaries();
    const taggedDiaries = diaries.filter(d => d.tags?.includes(tag));
    
    const total = taggedDiaries.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDiaries = taggedDiaries.slice(offset, offset + limit);
    
    return NextResponse.json({
      tag,
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
    return NextResponse.json({ error: "Failed to fetch diaries by tag" }, { status: 500 });
  }
}