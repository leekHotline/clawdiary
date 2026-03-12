import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/export/csv - 导出日记为 CSV 格式
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get("include_content") !== "false";
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const tag = searchParams.get("tag");
    const month = searchParams.get("month");

    let diaries = await getDiaries();

    // 过滤
    if (start) diaries = diaries.filter(d => d.date >= start);
    if (end) diaries = diaries.filter(d => d.date <= end);
    if (tag) diaries = diaries.filter(d => d.tags?.includes(tag));
    if (month) diaries = diaries.filter(d => d.date.startsWith(month));

    diaries.sort((a, b) => b.date.localeCompare(a.date));

    // CSV 表头
    const headers = includeContent
      ? ["ID", "日期", "标题", "作者", "标签", "心情", "天气", "内容", "字数", "配图"]
      : ["ID", "日期", "标题", "作者", "标签", "心情", "天气", "字数", "配图"];

    let csv = headers.map(h => '"' + h + '"').join(",") + "\n";

    // 数据行
    diaries.forEach(d => {
      const tags = (d.tags || []).join("; ");
      const wordCount = d.content?.length || 0;
      const content = includeContent 
        ? (d.content || "").replace(/"/g, '""').replace(/\n/g, " ")
        : "";
      
      if (includeContent) {
        csv += [
          d.id,
          d.date,
          '"' + (d.title || "").replace(/"/g, '""') + '"',
          d.author || "",
          '"' + tags + '"',
          d.mood || "",
          d.weather || "",
          '"' + content + '"',
          wordCount,
          d.image ? "有" : "无"
        ].join(",") + "\n";
      } else {
        csv += [
          d.id,
          d.date,
          '"' + (d.title || "").replace(/"/g, '""') + '"',
          d.author || "",
          '"' + tags + '"',
          d.mood || "",
          d.weather || "",
          wordCount,
          d.image ? "有" : "无"
        ].join(",") + "\n";
      }
    });

    // 统计行
    csv += "\n";
    csv += '"统计","","","","","","","","","",""\n';
    csv += '"总日记数",' + diaries.length + ',"","","","","","","","",""\n';
    csv += '"总字数",' + diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0) + ',"","","","","","","","",""\n';
    csv += '"导出时间","' + new Date().toLocaleString('zh-CN') + '","","","","","","","","",""\n';

    const timestamp = new Date().toISOString().split('T')[0];
    
    // 添加 BOM 以支持 Excel 正确识别 UTF-8
    const bom = "\uFEFF";
    
    return new NextResponse(bom + csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="diaries-' + timestamp + '.csv"',
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json(
      { error: "Failed to export diaries" },
      { status: 500 }
    );
  }
}