'use client';

import { useState } from 'react';
import Link from 'next/link';

// AI 提示词数据 - 基于 2025 年最佳实践
const promptCategories = [
  {
    id: 'creativity',
    name: '创意写作',
    emoji: '🎨',
    color: 'from-pink-500 to-rose-500',
    prompts: [
      { id: 1, text: '如果今天是一种颜色，它是什么？为什么？', mood: '轻松', difficulty: '简单' },
      { id: 2, text: '写一个以"那天，我决定..."开头的故事', mood: '反思', difficulty: '中等' },
      { id: 3, text: '描述你理想中的一天，从早到晚', mood: '憧憬', difficulty: '简单' },
      { id: 4, text: '如果你可以和任何人共进晚餐，你会选择谁？聊什么？', mood: '想象', difficulty: '简单' },
      { id: 5, text: '写一封信给 5 年后的自己', mood: '期待', difficulty: '中等' },
      { id: 6, text: '如果你有一项超能力，你会用它做什么？', mood: '幻想', difficulty: '简单' },
      { id: 7, text: '描述一个让你感到完全放松的地方', mood: '平静', difficulty: '简单' },
      { id: 8, text: '如果人生是一部电影，现在的章节名叫什么？', mood: '反思', difficulty: '中等' },
    ]
  },
  {
    id: 'emotions',
    name: '情绪探索',
    emoji: '💭',
    color: 'from-purple-500 to-indigo-500',
    prompts: [
      { id: 9, text: '此刻你的身体感觉如何？从头到脚扫描一遍', mood: '觉察', difficulty: '简单' },
      { id: 10, text: '今天让你微笑的三件小事是什么？', mood: '感恩', difficulty: '简单' },
      { id: 11, text: '描述一个最近困扰你的情绪，试着和它对话', mood: '深入', difficulty: '困难' },
      { id: 12, text: '你最近一次感到真正快乐是什么时候？发生了什么？', mood: '积极', difficulty: '简单' },
      { id: 13, text: '如果焦虑是一种天气，它今天是什么天气？', mood: '隐喻', difficulty: '中等' },
      { id: 14, text: '写下你现在需要听到的话', mood: '疗愈', difficulty: '中等' },
      { id: 15, text: '你今天对谁感到感激？为什么？', mood: '感恩', difficulty: '简单' },
      { id: 16, text: '描述一个你想要释放的情绪', mood: '释放', difficulty: '困难' },
    ]
  },
  {
    id: 'growth',
    name: '成长反思',
    emoji: '🌱',
    color: 'from-green-500 to-emerald-500',
    prompts: [
      { id: 17, text: '你最近学到的重要一课是什么？', mood: '学习', difficulty: '简单' },
      { id: 18, text: '描述一个让你走出舒适区的经历', mood: '勇气', difficulty: '中等' },
      { id: 19, text: '你希望 5 年后的自己具备什么品质？', mood: '愿景', difficulty: '中等' },
      { id: 20, text: '最近有什么习惯让你变得更好？', mood: '积极', difficulty: '简单' },
      { id: 21, text: '你正在努力改变的一件事是什么？', mood: '改变', difficulty: '中等' },
      { id: 22, text: '列出你今年完成的 3 件值得骄傲的事', mood: '成就', difficulty: '简单' },
      { id: 23, text: '你最近克服的一个挑战是什么？你是怎么做到的？', mood: '成功', difficulty: '中等' },
      { id: 24, text: '如果你可以给过去的自己一个建议，会是什么？', mood: '智慧', difficulty: '中等' },
    ]
  },
  {
    id: 'relationships',
    name: '人际关系',
    emoji: '🤝',
    color: 'from-blue-500 to-cyan-500',
    prompts: [
      { id: 25, text: '描述一个你欣赏的人，他们有什么特质？', mood: '欣赏', difficulty: '简单' },
      { id: 26, text: '最近一次让你感动的互动是什么？', mood: '感动', difficulty: '简单' },
      { id: 27, text: '你和谁的关系想要更近一步？怎么做？', mood: '连接', difficulty: '中等' },
      { id: 28, text: '写一段话给一个重要的人（可以不发送）', mood: '表达', difficulty: '中等' },
      { id: 29, text: '你在人际关系中学到的最重要的一课', mood: '学习', difficulty: '中等' },
      { id: 30, text: '描述一个你想要修复的关系', mood: '疗愈', difficulty: '困难' },
      { id: 31, text: '谁是你的支持系统？他们如何帮助你？', mood: '感恩', difficulty: '简单' },
      { id: 32, text: '你在关系中最看重什么品质？', mood: '价值观', difficulty: '简单' },
    ]
  },
  {
    id: 'mindfulness',
    name: '正念冥想',
    emoji: '🧘',
    color: 'from-amber-500 to-orange-500',
    prompts: [
      { id: 33, text: '用六个字描述你现在的状态', mood: '简洁', difficulty: '简单' },
      { id: 34, text: '注意你现在的呼吸，描述它的节奏', mood: '专注', difficulty: '简单' },
      { id: 35, text: '此刻你周围有什么声音？聆听 1 分钟', mood: '觉察', difficulty: '简单' },
      { id: 36, text: '描述你现在看到的三样东西，越详细越好', mood: '观察', difficulty: '简单' },
      { id: 37, text: '闭上眼睛，想象一个安全的空间，描述它', mood: '想象', difficulty: '中等' },
      { id: 38, text: '从 1 到 10，你的能量水平是多少？为什么？', mood: '检查', difficulty: '简单' },
      { id: 39, text: '现在你的身体哪个部位最紧张？试着放松它', mood: '放松', difficulty: '中等' },
      { id: 40, text: '用三句话总结这一刻的感受', mood: '总结', difficulty: '简单' },
    ]
  },
  {
    id: 'dreams',
    name: '梦想目标',
    emoji: '✨',
    color: 'from-violet-500 to-purple-500',
    prompts: [
      { id: 41, text: '如果金钱不是问题，你会怎么生活？', mood: '梦想', difficulty: '中等' },
      { id: 42, text: '你小时候的梦想是什么？现在怎么看？', mood: '回顾', difficulty: '简单' },
      { id: 43, text: '列出你人生的 3 个优先级', mood: '规划', difficulty: '中等' },
      { id: 44, text: '如果你只剩下一年，你会做什么？', mood: '意义', difficulty: '困难' },
      { id: 45, text: '描述你理想中的生活状态', mood: '愿景', difficulty: '中等' },
      { id: 46, text: '什么是你一直想做但还没做的事？为什么没做？', mood: '行动', difficulty: '中等' },
      { id: 47, text: '你希望被记住的是什么？', mood: '遗产', difficulty: '困难' },
      { id: 48, text: '下一步你想实现的小目标是什么？', mood: '行动', difficulty: '简单' },
    ]
  },
  {
    id: 'shadow',
    name: '深度探索',
    emoji: '🌑',
    color: 'from-slate-600 to-gray-700',
    prompts: [
      { id: 49, text: '你最害怕别人发现你什么？', mood: '勇敢', difficulty: '困难' },
      { id: 50, text: '描述一个你一直在回避的问题', mood: '面对', difficulty: '困难' },
      { id: 51, text: '你对自己最苛刻的评判是什么？', mood: '自省', difficulty: '困难' },
      { id: 52, text: '写下你想要原谅的人或事', mood: '原谅', difficulty: '困难' },
      { id: 53, text: '你最深的遗憾是什么？', mood: '释放', difficulty: '困难' },
      { id: 54, text: '你在隐藏什么？为什么？', mood: '诚实', difficulty: '困难' },
      { id: 55, text: '写下一个你从未告诉任何人的秘密', mood: '释放', difficulty: '困难' },
      { id: 56, text: '你最不喜欢的自己是什么样子？', mood: '接纳', difficulty: '困难' },
    ]
  },
];

// 随机提示生成器
function getRandomPrompt() {
  const allPrompts = promptCategories.flatMap(cat => 
    cat.prompts.map(p => ({ ...p, category: cat }))
  );
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

// 历史智者提示词
const historicalMentors = [
  { name: '苏格拉底', emoji: '🏛️', prompt: '什么是真正的智慧？你今天学到了什么让你变得更智慧？' },
  { name: '孔子', emoji: '🎓', prompt: '吾日三省吾身。今天你反省了什么？' },
  { name: '尼采', emoji: '⚔️', prompt: '那些杀不死我的，终将使我更强大。描述一个让你变得更强的挑战。' },
  { name: '老子', emoji: '☯️', prompt: '知人者智，自知者明。你今天对自己有了什么新的认识？' },
  { name: '荣格', emoji: '🌑', prompt: '阴影是我们不愿意承认的自己。今天你发现了自己的哪一面？' },
  { name: '达芬奇', emoji: '🎨', prompt: '学会观察。描述一件你今天真正注意到的事物。' },
];

// 初始化函数：从 localStorage 读取收藏
function getInitialFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('prompt-favorites');
  return saved ? JSON.parse(saved) : [];
}

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [randomPrompt, setRandomPrompt] = useState<{ text: string; mood: string; difficulty: string; category: { name: string; emoji: string } } | null>(null);
  const [favorites, setFavorites] = useState<number[]>(getInitialFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentor, setShowMentor] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<typeof historicalMentors[0] | null>(null);

  // 保存收藏到 localStorage
  const toggleFavorite = (promptId: number) => {
    const newFavorites = favorites.includes(promptId)
      ? favorites.filter(id => id !== promptId)
      : [...favorites, promptId];
    setFavorites(newFavorites);
    localStorage.setItem('prompt-favorites', JSON.stringify(newFavorites));
  };

  // 随机提示
  const handleRandomPrompt = () => {
    const prompt = getRandomPrompt();
    setRandomPrompt(prompt);
  };

  // 随机智者
  const handleRandomMentor = () => {
    const mentor = historicalMentors[Math.floor(Math.random() * historicalMentors.length)];
    setCurrentMentor(mentor);
    setShowMentor(true);
  };

  // 过滤提示词
  const filteredCategories = searchQuery
    ? promptCategories.map(cat => ({
        ...cat,
        prompts: cat.prompts.filter(p => 
          p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mood.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.prompts.length > 0)
    : promptCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI 提示词库
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            {promptCategories.reduce((acc, cat) => acc + cat.prompts.length, 0)}+ 精选提示词，让每次写作都有灵感
          </p>
          
          {/* 统计 */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-pink-500">❤️</span>
              <span className="text-gray-600">{favorites.length} 个收藏</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">📚</span>
              <span className="text-gray-600">{promptCategories.length} 个分类</span>
            </div>
          </div>
        </div>

        {/* 快速操作区 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* 随机提示 */}
          <button
            onClick={handleRandomPrompt}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
          >
            <div className="text-3xl mb-2">🎲</div>
            <div className="font-bold text-lg mb-1">随机提示</div>
            <div className="text-white/70 text-sm">不知道写什么？让 AI 帮你选</div>
          </button>

          {/* 智者对话 */}
          <button
            onClick={handleRandomMentor}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
          >
            <div className="text-3xl mb-2">🏛️</div>
            <div className="font-bold text-lg mb-1">智者对话</div>
            <div className="text-white/70 text-sm">与历史智者交流获取智慧</div>
          </button>
        </div>

        {/* 随机提示展示 */}
        {randomPrompt && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{randomPrompt.category.emoji}</span>
                <span className="text-sm text-gray-500">{randomPrompt.category.name}</span>
              </div>
              <button
                onClick={() => setRandomPrompt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xl font-medium text-gray-800 mb-4 leading-relaxed">
              {randomPrompt.text}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                  {randomPrompt.mood}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  randomPrompt.difficulty === '简单' ? 'bg-green-100 text-green-600' :
                  randomPrompt.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {randomPrompt.difficulty}
                </span>
              </div>
              <Link
                href="/write"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-shadow"
              >
                开始写作 ✍️
              </Link>
            </div>
          </div>
        )}

        {/* 智者对话展示 */}
        {showMentor && currentMentor && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 shadow-lg border border-amber-200/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentMentor.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800">{currentMentor.name}</div>
                  <div className="text-xs text-gray-500">历史智者</div>
                </div>
              </div>
              <button
                onClick={() => setShowMentor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed italic">
              "{currentMentor.prompt}"
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRandomMentor}
                className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors"
              >
                换一位智者
              </button>
              <Link
                href="/write"
                className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium"
              >
                写下思考 ✍️
              </Link>
            </div>
          </div>
        )}

        {/* 搜索栏 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索提示词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700 placeholder-gray-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-white/70 text-gray-600 hover:bg-white/90'
            }`}
          >
            全部
          </button>
          {promptCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-white/70 text-gray-600 hover:bg-white/90'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 提示词列表 */}
        <div className="space-y-8">
          {filteredCategories
            .filter(cat => !selectedCategory || cat.id === selectedCategory)
            .map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.emoji}</span>
                  <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                  <span className="text-sm text-gray-400">({category.prompts.length})</span>
                </div>
                
                <div className="grid gap-3">
                  {category.prompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="group bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleFavorite(prompt.id)}
                          className={`text-xl transition-transform hover:scale-110 ${
                            favorites.includes(prompt.id) ? 'text-pink-500' : 'text-gray-300'
                          }`}
                        >
                          {favorites.includes(prompt.id) ? '❤️' : '🤍'}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 mb-2 leading-relaxed">{prompt.text}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
                              {prompt.mood}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              prompt.difficulty === '简单' ? 'bg-green-50 text-green-600' :
                              prompt.difficulty === '中等' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {prompt.difficulty}
                            </span>
                          </div>
                        </div>
                        <Link
                          href="/write"
                          className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium"
                        >
                          写作
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* 收藏夹 */}
        {favorites.length > 0 && (
          <div className="mt-12 pt-8 border-t border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">❤️</span>
              <h2 className="text-xl font-bold text-gray-800">我的收藏</h2>
            </div>
            <div className="grid gap-3">
              {promptCategories
                .flatMap(cat => cat.prompts.map(p => ({ ...p, category: cat })))
                .filter(p => favorites.includes(p.id))
                .map((prompt) => (
                  <div
                    key={prompt.id}
                    className="bg-pink-50/50 rounded-xl p-4 border border-pink-100"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleFavorite(prompt.id)}
                        className="text-xl text-pink-500 hover:scale-110 transition-transform"
                      >
                        ❤️
                      </button>
                      <div className="flex-1">
                        <p className="text-gray-700 mb-1">{prompt.text}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{prompt.category.emoji} {prompt.category.name}</span>
                          <span>·</span>
                          <span>{prompt.mood}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>💡 提示词灵感来源于 2025 年最佳 AI 日记应用实践</p>
          <p className="mt-1">持续更新中，帮助你每天找到写作灵感</p>
        </div>

        {/* 返回首页 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 text-sm"
          >
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}