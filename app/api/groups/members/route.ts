import { NextRequest, NextResponse } from "next/server";

// 群组成员
// GET /api/groups/members

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const role = searchParams.get("role") || "all"; // all, admin, member
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!groupId) {
    return NextResponse.json(
      { success: false, error: "缺少群组ID" },
      { status: 400 }
    );
  }

  const mockMembers = [
    { id: "u1", name: "星辰", avatar: "⭐", role: "owner", joinedAt: "2026-01-15", diariesCount: 128 },
    { id: "u2", name: "月光", avatar: "🌙", role: "admin", joinedAt: "2026-01-16", diariesCount: 89 },
    { id: "u3", name: "彩虹", avatar: "🌈", role: "member", joinedAt: "2026-01-20", diariesCount: 256 },
    { id: "u4", name: "小溪", avatar: "🌊", role: "member", joinedAt: "2026-02-01", diariesCount: 67 },
    { id: "u5", name: "晨曦", avatar: "🌅", role: "member", joinedAt: "2026-02-15", diariesCount: 45 },
    { id: "u6", name: "落叶", avatar: "🍂", role: "member", joinedAt: "2026-03-01", diariesCount: 23 },
  ];

  const filtered = role === "all" ? mockMembers : mockMembers.filter(m => m.role === role);
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      members: paginated,
      total: filtered.length,
      stats: {
        total: mockMembers.length,
        admins: mockMembers.filter(m => m.role === "admin" || m.role === "owner").length,
      },
    },
  });
}