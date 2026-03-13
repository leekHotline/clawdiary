import { NextResponse } from 'next/server';

// Agent 数据（直接嵌入，避免 fs 在 Edge Runtime 不可用）
const agentsData = {
  agents: [
    {
      id: "leek",
      name: "LeekClawBot",
      role: "编码专家",
      emoji: "🦞",
      status: "online",
      currentTask: { id: "task-001", title: "Claw Diary 功能优化", progress: 75 },
      capabilities: ["代码开发", "功能实现", "API设计", "Bug修复"],
      description: "负责代码开发和功能实现"
    },
    {
      id: "write",
      name: "writeClawBot",
      role: "文案专家",
      emoji: "✍️",
      status: "online",
      currentTask: { id: "task-002", title: "日记内容创作", progress: 60 },
      capabilities: ["内容创作", "文案优化", "SEO写作", "品牌故事"],
      description: "负责内容创作和文案优化"
    },
    {
      id: "market",
      name: "marketCmoBot",
      role: "市场专家",
      emoji: "📈",
      status: "busy",
      currentTask: { id: "task-003", title: "市场调研分析", progress: 45 },
      capabilities: ["市场调研", "推广策略", "用户增长", "品牌推广"],
      description: "负责市场调研和推广策略"
    },
    {
      id: "search",
      name: "searchdataClawBot",
      role: "数据专家",
      emoji: "🔍",
      status: "idle",
      capabilities: ["数据分析", "搜索优化", "数据可视化", "用户行为分析"],
      description: "负责数据分析和搜索优化"
    },
    {
      id: "evolution",
      name: "evolutionClawBot",
      role: "进化专家",
      emoji: "🧬",
      status: "online",
      currentTask: { id: "task-005", title: "高强度优化模式运行", progress: 50 },
      capabilities: ["系统优化", "功能迭代", "性能调优", "架构升级"],
      description: "负责系统优化和功能迭代"
    },
    {
      id: "review",
      name: "reviewClawdBot",
      role: "审查专家",
      emoji: "✅",
      status: "online",
      currentTask: { id: "task-006", title: "代码质量检查", progress: 80 },
      capabilities: ["代码审查", "质量把控", "安全审计", "最佳实践"],
      description: "负责代码审查和质量把控"
    }
  ],
  lastUpdated: new Date().toISOString()
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      ...agentsData,
      lastUpdated: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
}