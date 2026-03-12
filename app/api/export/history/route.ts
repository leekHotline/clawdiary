import { NextRequest, NextResponse } from "next/server";

// 导出历史记录存储（内存存储，重启后清空）
// 生产环境可替换为数据库存储
let exportHistory: Array<{
  id: string;
  format: string;
  count: number;
  timestamp: string;
  filters?: Record<string, string>;
}> = [];

// GET /api/export/history - 获取导出历史
export async function GET() {
  try {
    return NextResponse.json({
      history: exportHistory.slice(-20).reverse() // 最近20条
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch export history" },
      { status: 500 }
    );
  }
}

// POST /api/export/history - 记录导出操作
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, count, filters } = body;

    const record = {
      id: `export_${Date.now()}`,
      format: format || "unknown",
      count: count || 0,
      timestamp: new Date().toISOString(),
      filters: filters || undefined
    };

    exportHistory.push(record);

    // 只保留最近100条
    if (exportHistory.length > 100) {
      exportHistory = exportHistory.slice(-100);
    }

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record export" },
      { status: 500 }
    );
  }
}

// DELETE /api/export/history - 清空导出历史
export async function DELETE() {
  try {
    exportHistory = [];
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear export history" },
      { status: 500 }
    );
  }
}