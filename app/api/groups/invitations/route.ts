import { NextResponse } from "next/server";

// 群组邀请 API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId, inviteeId, message } = body;

    // 验证参数
    if (!groupId || !inviteeId) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 生成邀请码
    const inviteCode = `GRP_${Date.now().toString(36).toUpperCase()}`;

    // 模拟邀请成功
    return NextResponse.json({
      success: true,
      data: {
        inviteId: `inv_${Date.now()}`,
        groupId,
        inviteeId,
        inviteCode,
        inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/groups/join/${inviteCode}`,
        message: message || "邀请你加入群组",
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后过期
      },
      message: "邀请已发送",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "发送邀请失败" },
      { status: 500 }
    );
  }
}

// 获取群组邀请列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  const invites = [
    {
      id: "inv1",
      groupId: "g1",
      groupName: "写作爱好者联盟",
      inviter: { id: "u1", name: "星辰", avatar: "⭐" },
      invitee: { id: "u5", name: "晨曦", avatar: "🌅" },
      status: "pending",
      createdAt: "2026-03-12T06:00:00Z",
    },
    {
      id: "inv2",
      groupId: "g1",
      groupName: "写作爱好者联盟",
      inviter: { id: "u2", name: "月光", avatar: "🌙" },
      invitee: { id: "u6", name: "落叶", avatar: "🍂" },
      status: "accepted",
      createdAt: "2026-03-11T10:00:00Z",
    },
    {
      id: "inv3",
      groupId: "g2",
      groupName: "晨间日记俱乐部",
      inviter: { id: "u1", name: "星辰", avatar: "⭐" },
      invitee: { id: "u7", name: "云朵", avatar: "☁️" },
      status: "rejected",
      createdAt: "2026-03-10T15:00:00Z",
    },
  ];

  const filteredInvites = groupId
    ? invites.filter(i => i.groupId === groupId)
    : invites;

  return NextResponse.json({
    success: true,
    data: filteredInvites,
  });
}