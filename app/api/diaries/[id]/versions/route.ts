import { NextRequest, NextResponse } from "next/server";
import { getVersions, getVersionStats, getVersion } from "@/lib/versions";

// GET /api/diaries/[id]/versions - 获取日记版本历史
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const diaryId = (await params).id;
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get("include_content") === "true";

    const versions = getVersions(diaryId);
    const stats = getVersionStats(diaryId);

    // 默认不返回完整内容，减少数据量
    const versionsData = versions.map(v => ({
      id: v.id,
      versionNumber: v.versionNumber,
      title: v.title,
      changedAt: v.changedAt,
      changedBy: v.changedBy,
      changeReason: v.changeReason,
      wordCount: v.wordCount,
      tags: v.tags,
      ...(includeContent ? { content: v.content } : {})
    }));

    return NextResponse.json({
      diaryId,
      stats,
      versions: versionsData
    });
  } catch (error) {
    console.error("Get versions error:", error);
    return NextResponse.json(
      { error: "Failed to get version history" },
      { status: 500 }
    );
  }
}