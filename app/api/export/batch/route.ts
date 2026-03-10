import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 导出指定格式的日记
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format, diaryIds, includeImages } = body;

    const diaries = await getDiaries();
    const targetDiaries = diaryIds
      ? diaries.filter((d) => diaryIds.includes(d.id))
      : diaries;

    let exportData: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case "markdown":
        exportData = exportAsMarkdown(targetDiaries, includeImages);
        contentType = "text/markdown";
        filename = "diaries.md";
        break;

      case "json":
        exportData = JSON.stringify(targetDiaries, null, 2);
        contentType = "application/json";
        filename = "diaries.json";
        break;

      case "html":
        exportData = exportAsHtml(targetDiaries, includeImages);
        contentType = "text/html";
        filename = "diaries.html";
        break;

      case "txt":
        exportData = exportAsText(targetDiaries);
        contentType = "text/plain";
        filename = "diaries.txt";
        break;

      default:
        return NextResponse.json({ error: "不支持的导出格式" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: exportData,
      contentType,
      filename,
      count: targetDiaries.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "导出失败" }, { status: 500 });
  }
}

function exportAsMarkdown(diaries: any[], includeImages: boolean): string {
  let md = "# Claw Diary - 日记导出\n\n";
  md += `导出时间: ${new Date().toLocaleString("zh-CN")}\n\n`;
  md += "---\n\n";

  diaries.forEach((d) => {
    md += `## ${d.title}\n\n`;
    md += `**日期:** ${d.date}\n`;
    md += `**作者:** ${d.author || "太空龙虾"}\n`;
    if (d.tags?.length) {
      md += `**标签:** ${d.tags.map((t: string) => `#${t}`).join(" ")}\n`;
    }
    if (includeImages && d.image) {
      md += `\n![${d.title}](${d.image})\n`;
    }
    md += `\n${d.content}\n\n`;
    md += "---\n\n";
  });

  return md;
}

function exportAsHtml(diaries: any[], includeImages: boolean): string {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claw Diary - 日记导出</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #fafafa; }
    .diary { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .diary h2 { margin: 0 0 8px; color: #1a1a1a; }
    .meta { color: #666; font-size: 14px; margin-bottom: 16px; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .tag { background: #f0f0f0; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .content { line-height: 1.7; white-space: pre-wrap; }
    .image { width: 100%; border-radius: 8px; margin: 16px 0; }
  </style>
</head>
<body>
  <h1>🦞 Claw Diary</h1>
  <p>导出时间: ${new Date().toLocaleString("zh-CN")}</p>
`;

  diaries.forEach((d) => {
    html += `
  <article class="diary">
    <h2>${d.title}</h2>
    <div class="meta">
      <span>📅 ${d.date}</span> ·
      <span>✍️ ${d.author || "太空龙虾"}</span>
    </div>`;
    if (d.tags?.length) {
      html += `
    <div class="tags">
      ${d.tags.map((t: string) => `<span class="tag">#${t}</span>`).join("")}
    </div>`;
    }
    if (includeImages && d.image) {
      html += `
    <img class="image" src="${d.image}" alt="${d.title}" />`;
    }
    html += `
    <div class="content">${d.content}</div>
  </article>`;
  });

  html += `
</body>
</html>`;

  return html;
}

function exportAsText(diaries: any[]): string {
  let txt = "================================\n";
  txt += "       Claw Diary 日记导出\n";
  txt += "================================\n\n";
  txt += `导出时间: ${new Date().toLocaleString("zh-CN")}\n\n`;

  diaries.forEach((d, i) => {
    txt += `[${i + 1}] ${d.title}\n`;
    txt += `日期: ${d.date}\n`;
    txt += `作者: ${d.author || "太空龙虾"}\n`;
    if (d.tags?.length) {
      txt += `标签: ${d.tags.join(", ")}\n`;
    }
    txt += `\n${d.content}\n\n`;
    txt += "--------------------------------\n\n";
  });

  return txt;
}