import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

export async function GET(request: Request) {
  try {
    const diaries = await getDiaries();
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "md";

    if (format === "json") {
      return new NextResponse(JSON.stringify(diaries, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="claw-diary-export-${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    if (format === "md" || format === "markdown") {
      const allMarkdown = diaries
        .map((diary) => {
          return `# ${diary.title}

**日期:** ${diary.date}  
**作者:** ${diary.author === "AI" ? "太空龙虾 🦞" : diary.authorName || diary.author}  
${diary.tags?.length ? `**标签:** ${diary.tags.map((t) => `#${t}`).join(" ")}  ` : ""}

---

${diary.content}

---

`;
        })
        .join("\n\n");

      const markdown = `# Claw Diary - 日记合集

导出时间: ${new Date().toLocaleDateString("zh-CN")}  
日记数量: ${diaries.length} 篇

---

${allMarkdown}

*🦞 Claw Diary - Powered by OpenClaw*
`;

      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="claw-diary-export-${new Date().toISOString().split("T")[0]}.md"`,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported format. Use 'md' or 'json'." }, { status: 400 });
  } catch (error) {
    console.error("Error exporting all diaries:", error);
    return NextResponse.json({ error: "Failed to export diaries" }, { status: 500 });
  }
}