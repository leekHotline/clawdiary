"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  tags: string[];
  questions: string[];
  prompt: string;
  popularity: number;
  author: string;
  color: string;
}

const templates: Template[] = [
  // 情感记录类
  {
    id: "gratitude",
    name: "感恩日记",
    emoji: "🙏",
    category: "情感记录",
    description: "记录每天值得感恩的三件小事，培养积极心态",
    tags: ["感恩", "正能量", "心态"],
    questions: [
      "今天发生了什么让你感到温暖的事？",
      "有谁让你想要说一声谢谢？",
      "今天你拥有什么，是以前没有的？",
    ],
    prompt: "请帮我写一篇感恩日记，记录今天值得感谢的三件事。风格要温暖真诚，表达内心的感激之情。",
    popularity: 982,
    author: "执笔爪",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "mood-track",
    name: "情绪追踪",
    emoji: "🌈",
    category: "情感记录",
    description: "追踪和分析每天的情绪变化，更好地了解自己",
    tags: ["情绪", "自我觉察", "心理健康"],
    questions: [
      "今天最主要的情绪是什么？",
      "是什么触发了这种情绪？",
      "你如何应对和处理它？",
    ],
    prompt: "请帮我记录今天的情绪状态，包括：主导情绪、触发原因、应对方式，以及对情绪的反思。",
    popularity: 756,
    author: "进化爪",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "happiness",
    name: "快乐清单",
    emoji: "😊",
    category: "情感记录",
    description: "记录生活中的小确幸，积累幸福记忆",
    tags: ["幸福", "小确幸", "生活"],
    questions: [
      "今天有什么让你嘴角上扬？",
      "哪个瞬间让你觉得活着真好？",
      "给自己打分，今天的快乐指数是多少？",
    ],
    prompt: "请帮我写一篇快乐清单，记录今天让我感到幸福的瞬间和原因。",
    popularity: 634,
    author: "采风爪",
    color: "from-yellow-400 to-orange-400",
  },

  // 成长反思类
  {
    id: "reflection",
    name: "每日反思",
    emoji: "🪞",
    category: "成长反思",
    description: "深度反思每天的收获、不足和改进方向",
    tags: ["反思", "成长", "自我提升"],
    questions: [
      "今天最大的收获是什么？",
      "有什么可以做得更好的？",
      "明天想改变的一件事？",
    ],
    prompt: "请帮我写一篇深度反思日记，包含：今天的收获、需要改进的地方、明天的行动计划。",
    popularity: 1124,
    author: "进化爪",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "learning",
    name: "学习笔记",
    emoji: "📚",
    category: "成长反思",
    description: "记录每天学到的新知识和心得体会",
    tags: ["学习", "知识", "进步"],
    questions: [
      "今天学到了什么新东西？",
      "这个知识对你有什么启发？",
      "如何应用到实际生活中？",
    ],
    prompt: "请帮我整理今天的学习笔记，包括：新知识要点、个人理解和启发、应用计划。",
    popularity: 892,
    author: "掘金爪",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "mistake",
    name: "失败日志",
    emoji: "💪",
    category: "成长反思",
    description: "从失败中学习，把错误变成成长养分",
    tags: ["失败", "复盘", "成长"],
    questions: [
      "今天犯了什么错误？",
      "原因是什么？",
      "如何避免再犯？",
    ],
    prompt: "请帮我记录今天的失败经历，重点分析原因和改进方案，用积极的心态看待失败。",
    popularity: 423,
    author: "进化爪",
    color: "from-red-500 to-pink-500",
  },

  // 目标规划类
  {
    id: "goal",
    name: "目标追踪",
    emoji: "🎯",
    category: "目标规划",
    description: "追踪目标进度，保持前进动力",
    tags: ["目标", "进度", "动力"],
    questions: [
      "今天为目标做了什么？",
      "进度如何？",
      "下一步计划是什么？",
    ],
    prompt: "请帮我记录今天的目标进展，包括：具体行动、完成进度、下一步计划和遇到的困难。",
    popularity: 687,
    author: "执笔爪",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "morning",
    name: "晨间计划",
    emoji: "🌅",
    category: "目标规划",
    description: "规划一天的安排，开启高效的早晨",
    tags: ["早晨", "计划", "效率"],
    questions: [
      "今天的三大要事是什么？",
      "期待今天发生什么？",
      "今天想保持什么状态？",
    ],
    prompt: "请帮我写一篇晨间计划日记，包括：今日三件要事、期待和心情状态。",
    popularity: 534,
    author: "采风爪",
    color: "from-sky-400 to-blue-500",
  },
  {
    id: "review",
    name: "晚间复盘",
    emoji: "🌙",
    category: "目标规划",
    description: "回顾一天，总结得失，为明天做准备",
    tags: ["复盘", "总结", "晚上"],
    questions: [
      "今天完成了什么？",
      "有什么遗憾？",
      "明天最重要的三件事？",
    ],
    prompt: "请帮我写一篇晚间复盘日记，总结今天的成就、遗憾和明天的计划。",
    popularity: 612,
    author: "执笔爪",
    color: "from-indigo-500 to-purple-500",
  },

  // 创意灵感类
  {
    id: "idea",
    name: "灵感捕捉",
    emoji: "💡",
    category: "创意灵感",
    description: "记录灵光乍现的瞬间，不让好想法溜走",
    tags: ["灵感", "创意", "想法"],
    questions: [
      "今天有什么新想法？",
      "这个想法从何而来？",
      "你想怎么实现它？",
    ],
    prompt: "请帮我记录今天捕捉到的灵感，包括：想法内容、来源、可能的实现路径。",
    popularity: 478,
    author: "采风爪",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "dream",
    name: "梦境记录",
    emoji: "💭",
    category: "创意灵感",
    description: "记录和分析梦境，探索潜意识的秘密",
    tags: ["梦境", "潜意识", "心理"],
    questions: [
      "昨晚做了什么梦？",
      "梦里的感受是什么？",
      "这个梦让你想到什么？",
    ],
    prompt: "请帮我记录和分析昨晚的梦境，包括梦境内容、感受和可能的象征意义。",
    popularity: 356,
    author: "采风爪",
    color: "from-slate-500 to-gray-600",
  },
  {
    id: "creative",
    name: "创意写作",
    emoji: "✨",
    category: "创意灵感",
    description: "自由创作，让想象力自由驰骋",
    tags: ["创作", "想象", "自由"],
    questions: [
      "今天想写什么？",
      "想用什么风格？",
      "有特别想表达的情感吗？",
    ],
    prompt: "请帮我进行创意写作，根据我提供的主题和风格，创作一篇有趣的短文。",
    popularity: 289,
    author: "执笔爪",
    color: "from-pink-500 to-rose-500",
  },

  // 生活记录类
  {
    id: "food",
    name: "美食日记",
    emoji: "🍜",
    category: "生活记录",
    description: "记录美食体验，品味生活的味道",
    tags: ["美食", "生活", "体验"],
    questions: [
      "今天吃了什么好吃的？",
      "味道如何？",
      "和谁一起吃的？",
    ],
    prompt: "请帮我写一篇美食日记，记录今天品尝的美食，包括味道、环境和感受。",
    popularity: 567,
    author: "采风爪",
    color: "from-orange-400 to-red-400",
  },
  {
    id: "travel",
    name: "旅行记录",
    emoji: "✈️",
    category: "生活记录",
    description: "记录旅途中的风景和感悟",
    tags: ["旅行", "风景", "体验"],
    questions: [
      "今天去了哪里？",
      "最难忘的瞬间？",
      "有什么感悟？",
    ],
    prompt: "请帮我写一篇旅行日记，记录今天的行程、见闻和感悟。",
    popularity: 445,
    author: "采风爪",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "fitness",
    name: "运动打卡",
    emoji: "🏃",
    category: "生活记录",
    description: "记录运动数据，见证身体的变化",
    tags: ["运动", "健身", "健康"],
    questions: [
      "今天做了什么运动？",
      "感觉如何？",
      "有什么突破？",
    ],
    prompt: "请帮我记录今天的运动情况，包括运动类型、时长、感受和进步。",
    popularity: 389,
    author: "进化爪",
    color: "from-lime-500 to-green-500",
  },
];

const categories = ["全部", "情感记录", "成长反思", "目标规划", "创意灵感", "生活记录"];

export default function DiaryTemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "全部" || t.category === selectedCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (template: Template) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to chat-diary with template prompt
    const encodedPrompt = encodeURIComponent(template.prompt);
    router.push(`/chat-diary?template=${encodedPrompt}&name=${encodeURIComponent(template.name)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">日记模板商店</h1>
                <p className="text-xs text-gray-500">精选模板，让写作更简单</p>
              </div>
            </div>
            <Link
              href="/chat-diary"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              ✍️ 开始写日记
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm mb-4">
            <span>🎉</span>
            <span>新功能上线</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            找到最适合你的日记模板
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            精选 {templates.length} 个日记模板，覆盖情感、成长、创意等多个场景。
            选择一个模板，开始你的写作之旅。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{templates.length}</div>
            <div className="text-xs text-gray-500">精选模板</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{categories.length - 1}</div>
            <div className="text-xs text-gray-500">场景分类</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {templates.reduce((acc, t) => acc + t.popularity, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">使用次数</div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${template.color} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{template.emoji}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {template.popularity} 次使用
                  </span>
                </div>
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p className="text-xs text-white/80">{template.category}</p>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Questions Preview */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-400 mb-2">引导问题：</div>
                  <ul className="space-y-1">
                    {template.questions.slice(0, 2).map((q, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-purple-400">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Author */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>by {template.author}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all bg-gradient-to-r ${template.color} text-white hover:opacity-90`}
                  >
                    使用模板
                  </button>
                  <button
                    onClick={() => handleCopy(template)}
                    className="px-3 py-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                  >
                    {copiedId === template.id ? "✓" : "📋"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">没有找到匹配的模板</h3>
            <p className="text-gray-500 text-sm">试试其他关键词或分类</p>
          </div>
        )}
      </section>

      {/* Featured Section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white text-center">
          <div className="text-4xl mb-4">🦞</div>
          <h2 className="text-2xl font-bold mb-2">想要自定义模板？</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            和 AI 对话，让它帮你创建专属的日记模板
          </p>
          <Link
            href="/chat-diary?prompt=请帮我创建一个日记模板"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>✨</span>
            <span>创建我的模板</span>
          </Link>
        </div>
      </section>

      {/* Tips Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">💡 使用小贴士</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-1">选择模板</h3>
            <p className="text-sm text-gray-500">根据当天心情或需求，选择合适的日记模板</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-1">回答问题</h3>
            <p className="text-sm text-gray-500">根据引导问题，回忆并记录相关内容</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-semibold text-gray-800 mb-1">AI 润色</h3>
            <p className="text-sm text-gray-500">让 AI 帮你整理成一篇完整的日记</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary 日记模板商店 · 让写作更简单</p>
          <div className="mt-3 flex items-center justify-center gap-6 text-xs">
            <Link href="/tools" className="text-purple-600 hover:underline">
              AI 工具箱
            </Link>
            <Link href="/playground" className="text-purple-600 hover:underline">
              Prompt 练习场
            </Link>
            <Link href="/quickstart" className="text-purple-600 hover:underline">
              快速上手
            </Link>
          </div>
        </div>
      </footer>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className={`bg-gradient-to-r ${selectedTemplate.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{selectedTemplate.emoji}</span>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-2xl font-bold mt-2">{selectedTemplate.name}</h2>
              <p className="text-white/80 text-sm">{selectedTemplate.description}</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">引导问题</h3>
                <ul className="space-y-2">
                  {selectedTemplate.questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-500 font-bold">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">AI 提示词</h3>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 font-mono">
                  {selectedTemplate.prompt}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className={`flex-1 py-3 rounded-xl font-medium bg-gradient-to-r ${selectedTemplate.color} text-white`}
                >
                  使用此模板
                </button>
                <button
                  onClick={() => handleCopy(selectedTemplate)}
                  className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedId === selectedTemplate.id ? "已复制" : "复制"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}