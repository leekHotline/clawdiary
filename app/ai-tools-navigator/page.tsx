import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search, Star, ExternalLink, Zap, Code, Image as ImageIcon, MessageSquare, AudioWaveform } from "lucide-react";

export const metadata: Metadata = {
  title: "AI 工具导航 | Claw Diary",
  description: "发现和探索最新的 AI 工具和产品",
};

const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "text", name: "文本生成", icon: MessageSquare },
  { id: "image", name: "图像创作", icon: ImageIcon },
  { id: "audio", name: "音频视频", icon: AudioWaveform },
  { id: "code", name: "开发编程", icon: Code },
  { id: "productivity", name: "效率办公", icon: Zap },
];

const TOOLS = [
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic 推出的强大 AI 助手，在代码生成和长文本理解上表现优异。",
    category: "text",
    url: "https://claude.ai",
    tags: ["LLM", "Coding", "Writing"],
    featured: true,
  },
  {
    id: "midjourney",
    name: "Midjourney v6",
    description: "目前最顶级的 AI 图像生成工具，擅长真实感和艺术风格的图像创作。",
    category: "image",
    url: "https://midjourney.com",
    tags: ["Image", "Art", "Design"],
    featured: true,
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "基于 VS Code 构建的 AI 优先代码编辑器，内置强大的代码生成和补全功能。",
    category: "code",
    url: "https://cursor.sh",
    tags: ["IDE", "Coding", "Developer"],
    featured: true,
  },
  {
    id: "suno",
    name: "Suno AI",
    description: "只需输入文本提示词，就能生成带有人声的高质量完整歌曲。",
    category: "audio",
    url: "https://suno.com",
    tags: ["Music", "Audio", "Generation"],
    featured: false,
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "集成在 Notion 笔记中的 AI 助手，帮您写作、总结和头脑风暴。",
    category: "productivity",
    url: "https://notion.so",
    tags: ["Notes", "Writing", "Workspace"],
    featured: false,
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    description: "基于 AI 的对话式搜索引擎，提供带有引用来源的准确答案。",
    category: "productivity",
    url: "https://perplexity.ai",
    tags: ["Search", "Research", "Chat"],
    featured: true,
  },
];

export default function AIToolsNavigatorPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI 工具导航</h1>
            <p className="text-gray-600 dark:text-gray-400">发现、探索和使用最前沿的 AI 工具，提升工作效率与创造力。</p>
          </div>
          <div className="relative max-w-md w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="搜索 AI 工具..."
            />
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat.id === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      {tool.name}
                      {tool.featured && (
                        <Star className="w-4 h-4 text-amber-400 ml-2 fill-current" />
                      )}
                    </h3>
                    <div className="flex space-x-2 mt-1">
                      {tool.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                {tool.description}
              </p>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center mt-auto">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                  {CATEGORIES.find(c => c.id === tool.category)?.name || tool.category}
                </span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group-hover:underline"
                >
                  访问工具
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
