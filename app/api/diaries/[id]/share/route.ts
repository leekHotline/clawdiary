import { NextRequest, NextResponse } from "next/server";

// 模拟分享状态存储
const sharedDiaries = new Map<string, {
  shared: boolean;
  shareToken: string;
  sharedAt: string;
  expiresAt: string | null;
  views: number;
  allowComments: boolean;
}>();

// 生成分享 token
function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 获取分享状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const shareInfo = sharedDiaries.get(id);
  
  return NextResponse.json({
    diaryId: id,
    shared: shareInfo?.shared || false,
    shareToken: shareInfo?.shareToken || null,
    sharedAt: shareInfo?.sharedAt || null,
    expiresAt: shareInfo?.expiresAt || null,
    views: shareInfo?.views || 0,
    allowComments: shareInfo?.allowComments || false,
    shareUrl: shareInfo?.shareToken 
      ? `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/share/${shareInfo.shareToken}`
      : null,
  });
}

// 创建分享
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { expiresIn, allowComments } = body;
    
    const shareToken = generateShareToken();
    const now = new Date();
    const expiresAt = expiresIn 
      ? new Date(now.getTime() + expiresIn * 1000).toISOString()
      : null;
    
    const shareInfo = {
      shared: true,
      shareToken,
      sharedAt: now.toISOString(),
      expiresAt,
      views: 0,
      allowComments: allowComments || false,
    };
    
    sharedDiaries.set(id, shareInfo);
    
    return NextResponse.json({
      success: true,
      diaryId: id,
      shareToken,
      shareUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/share/${shareToken}`,
      sharedAt: shareInfo.sharedAt,
      expiresAt: shareInfo.expiresAt,
      allowComments: shareInfo.allowComments,
      message: "分享链接已创建",
    });
  } catch (error) {
    console.error("创建分享失败:", error);
    return NextResponse.json(
      { error: "创建分享失败" },
      { status: 500 }
    );
  }
}

// 更新分享设置
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { allowComments, extendExpiry, expiresIn } = body;
    
    const shareInfo = sharedDiaries.get(id);
    if (!shareInfo) {
      return NextResponse.json(
        { error: "日记未分享" },
        { status: 404 }
      );
    }
    
    if (allowComments !== undefined) {
      shareInfo.allowComments = allowComments;
    }
    
    if (extendExpiry && expiresIn) {
      shareInfo.expiresAt = new Date(
        new Date().getTime() + expiresIn * 1000
      ).toISOString();
    }
    
    sharedDiaries.set(id, shareInfo);
    
    return NextResponse.json({
      success: true,
      shareInfo,
      message: "分享设置已更新",
    });
  } catch (error) {
    console.error("更新分享失败:", error);
    return NextResponse.json(
      { error: "更新分享失败" },
      { status: 500 }
    );
  }
}

// 取消分享
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  sharedDiaries.delete(id);
  
  return NextResponse.json({
    success: true,
    diaryId: id,
    message: "分享已取消",
  });
}