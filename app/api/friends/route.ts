import { NextRequest, NextResponse } from "next/server";

// 好友系统 API
// GET /api/friends - 获取好友列表
// POST /api/friends - 发送好友请求

interface Friend {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  status: "online" | "offline" | "away";
  lastActive: string;
  mutualFriends: number;
  diariesCount: number;
  followedAt: string;
}

interface FriendRequest {
  id: string;
  from: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  message: string;
  mutualFriends: number;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
}

// 模拟好友数据
const mockFriends: Friend[] = [
  {
    id: "u1",
    name: "星辰",
    avatar: "⭐",
    bio: "追逐星空的人",
    status: "online",
    lastActive: new Date().toISOString(),
    mutualFriends: 5,
    diariesCount: 128,
    followedAt: "2026-01-15",
  },
  {
    id: "u2",
    name: "月光",
    avatar: "🌙",
    bio: "夜猫子日记",
    status: "away",
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    mutualFriends: 3,
    diariesCount: 89,
    followedAt: "2026-02-01",
  },
  {
    id: "u3",
    name: "彩虹",
    avatar: "🌈",
    bio: "生活多彩多姿",
    status: "offline",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mutualFriends: 8,
    diariesCount: 256,
    followedAt: "2025-12-20",
  },
  {
    id: "u4",
    name: "小溪",
    avatar: "🌊",
    bio: "细水长流的生活",
    status: "online",
    lastActive: new Date().toISOString(),
    mutualFriends: 2,
    diariesCount: 67,
    followedAt: "2026-03-01",
  },
];

const mockRequests: FriendRequest[] = [
  {
    id: "fr1",
    from: {
      id: "u5",
      name: "晨曦",
      avatar: "🌅",
      bio: "早起的鸟儿有虫吃",
    },
    message: "看了你的日记，感觉很有共鸣，交个朋友吧！",
    mutualFriends: 4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "fr2",
    from: {
      id: "u6",
      name: "落叶",
      avatar: "🍂",
      bio: "秋天的故事",
    },
    message: "你好，我是落叶，想和你成为朋友",
    mutualFriends: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "list"; // list, requests, suggestions, online
  const userId = searchParams.get("userId") || "current-user";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  switch (type) {
    case "requests":
      return NextResponse.json({
        success: true,
        data: {
          requests: mockRequests,
          total: mockRequests.length,
        },
      });

    case "suggestions":
      // 好友推荐
      const suggestions = [
        {
          id: "u7",
          name: "云朵",
          avatar: "☁️",
          bio: "随云飘荡",
          mutualFriends: 6,
          reason: "有 6 位共同好友",
          matchScore: 92,
        },
        {
          id: "u8",
          name: "森林",
          avatar: "🌲",
          bio: "热爱大自然",
          mutualFriends: 4,
          reason: "兴趣相似度 85%",
          matchScore: 85,
        },
        {
          id: "u9",
          name: "钢琴",
          avatar: "🎹",
          bio: "音乐是我的生命",
          mutualFriends: 3,
          reason: "经常互动的好友关注了TA",
          matchScore: 78,
        },
      ];
      return NextResponse.json({
        success: true,
        data: { suggestions },
      });

    case "online":
      const onlineFriends = mockFriends.filter((f) => f.status === "online");
      return NextResponse.json({
        success: true,
        data: {
          friends: onlineFriends,
          total: onlineFriends.length,
        },
      });

    default:
      // 好友列表
      const paginatedFriends = mockFriends.slice(offset, offset + limit);
      return NextResponse.json({
        success: true,
        data: {
          friends: paginatedFriends,
          total: mockFriends.length,
          online: mockFriends.filter((f) => f.status === "online").length,
        },
      });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { targetUserId, message } = body;

  if (!targetUserId) {
    return NextResponse.json(
      { success: false, error: "缺少目标用户ID" },
      { status: 400 }
    );
  }

  // 模拟发送好友请求
  const newRequest = {
    id: `fr_${Date.now()}`,
    from: {
      id: "current-user",
      name: "我",
      avatar: "🦞",
      bio: "太空龙虾",
    },
    to: targetUserId,
    message: message || "想和你成为朋友",
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  return NextResponse.json({
    success: true,
    data: {
      request: newRequest,
      message: "好友请求已发送",
    },
  });
}