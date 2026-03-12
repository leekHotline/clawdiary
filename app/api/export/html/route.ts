import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/export/html - 导出日记为 HTML 格式
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style") || "default"; // default, journal, minimalist
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

    const styles = getStyles(style);
    
    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claw Diary 日记导出</title>
  <style>${styles}</style>
</head>
<body>
  <header>
    <h1>🦞 Claw Diary</h1>
    <p class="meta">导出时间：${new Date().toLocaleString('zh-CN')} · 共 ${diaries.length} 篇日记</p>
  </header>
  <main>
`;

    diaries.forEach((d, i) => {
      html += formatDiaryHTML(d, style, i);
    });

    html += `
  </main>
  <footer>
    <p>由 Claw Diary 自动导出 · ${new Date().getFullYear()}</p>
  </footer>
</body>
</html>`;

    const timestamp = new Date().toISOString().split('T')[0];
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="diaries-${timestamp}.html"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export HTML error:", error);
    return NextResponse.json(
      { error: "Failed to export diaries" },
      { status: 500 }
    );
  }
}

function getStyles(style: string): string {
  const base = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fafafa;
    }
    header {
      text-align: center;
      padding: 60px 20px 40px;
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: white;
    }
    header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    header .meta { opacity: 0.9; }
    main { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    article {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    article .date { color: #666; font-size: 0.9rem; margin-bottom: 8px; }
    article h2 { font-size: 1.5rem; margin-bottom: 15px; color: #1a1a1a; }
    article .tags { margin-bottom: 15px; }
    article .tags span {
      display: inline-block;
      background: #fff7ed;
      color: #ea580c;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-right: 8px;
    }
    article .content { 
      white-space: pre-wrap; 
      line-height: 1.8;
      color: #444;
    }
    article img { 
      max-width: 100%; 
      border-radius: 12px; 
      margin-top: 20px;
    }
    footer {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 0.9rem;
    }
  `;

  if (style === "journal") {
    return base + `
      body { background: #f5f0e8; }
      article {
        background: #fffef9;
        border: 1px solid #e8e0d0;
        box-shadow: none;
      }
      header { background: linear-gradient(135deg, #8b7355, #6b5344); }
      article .tags span {
        background: #f0ebe0;
        color: #6b5344;
      }
    `;
  }

  if (style === "minimalist") {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: Georgia, serif;
        line-height: 1.8;
        color: #222;
        max-width: 700px;
        margin: 0 auto;
        padding: 60px 20px;
        background: white;
      }
      header { border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 40px; }
      header h1 { font-size: 1.8rem; font-weight: normal; }
      header .meta { color: #888; font-size: 0.9rem; margin-top: 10px; }
      article { margin-bottom: 50px; }
      article .date { color: #888; font-size: 0.85rem; }
      article h2 { font-size: 1.3rem; font-weight: normal; margin: 10px 0; }
      article .tags { font-size: 0.85rem; color: #666; }
      article .content { margin-top: 15px; }
      footer { border-top: 1px solid #eee; padding-top: 30px; margin-top: 60px; color: #888; font-size: 0.85rem; }
    `;
  }

  return base;
}

function formatDiaryHTML(diary: any, style: string, index: number): string {
  return `
    <article>
      <div class="date">📅 ${diary.date}${diary.author ? ` · ${diary.author}` : ''}${diary.mood ? ` · ${diary.mood}` : ''}</div>
      <h2>${diary.title}</h2>
      ${diary.tags?.length ? `
        <div class="tags">
          ${diary.tags.map((t: string) => `<span>#${t}</span>`).join('')}
        </div>
      ` : ''}
      <div class="content">${escapeHtml(diary.content)}</div>
      ${diary.image ? `<img src="${diary.image}" alt="配图" loading="lazy">` : ''}
    </article>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}