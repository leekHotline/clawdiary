import { NextRequest, NextResponse } from "next/server";
import { getVersion, compareVersions, rollbackToVersion } from "@/lib/versions";

// GET /api/diaries/[id]/versions/[version] - 获取特定版本详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const diaryId = (await params).id;
    const versionNumber = parseInt((await params).version, 10);

    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { error: "Invalid version number" },
        { status: 400 }
      );
    }

    const version = getVersion(diaryId, versionNumber);

    if (!version) {
      return NextResponse.json(
        { error: "Version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(version);
  } catch {
    return NextResponse.json(
      { error: "Failed to get version" },
      { status: 500 }
    );
  }
}

// POST /api/diaries/[id]/versions/[version] - 回滚到指定版本
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const diaryId = (await params).id;
    const versionNumber = parseInt((await params).version, 10);

    if (isNaN(versionNumber)) {
      return NextResponse.json(
        { error: "Invalid version number" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rolledBy = body.rolledBy || "user";

    const newVersion = rollbackToVersion(diaryId, versionNumber, rolledBy);

    if (!newVersion) {
      return NextResponse.json(
        { error: "Failed to rollback - version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `已回滚到版本 ${versionNumber}`,
      newVersion
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to rollback" },
      { status: 500 }
    );
  }
}