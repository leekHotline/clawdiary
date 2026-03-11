import { NextRequest, NextResponse } from "next/server";

// 数据备份 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json"; // json | markdown | txt
  const includeImages = searchParams.get("images") === "true";
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");
  
  try {
    // 模拟备份数据
    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      format,
      filters: {
        dateFrom,
        dateTo,
        includeImages,
      },
      stats: {
        totalDiaries: 156,
        totalWords: 45000,
        dateRange: {
          from: dateFrom || "2024-01-01",
          to: dateTo || new Date().toISOString().split("T")[0],
        },
      },
      // 实际应该返回文件下载链接或流
      downloadUrl: `/api/backup/download?token=${Date.now()}`,
    };
    
    return NextResponse.json(backupData);
  } catch (error) {
    console.error("创建备份失败:", error);
    return NextResponse.json(
      { error: "创建备份失败" },
      { status: 500 }
    );
  }
}

// 创建备份任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format = "json", includeImages = false, notifyEmail } = body;
    
    // 模拟创建备份任务
    const taskId = `backup-${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      taskId,
      status: "pending",
      message: "备份任务已创建，正在处理中...",
      estimatedTime: "2-5 分钟",
      notifyEmail,
    });
  } catch (error) {
    console.error("创建备份任务失败:", error);
    return NextResponse.json(
      { error: "创建备份任务失败" },
      { status: 500 }
    );
  }
}