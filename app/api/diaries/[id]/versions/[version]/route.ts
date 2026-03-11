import { NextRequest, NextResponse } from "next/server";

// 获取特定版本
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const { id, version } = await params;
  const versionNum = parseInt(version.replace("v", ""));
  
  try {
    // 模拟获取特定版本
    const versionData = {
      id: `${id}-v${versionNum}`,
      diaryId: id,
      version: versionNum,
      title: `版本 ${versionNum} 的标题`,
      content: `这是版本 ${versionNum} 的具体内容...`,
      mood: versionNum % 2 === 0 ? "happy" : "peaceful",
      tags: ["日常", "生活"],
      createdAt: new Date(Date.now() - (10 - versionNum) * 24 * 60 * 60 * 1000).toISOString(),
      changeSummary: `版本 ${versionNum} 的修改说明`,
      wordCount: 150 + versionNum * 50,
    };
    
    return NextResponse.json(versionData);
  } catch (error) {
    console.error("获取版本详情失败:", error);
    return NextResponse.json(
      { error: "获取版本详情失败" },
      { status: 500 }
    );
  }
}

// 恢复到特定版本
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const { id, version } = await params;
  const versionNum = parseInt(version.replace("v", ""));
  
  try {
    // 模拟恢复版本
    return NextResponse.json({
      success: true,
      message: `已恢复到版本 ${versionNum}`,
      diaryId: id,
      restoredVersion: versionNum,
      restoredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("恢复版本失败:", error);
    return NextResponse.json(
      { error: "恢复版本失败" },
      { status: 500 }
    );
  }
}

// 删除特定版本
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const { id, version } = await params;
  
  try {
    return NextResponse.json({
      success: true,
      message: `版本 ${version} 已删除`,
      diaryId: id,
    });
  } catch (error) {
    console.error("删除版本失败:", error);
    return NextResponse.json(
      { error: "删除版本失败" },
      { status: 500 }
    );
  }
}