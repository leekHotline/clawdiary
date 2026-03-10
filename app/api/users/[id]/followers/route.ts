import { NextRequest, NextResponse } from "next/server";

// 用户粉丝列表
// GET /api/users/[id]/followers - 获取粉丝列表
// POST /api/users/[id]/followers - 关注用户
// DELETE /api/users/[id]/followers - 取消关注

// 模拟粉丝数据
const mockFollowers = [
  { id: "f1", name: "星辰", avatar: "⭐", bio: "追逐星空的人", followedAt: "2024-03-10" },
  { id: "f2", name: "月光", avatar: "🌙", bio: "夜猫子日记", followedAt: "2024-03-09" },
  { id: "f3", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", followedAt: "2024-03-08" },
  { id: "f4", name: "森林", avatar: "🌲", bio: "自然主义者", followedAt: "2024-03-07" },
  { id: "f5", name: "海洋", avatar: "🌊", bio: "深邃如海", followedAt: "2024-03-06" },
  { id: "f6", name: "猫咪", avatar: "🐱", bio: "慵懒的猫生", followedAt: "2024-03-05" },
  { id: "f7", name: "向日葵", avatar: "🌻", bio: "永远向阳", followedAt: "2024-03-04" },
  { id: "f8", name: "火箭", avatar: "🚀", bio: "冲向星辰大海", followedAt: "2024-03-03" },
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
  const paginatedFollowers = mockFollowers.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: {
      userId,
      followers: paginatedFollowers,
      pagination: {
        page,
        limit,
        total: mockFollowers.length,
        totalPages: Math.ceil(mockFollowers.length / limit),
      },
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  return NextResponse.json({
    success: true,
    data: {
      userId,
      message: "关注成功",
      followedAt: new Date().toISOString(),
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  return NextResponse.json({
    success: true,
    data: {
      userId,
      message: "已取消关注",
    },
  });
}