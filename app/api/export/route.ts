import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, dateRange, tags, includeImages } = body;

    // 验证格式
    const validFormats = ['markdown', 'pdf', 'html', 'json', 'txt'];
    if (!format || !validFormats.includes(format)) {
      return NextResponse.json(
        { success: false, error: '无效的导出格式' },
        { status: 400 }
      );
    }

    // 模拟导出处理
    const exportId = Date.now().toString();
    const estimatedSize = Math.floor(Math.random() * 10000000) + 1000000; // 1-10MB

    return NextResponse.json({
      success: true,
      data: {
        id: exportId,
        format,
        status: 'completed',
        size: estimatedSize,
        downloadUrl: `/api/export/download/${exportId}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时有效
      },
      message: '导出成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '导出失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // 返回支持的导出格式
  const formats = [
    { id: 'markdown', name: 'Markdown', extension: '.md', mimeType: 'text/markdown' },
    { id: 'pdf', name: 'PDF', extension: '.pdf', mimeType: 'application/pdf' },
    { id: 'html', name: 'HTML', extension: '.html', mimeType: 'text/html' },
    { id: 'json', name: 'JSON', extension: '.json', mimeType: 'application/json' },
    { id: 'txt', name: '纯文本', extension: '.txt', mimeType: 'text/plain' },
  ];

  return NextResponse.json({
    success: true,
    data: formats,
  });
}