"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 功能分类
interface Feature {
  id: string;
  name: string;
  route: string;
  category: string;
  description: string;
  usageScore: number; // 使用频率 1-5
  valueScore: number; // 用户价值 1-5
  costScore: number; // 维护成本 1-5 (5=低成本, 1=高成本)
  recommendation: "keep" | "review" | "remove";
  lastUpdated: string;
}

// 预设功能列表（从项目扫描）
const FEATURES: Feature[] = [
  // 核心功能
  { id: "1", name: "日记列表", route: "/", category: "核心", description: "日记浏览和管理", usageScore: 5, valueScore: 5, costScore: 4, recommendation: "keep", lastUpdated: "2026-03-23" },
  { id: "2", name: "写日记", route: "/write", category: "核心", description: "创建和编辑日记", usageScore: 5, valueScore: 5, costScore: 4, recommendation: "keep", lastUpdated: "2026-03-23" },
  { id: "3", name: "日记详情", route: "/diary", category: "核心", description: "查看单篇日记", usageScore: 5, valueScore: 5, costScore: 4, recommendation: "keep", lastUpdated: "2026-03-23" },
  
  // AI 功能
  { id: "4", name: "AI日记伙伴", route: "/diary-buddy", category: "AI互动", description: "AI陪伴式写日记", usageScore: 3, valueScore: 4, costScore: 3, recommendation: "review", lastUpdated: "2026-03-22" },
  { id: "5", name: "AI日记教练", route: "/diary-coach", category: "AI互动", description: "个性化写作指导", usageScore: 3, valueScore: 4, costScore: 3, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "6", name: "情绪透视镜", route: "/emotion-lens", category: "AI分析", description: "多视角情绪分析", usageScore: 2, valueScore: 3, costScore: 3, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "7", name: "日记盲盒", route: "/diary-blindbox", category: "趣味", description: "随机抽取日记惊喜", usageScore: 2, valueScore: 2, costScore: 4, recommendation: "remove", lastUpdated: "2026-03-23" },
  { id: "8", name: "智慧导师", route: "/wisdom-mentors", category: "AI互动", description: "与历史名人对话", usageScore: 2, valueScore: 3, costScore: 3, recommendation: "remove", lastUpdated: "2026-03-23" },
  { id: "9", name: "梦境解码器", route: "/dream-decoder", category: "AI分析", description: "AI解读梦境符号", usageScore: 2, valueScore: 2, costScore: 3, recommendation: "remove", lastUpdated: "2026-03-23" },
  { id: "10", name: "时光信箱", route: "/time-mailbox", category: "趣味", description: "与过去的自己对话", usageScore: 2, valueScore: 3, costScore: 4, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "11", name: "情绪天气预报", route: "/emotion-weather", category: "可视化", description: "用天气隐喻情绪", usageScore: 2, valueScore: 3, costScore: 4, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "12", name: "写作风格分析器", route: "/style-analyzer", category: "AI分析", description: "分析用户写作风格", usageScore: 2, valueScore: 3, costScore: 3, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "13", name: "每日一问", route: "/daily-question", category: "引导", description: "引导式日记问答", usageScore: 3, valueScore: 4, costScore: 4, recommendation: "keep", lastUpdated: "2026-03-23" },
  { id: "14", name: "风格炼金术", route: "/style-alchemist", category: "AI创作", description: "转换成大师风格", usageScore: 2, valueScore: 2, costScore: 3, recommendation: "remove", lastUpdated: "2026-03-23" },
  { id: "15", name: "日记回忆馆", route: "/memory-gallery", category: "可视化", description: "随机回忆时间轴", usageScore: 2, valueScore: 3, costScore: 3, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "16", name: "心情Bingo", route: "/mood-bingo", category: "游戏化", description: "游戏化心情追踪", usageScore: 3, valueScore: 4, costScore: 4, recommendation: "keep", lastUpdated: "2026-03-23" },
  { id: "17", name: "能量站", route: "/energy-station", category: "激励", description: "能量等级和成就系统", usageScore: 3, valueScore: 4, costScore: 3, recommendation: "review", lastUpdated: "2026-03-23" },
  { id: "18", name: "周回顾生成器", route: "/weekly-review", category: "分析", description: "生成周回顾报告", usageScore: 3, valueScore: 4, costScore: 3, recommendation: "keep", lastUpdated: "2026-03-22" },
  { id: "19", name: "能量充值站", route: "/energy-booster", category: "激励", description: "能量恢复和激励", usageScore: 2, valueScore: 2, costScore: 4, recommendation: "remove", lastUpdated: "2026-03-22" },
  { id: "20", name: "写作人格测试", route: "/writing-personality", category: "趣味", description: "测试写作人格", usageScore: 2, valueScore: 2, costScore: 4, recommendation: "remove", lastUpdated: "2026-03-22" },
  { id: "21", name: "日记卡片生成器", route: "/diary-card", category: "分享", description: "生成分享卡片", usageScore: 3, valueScore: 3, costScore: 3, recommendation: "review", lastUpdated: "2026-03-22" },
  { id: "22", name: "AI情绪镜子", route: "/emotion-mirror", category: "AI分析", description: "情绪映射和反思", usageScore: 2, valueScore: 3, costScore: 3, recommendation: "review", lastUpdated: "2026-03-22" },
  { id: "23", name: "时光回溯", route: "/time-travel", category: "趣味", description: "回顾过去的日记", usageScore: 2, valueScore: 3, costScore: 4, recommendation: "review", lastUpdated: "2026-03-22" },
  { id: "24", name: "语音日记", route: "/voice-diary", category: "核心", description: "语音转文字日记", usageScore: 3, valueScore: 4, costScore: 3, recommendation: "keep", lastUpdated: "2026-03-23" },
  { id: "25", name: "聊天日记", route: "/chat-diary", category: "核心", description: "对话式写日记", usageScore: 4, valueScore: 5, costScore: 3, recommendation: "keep", lastUpdated: "2026-03-21" },
];

// 计算功能得分
function calculateScore(feature: Feature): number {
  // 综合得分 = 使用频率 * 0.4 + 用户价值 * 0.4 + 维护成本 * 0.2
  return feature.usageScore * 0.4 + feature.valueScore * 0.4 + feature.costScore * 0.2;
}

// 获取推荐标签
function getRecommendationLabel(rec: string) {
  switch (rec) {
    case "keep": return { text: "保留", color: "bg-green-500", emoji: "✅" };
    case "review": return { text: "待评估", color: "bg-yellow-500", emoji: "⚠️" };
    case "remove": return { text: "建议删除", color: "bg-red-500", emoji: "❌" };
    default: return { text: "未知", color: "bg-gray-500", emoji: "❓" };
  }
}

// 分类颜色
const categoryColors: Record<string, string> = {
  "核心": "from-blue-500 to-indigo-500",
  "AI互动": "from-purple-500 to-pink-500",
  "AI分析": "from-violet-500 to-purple-500",
  "AI创作": "from-fuchsia-500 to-pink-500",
  "趣味": "from-orange-500 to-amber-500",
  "可视化": "from-cyan-500 to-blue-500",
  "引导": "from-green-500 to-emerald-500",
  "游戏化": "from-rose-500 to-pink-500",
  "激励": "from-yellow-500 to-orange-500",
  "分析": "from-teal-500 to-cyan-500",
  "分享": "from-indigo-500 to-violet-500",
};

export default function FeatureAuditPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filter, setFilter] = useState<"all" | "keep" | "review" | "remove">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "usage">("score");
  const [showExport, setShowExport] = useState(false);

  // 加载功能列表
  useEffect(() => {
    // 从 localStorage 加载自定义评分
    const saved = localStorage.getItem("feature-audit-scores");
    if (saved) {
      const savedScores = JSON.parse(saved);
      const merged = FEATURES.map(f => {
        const saved = savedScores[f.id];
        if (saved) {
          return { ...f, ...saved };
        }
        return f;
      });
      setFeatures(merged);
    } else {
      setFeatures(FEATURES);
    }
  }, []);

  // 保存评分
  const saveFeature = (id: string, updates: Partial<Feature>) => {
    const newFeatures = features.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    setFeatures(newFeatures);
    
    // 保存到 localStorage
    const scores: Record<string, Partial<Feature>> = {};
    newFeatures.forEach(f => {
      scores[f.id] = {
        usageScore: f.usageScore,
        valueScore: f.valueScore,
        costScore: f.costScore,
        recommendation: f.recommendation,
      };
    });
    localStorage.setItem("feature-audit-scores", JSON.stringify(scores));
  };

  // 过滤和排序
  const filteredFeatures = features
    .filter(f => filter === "all" || f.recommendation === filter)
    .filter(f => categoryFilter === "all" || f.category === categoryFilter)
    .sort((a, b) => {
      if (sortBy === "score") return calculateScore(b) - calculateScore(a);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "usage") return b.usageScore - a.usageScore;
      return 0;
    });

  // 统计
  const stats = {
    total: features.length,
    keep: features.filter(f => f.recommendation === "keep").length,
    review: features.filter(f => f.recommendation === "review").length,
    remove: features.filter(f => f.recommendation === "remove").length,
    avgScore: features.reduce((sum, f) => sum + calculateScore(f), 0) / features.length,
  };

  // 导出报告
  const exportReport = () => {
    const report = {
      date: new Date().toISOString(),
      stats,
      features: features.map(f => ({
        name: f.name,
        route: f.route,
        category: f.category,
        score: calculateScore(f).toFixed(2),
        recommendation: f.recommendation,
        reason: f.recommendation === "remove" 
          ? "使用频率低、用户价值低或维护成本高"
          : f.recommendation === "review"
          ? "需要进一步评估用户反馈"
          : "核心功能或高价值功能",
      })),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature-audit-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // 获取所有分类
  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <Link href="/" className="text-sm text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🔍</span>
            <h1 className="text-3xl font-bold text-white">产品体检中心</h1>
          </div>
          <p className="text-purple-300">评估功能价值，做减法而不是加法</p>
          <p className="text-sm text-purple-400 mt-2">如无必要，勿增实体 — 奥卡姆剃刀</p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-purple-400">总功能数</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">✅ {stats.keep}</div>
            <div className="text-xs text-green-300">保留</div>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-400">⚠️ {stats.review}</div>
            <div className="text-xs text-yellow-300">待评估</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-500/30">
            <div className="text-3xl font-bold text-red-400">❌ {stats.remove}</div>
            <div className="text-xs text-red-300">建议删除</div>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400">{stats.avgScore.toFixed(1)}</div>
            <div className="text-xs text-purple-300">平均得分</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* 状态过滤 */}
          <div className="flex gap-2">
            {["all", "keep", "review", "remove"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-purple-300 hover:bg-white/20"
                }`}
              >
                {f === "all" ? "全部" : getRecommendationLabel(f).text}
              </button>
            ))}
          </div>
          
          {/* 分类过滤 */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/10 text-purple-300 border border-white/20 focus:outline-none focus:border-purple-500"
          >
            <option value="all">所有分类</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          
          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-white/10 text-purple-300 border border-white/20 focus:outline-none focus:border-purple-500"
          >
            <option value="score">按得分排序</option>
            <option value="name">按名称排序</option>
            <option value="usage">按使用频率排序</option>
          </select>
          
          {/* 导出 */}
          <button
            onClick={() => exportReport()}
            className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-all"
          >
            📥 导出报告
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {filteredFeatures.map((feature) => {
            const score = calculateScore(feature);
            const rec = getRecommendationLabel(feature.recommendation);
            
            return (
              <div
                key={feature.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryColors[feature.category] || "from-gray-500 to-gray-600"}`}>
                        {feature.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${rec.color}`}>
                        {rec.emoji} {rec.text}
                      </span>
                      <Link
                        href={feature.route}
                        target="_blank"
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        {feature.route}
                      </Link>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">{feature.name}</h3>
                    <p className="text-sm text-purple-300">{feature.description}</p>
                  </div>
                  
                  {/* Right: Score */}
                  <div className="flex flex-col items-center">
                    <div className={`text-3xl font-bold ${
                      score >= 4 ? "text-green-400" : score >= 3 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {score.toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-400">综合得分</div>
                  </div>
                </div>
                
                {/* Scoring */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-purple-400 block mb-1">使用频率 (1-5)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          onClick={() => saveFeature(feature.id, { usageScore: v })}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            feature.usageScore >= v
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-purple-400 hover:bg-white/20"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-purple-400 block mb-1">用户价值 (1-5)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          onClick={() => saveFeature(feature.id, { valueScore: v })}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            feature.valueScore >= v
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-purple-400 hover:bg-white/20"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-purple-400 block mb-1">维护成本 (5=低, 1=高)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          onClick={() => saveFeature(feature.id, { costScore: v })}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            feature.costScore >= v
                              ? "bg-purple-600 text-white"
                              : "bg-white/10 text-purple-400 hover:bg-white/20"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => saveFeature(feature.id, { recommendation: "keep" })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      feature.recommendation === "keep"
                        ? "bg-green-600 text-white"
                        : "bg-white/10 text-green-400 hover:bg-green-600/20"
                    }`}
                  >
                    ✅ 保留
                  </button>
                  <button
                    onClick={() => saveFeature(feature.id, { recommendation: "review" })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      feature.recommendation === "review"
                        ? "bg-yellow-600 text-white"
                        : "bg-white/10 text-yellow-400 hover:bg-yellow-600/20"
                    }`}
                  >
                    ⚠️ 待评估
                  </button>
                  <button
                    onClick={() => saveFeature(feature.id, { recommendation: "remove" })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      feature.recommendation === "remove"
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-red-400 hover:bg-red-600/20"
                    }`}
                  >
                    ❌ 删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>评估总结</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <h3 className="font-medium text-green-400 mb-2">✅ 建议保留 ({stats.keep}个)</h3>
              <p className="text-sm text-purple-300">
                核心功能或高价值功能，使用频率高，用户价值大。
              </p>
              <div className="mt-2 text-xs text-purple-400">
                {features.filter(f => f.recommendation === "keep").map(f => f.name).join("、") || "暂无"}
              </div>
            </div>
            
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <h3 className="font-medium text-yellow-400 mb-2">⚠️ 待评估 ({stats.review}个)</h3>
              <p className="text-sm text-purple-300">
                需要查看用户数据、收集反馈后再决定。
              </p>
              <div className="mt-2 text-xs text-purple-400">
                {features.filter(f => f.recommendation === "review").slice(0, 5).map(f => f.name).join("、")}
                {stats.review > 5 && ` 等${stats.review}个`}
              </div>
            </div>
            
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <h3 className="font-medium text-red-400 mb-2">❌ 建议删除 ({stats.remove}个)</h3>
              <p className="text-sm text-purple-300">
                使用频率低、用户价值低，占用开发资源。
              </p>
              <div className="mt-2 text-xs text-purple-400">
                {features.filter(f => f.recommendation === "remove").map(f => f.name).join("、") || "暂无"}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <h3 className="font-medium text-purple-300 mb-2">💡 建议</h3>
            <ul className="text-sm text-purple-400 space-y-1">
              <li>• 优先保留核心功能：日记列表、写日记、聊天日记、语音日记</li>
              <li>• 删除低价值功能：日记盲盒、风格炼金术、写作人格测试等</li>
              <li>• 合并相似功能：能量站 + 能量充值站 → 合并为一个</li>
              <li>• AI功能需要实际API支持，评估是否有真实用户使用</li>
              <li>• 游戏化功能（Bingo、每日一问）有助于用户留存，保留</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-purple-400 text-sm">
          <p>🧬 产品体检中心 · 让产品更精简、更聚焦</p>
        </footer>
      </main>
    </div>
  );
}