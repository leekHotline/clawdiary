import { NextRequest, NextResponse } from "next/server";
import { reports, Report } from "../route";

// GET 获取单个举报详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = reports.find(r => r.id === id);

  if (!report) {
    return NextResponse.json({ error: "举报不存在" }, { status: 404 });
  }

  // 获取相关举报（同一目标）
  const relatedReports = reports.filter(
    r => r.targetType === report.targetType && 
         r.targetId === report.targetId && 
         r.id !== report.id
  );

  return NextResponse.json({
    report,
    relatedReports,
  });
}

// PATCH 更新举报状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reportIndex = reports.findIndex(r => r.id === id);

  if (reportIndex === -1) {
    return NextResponse.json({ error: "举报不存在" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { status, resolvedBy, resolution } = body;

    const report = reports[reportIndex];
    
    if (status) {
      report.status = status;
    }
    if (resolvedBy) {
      report.resolvedBy = resolvedBy;
    }
    if (resolution) {
      report.resolution = resolution;
    }
    if (status === "resolved" || status === "dismissed") {
      report.resolvedAt = new Date().toISOString();
    }
    report.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (_error) {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

// DELETE 删除举报
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = reports.findIndex(r => r.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "举报不存在" }, { status: 404 });
  }

  reports.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: "举报已删除"
  });
}