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
    description: "AI Agent 处理警报分类和调查，让人类分析师专注于威胁狩猎和防御开发",
    impact: "high",
    category: "安全",
  },
  {
    id: 6,
    title: "医疗保健上下文感知",
    emoji: "🏥",
    description: "基于模型的 Agent 维护患者记录的上下文感知，支持临床决策，减少管理负担",
    impact: "medium",
    category: "医疗",
  },
  {
    id: 7,
    title: "金融风险分析",
    emoji: "📊",
    description: "Agent 团队分析经济指标、管理风险、简化端到端银行业务工作流",
    impact: "medium",
    category: "金融",
  },
  {
    id: 8,
    title: "实时可观测性",
    emoji: "📈",
    description: "Agentic AI 系统连接跨云、IT 和金融环境的实时可观测性，显著提升有效性",
    impact: "medium",
    category: "监控",
  },
];

export default function TrendingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [expandedTrend, setExpandedTrend] = useState<number | null>(null);
  const [votedTrends, setVotedTrends] = useState<number[]>([]);

  const categories = ["全部", ...Array.from(new Set(trends.map((t) => t.category)))];

  const filteredTrends = selectedCategory === "全部"
    ? trends
    : trends.filter((t) => t.category === selectedCategory);

  const handleVote = (id: number) => {
    if (!votedTrends.includes(id)) {
      setVotedTrends([...votedTrends, id]);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 mb-4">
            <span className="text-purple-400 text-sm">🔥 2026 AI Agent 趋势</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI Agent 趋势风向标
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            源自 Google Cloud、Salesmate、Gartner、Forrester 的最新趋势洞察
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-white">{trends.length}</div>
            <div className="text-slate-400 text-sm">趋势数量</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-red-400">
              {trends.filter((t) => t.impact === "high").length}
            </div>
            <div className="text-slate-400 text-sm">高影响力</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">{votedTrends.length}</div>
            <div className="text-slate-400 text-sm">我关注的</div>
          </div>
        </div>

        {/* Trends List */}
        <div className="space-y-4">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className={`bg-slate-800/50 rounded-xl border transition-all cursor-pointer ${
                expandedTrend === trend.id
                  ? "border-purple-500/50 shadow-lg shadow-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
              onClick={() => setExpandedTrend(expandedTrend === trend.id ? null : trend.id)}
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{trend.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{trend.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getImpactColor(trend.impact)}`}>
                        {trend.impact === "high" ? "高影响" : trend.impact === "medium" ? "中影响" : "低影响"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {trend.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{trend.description}</p>
                  </div>
                </div>

                {expandedTrend === trend.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(trend.id);
                        }}
                        disabled={votedTrends.includes(trend.id)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          votedTrends.includes(trend.id)
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {votedTrends.includes(trend.id) ? "✓ 已关注" : "⭐ 关注"}
                      </button>
                      <span className="text-slate-500 text-sm">
                        点击卡片展开详情
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Source */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            数据来源：Google Cloud, Salesmate, Gartner, Forrester
          </p>
        </div>
      </div>
    </div>
  );
}
