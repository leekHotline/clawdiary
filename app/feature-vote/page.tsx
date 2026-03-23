"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Feature {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  votes: number;
  status: "planned" | "in-progress" | "completed";
  userVoted?: boolean;
}

const initialFeatures: Feature[] = [
  {
    id: "ai-coach",
    title: "AI 教练",
    description: "个性化写作教练，分析你的写作风格并给出改进建议",
    emoji: "🎯",
    category: "AI",
    votes: 42,
    status: "planned",
  },
  {
    id: "voice-diary",
    title: "语音日记",
    description: "语音输入自动转文字，支持语音情绪识别",
    emoji: "🎙️",
    category: "输入",
    votes: 38,
    status: "planned",
  },
  {
    id: "mood-calendar",
    title: "情绪日历",
    description: "可视化展示每月情绪变化，发现情绪规律",
    emoji: "📅",
    category: "分析",
    votes: 35,
    status: "completed",
  },
  {
    id: "ai-summary",
    title: "周报/月报 AI 总结",
    description: "自动生成周期性总结，发现成长轨迹",
    emoji: "📊",
    category: "AI",
    votes: 31,
    status: "planned",
  },
  {
    id: "collab-diary",
    title: "协作日记",
    description: "和朋友一起写日记，共同记录美好时光",
    emoji: "👥",
    category: "社交",
    votes: 28,
    status: "planned",
  },
  {
    id: "photo-story",
    title: "照片故事生成",
    description: "上传照片，AI 自动生成日记故事",
    emoji: "📷",
    category: "AI",
    votes: 25,
    status: "planned",
  },
  {
    id: "habit-tracker",
    title: "习惯追踪器",
    description: "追踪每日习惯完成情况，养成好习惯",
    emoji: "✅",
    category: "效率",
    votes: 22,
    status: "completed",
  },
  {
    id: "ai-writer",
    title: "AI 续写",
    description: "写一半卡住了？让 AI 帮你续写",
    emoji: "✍️",
    category: "AI",
    votes: 20,
    status: "completed",
  },
  {
    id: "export-pdf",
    title: "PDF 导出",
    description: "一键导出精美排版的 PDF 日记本",
    emoji: "📄",
    category: "导出",
    votes: 18,
    status: "planned",
  },
  {
    id: "timeline-view",
    title: "时间轴视图",
    description: "以时间轴形式浏览所有日记",
    emoji: "⏳",
    category: "展示",
    votes: 15,
    status: "planned",
  },
];

const categories = [
  { id: "all", name: "全部", emoji: "🌟" },
  { id: "AI", name: "AI 功能", emoji: "🤖" },
  { id: "效率", name: "效率工具", emoji: "⚡" },
  { id: "社交", name: "社交", emoji: "👥" },
  { id: "输入", name: "输入方式", emoji: "📝" },
  { id: "分析", name: "数据分析", emoji: "📊" },
  { id: "导出", name: "导出", emoji: "📤" },
  { id: "展示", name: "展示", emoji: "🎨" },
];

// 从 localStorage 初始化状态
const getInitialFeatures = (): Feature[] => {
  if (typeof window === 'undefined') return initialFeatures;
  const saved = localStorage.getItem("features");
  return saved ? JSON.parse(saved) : initialFeatures;
};

const getInitialVotes = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const saved = localStorage.getItem("userVotes");
  return saved ? new Set(JSON.parse(saved)) : new Set();
};

const getInitialVotedToday = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem("lastVoteDate") === new Date().toDateString();
};

export default function FeatureVotePage() {
  const [features, setFeatures] = useState<Feature[]>(getInitialFeatures);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userVotes, setUserVotes] = useState<Set<string>>(getInitialVotes);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: "", description: "", category: "AI" });
  const [hasVotedToday, setHasVotedToday] = useState(getInitialVotedToday);
  const [sortBy] = useState<"votes" | "newest">("votes");

  // 保存到 localStorage
  useEffect(() => {
    if (features.length > 0) {
      localStorage.setItem("features", JSON.stringify(features));
    }
  }, [features]);

  const handleVote = (featureId: string) => {
    const today = new Date().toDateString();
    
    if (userVotes.has(featureId)) {
      // 取消投票
      setFeatures(prev =>
        prev.map(f =>
          f.id === featureId ? { ...f, votes: f.votes - 1 } : f
        )
      );
      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(featureId);
        localStorage.setItem("userVotes", JSON.stringify([...newSet]));
        return newSet;
      });
    } else {
      // 投票
      setFeatures(prev =>
        prev.map(f =>
          f.id === featureId ? { ...f, votes: f.votes + 1 } : f
        )
      );
      setUserVotes(prev => {
        const newSet = new Set(prev);
        newSet.add(featureId);
        localStorage.setItem("userVotes", JSON.stringify([...newSet]));
        localStorage.setItem("lastVoteDate", today);
        return newSet;
      });
      setHasVotedToday(true);
    }
  };

  const handleSubmitFeature = () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) return;

    const feature: Feature = {
      id: `custom-${Date.now()}`,
      title: newFeature.title,
      description: newFeature.description,
      emoji: "💡",
      category: newFeature.category,
      votes: 1,
      status: "planned",
    };

    setFeatures(prev => [feature, ...prev]);
    setUserVotes(prev => {
      const newSet = new Set(prev);
      newSet.add(feature.id);
      localStorage.setItem("userVotes", JSON.stringify([...newSet]));
      return newSet;
    });
    setNewFeature({ title: "", description: "", category: "AI" });
    setShowSubmitModal(false);
  };

  const filteredFeatures = features
    .filter(f => selectedCategory === "all" || f.category === selectedCategory)
    .sort((a, b) => (sortBy === "votes" ? b.votes - a.votes : 0));

  const statusColors = {
    planned: "bg-blue-100 text-blue-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  };

  const statusLabels = {
    planned: "计划中",
    "in-progress": "开发中",
    completed: "已完成",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🗳️</span>
            <h1 className="text-3xl font-bold text-gray-800">功能投票板</h1>
          </div>
          <p className="text-gray-500">
            决定 Claw Diary 的未来！为你想要的功能投票，或者提交新想法
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-purple-600">{features.length}</div>
            <div className="text-xs text-gray-500">功能提案</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-pink-600">
              {features.reduce((sum, f) => sum + f.votes, 0)}
            </div>
            <div className="text-xs text-gray-500">总投票数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-fuchsia-600">{userVotes.size}</div>
            <div className="text-xs text-gray-500">我的投票</div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-white/70 text-gray-600 hover:bg-white/90"
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* 提交按钮 */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>💡</span> 提交新功能
          </button>
        </div>

        {/* 功能列表 */}
        <div className="space-y-4">
          {filteredFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className={`bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all ${
                userVotes.has(feature.id) ? "ring-2 ring-purple-300" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 排名 */}
                <div className="flex-shrink-0 w-8 text-center">
                  {index < 3 ? (
                    <span className="text-xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">{index + 1}</span>
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{feature.emoji}</span>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[feature.status]}`}>
                      {statusLabels[feature.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{feature.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">{feature.category}</span>
                  </div>
                </div>

                {/* 投票按钮 */}
                <button
                  onClick={() => handleVote(feature.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${
                    userVotes.has(feature.id)
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                  }`}
                >
                  <span className="text-lg">👍</span>
                  <span className="text-sm font-bold">{feature.votes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl mb-4 block">🔍</span>
            <p>该分类下暂无功能提案</p>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📌</span> 投票说明
          </h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 每个功能可以投票或取消投票</li>
            <li>• 投票数越高的功能，开发优先级越高</li>
            <li>• 欢迎提交你的创意想法</li>
            <li>• 已完成的功能仍可查看历史投票</li>
          </ul>
        </div>
      </main>

      {/* 提交新功能弹窗 */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">💡 提交新功能</h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  功能名称
                </label>
                <input
                  type="text"
                  value={newFeature.title}
                  onChange={e => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：语音日记"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  功能描述
                </label>
                <textarea
                  value={newFeature.description}
                  onChange={e => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个功能能解决什么问题..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none resize-none"
                  rows={3}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <select
                  value={newFeature.category}
                  onChange={e => setNewFeature(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none"
                >
                  {categories.filter(c => c.id !== "all").map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitFeature}
                disabled={!newFeature.title.trim() || !newFeature.description.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
              >
                提交并投票
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}