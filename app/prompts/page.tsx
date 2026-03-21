'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  author: string
  uses: number
  isFavorite: boolean
  tags: string[]
}

const categories = [
  { id: 'daily', name: '日常记录', icon: '📝', color: 'from-orange-500 to-amber-500' },
  { id: 'mood', name: '情绪日记', icon: '🎭', color: 'from-pink-500 to-rose-500' },
  { id: 'growth', name: '成长反思', icon: '🌱', color: 'from-green-500 to-emerald-500' },
  { id: 'creative', name: '创意写作', icon: '✨', color: 'from-purple-500 to-violet-500' },
  { id: 'gratitude', name: '感恩日记', icon: '🙏', color: 'from-blue-500 to-cyan-500' },
  { id: 'review', name: '复盘总结', icon: '📊', color: 'from-indigo-500 to-blue-500' },
]

const defaultPrompts: Prompt[] = [
  {
    id: '1',
    title: '每日三件事',
    content: '请帮我整理今天的日记，记录三件最重要的事：\n1. 今天完成的最重要的事\n2. 今天学到的新东西\n3. 明天要改进的地方\n\n请用简洁、温暖的语言整理成日记格式。',
    category: 'daily',
    author: '执笔爪',
    uses: 128,
    isFavorite: true,
    tags: ['简洁', '日常', '高效'],
  },
  {
    id: '2',
    title: '情绪温度计',
    content: '我想记录今天的情绪状态。我的情绪温度是 X/10 分。\n\n请帮我分析：\n- 今天是什么影响了我的情绪？\n- 有什么方法可以让我感觉更好？\n- 给我一个温暖的鼓励\n\n把它写成一篇情绪日记。',
    category: 'mood',
    author: '采风爪',
    uses: 89,
    isFavorite: false,
    tags: ['情绪', '分析', '温暖'],
  },
  {
    id: '3',
    title: '周度复盘',
    content: '请帮我做本周复盘：\n\n📅 本周完成的事情：\n（我会补充具体内容）\n\n📈 本周成长：\n- 学到了什么？\n- 哪里做得更好了？\n\n🎯 下周目标：\n- 最重要的三件事\n\n请用清晰的格式整理成周报日记。',
    category: 'review',
    author: '进化爪',
    uses: 67,
    isFavorite: true,
    tags: ['周报', '复盘', '目标'],
  },
  {
    id: '4',
    title: '感恩三件事',
    content: '今天我想感谢三件事/三个人：\n\n1. 感谢_______，因为_______\n2. 感谢_______，因为_______\n3. 感谢_______，因为_______\n\n请帮我写成一篇温暖的感恩日记，表达我的感激之情。',
    category: 'gratitude',
    author: '执笔爪',
    uses: 156,
    isFavorite: false,
    tags: ['感恩', '温暖', '正能量'],
  },
  {
    id: '5',
    title: '创意故事开头',
    content: '请以这个开头写一个创意短篇：\n\n"那天的阳光格外刺眼，我没想到一个小小的决定会改变一切..."\n\n要求：\n- 字数 200-500 字\n- 有意想不到的转折\n- 结尾留有余韵',
    category: 'creative',
    author: '采风爪',
    uses: 45,
    isFavorite: false,
    tags: ['创意', '故事', '想象力'],
  },
  {
    id: '6',
    title: '成长里程碑',
    content: '今天我完成了一个小目标：_______\n\n请帮我写一篇成长日记：\n1. 为什么这个目标对我很重要？\n2. 我是怎么克服困难的？\n3. 这个成就给我带来了什么？\n4. 下一步我想做什么？\n\n用激励人心的语气来写。',
    category: 'growth',
    author: '进化爪',
    uses: 78,
    isFavorite: true,
    tags: ['成长', '目标', '激励'],
  },
  {
    id: '7',
    title: '心情画像',
    content: '如果我现在的心情是一幅画，它可能是这样的：\n\n- 颜色：_______（描述主色调）\n- 天气：_______（晴朗/阴雨/多云等）\n- 景象：_______（描述场景）\n\n请帮我把这幅"心情画"写成一篇文章，表达我此刻的感受。',
    category: 'mood',
    author: '采风爪',
    uses: 34,
    isFavorite: false,
    tags: ['心情', '意象', '创意'],
  },
  {
    id: '8',
    title: '梦境记录',
    content: '我做了一个梦：\n\n（描述梦境内容）\n\n请帮我：\n1. 记录这个梦的细节\n2. 分析梦境可能的象征意义\n3. 写成一篇有趣的梦境日记',
    category: 'creative',
    author: '执笔爪',
    uses: 23,
    isFavorite: false,
    tags: ['梦境', '分析', '有趣'],
  },
]

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(defaultPrompts)
  const [activeCategory, setActiveCategory] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    category: 'daily',
    tags: '',
  })

  const filteredPrompts = prompts.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.includes(searchQuery))
    return matchCategory && matchSearch
  })

  const handleCopy = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(prompt.content)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
    
    // 增加使用次数
    setPrompts(prompts.map(p => 
      p.id === prompt.id ? { ...p, uses: p.uses + 1 } : p
    ))
  }

  const handleFavorite = (id: string) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ))
  }

  const handleCreatePrompt = () => {
    if (!newPrompt.title || !newPrompt.content) return
    
    const prompt: Prompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      content: newPrompt.content,
      category: newPrompt.category,
      author: '我',
      uses: 0,
      isFavorite: false,
      tags: newPrompt.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    
    setPrompts([prompt, ...prompts])
    setShowCreateForm(false)
    setNewPrompt({ title: '', content: '', category: 'daily', tags: '' })
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">📋</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              AI 提示词库
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            精选优质提示词，一键复制，让你的 AI 日记更精彩
          </p>
        </div>

        {/* 搜索和创建 */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索提示词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>✨</span>
            <span>创建提示词</span>
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-violet-500 text-white shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            全部 ({prompts.length})
          </button>
          {categories.map((cat) => {
            const count = prompts.filter(p => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({count})</span>
              </button>
            )
          })}
        </div>

        {/* 提示词卡片 */}
        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => {
            const categoryInfo = getCategoryInfo(prompt.category)
            return (
              <div
                key={prompt.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`h-1 bg-gradient-to-r ${categoryInfo.color}`} />
                <div className="p-5">
                  {/* 标题栏 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryInfo.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{prompt.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{prompt.author}</span>
                          <span>·</span>
                          <span>{prompt.uses} 次使用</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFavorite(prompt.id)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        prompt.isFavorite ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      {prompt.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>

                  {/* 内容 */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                    {prompt.content}
                  </div>

                  {/* 标签和操作 */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/chat-diary?prompt=${encodeURIComponent(prompt.content)}`}
                        className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                      >
                        🦞 使用此提示词
                      </Link>
                      <button
                        onClick={() => handleCopy(prompt)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          copiedId === prompt.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {copiedId === prompt.id ? '✅ 已复制' : '📋 复制'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 空状态 */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500">没有找到匹配的提示词</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
              className="mt-4 text-violet-500 hover:underline"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">{prompts.length}</div>
            <div className="text-sm text-gray-500">提示词总数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{prompts.filter(p => p.isFavorite).length}</div>
            <div className="text-sm text-gray-500">已收藏</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{prompts.reduce((a, p) => a + p.uses, 0)}</div>
            <div className="text-sm text-gray-500">总使用次数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-sm text-gray-500">分类数</div>
          </div>
        </div>
      </div>

      {/* 创建提示词弹窗 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">✨ 创建新提示词</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="给提示词起个名字"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setNewPrompt({ ...newPrompt, category: cat.id })}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        newPrompt.category === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">提示词内容</label>
                <textarea
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 h-40 font-mono text-sm"
                  placeholder="输入提示词内容，可以用 ______ 作为用户填空位置"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="例如：高效, 日常, 简洁"
                />
              </div>

              <button
                onClick={handleCreatePrompt}
                disabled={!newPrompt.title || !newPrompt.content}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建提示词
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}