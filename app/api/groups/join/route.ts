import { NextRequest, NextResponse } from "next/server";

// 加入群组
// POST /api/groups/join

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { groupId, inviteCode } = body;

  if (!groupId && !inviteCode) {
    return NextResponse.json(
      { success: false, error: "缺少群组ID或邀请码" },
      { status: 400 }
    );
  }

  // 检查群组是否存在
  // 检查是否已经是成员
  // 检查群组是否已满

  const groupInfo = {
    id: groupId || `g_${Date.now()}`,
    name: "写作爱好者联盟",
    avatar: "✍️",
    membersCount: 129, // 加入后 +1
    welcomeMessage: "欢迎加入写作爱好者联盟！这里有一群热爱写作的小伙伴，一起分享心得，共同进步！",
  };

  return NextResponse.json({
    success: true,
    data: {
      group: groupInfo,
      joinedAt: new Date().toISOString(),
      memberRole: "member", // member, admin, owner
    },
    message: `成功加入「${groupInfo.name}」`,
  });
}