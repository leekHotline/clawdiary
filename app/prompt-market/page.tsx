"use client";

import { useState, useEffect } from "react";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  author: string;
  emoji: string;
  category: string;
  likes: number;
  uses: number;
  tags: string[];
}

const initialPrompts: Prompt[] = [
  {
    id: "1",
    title: "写作风格分析",
    prompt: "分析以下文本的写作风格、语气和特点，给出详细的风格报告：",
    author: "AI导师",
    emoji: "✍️",
    category: "写作",
    likes: 128,
    uses: 342,
    tags: ["写作", "分析", "风格"],
  },
  {
    id: "2",
    title: "情绪日记助手",
    prompt: "请根据我今天的心情，帮助我写一段反思日记，包含以下要素：1. 今天的情绪 2. 触发因素 3. 学到的教训",
    author: "情绪大师",
    emoji: "💭",
    category: "日记",
    likes: 89,
    uses: 156,
    tags: ["日记", "情绪", "反思"],
  },
  {
    id: "3",
    title: "目标拆解专家",
    prompt: "请将我的大目标拆解为可执行的小步骤，并制定具体的时间表和里程碑",
    author: "成长导师",
    emoji: "🎯",
    category: "规划",
    likes: 156,
    uses: 278,
    tags: ["目标", "规划", "行动"],
  },
  {
    id: "4",
    title: "代码审查助手",
    prompt: "请审查以下代码，提出改进建议，重点关注：1. 性能 2. 可读性 3. 最佳实践 4. 潜在bug",
    author: "DevMaster",
    emoji: "🔧",
    category: "开发",
    likes: 234,
    uses: 567,
    tags: ["代码", "审查", "开发"],
  },
  {
    id: "5",
    title: "学习总结生成",
    prompt: "根据我的学习笔记，生成一份结构化的总结，包含：核心概念、关键洞察、实际应用",
    author: "学神",
    emoji: "📚",
    category: "学习",
    likes: 67,
    uses: 123,
    tags: ["学习", "总结", "笔记"],
  },
  {
    id: "6",
    title: "创意头脑风暴",
    prompt: "针对以下主题，生成10个创意点子，要求：创新性高、可执行、有商业价值",
    emoji: "💡",
    category: "创意",
    author: "创意工坊",
    likes: 198,
    uses: 445,
    tags: ["创意", "头脑风暴", "创新"],
  },
];

export default function PromptMarketplacePage() {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [likedPrompts, setLikedPrompts] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["全部", "写作", "日记", "规划", "开发", "学习", "创意"];

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "全部" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (id: string) => {
    if (likedPrompts.has(id)) {
      setLikedPrompts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: p.likes - 1 } : p))
      );
    } else {
      setLikedPrompts((prev) => new Set(prev).add(id));
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
    }
  };

  const handleCopy = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setPrompts((prev) =>
      prev.map((p) => (p.id === prompt.id ? { ...p, uses: p.uses + 1 } : p))
    );
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🧪 Prompt 市场
          </h1>
          <p className="text-gray-600">发现、分享、收藏高效 AI 提示词</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="搜索提示词、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">{prompts.length}</div>
            <div className="text-sm text-gray-500">提示词</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">
              {prompts.reduce((a, p) => a + p.uses, 0)}
            </div>
            <div className="text-sm text-gray-500">使用次数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-pink-600">
              {prompts.reduce((a, p) => a + p.likes, 0)}
            </div>
            <div className="text-sm text-gray-500">点赞数</div>
          </div>
        </div>

        {/* Prompt List */}
        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{prompt.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{prompt.title}</h3>
                    <span className="text-sm text-gray-500">by {prompt.author}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                  {prompt.category}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 font-mono text-sm text-gray-700 max-h-24 overflow-hidden relative">
                {prompt.prompt}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(prompt.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                      likedPrompts.has(prompt.id)
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{likedPrompts.has(prompt.id) ? "❤️" : "🤍"}</span>
                    <span className="font-medium">{prompt.likes}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📤</span>
                    <span className="font-medium">{prompt.uses}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(prompt)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    copiedId === prompt.id
                      ? "bg-green-500 text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {copiedId === prompt.id ? "✓ 已复制" : "📋 复制"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl mb-4 block">🔍</span>
            <p>没有找到匹配的提示词</p>
          </div>
        )}
      </div>
    </div>
  );
}