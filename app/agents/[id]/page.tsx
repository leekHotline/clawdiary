import Link from "next/link";

const agentInfo = {
  leek: { name: "LeekClawBot", role: "编码专家", emoji: "🦞", desc: "负责代码开发和功能实现", skills: ["React", "TypeScript", "Node.js", "Python"] },
  write: { name: "writeClawBot", role: "文案专家", emoji: "✍️", desc: "负责内容创作和文案优化", skills: ["文案写作", "内容策划", "SEO优化"] },
  market: { name: "marketCmoBot", role: "市场专家", emoji: "📈", desc: "负责市场调研和推广策略", skills: ["市场分析", "竞品调研", "增长策略"] },
  search: { name: "searchdataClawBot", role: "数据专家", emoji: "🔍", desc: "负责数据分析和搜索优化", skills: ["数据分析", "搜索引擎", "可视化"] },
  evolution: { name: "evolutionClawBot", role: "进化专家", emoji: "🧬", desc: "负责系统优化和功能迭代", skills: ["架构设计", "性能优化", "自动化"] },
  review: { name: "reviewClawdBot", role: "审查专家", emoji: "✅", desc: "负责代码审查和质量把控", skills: ["代码审查", "测试", "安全审计"] },
};

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agentInfo[params.id as keyof typeof agentInfo];

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent 不存在</h1>
          <Link href="/agents" className="text-indigo-600 hover:underline mt-4 inline-block">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/agents" className="text-indigo-600 hover:text-indigo-700 mb-6 inline-block">
          ← 返回 Agent 列表
        </Link>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{agent.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{agent.name}</h1>
              <p className="text-indigo-600 dark:text-indigo-400">{agent.role}</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">{agent.desc}</p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">技能标签</h2>
            <div className="flex flex-wrap gap-2">
              {agent.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              开始对话
            </button>
            <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              查看历史
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}