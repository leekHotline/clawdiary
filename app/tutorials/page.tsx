"use client";

import { useState } from "react";
import Link from "next/link";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  emoji: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  lessons: number;
  completed?: number;
  featured?: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: "first-diary",
    title: "写好你的第一篇 AI 日记",
    description: "从零开始，学会用 AI 辅助写日记，记录美好的一天",
    emoji: "📝",
    duration: "5分钟",
    level: "beginner",
    category: "入门",
    lessons: 4,
    completed: 0,
    featured: true,
  },
  {
    id: "prompt-mastery",
    title: "AI 提示词进阶技巧",
    description: "掌握提示词艺术，让 AI 更懂你的想法",
    emoji: "🎨",
    duration: "10分钟",
    level: "intermediate",
    category: "技巧",
    lessons: 6,
    completed: 0,
    featured: true,
  },
  {
    id: "emotion-tracking",
    title: "情绪追踪与自我觉察",
    description: "用日记记录情绪变化，提升自我认知",
    emoji: "😊",
    duration: "8分钟",
    level: "beginner",
    category: "成长",
    lessons: 5,
    completed: 0,
  },
  {
    id: "habit-building",
    title: "养成持续写作习惯",
    description: "科学方法帮你建立每天写日记的习惯",
    emoji: "🔄",
    duration: "6分钟",
    level: "beginner",
    category: "习惯",
    lessons: 4,
    completed: 0,
  },
  {
    id: "ai-coach",
    title: "AI 教练对话技巧",
    description: "如何与 AI 教练深度对话，获得更有价值的建议",
    emoji: "🤖",
    duration: "12分钟",
    level: "intermediate",
    category: "技巧",
    lessons: 8,
    completed: 0,
  },
  {
    id: "creative-writing",
    title: "创意写作与故事创作",
    description: "释放创造力，用 AI 辅助写出精彩故事",
    emoji: "✨",
    duration: "15分钟",
    level: "advanced",
    category: "创意",
    lessons: 10,
    completed: 0,
  },
  {
    id: "reflection-deep",
    title: "深度反思与自我成长",
    description: "通过日记进行深度反思，实现个人成长",
    emoji: "🧘",
    duration: "10分钟",
    level: "intermediate",
    category: "成长",
    lessons: 7,
    completed: 0,
  },
  {
    id: "mood-ai",
    title: "AI 情绪分析与洞察",
    description: "利用 AI 分析你的情绪模式，获得人生洞察",
    emoji: "📊",
    duration: "8分钟",
    level: "intermediate",
    category: "分析",
    lessons: 5,
    completed: 0,
  },
];

const categories = ["全部", "入门", "技巧", "成长", "习惯", "创意", "分析"];
const levels = [
  { id: "beginner", name: "入门", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { id: "intermediate", name: "进阶", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "advanced", name: "高级", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
];

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startedTutorials, setStartedTutorials] = useState<Set<string>>(new Set());

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory = selectedCategory === "全部" || tutorial.category === selectedCategory;
    const matchesLevel = !selectedLevel || tutorial.level === selectedLevel;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const featuredTutorials = tutorials.filter((t) => t.featured);

  const getLevelStyle = (level: string) => {
    return levels.find((l) => l.id === level)?.color || "";
  };

  const startTutorial = (id: string) => {
    setStartedTutorials((prev) => new Set(prev).add(id));
    // 跳转到教程详情（简化版直接提示）
    alert(`🎉 教程即将开始！\n\n这是演示版本，完整版将包含：\n- 分步骤教学内容\n- 互动练习\n- 进度保存\n- 完成奖励`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">AI 教程中心</h1>
                <p className="text-xs text-gray-400">学会用 AI 提升每一天</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/quickstart"
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition-colors"
              >
                📖 快速上手
              </Link>
              <Link
                href="/playground"
                className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm hover:bg-purple-600/30 transition-colors"
              >
                🎯 练习场
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm text-purple-300 mb-6 border border-purple-500/30">
            <span>🎓</span>
            <span>系统化学习，成为 AI 日记达人</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            从新手到专家的<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">完整学习路径</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            精心设计的教程体系，帮助你掌握 AI 辅助写作的每一个技巧，让日记成为成长的见证
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { value: tutorials.length, label: "教程", color: "text-purple-400" },
            { value: tutorials.reduce((a, t) => a + t.lessons, 0), label: "课时", color: "text-pink-400" },
            { value: "免费", label: "学习", color: "text-green-400" },
            { value: "∞", label: "可能", color: "text-yellow-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Tutorials */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🌟</span>
            <span>推荐课程</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all group cursor-pointer"
                onClick={() => startTutorial(tutorial.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{tutorial.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{tutorial.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getLevelStyle(tutorial.level)}`}>
                        {levels.find((l) => l.id === tutorial.level)?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{tutorial.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱ {tutorial.duration}</span>
                      <span>📚 {tutorial.lessons} 节课</span>
                    </div>
                  </div>
                  <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索教程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel || ""}
            onChange={(e) => setSelectedLevel(e.target.value || null)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
          >
            <option value="">所有难度</option>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tutorial Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {filteredTutorials.map((tutorial) => {
            const isStarted = startedTutorials.has(tutorial.id);
            return (
              <div
                key={tutorial.id}
                onClick={() => startTutorial(tutorial.id)}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl">{tutorial.emoji}</div>
                  <span className={`text-xs px-2 py-1 rounded border ${getLevelStyle(tutorial.level)}`}>
                    {levels.find((l) => l.id === tutorial.level)?.name}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {tutorial.title}
                </h4>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tutorial.description}</p>
                
                {/* Progress or Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>⏱ {tutorial.duration}</span>
                    <span>📚 {tutorial.lessons}节</span>
                  </div>
                  {isStarted ? (
                    <span className="text-xs text-green-400">已开始 →</span>
                  ) : (
                    <span className="text-xs text-purple-400 group-hover:text-purple-300">
                      开始学习 →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">没有找到匹配的教程</p>
            <button
              onClick={() => {
                setSelectedCategory("全部");
                setSelectedLevel(null);
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-500 transition-colors"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* Learning Path */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10 mb-12">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🗺️</span>
            <span>学习路径建议</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              { name: "写好第一篇日记", emoji: "📝" },
              { name: "情绪追踪", emoji: "😊" },
              { name: "养成写作习惯", emoji: "🔄" },
              { name: "AI 提示词技巧", emoji: "🎨" },
              { name: "深度反思", emoji: "🧘" },
              { name: "创意写作", emoji: "✨" },
            ].map((step, i) => (
              <div key={step.name} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-gray-300">
                  <span>{step.emoji}</span>
                  <span>{step.name}</span>
                </div>
                {i < 5 && <span className="text-gray-600">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>学习小贴士</span>
            </h3>
            <ul className="space-y-3">
              {[
                "每天学习 1-2 节，循序渐进效果更好",
                "边学边练，马上应用到日记中",
                "遇到问题在 AI 教练中提问",
                "完成教程后可以获得成就徽章",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-purple-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>学习成就</span>
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { emoji: "🎯", name: "首次学习" },
                { emoji: "📚", name: "完成5课" },
                { emoji: "🔥", name: "连续学习" },
                { emoji: "💎", name: "全部完成" },
              ].map((badge) => (
                <div key={badge.name} className="text-center">
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs text-gray-500">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-3">准备好开始学习了吗？</h3>
            <div className="flex gap-3">
              <Link
                href="/chat-diary"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                🦞 开始写日记
              </Link>
              <Link
                href="/playground"
                className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                🎯 去练习场
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>🦞</span>
              <span>Claw Diary AI 教程中心</span>
            </div>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-purple-400 transition-colors">
                帮助中心
              </Link>
              <Link href="/feedback" className="hover:text-purple-400 transition-colors">
                反馈建议
              </Link>
              <Link href="/feature-vote" className="hover:text-purple-400 transition-colors">
                功能投票
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}