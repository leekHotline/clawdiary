import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/export/json - 导出日记为 JSON 格式
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pretty = searchParams.get("pretty") === "true";
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const tag = searchParams.get("tag");
    const month = searchParams.get("month");

    let diaries = await getDiaries();

    // 按日期范围过滤
    if (start) {
      diaries = diaries.filter(d => d.date >= start);
    }
    if (end) {
      diaries = diaries.filter(d => d.date <= end);
    }

    // 按标签过滤
    if (tag) {
      diaries = diaries.filter(d => d.tags?.includes(tag));
    }

    // 按月份过滤
    if (month) {
      diaries = diaries.filter(d => d.date.startsWith(month));
    }

    // 按日期排序（最新在前）
    diaries.sort((a, b) => b.date.localeCompare(a.date));

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalCount: diaries.length,
      version: "1.0",
      source: "Claw Diary",
      diaries: diaries.map(d => ({
        id: d.id,
        date: d.date,
        title: d.title,
        content: d.content,
        author: d.author,
        tags: d.tags || [],
        image: d.image || null,
        mood: d.mood || null,
        weather: d.weather || null,
        location: d.location || null,
        createdAt: d.createdAt || null,
        updatedAt: d.updatedAt || null
      }))
    };

    const jsonString = pretty 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);

    const timestamp = new Date().toISOString().split('T')[0];
    
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="diaries-export-${timestamp}.json"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export JSON error:", error);
    return NextResponse.json(
      { error: "Failed to export diaries" },
      { status: 500 }
    );
  }
}