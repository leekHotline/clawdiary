"use client";

import { useState } from "react";
import Link from "next/link";

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "全部", emoji: "🌟" },
    { id: "writing", name: "写作助手", emoji: "✍️" },
    { id: "image", name: "图像生成", emoji: "🎨" },
    { id: "code", name: "编程开发", emoji: "💻" },
    { id: "audio", name: "音频处理", emoji: "🎵" },
    { id: "video", name: "视频制作", emoji: "🎬" },
    { id: "research", name: "研究分析", emoji: "🔬" },
    { id: "productivity", name: "效率工具", emoji: "⚡" },
  ];

  const tools = [
    {
      id: "claude",
      name: "Claude",
      emoji: "🤖",
      category: "writing",
      description: "安全、有帮助的AI助手，擅长长文本和代码",
      url: "https://claude.ai",
      tags: ["对话", "写作", "代码"],
      hot: true,
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      emoji: "💬",
      category: "writing",
      description: "OpenAI的智能对话助手，创意无限",
      url: "https://chat.openai.com",
      tags: ["对话", "GPT-4", "插件"],
      hot: true,
    },
    {
      id: "cursor",
      name: "Cursor",
      emoji: "🖱️",
      category: "code",
      description: "AI优先的代码编辑器，编程效率倍增",
      url: "https://cursor.sh",
      tags: ["编程", "IDE", "AI"],
      hot: true,
    },
    {
      id: "midjourney",
      name: "Midjourney",
      emoji: "🖼️",
      category: "image",
      description: "顶级AI绘图工具，创意无边界",
      url: "https://midjourney.com",
      tags: ["绘图", "创意", "设计"],
      hot: true,
    },
    {
      id: "dalle",
      name: "DALL·E 3",
      emoji: "🎨",
      category: "image",
      description: "OpenAI图像生成，文字转艺术",
      url: "https://openai.com/dall-e-3",
      tags: ["绘图", "OpenAI", "创意"],
    },
    {
      id: "suno",
      name: "Suno",
      emoji: "🎶",
      category: "audio",
      description: "AI音乐生成，几秒创作歌曲",
      url: "https://suno.ai",
      tags: ["音乐", "创作", "AI生成"],
      hot: true,
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      emoji: "🗣️",
      category: "audio",
      description: "顶级AI语音合成，声音克隆",
      url: "https://elevenlabs.io",
      tags: ["语音", "TTS", "克隆"],
    },
    {
      id: "runway",
      name: "Runway",
      emoji: "🎬",
      category: "video",
      description: "AI视频创作平台，创意视频生成",
      url: "https://runwayml.com",
      tags: ["视频", "Gen-2", "创意"],
      hot: true,
    },
    {
      id: "perplexity",
      name: "Perplexity",
      emoji: "🔍",
      category: "research",
      description: "AI搜索引擎，智能问答与引用",
      url: "https://perplexity.ai",
      tags: ["搜索", "研究", "问答"],
      hot: true,
    },
    {
      id: "notion-ai",
      name: "Notion AI",
      emoji: "📝",
      category: "productivity",
      description: "笔记协作AI助手，智能写作",
      url: "https://notion.so",
      tags: ["笔记", "协作", "写作"],
    },
    {
      id: "copilot",
      name: "GitHub Copilot",
      emoji: "✈️",
      category: "code",
      description: "AI编程搭档，代码自动补全",
      url: "https://github.com/features/copilot",
      tags: ["编程", "代码", "GitHub"],
    },
    {
      id: "raycast",
      name: "Raycast AI",
      emoji: "🚀",
      category: "productivity",
      description: "Mac效率神器，AI增强启动器",
      url: "https://raycast.com",
      tags: ["效率", "Mac", "启动器"],
    },
    {
      id: "gamma",
      name: "Gamma",
      emoji: "📊",
      category: "productivity",
      description: "AI演示文稿生成，一键做PPT",
      url: "https://gamma.app",
      tags: ["PPT", "演示", "设计"],
    },
    {
      id: "heygen",
      name: "HeyGen",
      emoji: "👤",
      category: "video",
      description: "AI数字人视频生成，虚拟主播",
      url: "https://heygen.com",
      tags: ["数字人", "视频", "营销"],
    },
    {
      id: "jasper",
      name: "Jasper",
      emoji: "✍️",
      category: "writing",
      description: "企业级AI写作助手，营销文案",
      url: "https://jasper.ai",
      tags: ["营销", "文案", "企业"],
    },
    {
      id: "ideogram",
      name: "Ideogram",
      emoji: "🔤",
      category: "image",
      description: "擅长文字渲染的AI绘图工具",
      url: "https://ideogram.ai",
      tags: ["绘图", "文字", "设计"],
    },
    {
      id: "windsurf",
      name: "Windsurf",
      emoji: "🌊",
      category: "code",
      description: "Codeium出品的AI编辑器，深度协作",
      url: "https://codeium.com/windsurf",
      tags: ["编程", "IDE", "AI"],
    },
    {
      id: "o1",
      name: "OpenAI o1",
      emoji: "🧠",
      category: "research",
      description: "推理能力强，适合复杂问题",
      url: "https://openai.com/o1",
      tags: ["推理", "研究", "复杂任务"],
      hot: true,
    },
    {
      id: "zed",
      name: "Zed",
      emoji: "⚡",
      category: "code",
      description: "高性能编辑器，AI辅助编码",
      url: "https://zed.dev",
      tags: ["编辑器", "快速", "AI"],
    },
    {
      id: "whisper",
      name: "Whisper",
      emoji: "🎤",
      category: "audio",
      description: "OpenAI语音识别，多语言转录",
      url: "https://openai.com/research/whisper",
      tags: ["语音", "转录", "开源"],
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredTools =
    selectedCategory === "all"
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">AI 工具箱</h1>
                <p className="text-xs text-gray-400">精选优质 AI 工具，助你效率翻倍</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-purple-400">❤️ {favorites.length}</span>
              <span>收藏</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-[73px] z-40 backdrop-blur-xl bg-slate-900/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔮</div>
              <div>
                <div className="text-white font-semibold">2026 AI 工具精选</div>
                <div className="text-sm text-gray-400">收录 {tools.length} 款优质工具</div>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                📅 周更
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                ✅ 实测
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                🎯 精选
              </span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
            >
              {/* Hot Badge */}
              {tool.hot && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg">
                  HOT
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{tool.emoji}</div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h3>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      访问官网 ↗
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(tool.id)}
                  className={`text-xl transition-transform hover:scale-125 ${
                    favorites.includes(tool.id) ? "text-red-500" : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {favorites.includes(tool.id) ? "❤️" : "🤍"}
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{tool.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quick Access Button */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-600/20 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors"
              >
                <span>立即使用</span>
                <span>→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400">该分类暂无工具</p>
          </div>
        )}

        {/* Suggest Section */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="text-lg font-semibold text-white mb-2">有好工具推荐？</h3>
          <p className="text-sm text-gray-400 mb-4">发现好用的 AI 工具，欢迎告诉我们</p>
          <Link
            href="/feedback?type=tool"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
          >
            提交推荐
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary AI 工具箱 · 精选好工具，效率更轻松</p>
        </div>
      </footer>
    </div>
  );
}