import { NextRequest, NextResponse } from "next/server";

// 标记单个通知为已读的简化接口
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // 在实际应用中，这里应该更新数据库
  // 这里返回一个简单的确认页面
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>已标记已读</title>
      <meta http-equiv="refresh" content="1;url=/notifications">
      <style>
        body {
          font-family: system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 2rem;
        }
        .icon { font-size: 4rem; }
        h1 { margin: 1rem 0; }
        p { opacity: 0.8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">✓</div>
        <h1>已标记为已读</h1>
        <p>正在返回通知中心...</p>
      </div>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return NextResponse.json({
    success: true,
    message: `Notification ${id} marked as read`,
    notification: {
      id,
      read: true,
      readAt: new Date().toISOString(),
    },
  });
}