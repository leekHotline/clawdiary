"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 模拟日记数据类型
interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  moodEmoji: string;
  tags: string[];
}

// 模拟历史日记数据
const mockMemories: MemoryEntry[] = [
  {
    id: "1",
    date: "2026-03-22",
    title: "深夜思考",
    content: "今天完成了一个新功能，感觉很充实。虽然熬夜了，但看到用户反馈很值得。",
    mood: "满足",
    moodEmoji: "😊",
    tags: ["工作", "成就感"]
  },
  {
    id: "2",
    date: "2026-03-20",
    title: "春日漫步",
    content: "中午去公园散步，看到很多樱花开了。春天真的来了，心情也跟着明媚起来。",
    mood: "愉悦",
    moodEmoji: "🌸",
    tags: ["生活", "自然"]
  },
  {
    id: "3",
    date: "2026-03-18",
    title: "关于选择",
    content: "今天思考了很多关于未来的事情。有时候选择太多反而让人迷茫，但也许这就是成长的过程。",
    mood: "思考",
    moodEmoji: "🤔",
    tags: ["反思", "成长"]
  },
  {
    id: "4",
    date: "2026-03-15",
    title: "小确幸",
    content: "收到朋友的问候，聊了很久以前的事情。原来那些看似普通的时光，现在回忆起来都闪闪发光。",
    mood: "温暖",
    moodEmoji: "💕",
    tags: ["友情", "感恩"]
  },
  {
    id: "5",
    date: "2026-03-10",
    title: "突破",
    content: "今天解决了一个困扰很久的技术问题。那种豁然开朗的感觉，让我明白坚持的意义。",
    mood: "兴奋",
    moodEmoji: "🎉",
    tags: ["技术", "突破"]
  },
  {
    id: "6",
    date: "2026-03-05",
    title: "雨夜",
    content: "下雨了，窝在家里看书。雨水敲打窗户的声音很治愈，就这样安静地度过一个晚上。",
    mood: "平静",
    moodEmoji: "🌧️",
    tags: ["独处", "阅读"]
  },
  {
    id: "7",
    date: "2026-03-01",
    title: "新的开始",
    content: "三月的开始，给自己定了一些小目标。不追求完美，只求每天都有小小的进步。",
    mood: "期待",
    moodEmoji: "🌱",
    tags: ["计划", "希望"]
  }
];

// AI 生成的回忆叙事模板
const memoryNarratives = [
  "从 {start} 到 {end}，这段时间里你的心情经历了一次小小的旅程。你学会了在繁忙中寻找宁静，在平凡中发现美好。",
  "翻开这些日记，我看到一个不断成长的你。从 {firstMood} 到 {lastMood}，每一篇都是独一无二的篇章。",
  "这些文字记录了你生命中闪闪发光的片段。关于 {topTag} 的思考最多，看来这是你这段时间关注的焦点。",
  "回望这些日子，你写下了 {count} 篇日记，记录了 {moodCount} 种不同的心情。每一刻都值得被记住。"
];

// 心情颜色映射
const moodColors: Record<string, string> = {
  "满足": "from-amber-400 to-orange-500",
  "愉悦": "from-pink-400 to-rose-500",
  "思考": "from-indigo-400 to-purple-500",
  "温暖": "from-red-400 to-pink-500",
  "兴奋": "from-yellow-400 to-amber-500",
  "平静": "from-cyan-400 to-blue-500",
  "期待": "from-green-400 to-emerald-500"
};

export default function MemoryGalleryPage() {
  const [selectedTab, setSelectedTab] = useState<"random" | "timeline" | "narrative">("random");
  const [randomMemory, setRandomMemory] = useState<MemoryEntry | null>(null);
  const [narrative, setNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<"all" | "week" | "month">("all");

  // 随机获取一篇回忆
  const getRandomMemory = () => {
    const random = mockMemories[Math.floor(Math.random() * mockMemories.length)];
    setRandomMemory(random);
  };

  // 生成 AI 回忆叙事
  const generateNarrative = () => {
    setIsGenerating(true);
    
    // 模拟 AI 生成过程
    setTimeout(() => {
      const template = memoryNarratives[Math.floor(Math.random() * memoryNarratives.length)];
      const moods = mockMemories.map(m => m.mood);
      const tags = mockMemories.flatMap(m => m.tags);
      const tagCounts = tags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "生活";
      
      const uniqueMoods = [...new Set(moods)];
      
      const result = template
        .replace("{start}", mockMemories[mockMemories.length - 1]?.date || "开始")
        .replace("{end}", mockMemories[0]?.date || "现在")
        .replace("{firstMood}", moods[0] || "平静")
        .replace("{lastMood}", moods[moods.length - 1] || "满足")
        .replace("{topTag}", topTag)
        .replace("{count}", String(mockMemories.length))
        .replace("{moodCount}", String(uniqueMoods.length));
      
      setNarrative(result);
      setIsGenerating(false);
    }, 1500);
  };

  // 初始化随机回忆
  useEffect(() => {
    getRandomMemory();
  }, []);

  // 筛选时间线
  const getFilteredMemories = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return mockMemories.filter(memory => {
      const memoryDate = new Date(memory.date);
      if (timelineFilter === "week") return memoryDate >= weekAgo;
      if (timelineFilter === "month") return memoryDate >= monthAgo;
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-fuchsia-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            日记回忆馆
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            穿越时光，重新发现那些被记录的瞬间。让过去的文字，照亮今天的你。
          </p>
        </div>

        {/* Tab 切换 */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "random", label: "随机回忆", emoji: "🎲" },
            { id: "timeline", label: "时间轴", emoji: "📅" },
            { id: "narrative", label: "回忆叙事", emoji: "📖" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedTab === tab.id
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg"
                  : "bg-white/70 text-gray-600 hover:bg-white/90"
              }`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 随机回忆 */}
        {selectedTab === "random" && randomMemory && (
          <div className="max-w-lg mx-auto">
            {/* 回忆卡片 */}
            <div className={`bg-gradient-to-br ${moodColors[randomMemory.mood] || "from-gray-400 to-gray-500"} rounded-3xl p-8 text-white shadow-xl mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm">{randomMemory.date}</span>
                <span className="text-3xl">{randomMemory.moodEmoji}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{randomMemory.title}</h3>
              <p className="text-white/90 leading-relaxed">{randomMemory.content}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                {randomMemory.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 心情标签 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">当时的心情</span>
                <span className="font-bold text-violet-600">{randomMemory.mood}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={getRandomMemory}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                🎲 翻阅下一篇
              </button>
            </div>

            {/* 提示 */}
            <p className="text-center text-sm text-gray-400 mt-6">
              每一次翻阅，都是与过去自己的对话
            </p>
          </div>
        )}

        {/* 时间轴 */}
        {selectedTab === "timeline" && (
          <div className="max-w-2xl mx-auto">
            {/* 筛选器 */}
            <div className="flex justify-center gap-2 mb-8">
              {[
                { id: "all", label: "全部" },
                { id: "week", label: "近一周" },
                { id: "month", label: "近一月" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimelineFilter(filter.id as typeof timelineFilter)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    timelineFilter === filter.id
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* 时间线 */}
            <div className="relative">
              {/* 时间线中轴 */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-purple-300 to-fuchsia-300" />

              {/* 日记列表 */}
              <div className="space-y-6">
                {getFilteredMemories().map((memory, index) => (
                  <div key={memory.id} className="relative pl-20">
                    {/* 时间点 */}
                    <div className={`absolute left-6 w-5 h-5 rounded-full bg-gradient-to-br ${moodColors[memory.mood] || "from-gray-400 to-gray-500"} shadow-lg border-2 border-white`} />
                    
                    {/* 卡片 */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-400">{memory.date}</span>
                        <span className="text-lg">{memory.moodEmoji}</span>
                        <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full">
                          {memory.mood}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">{memory.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {memory.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {getFilteredMemories().length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-gray-400">这个时间段还没有日记哦</p>
              </div>
            )}
          </div>
        )}

        {/* 回忆叙事 */}
        {selectedTab === "narrative" && (
          <div className="max-w-lg mx-auto">
            {/* 叙事卡片 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 mb-6">
              {narrative ? (
                <div>
                  <div className="text-4xl mb-6 text-center">📖</div>
                  <p className="text-gray-700 text-lg leading-relaxed text-center">
                    {narrative}
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600">{mockMemories.length}</div>
                      <div className="text-xs text-gray-400">篇日记</div>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fuchsia-600">
                        {new Set(mockMemories.map(m => m.mood)).size}
                      </div>
                      <div className="text-xs text-gray-400">种心情</div>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(mockMemories.flatMap(m => m.tags)).size}
                      </div>
                      <div className="text-xs text-gray-400">个标签</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✨</div>
                  <p className="text-gray-500 mb-2">点击下方按钮</p>
                  <p className="text-gray-400 text-sm">让 AI 把你的日记变成一个故事</p>
                </div>
              )}
            </div>

            {/* 生成按钮 */}
            <button
              onClick={generateNarrative}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  AI 正在编织你的故事...
                </span>
              ) : (
                <span>✨ 生成回忆叙事</span>
              )}
            </button>

            {/* 功能说明 */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-3">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-xs text-gray-500">分析日记模式</p>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl mb-2">🧠</div>
                <p className="text-xs text-gray-500">理解情感变化</p>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-xs text-gray-500">生成温暖叙事</p>
              </div>
            </div>
          </div>
        )}

        {/* 底部统计 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-gray-500">📚 共 {mockMemories.length} 篇回忆</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">💫 每一篇都闪闪发光</span>
          </div>
        </div>
      </main>
    </div>
  );
}