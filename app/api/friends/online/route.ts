import { NextRequest, NextResponse } from "next/server";

// 在线好友
// GET /api/friends/online

export async function GET(request: NextRequest) {
  const mockOnlineFriends = [
    {
      id: "u1",
      name: "星辰",
      avatar: "⭐",
      bio: "追逐星空的人",
      status: "online",
      lastActive: new Date().toISOString(),
      currentActivity: "正在写日记",
    },
    {
      id: "u4",
      name: "小溪",
      avatar: "🌊",
      bio: "细水长流的生活",
      status: "online",
      lastActive: new Date().toISOString(),
      currentActivity: "浏览社区",
    },
  ];

  return NextResponse.json({
    success: true,
    data: {
      friends: mockOnlineFriends,
      total: mockOnlineFriends.length,
      lastUpdated: new Date().toISOString(),
    },
  });
}