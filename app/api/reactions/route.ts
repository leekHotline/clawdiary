import { NextRequest, NextResponse } from "next/server";

// 表情回复系统 API
// GET /api/reactions - 获取内容的表情反应
// POST /api/reactions - 添加表情反应
// DELETE /api/reactions - 移除表情反应

interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  userAvatar: string;
  targetType: "diary" | "comment" | "reply";
  targetId: string;
  createdAt: string;
}

interface ReactionSummary {
  emoji: string;
  count: number;
  isReacted: boolean;
  users: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
}

// 支持的表情列表
const SUPPORTED_EMOJIS = [
  "❤️", "👍", "👏", "😊", "🤔", "😢", "😮", "🔥", "🎉", "💪",
  "🙏", "😍", "😂", "🥰", "😎", "🌟", "✨", "💯", "🙌", "💖"
];

// 模拟表情反应数据
const mockReactions: Reaction[] = [
  {
    id: "r1",
    emoji: "❤️",
    userId: "u1",
    userName: "星辰",
    userAvatar: "⭐",
    targetType: "diary",
    targetId: "diary_37",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r2",
    emoji: "❤️",
    userId: "u2",
    userName: "月光",
    userAvatar: "🌙",
    targetType: "diary",
    targetId: "diary_37",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r3",
    emoji: "👍",
    userId: "u3",
    userName: "彩虹",
    userAvatar: "🌈",
    targetType: "diary",
    targetId: "diary_37",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "r4",
    emoji: "🔥",
    userId: "u1",
    userName: "星辰",
    userAvatar: "⭐",
    targetType: "diary",
    targetId: "diary_36",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r5",
    emoji: "🎉",
    userId: "u4",
    userName: "小溪",
    userAvatar: "🌊",
    targetType: "comment",
    targetId: "c1",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType"); // diary, comment, reply
  const targetId = searchParams.get("targetId");
  const userId = searchParams.get("userId") || "current-user";
  const includeUsers = searchParams.get("includeUsers") === "true";

  // 过滤反应
  let filteredReactions = mockReactions;
  if (targetType && targetId) {
    filteredReactions = mockReactions.filter(
      (r) => r.targetType === targetType && r.targetId === targetId
    );
  } else if (targetType) {
    filteredReactions = mockReactions.filter((r) => r.targetType === targetType);
  }

  // 生成汇总
  const summary: ReactionSummary[] = [];
  const emojiMap = new Map<string, ReactionSummary>();

  for (const reaction of filteredReactions) {
    if (!emojiMap.has(reaction.emoji)) {
      emojiMap.set(reaction.emoji, {
        emoji: reaction.emoji,
        count: 0,
        isReacted: false,
        users: [],
      });
    }
    const entry = emojiMap.get(reaction.emoji)!;
    entry.count++;
    if (reaction.userId === userId) {
      entry.isReacted = true;
    }
    if (includeUsers && entry.users.length < 5) {
      entry.users.push({
        id: reaction.userId,
        name: reaction.userName,
        avatar: reaction.userAvatar,
      });
    }
  }

  // 转为数组并排序
  const reactions = Array.from(emojiMap.values()).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    success: true,
    data: {
      reactions,
      total: filteredReactions.length,
      supportedEmojis: SUPPORTED_EMOJIS,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { emoji, targetType, targetId, userId, userName, userAvatar } = body;

  // 验证
  if (!emoji || !targetType || !targetId) {
    return NextResponse.json(
      { success: false, error: "缺少必要参数" },
      { status: 400 }
    );
  }

  if (!SUPPORTED_EMOJIS.includes(emoji)) {
    return NextResponse.json(
      { success: false, error: "不支持的表情" },
      { status: 400 }
    );
  }

  // 检查是否已经反应过（同内容同表情）
  const existing = mockReactions.find(
    (r) =>
      r.targetType === targetType &&
      r.targetId === targetId &&
      r.userId === (userId || "current-user") &&
      r.emoji === emoji
  );

  if (existing) {
    return NextResponse.json(
      { success: false, error: "已经添加过此表情" },
      { status: 400 }
    );
  }

  // 添加反应
  const newReaction: Reaction = {
    id: `r_${Date.now()}`,
    emoji,
    userId: userId || "current-user",
    userName: userName || "我",
    userAvatar: userAvatar || "🦞",
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
  };

  mockReactions.push(newReaction);

  return NextResponse.json({
    success: true,
    data: {
      reaction: newReaction,
      message: "表情反应添加成功",
    },
  });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { emoji, targetType, targetId, userId } = body;

  // 查找并删除
  const index = mockReactions.findIndex(
    (r) =>
      r.targetType === targetType &&
      r.targetId === targetId &&
      r.userId === (userId || "current-user") &&
      r.emoji === emoji
  );

  if (index === -1) {
    return NextResponse.json(
      { success: false, error: "未找到该表情反应" },
      { status: 404 }
    );
  }

  const removed = mockReactions.splice(index, 1)[0];

  return NextResponse.json({
    success: true,
    data: {
      reaction: removed,
      message: "表情反应已移除",
    },
  });
}