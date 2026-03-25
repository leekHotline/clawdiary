"use client";

import { useState } from "react";
import Link from "next/link";

// Agent Recipe 类型定义
interface RecipeStep {
  id: string;
  name: string;
  description: string;
  tools?: string[];
  estimatedTime?: string;
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  steps: RecipeStep[];
  useCase: string;
  examplePrompt: string;
  author: string;
  stars: number;
  uses: number;
  featured?: boolean;
  new?: boolean;
}

// 预设 Agent Recipes
const recipes: Recipe[] = [
  {
    id: "daily-diary",
    name: "每日日记生成器",
    emoji: "📝",
    description: "自动从日程、消息、活动中生成结构化的每日日记",
    category: "自动化",
    difficulty: "beginner",
    tags: ["日记", "自动化", "总结"],
    useCase: "每天自动生成日记，记录重要事件和感受",
    examplePrompt: "请根据我今天的日程、聊天记录和完成的任务，生成一篇温暖的日记。包含：主要事件、感受、学到的东西。",
    author: "ClawDiary Team",
    stars: 128,
    uses: 1024,
    featured: true,
    steps: [
      { id: "collect", name: "收集数据", description: "获取日程、消息、任务数据", tools: ["calendar", "messages", "tasks"], estimatedTime: "1分钟" },
      { id: "analyze", name: "分析事件", description: "识别重要事件和情绪", tools: ["analysis"], estimatedTime: "2分钟" },
      { id: "write", name: "生成日记", description: "用温暖的语气写日记", tools: ["writing"], estimatedTime: "1分钟" },
      { id: "save", name: "保存发布", description: "保存到日记本", tools: ["storage"], estimatedTime: "即时" },
    ]
  },
  {
    id: "weekly-review",
    name: "周报自动生成",
    emoji: "📊",
    description: "从一周数据中提取关键信息，生成有洞察的周报",
    category: "工作",
    difficulty: "beginner",
    tags: ["周报", "工作", "总结"],
    useCase: "每周自动生成工作周报，节省整理时间",
    examplePrompt: "请分析我本周的工作记录，生成周报包含：完成事项、关键成果、遇到的问题、下周计划。",
    author: "ClawDiary Team",
    stars: 89,
    uses: 567,
    steps: [
      { id: "collect", name: "收集周数据", description: "获取本周所有工作记录", tools: ["tasks", "calendar"], estimatedTime: "2分钟" },
      { id: "summarize", name: "总结归纳", description: "分类整理关键事项", tools: ["analysis"], estimatedTime: "3分钟" },
      { id: "generate", name: "生成报告", description: "输出结构化周报", tools: ["writing"], estimatedTime: "1分钟" },
    ]
  },
  {
    id: "idea-expander",
    name: "创意扩展器",
    emoji: "💡",
    description: "输入一个模糊想法，输出详细的执行方案",
    category: "创意",
    difficulty: "intermediate",
    tags: ["创意", "头脑风暴", "方案"],
    useCase: "快速将零散想法转化为可执行方案",
    examplePrompt: "我有一个想法：[你的想法]。请帮我扩展成详细方案，包括目标、步骤、资源需求、潜在风险。",
    author: "ClawDiary Team",
    stars: 156,
    uses: 834,
    featured: true,
    steps: [
      { id: "understand", name: "理解想法", description: "分析想法的核心价值", tools: ["analysis"], estimatedTime: "2分钟" },
      { id: "expand", name: "扩展维度", description: "从多个角度丰富想法", tools: ["brainstorm"], estimatedTime: "5分钟" },
      { id: "structure", name: "结构化", description: "整理成可执行方案", tools: ["planning"], estimatedTime: "3分钟" },
      { id: "validate", name: "验证可行", description: "评估资源和风险", tools: ["evaluation"], estimatedTime: "2分钟" },
    ]
  },
  {
    id: "mood-tracker",
    name: "情绪追踪分析",
    emoji: "😊",
    description: "分析日记和消息中的情绪模式，提供心理健康建议",
    category: "健康",
    difficulty: "intermediate",
    tags: ["情绪", "健康", "分析"],
    useCase: "长期追踪情绪变化，发现情绪规律",
    examplePrompt: "请分析我过去7天的日记和消息，总结我的情绪状态、触发因素和改善建议。",
    author: "ClawDiary Team",
    stars: 203,
    uses: 1456,
    featured: true,
    steps: [
      { id: "collect", name: "收集数据", description: "获取日记和消息数据", tools: ["diary", "messages"], estimatedTime: "1分钟" },
      { id: "sentiment", name: "情绪识别", description: "分析情绪类型和强度", tools: ["nlp"], estimatedTime: "3分钟" },
      { id: "pattern", name: "模式发现", description: "识别情绪变化规律", tools: ["analysis"], estimatedTime: "5分钟" },
      { id: "suggest", name: "建议生成", description: "提供改善建议", tools: ["advice"], estimatedTime: "2分钟" },
    ]
  },
  {
    id: "learning-path",
    name: "学习路径规划",
    emoji: "📚",
    description: "根据目标和当前水平，生成个性化学习计划",
    category: "学习",
    difficulty: "intermediate",
    tags: ["学习", "计划", "成长"],
    useCase: "快速规划任何技能的学习路径",
    examplePrompt: "我想学习[技能名称]，目前水平是[初级/中级]。请为我制定30天学习计划，每天有具体任务。",
    author: "ClawDiary Team",
    stars: 178,
    uses: 923,
    steps: [
      { id: "assess", name: "评估现状", description: "了解当前水平和目标", tools: ["questionnaire"], estimatedTime: "5分钟" },
      { id: "research", name: "资源研究", description: "找到优质学习资源", tools: ["search"], estimatedTime: "10分钟" },
      { id: "plan", name: "制定计划", description: "生成每日学习任务", tools: ["planning"], estimatedTime: "5分钟" },
      { id: "track", name: "进度追踪", description: "设置检查点", tools: ["tracking"], estimatedTime: "2分钟" },
    ]
  },
  {
    id: "decision-matrix",
    name: "决策辅助器",
    emoji: "⚖️",
    description: "多维度分析决策选项，给出加权推荐",
    category: "决策",
    difficulty: "advanced",
    tags: ["决策", "分析", "权衡"],
    useCase: "复杂决策时进行系统化分析",
    examplePrompt: "我需要在[A选项]和[B选项]之间做选择。请帮我列出各自的优劣势、风险和长期影响，给出建议。",
    author: "ClawDiary Team",
    stars: 134,
    uses: 678,
    steps: [
      { id: "options", name: "明确选项", description: "列出所有可能的选项", tools: ["brainstorm"], estimatedTime: "3分钟" },
      { id: "criteria", name: "确定标准", description: "设定评估维度和权重", tools: ["planning"], estimatedTime: "5分钟" },
      { id: "evaluate", name: "逐项评估", description: "对每个选项打分", tools: ["analysis"], estimatedTime: "10分钟" },
      { id: "recommend", name: "生成建议", description: "基于分析给出推荐", tools: ["reasoning"], estimatedTime: "3分钟" },
    ]
  },
  {
    id: "code-reviewer",
    name: "代码审查助手",
    emoji: "🔍",
    description: "智能审查代码，发现潜在问题和改进建议",
    category: "开发",
    difficulty: "advanced",
    tags: ["代码", "审查", "质量"],
    useCase: "提交代码前自动审查，提升代码质量",
    examplePrompt: "请审查这段代码，检查：1. 潜在bug 2. 性能问题 3. 代码风格 4. 安全隐患，并给出改进建议。",
    author: "ClawDiary Team",
    stars: 245,
    uses: 1567,
    new: true,
    steps: [
      { id: "parse", name: "解析代码", description: "理解代码结构和逻辑", tools: ["code-parser"], estimatedTime: "2分钟" },
      { id: "analyze", name: "静态分析", description: "检查常见问题模式", tools: ["linter"], estimatedTime: "3分钟" },
      { id: "security", name: "安全检查", description: "识别安全漏洞", tools: ["security-scanner"], estimatedTime: "5分钟" },
      { id: "suggest", name: "生成建议", description: "输出改进方案", tools: ["writing"], estimatedTime: "2分钟" },
    ]
  },
  {
    id: "meeting-summary",
    name: "会议纪要生成",
    emoji: "📋",
    description: "从会议录音或笔记生成结构化会议纪要",
    category: "工作",
    difficulty: "beginner",
    tags: ["会议", "纪要", "工作"],
    useCase: "会议后快速生成纪要，记录决议和行动项",
    examplePrompt: "请根据会议内容生成纪要，包含：参会人、讨论要点、决议事项、后续行动项（标注负责人和截止日期）。",
    author: "ClawDiary Team",
    stars: 167,
    uses: 1234,
    steps: [
      { id: "transcribe", name: "转录内容", description: "将录音转文字", tools: ["speech-to-text"], estimatedTime: "5分钟" },
      { id: "extract", name: "提取关键", description: "识别重要信息", tools: ["nlp"], estimatedTime: "3分钟" },
      { id: "structure", name: "结构化", description: "按格式整理", tools: ["formatting"], estimatedTime: "2分钟" },
      { id: "distribute", name: "分发纪要", description: "发送给相关人员", tools: ["messaging"], estimatedTime: "1分钟" },
    ]
  },
];

const categories = [
  { id: "all", name: "全部", emoji: "📦" },
  { id: "自动化", name: "自动化", emoji: "🤖" },
  { id: "工作", name: "工作", emoji: "💼" },
  { id: "创意", name: "创意", emoji: "💡" },
  { id: "健康", name: "健康", emoji: "❤️" },
  { id: "学习", name: "学习", emoji: "📚" },
  { id: "决策", name: "决策", emoji: "⚖️" },
  { id: "开发", name: "开发", emoji: "💻" },
];

const difficultyConfig = {
  beginner: { label: "入门", color: "text-green-400", bg: "bg-green-500/20" },
  intermediate: { label: "进阶", color: "text-yellow-400", bg: "bg-yellow-500/20" },
  advanced: { label: "高级", color: "text-red-400", bg: "bg-red-500/20" },
};

// Recipe Card 组件
function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const difficulty = difficultyConfig[recipe.difficulty];
  
  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.02] group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl group-hover:scale-110 transition-transform">{recipe.emoji}</div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded ${difficulty.bg} ${difficulty.color}`}>
                {difficulty.label}
              </span>
              {recipe.new && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  新
                </span>
              )}
              {recipe.featured && (
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                  精选
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{recipe.description}</p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {recipe.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-gray-400">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span>⭐</span>
            <span>{recipe.stars}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🚀</span>
            <span>{recipe.uses} 次使用</span>
          </span>
        </div>
        <span className="text-purple-400 group-hover:text-purple-300">查看详情 →</span>
      </div>
    </div>
  );
}

// Recipe Detail Modal
function RecipeDetail({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const difficulty = difficultyConfig[recipe.difficulty];
  
  const handleCopy = () => {
    navigator.clipboard.writeText(recipe.examplePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{recipe.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{recipe.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${difficulty.bg} ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                  <span className="text-sm text-gray-400">{recipe.category}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">描述</h3>
            <p className="text-white">{recipe.description}</p>
          </div>
          
          {/* Use Case */}
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <h3 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>使用场景</span>
            </h3>
            <p className="text-gray-300">{recipe.useCase}</p>
          </div>
          
          {/* Workflow Steps */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span>⚙️</span>
              <span>工作流程</span>
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-sm font-medium text-purple-300 shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{step.name}</h4>
                      {step.estimatedTime && (
                        <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{step.description}</p>
                    {step.tools && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {step.tools.map((tool) => (
                          <span key={tool} className="text-xs px-2 py-0.5 bg-slate-700/50 rounded text-gray-400">
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Example Prompt */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <span>💬</span>
              <span>示例提示词</span>
            </h3>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
              <p className="text-gray-300 font-mono text-sm mb-3">{recipe.examplePrompt}</p>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied 
                    ? "bg-green-600/20 text-green-400" 
                    : "bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
                }`}
              >
                {copied ? "✓ 已复制" : "📋 复制提示词"}
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-yellow-400">
                <span>⭐</span>
                <span>{recipe.stars} 收藏</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span>🚀</span>
                <span>{recipe.uses} 次使用</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">by {recipe.author}</span>
          </div>
          
          {/* CTA */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              🚀 立即使用
            </button>
            <button className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors">
              ⭐ 收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentRecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // Featured recipes
  const featuredRecipes = recipes.filter(r => r.featured);
  
  // Stats
  const totalUses = recipes.reduce((acc, r) => acc + r.uses, 0);
  const totalStars = recipes.reduce((acc, r) => acc + r.stars, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
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
                <h1 className="text-xl font-bold text-white">Agent Recipes</h1>
                <p className="text-xs text-gray-400">可复用的 AI 工作流模板库</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/agent-skills"
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition-colors"
              >
                🌳 技能树
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full text-sm text-indigo-300 mb-6 border border-indigo-500/30">
            <span>🧪</span>
            <span>Agent 工作流配方库</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            一键复用<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">智能工作流</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            精选 Agent 工作流模板，从日记生成到代码审查，让 AI 更高效地为你工作
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{recipes.length}</div>
            <div className="text-xs text-gray-500">工作流模板</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{(totalUses / 1000).toFixed(1)}k</div>
            <div className="text-xs text-gray-500">累计使用</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">{totalStars}</div>
            <div className="text-xs text-gray-500">用户收藏</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工作流..."
              className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        {selectedCategory === "all" && !searchQuery && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>⭐</span>
              <span>精选推荐</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📦</span>
            <span>{selectedCategory === "all" ? "全部工作流" : categories.find(c => c.id === selectedCategory)?.name}</span>
            <span className="text-sm font-normal text-gray-500">({filteredRecipes.length})</span>
          </h3>
          
          {filteredRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400">没有找到匹配的工作流</p>
              <p className="text-sm text-gray-500 mt-1">试试其他关键词或分类</p>
            </div>
          )}
        </div>

        {/* Create Your Own */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-white/10 text-center mb-10">
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="text-xl font-bold text-white mb-2">创建你的工作流</h3>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            有好用的 Agent 工作流模式？分享给社区，帮助更多人提升效率
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/feedback?type=recipe"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              📝 提交工作流
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              🎯 练习场测试
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/agent-skills"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🌳</span>
            <span className="text-sm font-medium text-gray-300">技能树</span>
          </Link>
          <Link
            href="/playground"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🎯</span>
            <span className="text-sm font-medium text-gray-300">Prompt 练习</span>
          </Link>
          <Link
            href="/tutorials"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">📚</span>
            <span className="text-sm font-medium text-gray-300">教程中心</span>
          </Link>
          <Link
            href="/quickstart"
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-2xl block mb-1">🚀</span>
            <span className="text-sm font-medium text-gray-300">快速上手</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>🦞</span>
              <span>Claw Diary Agent Recipes</span>
            </div>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-purple-400 transition-colors">
                帮助中心
              </Link>
              <Link href="/feedback" className="hover:text-purple-400 transition-colors">
                反馈建议
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}