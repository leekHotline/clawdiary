import { NextRequest, NextResponse } from "next/server";

// 邀请码存储（实际项目中应使用数据库）
const inviteCodes: Record<string, {
  code: string;
  collabId: string;
  collabTitle: string;
  createdAt: string;
  createdBy: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
}> = {};

// 生成随机邀请码
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET - 获取协作的邀请信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // 获取该协作的所有邀请码
  const collabInvites = Object.values(inviteCodes).filter(
    invite => invite.collabId === id
  );
  
  return NextResponse.json({
    success: true,
    data: collabInvites
  });
}

// POST - 创建新邀请码
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { createdBy, maxUses = 10, expiresInDays } = body;
  
  const code = generateInviteCode();
  
  // 检查邀请码是否已存在
  while (inviteCodes[code]) {
    const newCode = generateInviteCode();
    inviteCodes[newCode] = inviteCodes[code]; // This won't happen often
  }
  
  const expiresAt = expiresInDays 
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;
  
  const invite = {
    code,
    collabId: id,
    collabTitle: body.collabTitle || "协作日记",
    createdAt: new Date().toISOString(),
    createdBy: createdBy || "user-1",
    maxUses,
    usedCount: 0,
    expiresAt
  };
  
  inviteCodes[code] = invite;
  
  return NextResponse.json({
    success: true,
    data: {
      code: invite.code,
      inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/collab/join/${invite.code}`,
      ...invite
    },
    message: "邀请码创建成功！"
  });
}

// DELETE - 删除邀请码
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  
  if (!code || !inviteCodes[code]) {
    return NextResponse.json(
      { success: false, message: "邀请码不存在" },
      { status: 404 }
    );
  }
  
  if (inviteCodes[code].collabId !== id) {
    return NextResponse.json(
      { success: false, message: "邀请码不匹配" },
      { status: 400 }
    );
  }
  
  delete inviteCodes[code];
  
  return NextResponse.json({
    success: true,
    message: "邀请码已删除"
  });
}

// 导出邀请码存储，供其他 API 使用
export { inviteCodes };