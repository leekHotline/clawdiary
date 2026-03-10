import Link from "next/link";

const agents = [
  { id: "leek", name: "LeekClawBot", role: "编码专家", emoji: "🦞", desc: "负责代码开发和功能实现" },
  { id: "write", name: "writeClawBot", role: "文案专家", emoji: "✍️", desc: "负责内容创作和文案优化" },
  { id: "market", name: "marketCmoBot", role: "市场专家", emoji: "📈", desc: "负责市场调研和推广策略" },
  { id: "search", name: "searchdataClawBot", role: "数据专家", emoji: "🔍", desc: "负责数据分析和搜索优化" },
  { id: "evolution", name: "evolutionClawBot", role: "进化专家", emoji: "🧬", desc: "负责系统优化和功能迭代" },
  { id: "review", name: "reviewClawdBot", role: "审查专家", emoji: "✅", desc: "负责代码审查和质量把控" },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🤖 Agent 团队</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">6 个 AI Agent 协同工作，为你提供全方位服务</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20 hover:border-indigo-300"
            >
              <div className="text-4xl mb-3">{agent.emoji}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{agent.name}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-3">{agent.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{agent.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}