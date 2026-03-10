import { NextResponse } from "next/server";
import { getDiary } from "@/lib/diaries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diary = await getDiary(id);
    
    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "md";

    if (format === "md" || format === "markdown") {
      // Markdown 格式
      const markdown = `# ${diary.title}

**日期:** ${diary.date}  
**作者:** ${diary.author === "AI" ? "太空龙虾 🦞" : diary.authorName || diary.author}  
${diary.tags?.length ? `**标签:** ${diary.tags.map((t) => `#${t}`).join(" ")}  ` : ""}
**创建时间:** ${diary.createdAt}  
**更新时间:** ${diary.updatedAt}

---

${diary.content}

---

*🦞 Claw Diary - Powered by OpenClaw*
`;

      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${diary.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}.md"`,
        },
      });
    }

    if (format === "txt") {
      // 纯文本格式
      const text = `${diary.title}
${"=".repeat(diary.title.length)}

日期: ${diary.date}
作者: ${diary.author === "AI" ? "太空龙虾" : diary.authorName || diary.author}
${diary.tags?.length ? `标签: ${diary.tags.join(", ")}` : ""}

${diary.content}

---
Claw Diary - Powered by OpenClaw
`;

      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${diary.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}.txt"`,
        },
      });
    }

    if (format === "json") {
      // JSON 格式
      return new NextResponse(JSON.stringify(diary, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${diary.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}.json"`,
        },
      });
    }

    if (format === "html") {
      // HTML 格式
      const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${diary.title} - Claw Diary</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 { color: #ea580c; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    .meta span { margin-right: 15px; }
    .tags { margin: 10px 0; }
    .tag {
      background: #fff7ed;
      color: #ea580c;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      margin-right: 5px;
    }
    .content { 
      white-space: pre-wrap;
      background: #fafafa;
      padding: 20px;
      border-radius: 8px;
    }
    .footer { 
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    img { max-width: 100%; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <article>
    <h1>${diary.title}</h1>
    <div class="meta">
      <span>📅 ${diary.date}</span>
      <span>✍️ ${diary.author === "AI" ? "太空龙虾 🦞" : diary.authorName || diary.author}</span>
    </div>
    ${diary.tags?.length ? `
    <div class="tags">
      ${diary.tags.map((t) => `<span class="tag">#${t}</span>`).join("")}
    </div>
    ` : ""}
    ${diary.image ? `<img src="${diary.image}" alt="${diary.title}" />` : ""}
    <div class="content">${diary.content}</div>
  </article>
  <footer class="footer">
    🦞 Claw Diary · Powered by OpenClaw
  </footer>
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${diary.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")}.html"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting diary:", error);
    return NextResponse.json({ error: "Failed to export diary" }, { status: 500 });
  }
}