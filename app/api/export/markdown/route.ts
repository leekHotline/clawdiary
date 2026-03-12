import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/export/markdown - 导出日记为 Markdown 格式
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group"); // month
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

    if (group === "month") {
      // 按月份分组输出
      const byMonth = diaries.reduce((acc, d) => {
        const m = d.date.substring(0, 7);
        if (!acc[m]) acc[m] = [];
        acc[m].push(d);
        return acc;
      }, {} as Record<string, typeof diaries>);

      let markdown = `# Claw Diary 日记导出\n\n`;
      markdown += `> 导出时间：${new Date().toLocaleString('zh-CN')}\n`;
      markdown += `> 总计：${diaries.length} 篇日记，${Object.keys(byMonth).length} 个月份\n\n`;
      markdown += `---\n\n`;
      markdown += `## 目录\n\n`;

      Object.keys(byMonth).sort().reverse().forEach(m => {
        markdown += `- [${m}](#${m.replace(/-/g, '')}) (${byMonth[m].length} 篇)\n`;
      });
      markdown += `\n---\n\n`;

      Object.entries(byMonth)
        .sort(([a], [b]) => b.localeCompare(a))
        .forEach(([month, monthDiaries]) => {
          markdown += `## ${month}\n\n`;
          monthDiaries.forEach(d => {
            markdown += formatDiary(d);
          });
          markdown += `---\n\n`;
        });

      const timestamp = new Date().toISOString().split('T')[0];
      return new NextResponse(markdown, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="diaries-${timestamp}.md"`,
          "Cache-Control": "no-cache"
        }
      });
    }

    // 单个文件输出
    let markdown = `# Claw Diary 日记导出\n\n`;
    markdown += `> 导出时间：${new Date().toLocaleString('zh-CN')}\n`;
    markdown += `> 总计：${diaries.length} 篇日记\n\n`;
    markdown += `---\n\n`;

    diaries.forEach(d => {
      markdown += formatDiary(d);
    });

    markdown += `\n---\n\n`;
    markdown += `*由 Claw Diary 自动导出*\n`;

    const timestamp = new Date().toISOString().split('T')[0];
    const suffix = tag ? `-${tag}` : month ? `-${month}` : '';
    
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="diaries${suffix}-${timestamp}.md"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export Markdown error:", error);
    return NextResponse.json(
      { error: "Failed to export diaries" },
      { status: 500 }
    );
  }
}

function formatDiary(diary: any): string {
  let md = `### ${diary.title}\n\n`;
  md += `📅 ${diary.date}`;
  if (diary.author) {
    md += ` · ✍️ ${diary.author}`;
  }
  if (diary.mood) {
    md += ` · ${diary.mood}`;
  }
  md += `\n\n`;

  if (diary.tags?.length) {
    md += diary.tags.map((t: string) => `#${t}`).join(' ') + '\n\n';
  }

  md += `${diary.content}\n\n`;

  if (diary.image) {
    md += `![配图](${diary.image})\n\n`;
  }

  md += `---\n\n`;
  return md;
}