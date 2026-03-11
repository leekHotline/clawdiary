import { NextRequest, NextResponse } from "next/server";

// 创建群组
// POST /api/groups/create

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { 
    name, 
    description, 
    isPublic = true, 
    maxMembers = 200,
    avatar,
    tags,
    welcomeMessage,
  } = body;

  // 验证
  if (!name || name.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "群组名称不能为空" },
      { status: 400 }
    );
  }

  if (name.length > 50) {
    return NextResponse.json(
      { success: false, error: "群组名称不能超过50字" },
      { status: 400 }
    );
  }

  // 创建群组
  const newGroup = {
    id: `g_${Date.now()}`,
    name: name.trim(),
    description: description || "",
    avatar: avatar || "📝",
    ownerId: "current-user",
    ownerName: "我",
    membersCount: 1,
    maxMembers,
    isPublic,
    tags: tags || [],
    welcomeMessage: welcomeMessage || "",
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    settings: {
      allowMemberInvite: true,
      allowMemberPost: true,
      requireApproval: !isPublic,
    },
  };

  return NextResponse.json({
    success: true,
    data: {
      group: newGroup,
      inviteCode: `INVITE_${Date.now().toString(36).toUpperCase()}`,
    },
    message: "群组创建成功！快邀请好友加入吧",
  });
}