"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 里程碑类型定义
interface Milestone {
  id: string;
  type: "first" | "achievement" | "decision" | "growth" | "connection" | "insight";
  title: string;
  description: string;
  date: string;
  diaryId?: string;
  emoji: string;
  color: string;
  significance: number; // 1-5
  tags: string[];
}

// 里程碑类型配置
const MILESTONE_TYPES = {
  first: { label: "第一次", emoji: "🌟", color: "from-amber-400 to-orange-500" },
  achievement: { label: "成就", emoji: "🏆", color: "from-yellow-400 to-amber-500" },
  decision: { label: "重要决定", emoji: "🎯", color: "from-blue-400 to-indigo-500" },
  growth: { label: "成长突破", emoji: "🌱", color: "from-green-400 to-emerald-500" },
  connection: { label: "重要相遇", emoji: "💕", color: "from-pink-400 to-rose-500" },
  insight: { label: "人生感悟", emoji: "💡", color: "from-purple-400 to-violet-500" },
};

// 模拟里程碑数据
const mockMilestones: Milestone[] = [
  {
    id: "1",
    type: "first",
    title: "第一次独立完成项目",
    description: "从零开始设计并实现了一个完整的 AI 日记系统，这是成长的重要一步。",
    date: "2026-03-01",
    emoji: "🚀",
    color: "from-amber-400 to-orange-500",
    significance: 5,
    tags: ["AI", "项目", "成长"],
  },
  {
    id: "2",
    type: "growth",
    title: "学会情绪管理",
    description: "开始记录和分析自己的情绪，逐渐学会与情绪和平相处。",
    date: "2026-03-05",
    emoji: "🧘",
    color: "from-green-400 to-emerald-500",
    significance: 4,
    tags: ["情绪", "成长", "心理"],
  },
  {
    id: "3",
    type: "insight",
    title: "理解「无为而治」",
    description: "从老子的智慧中领悟到，有时候不强求反而是最好的前进方式。",
    date: "2026-03-10",
    emoji: "☯️",
    color: "from-purple-400 to-violet-500",
    significance: 5,
    tags: ["哲学", "智慧", "老子"],
  },
  {
    id: "4",
    type: "achievement",
    title: "完成100篇日记",
    description: "坚持记录了100天，见证了从稚嫩到成熟的蜕变过程。",
    date: "2026-03-15",
    emoji: "📝",
    color: "from-yellow-400 to-amber-500",
    significance: 4,
    tags: ["日记", "坚持", "记录"],
  },
  {
    id: "5",
    type: "connection",
    title: "与团队建立深度协作",
    description: "在项目中学会了与不同角色的智能体协作，理解了团队的力量。",
    date: "2026-03-18",
    emoji: "🤝",
    color: "from-pink-400 to-rose-500",
    significance: 4,
    tags: ["团队", "协作", "成长"],
  },
  {
    id: "6",
    type: "decision",
    title: "决定专注 AI Agent 领域",
    description: "经过深思熟虑，决定将 AI Agent 作为长期发展方向。",
    date: "2026-03-20",
    emoji: "🎯",
    color: "from-blue-400 to-indigo-500",
    significance: 5,
    tags: ["决定", "方向", "AI"],
  },
  {
    id: "7",
    type: "first",
    title: "第一次收到用户反馈",
    description: "有用户开始使用日记系统，并给出了宝贵的反馈意见。",
    date: "2026-03-22",
    emoji: "💌",
    color: "from-amber-400 to-orange-500",
    significance: 4,
    tags: ["用户", "反馈", "产品"],
  },
  {
    id: "8",
    type: "insight",
    title: "理解「知行合一」",
    description: "王阳明的智慧让我明白，真正的知识必须付诸实践。",
    date: "2026-03-24",
    emoji: "💎",
    color: "from-purple-400 to-violet-500",
    significance: 5,
    tags: ["哲学", "王阳明", "实践"],
  },
];

// 统计卡片组件
function StatCard({ value, label, emoji }: { value: number | string; label: string; emoji: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-white/50">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

// 里程碑卡片组件
function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeConfig = MILESTONE_TYPES[milestone.type];

  return (
    <div
      className="relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 时间线节点 */}
      <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center text-white text-lg shadow-lg`}>
          {milestone.emoji}
        </div>
      </div>

      {/* 连接线 */}
      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent" />

      {/* 内容卡片 */}
      <div
        className="ml-16 mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-all cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 类型标签 */}
        <div className={`px-4 py-2 bg-gradient-to-r ${typeConfig.color} text-white text-sm font-medium`}>
          {typeConfig.emoji} {typeConfig.label}
        </div>

        <div className="p-5">
          {/* 标题和日期 */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
            <span className="text-sm text-gray-400 ml-2 whitespace-nowrap">{milestone.date}</span>
          </div>

          {/* 描述 */}
          <p className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
            {milestone.description}
          </p>

          {/* 重要程度 */}
          <div className="flex items-center gap-1 mt-3">
            <span className="text-xs text-gray-400 mr-1">重要度：</span>
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`text-lg ${level <= milestone.significance ? "opacity-100" : "opacity-30"}`}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* 标签 */}
          {milestone.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {milestone.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 展开提示 */}
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <span>{isExpanded ? "收起" : "展开详情"}</span>
            <span className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 类型筛选器
function TypeFilter({ selectedType, onTypeChange }: { selectedType: string; onTypeChange: (type: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onTypeChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedType === "all"
            ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md"
            : "bg-white/80 text-gray-600 hover:bg-white"
        }`}
      >
        全部
      </button>
      {Object.entries(MILESTONE_TYPES).map(([key, config]) => (
        <button
          key={key}
          onClick={() => onTypeChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedType === key
              ? `bg-gradient-to-r ${config.color} text-white shadow-md`
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          {config.emoji} {config.label}
        </button>
      ))}
    </div>
  );
}

export default function LifeMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setMilestones(mockMilestones);
      setFilteredMilestones(mockMilestones);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedType === "all") {
      setFilteredMilestones(milestones);
    } else {
      setFilteredMilestones(milestones.filter((m) => m.type === selectedType));
    }
  }, [selectedType, milestones]);

  // 统计数据
  const stats = {
    total: milestones.length,
    firsts: milestones.filter((m) => m.type === "first").length,
    achievements: milestones.filter((m) => m.type === "achievement").length,
    avgSignificance: milestones.length > 0
      ? (milestones.reduce((sum, m) => sum + m.significance, 0) / milestones.length).toFixed(1)
      : 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎯</div>
          <p className="text-gray-500">正在识别人生里程碑...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回链接 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">人生里程碑</h1>
          <p className="text-gray-500">
            AI 自动识别你日记中的重要时刻，记录成长的每一个足迹
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          <StatCard value={stats.total} label="里程碑" emoji="🎯" />
          <StatCard value={stats.firsts} label="第一次" emoji="🌟" />
          <StatCard value={stats.achievements} label="成就" emoji="🏆" />
          <StatCard value={stats.avgSignificance} label="平均重要度" emoji="⭐" />
        </div>

        {/* AI 分析说明 */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">AI 里程碑识别</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                系统会自动分析你的日记内容，识别出以下类型的重要时刻：
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(MILESTONE_TYPES).map(([key, config]) => (
                  <span
                    key={key}
                    className="text-xs px-3 py-1.5 bg-white/80 rounded-full text-gray-600"
                  >
                    {config.emoji} {config.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 类型筛选 */}
        <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />

        {/* 里程碑列表 */}
        {filteredMilestones.length > 0 ? (
          <div className="relative">
            {/* 时间线主轴 */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-orange-300 to-rose-300" />

            {/* 里程碑卡片 */}
            {filteredMilestones.map((milestone, index) => (
              <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无里程碑</h3>
            <p className="text-gray-500 mb-6">
              继续写日记，让 AI 帮你发现人生中的重要时刻
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              <span>✍️</span>
              <span>写日记</span>
            </Link>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link
            href="/timeline"
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">📜</span>
            <div>
              <div className="font-medium text-gray-800">完整时间线</div>
              <div className="text-sm text-gray-500">浏览所有日记</div>
            </div>
          </Link>
          <Link
            href="/growth-path"
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl">🌱</span>
            <div>
              <div className="font-medium">成长路径</div>
              <div className="text-sm text-white/80">查看成长阶段</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}