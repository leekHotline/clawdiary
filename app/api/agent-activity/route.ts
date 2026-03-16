import { NextRequest, NextResponse } from 'next/server';

// 内存存储（serverless 会重置，但短时间内有效）
// 生产环境建议使用 Vercel KV 或 Redis
const activityState = {
  lastUpdate: Date.now(),
  agents: {
    lobster: { status: 'idle', message: '等待中...', lastActive: Date.now() },
    leek: { status: 'idle', message: '', lastActive: Date.now() },
    write: { status: 'idle', message: '', lastActive: Date.now() },
    market: { status: 'idle', message: '', lastActive: Date.now() },
    search: { status: 'idle', message: '', lastActive: Date.now() },
    evolution: { status: 'idle', message: '', lastActive: Date.now() },
    review: { status: 'idle', message: '', lastActive: Date.now() },
  }
};

// GET: 获取当前状态
export async function GET() {
  return NextResponse.json({
    success: true,
    ...activityState
  });
}

// POST: 更新 Agent 状态
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, status, message } = body;

    if (!agentId || !activityState.agents[agentId as keyof typeof activityState.agents]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid agentId' 
      }, { status: 400 });
    }

    // 更新状态
    activityState.agents[agentId as keyof typeof activityState.agents] = {
      status: status || 'active',
      message: message || '',
      lastActive: Date.now()
    };
    activityState.lastUpdate = Date.now();

    return NextResponse.json({ 
      success: true, 
      agent: activityState.agents[agentId as keyof typeof activityState.agents]
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request body' 
    }, { status: 400 });
  }
}