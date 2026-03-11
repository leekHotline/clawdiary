import { NextRequest, NextResponse } from "next/server";

// 切换提醒状态（开启/暂停）
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // 在实际应用中，这里应该更新数据库
  // 这里返回一个简单的 HTML 页面进行跳转
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>提醒状态已更新</title>
      <meta http-equiv="refresh" content="1;url=/reminders">
      <style>
        body {
          font-family: system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
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
        <h1>状态已更新</h1>
        <p>正在返回提醒列表...</p>
      </div>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  return NextResponse.json({
    success: true,
    message: `Reminder ${id} toggled`,
    updatedAt: new Date().toISOString(),
  });
}