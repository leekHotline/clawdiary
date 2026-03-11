import { NextRequest, NextResponse } from "next/server";

// 举报类型
export type ReportType = 
  | "spam"           // 垃圾内容
  | "harassment"     // 骚扰
  | "hate_speech"    // 仇恨言论
  | "violence"       // 暴力内容
  | "adult"          // 成人内容
  | "misinformation" // 虚假信息
  | "copyright"      // 版权问题
  | "other";         // 其他

// 举报状态
export type ReportStatus = 
  | "pending"    // 待处理
  | "reviewing"  // 审核中
  | "resolved"   // 已解决
  | "dismissed"; // 已驳回

// 举报目标类型
export type ReportTargetType = 
  | "diary"      // 日记
  | "comment"    // 评论
  | "user"       // 用户
  | "inspiration" // 灵感
  | "challenge"  // 挑战
  | "collab";    // 协作

export interface Report {
  id: string;
  type: ReportType;
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  // 关联内容快照
  snapshot?: {
    title?: string;
    content?: string;
    authorId?: string;
    authorName?: string;
  };
}

// 模拟数据库 - 导出供其他路由使用
export const reports: Report[] = [
  {
    id: "report_1",
    type: "spam",
    targetType: "diary",
    targetId: "diary_123",
    reporterId: "user_1",
    reporterName: "测试用户",
    reason: "这是垃圾广告内容",
    description: "这篇日记包含大量无关广告链接",
    status: "pending",
    createdAt: "2026-03-11T10:00:00Z",
    updatedAt: "2026-03-11T10:00:00Z",
    snapshot: {
      title: "测试日记标题",
      content: "这是一些广告内容...",
      authorId: "user_2",
      authorName: "广告发布者"
    }
  },
  {
    id: "report_2",
    type: "harassment",
    targetType: "comment",
    targetId: "comment_456",
    reporterId: "user_3",
    reporterName: "另一个用户",
    reason: "恶意评论攻击",
    status: "reviewing",
    createdAt: "2026-03-10T15:30:00Z",
    updatedAt: "2026-03-11T09:00:00Z",
    snapshot: {
      content: "这是恶意评论内容...",
      authorId: "user_4",
      authorName: "攻击者"
    }
  }
];

// GET 获取举报列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const targetType = searchParams.get("targetType");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let filtered = [...reports];

  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }
  if (type) {
    filtered = filtered.filter(r => r.type === type);
  }
  if (targetType) {
    filtered = filtered.filter(r => r.targetType === targetType);
  }

  // 按时间倒序
  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedReports = filtered.slice(offset, offset + limit);

  // 统计信息
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    reviewing: reports.filter(r => r.status === "reviewing").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
    byType: {
      spam: reports.filter(r => r.type === "spam").length,
      harassment: reports.filter(r => r.type === "harassment").length,
      hate_speech: reports.filter(r => r.type === "hate_speech").length,
      violence: reports.filter(r => r.type === "violence").length,
      adult: reports.filter(r => r.type === "adult").length,
      misinformation: reports.filter(r => r.type === "misinformation").length,
      copyright: reports.filter(r => r.type === "copyright").length,
      other: reports.filter(r => r.type === "other").length,
    }
  };

  return NextResponse.json({
    reports: paginatedReports,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    stats,
  });
}

// POST 创建举报
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, targetType, targetId, reporterId, reporterName, reason, description, snapshot } = body;

    if (!type || !targetType || !targetId || !reporterId || !reason) {
      return NextResponse.json(
        { error: "缺少必要字段" },
        { status: 400 }
      );
    }

    // 检查是否已举报
    const existing = reports.find(
      r => r.targetType === targetType && 
           r.targetId === targetId && 
           r.reporterId === reporterId &&
           r.status !== "dismissed"
    );

    if (existing) {
      return NextResponse.json(
        { error: "您已举报过此内容", existingReport: existing },
        { status: 400 }
      );
    }

    const newReport: Report = {
      id: `report_${Date.now()}`,
      type,
      targetType,
      targetId,
      reporterId,
      reporterName: reporterName || "匿名用户",
      reason,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      snapshot,
    };

    reports.unshift(newReport);

    return NextResponse.json({
      success: true,
      report: newReport,
      message: "举报已提交，我们会尽快处理"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "创建举报失败" },
      { status: 500 }
    );
  }
}