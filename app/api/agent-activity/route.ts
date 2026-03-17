import { NextRequest, NextResponse } from 'next/server';

// 模拟 Agent 状态 - 让界面更生动
// 生产环境应该连接真实的 Agent 状态源（如 OpenClaw API）

const agentConfigs = {
  leek: { name: '采风爪', tasks: ['收集素材中...', '浏览新闻', '整理笔记', '搜索灵感'] },
  write: { name: '执笔爪', tasks: ['撰写日记中...', '润色文字', '构思内容', '整理草稿'] },
  market: { name: '吆喝爪', tasks: ['策划推广中...', '分析数据', '优化文案', '用户调研'] },
  search: { name: '掘金爪', tasks: ['数据分析中...', '挖掘洞察', '生成报告', '趋势预测'] },
  evolution: { name: '进化爪', tasks: ['产品迭代中...', '收集反馈', '规划功能', '代码优化'] },
  review: { name: '审阅爪', tasks: ['审查内容中...', '检查质量', '修正错误', '发布审核'] },
  lobster: { name: '太空龙虾', tasks: ['巡逻中...', '协调工作', '处理任务', '待命中'] },
};

// 根据时间生成伪随机但稳定的状态
function generateAgentStatus(agentId: string) {
  const now = Date.now();
  const minute = Math.floor(now / 60000); // 每分钟变化一次
  
  // 使用 agentId 和 minute 生成伪随机数
  const hash = (agentId + minute).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (hash * 9301 + 49297) % 233280;
  const normalized = random / 233280;
  
  // 30% 概率是 active
  const isActive = normalized > 0.7;
  
  const config = agentConfigs[agentId as keyof typeof agentConfigs];
  if (!config) {
    return { status: 'idle', message: '', lastActive: now };
  }
  
  if (isActive) {
    const taskIndex = Math.floor((normalized * 10) % config.tasks.length);
    return {
      status: 'active',
      message: config.tasks[taskIndex],
      lastActive: now - Math.floor(normalized * 300000), // 0-5分钟前
    };
  }
  
  return {
    status: 'idle',
    message: '',
    lastActive: now - Math.floor(normalized * 3600000), // 0-1小时前
  };
}

// GET: 获取当前状态
export async function GET() {
  const now = Date.now();
  
  // 为每个 agent 生成状态
  const agents = Object.keys(agentConfigs).reduce((acc, agentId) => {
    acc[agentId] = generateAgentStatus(agentId);
    return acc;
  }, {} as Record<string, ReturnType<typeof generateAgentStatus>>);
  
  return NextResponse.json({
    success: true,
    lastUpdate: now,
    agents,
  });
}

// POST: 更新 Agent 状态（保留接口，但 serverless 环境无法持久化）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, status, message } = body;

    if (!agentId || !agentConfigs[agentId as keyof typeof agentConfigs]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid agentId' 
      }, { status: 400 });
    }

    // 在 serverless 环境中，这个更新不会持久化
    // 但接口保留用于未来连接真实数据源
    return NextResponse.json({ 
      success: true,
      message: 'Status update received (serverless mode - not persisted)',
      agent: {
        status: status || 'active',
        message: message || '',
        lastActive: Date.now(),
      }
    });
  } catch {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request body' 
    }, { status: 400 });
  }
}