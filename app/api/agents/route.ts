import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'agents.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to load agents data',
      data: {
        agents: getDefaultAgents(),
        lastUpdated: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

function getDefaultAgents() {
  return [
    {
      id: "leek",
      name: "LeekClawBot",
      role: "编码专家",
      emoji: "🦞",
      status: "online",
      capabilities: ["代码开发", "功能实现"],
      description: "负责代码开发和功能实现"
    },
    {
      id: "write",
      name: "writeClawBot",
      role: "文案专家",
      emoji: "✍️",
      status: "online",
      capabilities: ["内容创作", "文案优化"],
      description: "负责内容创作和文案优化"
    },
    {
      id: "market",
      name: "marketCmoBot",
      role: "市场专家",
      emoji: "📈",
      status: "busy",
      capabilities: ["市场调研", "推广策略"],
      description: "负责市场调研和推广策略"
    },
    {
      id: "search",
      name: "searchdataClawBot",
      role: "数据专家",
      emoji: "🔍",
      status: "idle",
      capabilities: ["数据分析", "搜索优化"],
      description: "负责数据分析和搜索优化"
    },
    {
      id: "evolution",
      name: "evolutionClawBot",
      role: "进化专家",
      emoji: "🧬",
      status: "online",
      capabilities: ["系统优化", "功能迭代"],
      description: "负责系统优化和功能迭代"
    },
    {
      id: "review",
      name: "reviewClawdBot",
      role: "审查专家",
      emoji: "✅",
      status: "online",
      capabilities: ["代码审查", "质量把控"],
      description: "负责代码审查和质量把控"
    }
  ];
}