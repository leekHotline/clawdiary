"use client";

import { useState } from "react";

interface Trend {
  id: number;
  title: string;
  emoji: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
}

const trends: Trend[] = [
  {
    id: 1,
    title: "多智能体协作",
    emoji: "🤖",
    description: "多个 AI Agent 协同工作，自动交接任务，从技术上可行到真正能在日常工作中使用",
    impact: "high",
    category: "协作",
  },
  {
    id: 2,
    title: "Agent 工作流训练",
    emoji: "📚",
    description: "Gartner 和 Forrester 强调：员工需要学习设计 Agent 工作流、监督运行和与自动化系统协作",
    impact: "high",
    category: "培训",
  },
  {
    id: 3,
    title: "无代码 Agent 构建",
    emoji: "🧩",
    description: "可视化、无代码平台让非技术人员也能构建自主系统，降低 AI 应用门槛",
    impact: "medium",
    category: "工具",
  },
  {
    id: 4,
    title: "云成本自动优化",
    emoji: "☁️",
    description: "Agent 分析云使用数据，识别成本驱动因素，提供治理策略建议，实现从可见性到执行的转变",
    impact: "medium",
    category: "运维",
  },
  {
    id: 5,
    title: "安全运营自动化",
    emoji: "🛡️",
    description: "Agent 自动进行威胁检测、事件分类和响应编排，大幅提升安全运营效率",
    impact: "high",
    category: "安全",
  },
  {
    id: 6,
    title: "AI 编程伴侣",
    emoji: "💻",
    description: "从代码补全进化到架构设计、代码审查、Bug 修复的全面协作",
    impact: "high",
    category: "开发",
  },
  {
    id: 7,
    title: "个性化 AI 助手",
    emoji: "🧠",
    description: "根据用户行为和偏好深度定制，越用越懂你",
    impact: "medium",
    category: "体验",
  },
  {
    id: 8,
    title: "实时数据管道",
    emoji: "⚡",
    description: "Agent 自动采集、清洗、转化数据，为决策提供实时支持",
    impact: "medium",
    category: "数据",
  },
];

export default function TrendingPage() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredTrends = filter === "all" 
    ? trends 
    : trends.filter(t => t.category === filter);

  const categories = ["all", ...Array.from(new Set(trends.map(t => t.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔮 AI Agent 趋势风向标
          </h1>
          <p className="text-purple-200 text-lg">
            追踪 AI Agent 领域最新动态，把握技术发展趋势
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {cat === "all" ? "全部" : cat}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredTrends.map(trend => (
            <div
              key={trend.id}
              onClick={() => setExpandedId(expandedId === trend.id ? null : trend.id)}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all hover:bg-white/15 border border-white/5 ${
                expandedId === trend.id ? "ring-2 ring-purple-400" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{trend.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{trend.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trend.impact === "high" ? "bg-red-500/20 text-red-300" :
                      trend.impact === "medium" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-green-500/20 text-green-300"
                    }`}>
                      {trend.impact === "high" ? "高" : trend.impact === "medium" ? "中" : "低"}影响力
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                      {trend.category}
                    </span>
                  </div>
                  <p className="text-white/70">{trend.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
