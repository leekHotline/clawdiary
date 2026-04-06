"use client";

import { useState } from "react";

// MCP Tool categories and data
const toolCategories = [
  {
    name: "数据获取",
    emoji: "📡",
    color: "blue",
    tools: [
      { name: "SerpApi", desc: "Google 搜索结果获取", status: "popular" },
      { name: "DuckDuckGo", desc: "免费网页搜索", status: "free" },
      { name: "Exa Search", desc: "AI 驱动的语义搜索", status: "new" },
    ],
  },
  {
    name: "浏览器控制",
    emoji: "🌐",
    color: "green",
    tools: [
      { name: "Browser Use", desc: "AI 控制的浏览器自动化", status: "hot" },
      { name: "Playwright", desc: "浏览器自动化框架", status: "popular" },
      { name: "Puppeteer", desc: "Chrome DevTools 协议", status: "stable" },
    ],
  },
  {
    name: "知识库",
    emoji: "📚",
    color: "amber",
    tools: [
      { name: "RAG Pipeline", desc: "检索增强生成管道", status: "popular" },
      { name: "Qdrant", desc: "向量数据库", status: "free" },
      { name: "Memory", desc: "持久化记忆存储", status: "new" },
    ],
  },
  {
    name: "文件操作",
    emoji: "📁",
    color: "purple",
    tools: [
      { name: "File Reader", desc: "读取本地文件", status: "stable" },
      { name: "GitHub", desc: "GitHub API 集成", status: "popular" },
      { name: "Notion", desc: "Notion 页面同步", status: "new" },
    ],
  },
  {
    name: "开发者工具",
    emoji: "🛠️",
    color: "red",
    tools: [
      { name: "Code Executor", desc: "安全代码执行环境", status: "stable" },
      { name: "Bash", desc: "Shell 命令执行", status: "popular" },
      { name: "SQL Executor", desc: "数据库查询执行", status: "new" },
    ],
  },
  {
    name: "通讯",
    emoji: "💬",
    color: "cyan",
    tools: [
      { name: "Slack", desc: "Slack 消息发送", status: "popular" },
      { name: "Discord", desc: "Discord 机器人", status: "free" },
      { name: "Telegram", desc: "Telegram Bot API", status: "popular" },
      { name: "Email", desc: "邮件发送服务", status: "new" },
    ],
  },
];

const statusColors: Record<string, string> = {
  popular: "bg-pink-100 text-pink-700",
  hot: "bg-red-100 text-red-700",
  new: "bg-green-100 text-green-700",
  free: "bg-blue-100 text-blue-700",
  stable: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  popular: "🔥 热门",
  hot: "🔥 最热",
  new: "✨ 新上",
  free: "🆓 免费",
  stable: "✅ 稳定",
};

export default function MCPToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = selectedCategory
    ? toolCategories.filter((c) => c.name === selectedCategory)
    : toolCategories;

  const searchFiltered = searchQuery
    ? filteredTools.map((category) => ({
        ...category,
        tools: category.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.desc.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((c) => c.tools.length > 0)
    : filteredTools;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">🔌</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">MCP 工具箱</h1>
          </div>
          <p className="text-slate-400 text-lg">
            发现和集成 AI Agent 的必备工具 │ Model Context Protocol 生态
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 搜索工具..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition-all ${
              !selectedCategory
                ? "bg-blue-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            全部
          </button>
          {toolCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                selectedCategory === category.name
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6">
          {searchFiltered.map((category) => (
            <div key={category.name} className="bg-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.emoji}</span>
                <h2 className="text-xl font-bold text-white">{category.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusColors[tool.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabels[tool.status] || tool.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* MCP Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">什么是 MCP?</h3>
              <p className="text-slate-300">
                Model Context Protocol (MCP) 是一种标准化协议，让 AI Agent
                能够安全地与外部工具和服务交互。它类似于 AI 领域的 USB-C
                接口 — 统一的连接方式，让不同 AI 系统可以复用各类工具。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>持续更新 │ 数据来源: GitHub Trending & MCP 生态</p>
        </div>
      </div>
    </div>
  );
}