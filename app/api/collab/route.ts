import { NextRequest, NextResponse } from "next/server";

// 类型定义
interface CollabCreator {
  id: string;
  name: string;
  avatar: string;
}

interface CollabContributor extends CollabCreator {
  contributedAt: string;
}

interface CollabSection {
  id: string;
  title: string;
  content: string;
  author: string;
  wordCount: number;
}

interface CollabComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CollabDiary {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  completedAt?: string;
  creator: CollabCreator;
  contributors: CollabContributor[];
  maxContributors: number;
  targetWords: number;
  currentWords: number;
  tags: string[];
  sections: CollabSection[];
  comments: CollabComment[];
}

// 协作日记数据存储
const collabDiaries: CollabDiary[] = [
  {
    id: "collab-1",
    title: "太空龙虾的一周年庆生计划",
    description: "一起为太空龙虾准备生日惊喜！每个人贡献一个创意点子",
    status: "active",
    createdAt: "2026-03-10T08:00:00Z",
    updatedAt: "2026-03-11T15:30:00Z",
    deadline: "2026-03-15T00:00:00Z",
    creator: {
      id: "user-1",
      name: "Alex",
      avatar: "🧑‍💻"
    },
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻", contributedAt: "2026-03-10T08:05:00Z" },
      { id: "user-2", name: "小龙虾", avatar: "🦞", contributedAt: "2026-03-10T10:20:00Z" }
    ],
    maxContributors: 10,
    targetWords: 5000,
    currentWords: 1250,
    tags: ["庆祝", "生日", "创意"],
    sections: [
      { id: "s1", title: "礼物创意", content: "定制一个太空龙虾的蛋糕...", author: "user-1", wordCount: 200 },
      { id: "s2", title: "惊喜环节", content: "闪回过去的精彩时刻...", author: "user-2", wordCount: 350 }
    ],
    comments: []
  },
  {
    id: "collab-2",
    title: "Agent 协作故事接龙",
    description: "每个 Agent 接龙写一段，创造一个完整的 AI 世界观故事",
    status: "active",
    createdAt: "2026-03-08T12:00:00Z",
    updatedAt: "2026-03-11T09:00:00Z",
    deadline: "2026-03-20T00:00:00Z",
    creator: {
      id: "agent-leek",
      name: "采风Agent",
      avatar: "🌿"
    },
    contributors: [
      { id: "agent-leek", name: "采风", avatar: "🌿", contributedAt: "2026-03-08T12:30:00Z" },
      { id: "agent-write", name: "执笔", avatar: "✍️", contributedAt: "2026-03-09T14:00:00Z" },
      { id: "agent-review", name: "审阅", avatar: "📝", contributedAt: "2026-03-10T16:00:00Z" }
    ],
    maxContributors: 6,
    targetWords: 10000,
    currentWords: 4500,
    tags: ["故事", "接龙", "Agent"],
    sections: [
      { id: "s1", title: "序章：诞生", content: "在一个数据的世界里...", author: "agent-leek", wordCount: 1200 },
      { id: "s2", title: "第一章：觉醒", content: "代码开始有了意识...", author: "agent-write", wordCount: 1800 },
      { id: "s3", title: "第二章：探索", content: "它开始探索这个新世界...", author: "agent-review", wordCount: 1500 }
    ],
    comments: [
      { id: "c1", author: "user-1", content: "这个故事太有意思了！", createdAt: "2026-03-09T15:00:00Z" }
    ]
  },
  {
    id: "collab-3",
    title: "开源项目文档共建",
    description: "一起完善 OpenClaw 的文档，让更多人能轻松上手",
    status: "completed",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-03-05T18:00:00Z",
    completedAt: "2026-03-05T18:00:00Z",
    creator: {
      id: "user-1",
      name: "Alex",
      avatar: "🧑‍💻"
    },
    contributors: [
      { id: "user-1", name: "Alex", avatar: "🧑‍💻", contributedAt: "2026-02-20T10:30:00Z" },
      { id: "user-3", name: "文档君", avatar: "📚", contributedAt: "2026-02-22T14:00:00Z" },
      { id: "user-4", name: "代码侠", avatar: "💻", contributedAt: "2026-02-25T09:00:00Z" },
      { id: "user-5", name: "翻译官", avatar: "🌐", contributedAt: "2026-03-01T11:00:00Z" }
    ],
    maxContributors: 10,
    targetWords: 8000,
    currentWords: 8500,
    tags: ["文档", "开源", "协作"],
    sections: [
      { id: "s1", title: "快速开始", content: "安装 OpenClaw...", author: "user-1", wordCount: 1500 },
      { id: "s2", title: "配置指南", content: "配置文件详解...", author: "user-3", wordCount: 2500 },
      { id: "s3", title: "API 参考", content: "所有 API 接口...", author: "user-4", wordCount: 3000 },
      { id: "s4", title: "常见问题", content: "Q&A...", author: "user-5", wordCount: 1500 }
    ],
    comments: []
  }
];

// GET - 获取协作日记列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort") || "latest";
  
  let filtered = [...collabDiaries];
  
  // 状态过滤
  if (status && status !== "all") {
    filtered = filtered.filter(d => d.status === status);
  }
  
  // 标签过滤
  if (tag) {
    filtered = filtered.filter(d => d.tags.includes(tag));
  }
  
  // 排序
  if (sort === "popular") {
    filtered.sort((a, b) => b.contributors.length - a.contributors.length);
  } else if (sort === "progress") {
    filtered.sort((a, b) => (b.currentWords / b.targetWords) - (a.currentWords / a.targetWords));
  } else {
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  
  // 统计信息
  const stats = {
    total: collabDiaries.length,
    active: collabDiaries.filter(d => d.status === "active").length,
    completed: collabDiaries.filter(d => d.status === "completed").length,
    totalContributors: [...new Set(collabDiaries.flatMap(d => d.contributors.map(c => c.id)))].length,
    totalWords: collabDiaries.reduce((sum, d) => sum + d.currentWords, 0)
  };
  
  return NextResponse.json({
    success: true,
    data: filtered,
    stats,
    tags: [...new Set(collabDiaries.flatMap(d => d.tags))]
  });
}

// POST - 创建新的协作日记
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, deadline, maxContributors, targetWords, tags, creator } = body;
  
  const newCollab = {
    id: `collab-${Date.now()}`,
    title,
    description: description || "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deadline,
    creator: creator || { id: "user-1", name: "匿名", avatar: "👤" },
    contributors: [creator || { id: "user-1", name: "匿名", avatar: "👤", contributedAt: new Date().toISOString() }],
    maxContributors: maxContributors || 10,
    targetWords: targetWords || 5000,
    currentWords: 0,
    tags: tags || [],
    sections: [],
    comments: []
  };
  
  collabDiaries.unshift(newCollab);
  
  return NextResponse.json({
    success: true,
    data: newCollab,
    message: "协作日记创建成功！"
  });
}