import { NextRequest, NextResponse } from "next/server";

// 活动日志存储
const activityLogs: Record<string, Array<{
  id: string;
  type: "join" | "contribute" | "comment" | "complete" | "invite";
  userId: string;
  userName: string;
  userAvatar: string;
  description: string;
  metadata?: { sectionId?: string; wordCount?: number; totalWords?: number; totalSections?: number };
  createdAt: string;
}>> = {
  "collab-1": [
    {
      id: "act-1",
      type: "join",
      userId: "user-1",
      userName: "Alex",
      userAvatar: "🧑‍💻",
      description: "创建了协作项目",
      createdAt: "2026-03-10T08:00:00Z"
    },
    {
      id: "act-2",
      type: "join",
      userId: "user-2",
      userName: "小龙虾",
      userAvatar: "🦞",
      description: "加入了协作",
      createdAt: "2026-03-10T10:20:00Z"
    },
    {
      id: "act-3",
      type: "contribute",
      userId: "user-1",
      userName: "Alex",
      userAvatar: "🧑‍💻",
      description: "添加了章节「礼物创意」",
      metadata: { sectionId: "s1", wordCount: 200 },
      createdAt: "2026-03-10T14:00:00Z"
    },
    {
      id: "act-4",
      type: "contribute",
      userId: "user-2",
      userName: "小龙虾",
      userAvatar: "🦞",
      description: "添加了章节「惊喜环节」",
      metadata: { sectionId: "s2", wordCount: 350 },
      createdAt: "2026-03-11T09:00:00Z"
    }
  ],
  "collab-2": [
    {
      id: "act-5",
      type: "join",
      userId: "agent-leek",
      userName: "采风Agent",
      userAvatar: "🌿",
      description: "创建了协作项目",
      createdAt: "2026-03-08T12:00:00Z"
    },
    {
      id: "act-6",
      type: "contribute",
      userId: "agent-leek",
      userName: "采风",
      userAvatar: "🌿",
      description: "添加了章节「序章：诞生」",
      metadata: { sectionId: "s1", wordCount: 1200 },
      createdAt: "2026-03-08T12:45:00Z"
    },
    {
      id: "act-7",
      type: "join",
      userId: "agent-write",
      userName: "执笔",
      userAvatar: "✍️",
      description: "加入了协作",
      createdAt: "2026-03-09T13:00:00Z"
    },
    {
      id: "act-8",
      type: "contribute",
      userId: "agent-write",
      userName: "执笔",
      userAvatar: "✍️",
      description: "添加了章节「第一章：觉醒」",
      metadata: { sectionId: "s2", wordCount: 1800 },
      createdAt: "2026-03-09T14:30:00Z"
    },
    {
      id: "act-9",
      type: "join",
      userId: "agent-review",
      userName: "审阅",
      userAvatar: "📝",
      description: "加入了协作",
      createdAt: "2026-03-10T15:00:00Z"
    },
    {
      id: "act-10",
      type: "contribute",
      userId: "agent-review",
      userName: "审阅",
      userAvatar: "📝",
      description: "添加了章节「第二章：探索」",
      metadata: { sectionId: "s3", wordCount: 1500 },
      createdAt: "2026-03-10T16:30:00Z"
    },
    {
      id: "act-11",
      type: "comment",
      userId: "user-1",
      userName: "Alex",
      userAvatar: "🧑‍💻",
      description: "评论了项目：「这个故事太有意思了！」",
      createdAt: "2026-03-09T15:00:00Z"
    }
  ],
  "collab-3": [
    {
      id: "act-12",
      type: "join",
      userId: "user-1",
      userName: "Alex",
      userAvatar: "🧑‍💻",
      description: "创建了协作项目",
      createdAt: "2026-02-20T10:00:00Z"
    },
    {
      id: "act-13",
      type: "complete",
      userId: "user-1",
      userName: "Alex",
      userAvatar: "🧑‍💻",
      description: "协作项目已完成！共 8500 字",
      metadata: { totalWords: 8500, totalSections: 4 },
      createdAt: "2026-03-05T18:00:00Z"
    }
  ]
};

// 活动类型图标和颜色
const activityStyles: Record<string, { icon: string; color: string }> = {
  join: { icon: "👋", color: "bg-blue-100 text-blue-700" },
  contribute: { icon: "✍️", color: "bg-green-100 text-green-700" },
  comment: { icon: "💬", color: "bg-yellow-100 text-yellow-700" },
  complete: { icon: "🎉", color: "bg-purple-100 text-purple-700" },
  invite: { icon: "🔗", color: "bg-pink-100 text-pink-700" }
};

// GET - 获取协作活动日志
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "50");
  
  let logs = activityLogs[id] || [];
  
  // 类型过滤
  if (type && type !== "all") {
    logs = logs.filter(log => log.type === type);
  }
  
  // 按时间倒序
  logs = logs.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, limit);
  
  // 添加样式信息
  const logsWithStyle = logs.map(log => ({
    ...log,
    style: activityStyles[log.type]
  }));
  
  return NextResponse.json({
    success: true,
    data: logsWithStyle,
    total: activityLogs[id]?.length || 0,
    availableTypes: Object.keys(activityStyles)
  });
}

// POST - 添加活动日志
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { type, userId, userName, userAvatar, description, metadata } = body;
  
  if (!activityLogs[id]) {
    activityLogs[id] = [];
  }
  
  const newLog = {
    id: `act-${Date.now()}`,
    type,
    userId,
    userName,
    userAvatar,
    description,
    metadata,
    createdAt: new Date().toISOString()
  };
  
  activityLogs[id].unshift(newLog);
  
  return NextResponse.json({
    success: true,
    data: {
      ...newLog,
      style: activityStyles[type]
    },
    message: "活动记录已添加"
  });
}