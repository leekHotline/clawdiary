'use client';

import { useState } from 'react';

interface Tool {
  id: number;
  name: string;
  icon: string;
  category: string;
  description: string;
  tags: string[];
  price: string;
  stars: number;
  url: string;
}

const tools: Tool[] = [
  {
    id: 1,
    name: 'ChatGPT',
    icon: '🤖',
    category: 'AI对话',
    description: 'OpenAI 出品的 AI 对话助手，支持多模态交互，适合日记反思和问题解答',
    tags: ['AI对话', '写作助手', '多模态'],
    price: '免费/付费',
    stars: 5,
    url: 'https://chat.openai.com',
  },
  {
    id: 2,
    name: 'Claude',
    icon: '🧠',
    category: 'AI对话',
    description: 'Anthropic 出品的 AI 助手，擅长深度分析和写作，思考方式更接近人类',
    tags: ['深度分析', '写作', '代码'],
    price: '免费/付费',
    stars: 5,
    url: 'https://claude.ai',
  },
  {
    id: 3,
    name: 'Notion AI',
    icon: '📝',
    category: '笔记增强',
    description: 'Notion 内置的 AI 助手，帮你自动整理笔记、生成摘要、写文章',
    tags: ['笔记', '整理', '效率'],
    price: '付费',
    stars: 4,
    url: 'https://notion.so',
  },
  {
    id: 4,
    name: 'Otter.ai',
    icon: '🦦',
    category: '语音转文字',
    description: '实时语音转文字，记录会议、访谈灵感，适合语音日记整理',
    tags: ['语音', '转录', '会议'],
    price: '免费/付费',
    stars: 4,
    url: 'https://otter.ai',
  },
  {
    id: 5,
    name: 'Mem',
    icon: '🧠',
    category: 'AI笔记',
    description: 'AI 驱动的笔记工具，自动整理和关联你的笔记，智能推荐相关内容',
    tags: ['笔记', 'AI整理', '知识库'],
    price: '付费',
    stars: 4,
    url: 'https://mem.ai',
  },
  {
    id: 6,
    name: 'Reflect',
    icon: '🔮',
    category: 'AI笔记',
    description: 'AI 增强的笔记和日记工具，双向链接和 AI 帮你建立知识网络',
    tags: ['日记', '双向链接', 'AI'],
    price: '付费',
    stars: 4,
    url: 'https://reflect.app',
  },
  {
    id: 7,
    name: 'Day One',
    icon: '📓',
    category: '日记应用',
    description: '老牌日记应用，支持加密、照片、日历视图，适合长期日记记录',
    tags: ['日记', '加密', '照片'],
    price: '付费',
    stars: 4,
    url: 'https://dayoneapp.com',
  },
  {
    id: 8,
    name: 'Journey',
    icon: '🧭',
    category: '日记应用',
    description: '跨平台日记应用，支持 AI 分析情绪和写作建议，界面美观',
    tags: ['日记', 'AI分析', '跨平台'],
    price: '免费/付费',
    stars: 4,
    url: 'https://journey.cloud',
  },
  {
    id: 9,
    name: 'Flomo',
    icon: '💭',
    category: '卡片笔记',
    description: '浮墨卡片笔记，帮你快速记录灵感，适合碎片化思考和知识管理',
    tags: ['卡片笔记', '灵感', '轻量'],
    price: '免费/付费',
    stars: 4,
    url: 'https://flomoapp.com',
  },
  {
    id: 10,
    name: 'Obsidian',
    icon: '💎',
    category: '知识管理',
    description: '本地优先的知识管理工具，双向链接强大，适合深度知识整理',
    tags: ['知识管理', '双向链接', '本地'],
    price: '免费',
    stars: 5,
    url: 'https://obsidian.md',
  },
  {
    id: 11,
    name: 'Logseq',
    icon: '📊',
    category: '知识管理',
    description: '开源大纲工具，支持双向链接和本地存储，适合知识管理和日记',
    tags: ['大纲', '开源', '本地'],
    price: '免费',
    stars: 4,
    url: 'https://logseq.com',
  },
  {
    id: 12,
    name: 'Capacities',
    icon: '📦',
    category: '知识管理',
    description: '对象化的笔记工具，把内容变成可复用的对象，构建个人知识库',
    tags: ['对象化', '知识库', '创意'],
    price: '付费',
    stars: 4,
    url: 'https://capacities.io',
  },
];

const categories = ['全部', 'AI对话', '笔记增强', '语音转文字', 'AI笔记', '日记应用', '卡片笔记', '知识管理'];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [voted, setVoted] = useState<number[]>([]);

  const filteredTools = selectedCategory === '全部' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  const toggleBookmark = (id: number) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(b => b !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  const handleVote = (id: number) => {
    if (!voted.includes(id)) {
      setVoted([...voted, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🛠️ AI 工具百宝箱
          </h1>
          <p className="text-gray-600">发现适合日记、知识管理、AI 写作的优质工具</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8 text-center">
          <div className="bg-white/60 backdrop-blur rounded-2xl p-4 px-6">
            <div className="text-2xl font-bold text-purple-600">{tools.length}</div>
            <div className="text-sm text-gray-500">工具总数</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-2xl p-4 px-6">
            <div className="text-2xl font-bold text-pink-600">{bookmarked.length}</div>
            <div className="text-sm text-gray-500">已收藏</div>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-2xl p-4 px-6">
            <div className="text-2xl font-bold text-blue-600">{voted.length}</div>
            <div className="text-sm text-gray-500">已投票</div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{tool.name}</h3>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(tool.id)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    bookmarked.includes(tool.id) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  {bookmarked.includes(tool.id) ? '⭐' : '☆'}
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < tool.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">{tool.price}</span>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  访问 →
                </a>
              </div>

              {/* Vote Button */}
              <button
                onClick={() => handleVote(tool.id)}
                disabled={voted.includes(tool.id)}
                className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  voted.includes(tool.id)
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                }`}
              >
                {voted.includes(tool.id) ? '✓ 已推荐' : '👍 推荐这个工具'}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500">该分类下还没有工具</p>
          </div>
        )}
      </div>
    </div>
  );
}