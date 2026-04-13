import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, TrendingUp, Zap, MessageSquare, Image as ImageIcon, Video, Code, PenTool, Layout, FileText, Bot } from "lucide-react";

export const metadata = {
  title: "AI 工具推荐 - Claw Diary",
  description: "发现最优秀的 AI 工具，提升你的工作效率和创造力",
};

const categories = [
  { id: "all", name: "全部", icon: <Bot size={18} /> },
  { id: "chat", name: "对话与助手", icon: <MessageSquare size={18} /> },
  { id: "image", name: "图像生成", icon: <ImageIcon size={18} /> },
  { id: "video", name: "视频创作", icon: <Video size={18} /> },
  { id: "writing", name: "写作辅助", icon: <FileText size={18} /> },
  { id: "design", name: "设计工具", icon: <PenTool size={18} /> },
  { id: "code", name: "编程开发", icon: <Code size={18} /> },
  { id: "productivity", name: "效率办公", icon: <Layout size={18} /> },
];

const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI 开发的强大语言模型，能进行自然对话、解答问题、写代码和创作文章。",
    category: "chat",
    url: "https://chat.openai.com",
    tags: ["GPT-4", "对话", "全能"],
    featured: true,
    logo: "💬",
    rating: 4.9,
    price: "免费 / $20/月"
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic 开发的 AI 助手，以长文本处理能力、安全性和写作能力见长。",
    category: "chat",
    url: "https://claude.ai",
    tags: ["大词表", "写作", "编程"],
    featured: true,
    logo: "🧠",
    rating: 4.8,
    price: "免费 / $20/月"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "目前最强大的 AI 图像生成工具之一，能生成极具艺术感和高质量的图像。",
    category: "image",
    url: "https://www.midjourney.com",
    tags: ["AI绘图", "艺术", "设计"],
    featured: true,
    logo: "🎨",
    rating: 4.9,
    price: "付费 ($10/月起)"
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "专为 AI 时代设计的代码编辑器，内置强大的代码生成、补全和重构能力。",
    category: "code",
    url: "https://cursor.sh",
    tags: ["IDE", "编程", "Copilot"],
    featured: true,
    logo: "💻",
    rating: 4.8,
    price: "免费 / $20/月"
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "无缝集成在 Notion 笔记中的 AI 助手，帮助写作、总结和头脑风暴。",
    category: "productivity",
    url: "https://www.notion.so/product/ai",
    tags: ["笔记", "写作", "效率"],
    featured: false,
    logo: "📝",
    rating: 4.7,
    price: "附加订阅 ($10/月)"
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    description: "下一代 AI 搜索引擎，直接给出带引用来源的答案，而非网页链接列表。",
    category: "productivity",
    url: "https://www.perplexity.ai",
    tags: ["搜索", "研究", "问答"],
    featured: true,
    logo: "🔍",
    rating: 4.8,
    price: "免费 / $20/月"
  },
  {
    id: "suno",
    name: "Suno AI",
    description: "令人惊叹的 AI 音乐生成平台，只需输入歌词和风格描述即可生成完整歌曲。",
    category: "design",
    url: "https://suno.com",
    tags: ["音乐生成", "音频", "创意"],
    featured: false,
    logo: "🎵",
    rating: 4.6,
    price: "免费 / $8/月起"
  },
  {
    id: "runway",
    name: "Runway",
    description: "先进的 AI 视频生成和编辑平台，包含 Gen-1 和 Gen-2 文本/图像转视频模型。",
    category: "video",
    url: "https://runwayml.com",
    tags: ["视频生成", "视频编辑", "视觉特效"],
    featured: true,
    logo: "🎬",
    rating: 4.7,
    price: "免费额度 / $15/月起"
  },
  {
    id: "kimi",
    name: "Kimi 智能助手",
    description: "月之暗面科技推出的 AI 助手，支持超长文本输入和优秀的中文处理能力。",
    category: "chat",
    url: "https://kimi.moonshot.cn",
    tags: ["长文本", "中文", "免费"],
    featured: false,
    logo: "🌙",
    rating: 4.7,
    price: "免费"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "最受欢迎的 AI 编程助手，在你的编辑器中实时提供代码建议。",
    category: "code",
    url: "https://github.com/features/copilot",
    tags: ["代码补全", "开发", "插件"],
    featured: false,
    logo: "🐙",
    rating: 4.8,
    price: "$10/月"
  }
];

export default function AIToolsPage() {
  // In a real app with client components, we'd add state for filtering
  const activeCategory = "all";
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              AI 工具精选推荐
            </h1>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1">
            <TrendingUp size={14} />
            <span>持续更新中</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              探索 AI 时代的效率利器
            </h2>
            <p className="text-indigo-100 text-lg md:text-xl mb-6 leading-relaxed opacity-90">
              我们为你精选了当前最优秀、最实用的 AI 工具，帮助你在写作、工作、学习和创作中释放全部潜能。
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                🚀 提升效率
              </span>
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                ✨ 激发创意
              </span>
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                🛠️ 解决问题
              </span>
            </div>
          </div>
        </div>

        {/* Categories (Static UI for server component) */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  cat.id === activeCategory 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            编辑精选必用工具
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(t => t.featured).map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured={true} />
            ))}
          </div>
        </div>

        {/* All Tools Section */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Bot className="text-indigo-500" size={20} />
            发现更多工具
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(t => !t.featured).map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured={false} />
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 bg-white border rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            💡
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">有推荐的 AI 工具？</h3>
          <p className="text-slate-500 mb-6">如果你发现了好用的 AI 工具，或者你就是一款优秀 AI 工具的开发者，欢迎向我们推荐！</p>
          <a 
            href="#" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            提交工具推荐
            <ExternalLink size={18} />
          </a>
        </div>
      </main>
    </div>
  );
}

// Tool Card Component
function ToolCard({ tool, featured }: { tool: any, featured: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-6 transition-all hover:shadow-xl border flex flex-col h-full group ${
      featured ? 'border-indigo-100 shadow-md hover:-translate-y-1' : 'border-slate-100 shadow-sm hover:-translate-y-1'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
            featured ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-slate-50'
          }`}>
            {tool.logo}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
              <Star className="text-yellow-400 fill-yellow-400" size={12} />
              <span className="font-medium text-slate-700">{tool.rating}</span>
              <span className="mx-1">•</span>
              <span>{tool.price}</span>
            </div>
          </div>
        </div>
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="访问网站"
        >
          <ExternalLink size={18} />
        </a>
      </div>
      
      <p className="text-slate-600 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">
        {tool.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {tool.tags.map((tag: string, index: number) => (
          <span 
            key={index} 
            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
