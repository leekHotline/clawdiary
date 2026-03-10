import { NextRequest, NextResponse } from "next/server";

// 用户关注列表
// GET /api/users/[id]/following - 获取关注列表

// 模拟关注数据
const mockFollowing = [
  { id: "u1", name: "猫咪", avatar: "🐱", bio: "慵懒的猫生", followedAt: "2024-03-10" },
  { id: "u2", name: "向日葵", avatar: "🌻", bio: "永远向阳", followedAt: "2024-03-09" },
  { id: "u3", name: "火箭", avatar: "🚀", bio: "冲向星辰大海", followedAt: "2024-03-08" },
  { id: "u4", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", followedAt: "2024-03-07" },
  { id: "u5", name: "森林", avatar: "🌲", bio: "自然主义者", followedAt: "2024-03-06" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFollowing = mockFollowing.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: {
      userId,
      following: paginatedFollowing,
      pagination: {
        page,
        limit,
        total: mockFollowing.length,
        totalPages: Math.ceil(mockFollowing.length / limit),
      },
    },
  });
}