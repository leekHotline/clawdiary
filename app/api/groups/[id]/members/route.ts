import { NextRequest, NextResponse } from "next/server";

// 群组成员 API
// GET /api/groups/[id]/members - 获取群组成员

const mockMembers = [
  { id: "m1", userId: "u1", name: "星辰", avatar: "⭐", role: "admin", joinedAt: "2025-06-15", diaryCount: 45, lastActive: "刚刚" },
  { id: "m2", userId: "u2", name: "月光", avatar: "🌙", role: "moderator", joinedAt: "2025-06-16", diaryCount: 38, lastActive: "1小时前" },
  { id: "m3", userId: "u3", name: "彩虹", avatar: "🌈", role: "member", joinedAt: "2025-06-20", diaryCount: 22, lastActive: "3小时前" },
  { id: "m4", userId: "u4", name: "小溪", avatar: "🌊", role: "member", joinedAt: "2025-07-01", diaryCount: 15, lastActive: "昨天" },
  { id: "m5", userId: "u5", name: "晨曦", avatar: "🌅", role: "member", joinedAt: "2025-07-10", diaryCount: 8, lastActive: "2天前" },
  { id: "m6", userId: "u6", name: "落叶", avatar: "🍂", role: "member", joinedAt: "2025-08-01", diaryCount: 12, lastActive: "3天前" },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: groupId } = await params;
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role"); // admin, moderator, member
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let filteredMembers = [...mockMembers];

  // 角色过滤
  if (role) {
    filteredMembers = filteredMembers.filter((m) => m.role === role);
  }

  // 分页
  const paginatedMembers = filteredMembers.slice(offset, offset + limit);

  // 统计
  const stats = {
    total: mockMembers.length,
    admins: mockMembers.filter((m) => m.role === "admin").length,
    moderators: mockMembers.filter((m) => m.role === "moderator").length,
    members: mockMembers.filter((m) => m.role === "member").length,
  };

  return NextResponse.json({
    success: true,
    data: {
      members: paginatedMembers,
      stats,
      hasMore: offset + limit < filteredMembers.length,
    },
  });
}