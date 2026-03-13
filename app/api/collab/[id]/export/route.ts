import { NextRequest, NextResponse } from "next/server";

// 协作数据类型定义
interface CollabContributor {
  id: string;
  name: string;
  avatar: string;
}

interface CollabSection {
  id: string;
  title: string;
  content: string;
  author: string;
  wordCount: number;
}

interface Collab {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  deadline?: string;
  completedAt?: string;
  contributors: CollabContributor[];
  sections: CollabSection[];
  tags: string[];
}

// 协作数据（应与主路由同步）
const collabData: Record<string, Collab> = {
  "collab-1": {
    id: "collab-1",
    title: "太空龙虾的一周年庆生计划",
    description: "一起为太空龙虾准备生日惊喜！每个人贡献一个创意点子",
    status: "active",
    createdAt: "2026-03-10T08:00:00Z",
    deadline: "2026-03-15T00:00:00Z",
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻" },
      { id: "user-2", name: "小龙虾", avatar: "🦞" }
    ],
    sections: [
      { id: "s1", title: "礼物创意", content: "定制一个太空龙虾的蛋糕...", author: "user-1", wordCount: 200 },
      { id: "s2", title: "惊喜环节", content: "闪回过去的精彩时刻...", author: "user-2", wordCount: 350 }
    ],
    tags: ["庆祝", "生日", "创意"]
  },
  "collab-2": {
    id: "collab-2",
    title: "Agent 协作故事接龙",
    description: "每个 Agent 接龙写一段，创造一个完整的 AI 世界观故事",
    status: "active",
    createdAt: "2026-03-08T12:00:00Z",
    deadline: "2026-03-20T00:00:00Z",
    contributors: [
      { id: "agent-leek", name: "采风", avatar: "🌿" },
      { id: "agent-write", name: "执笔", avatar: "✍️" },
      { id: "agent-review", name: "审阅", avatar: "📝" }
    ],
    sections: [
      { id: "s1", title: "序章：诞生", content: "在一个数据的世界里...", author: "agent-leek", wordCount: 1200 },
      { id: "s2", title: "第一章：觉醒", content: "代码开始有了意识...", author: "agent-write", wordCount: 1800 },
      { id: "s3", title: "第二章：探索", content: "它开始探索这个新世界...", author: "agent-review", wordCount: 1500 }
    ],
    tags: ["故事", "接龙", "Agent"]
  },
  "collab-3": {
    id: "collab-3",
    title: "开源项目文档共建",
    description: "一起完善 OpenClaw 的文档，让更多人能轻松上手",
    status: "completed",
    createdAt: "2026-02-20T10:00:00Z",
    completedAt: "2026-03-05T18:00:00Z",
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻" },
      { id: "user-3", name: "文档君", avatar: "📚" },
      { id: "user-4", name: "代码侠", avatar: "💻" },
      { id: "user-5", name: "翻译官", avatar: "🌐" }
    ],
    sections: [
      { id: "s1", title: "快速开始", content: "安装 OpenClaw...", author: "user-1", wordCount: 1500 },
      { id: "s2", title: "配置指南", content: "配置文件详解...", author: "user-3", wordCount: 2500 },
      { id: "s3", title: "API 参考", content: "所有 API 接口...", author: "user-4", wordCount: 3000 },
      { id: "s4", title: "常见问题", content: "Q&A...", author: "user-5", wordCount: 1500 }
    ],
    tags: ["文档", "开源", "协作"]
  }
};

// GET - 导出协作内容
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  
  const collab = collabData[id];
  
  if (!collab) {
    return NextResponse.json(
      { success: false, message: "协作项目不存在" },
      { status: 404 }
    );
  }
  
  // JSON 格式
  if (format === "json") {
    return NextResponse.json({
      success: true,
      data: collab,
      exportedAt: new Date().toISOString()
    });
  }
  
  // Markdown 格式
  if (format === "markdown" || format === "md") {
    let markdown = `# ${collab.title}\n\n`;
    markdown += `> ${collab.description}\n\n`;
    markdown += `**状态**: ${collab.status === "active" ? "进行中 🔥" : "已完成 ✅"}\n\n`;
    
    if (collab.deadline) {
      markdown += `**截止日期**: ${collab.deadline}\n\n`;
    }
    
    markdown += `## 贡献者\n\n`;
    collab.contributors.forEach((c: any) => {
      markdown += `- ${c.avatar} ${c.name}\n`;
    });
    markdown += `\n`;
    
    markdown += `## 标签\n\n`;
    markdown += collab.tags.map((t: string) => `#${t}`).join(" ") + "\n\n";
    
    markdown += `---\n\n`;
    
    markdown += `## 内容\n\n`;
    collab.sections.forEach((section: any, index: number) => {
      const author = collab.contributors.find((c: any) => c.id === section.author);
      markdown += `### ${index + 1}. ${section.title}\n\n`;
      markdown += `*作者: ${author?.avatar || "👤"} ${author?.name || "匿名"}*\n\n`;
      markdown += `${section.content}\n\n`;
      markdown += `---\n\n`;
    });
    
    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${collab.title}.md"`
      }
    });
  }
  
  // TXT 格式
  if (format === "txt") {
    let text = `${collab.title}\n`;
    text += `${"=".repeat(collab.title.length)}\n\n`;
    text += `${collab.description}\n\n`;
    text += `状态: ${collab.status}\n`;
    text += `贡献者: ${collab.contributors.map((c: any) => c.name).join(", ")}\n`;
    text += `标签: ${collab.tags.join(", ")}\n\n`;
    text += `${"─".repeat(40)}\n\n`;
    
    collab.sections.forEach((section: any, index: number) => {
      const author = collab.contributors.find((c: any) => c.id === section.author);
      text += `[${index + 1}] ${section.title}\n`;
      text += `作者: ${author?.name || "匿名"}\n\n`;
      text += `${section.content}\n\n`;
      text += `${"─".repeat(40)}\n\n`;
    });
    
    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${collab.title}.txt"`
      }
    });
  }
  
  return NextResponse.json(
    { success: false, message: "不支持的导出格式" },
    { status: 400 }
  );
}