'use client'

import { useState } from 'react'
import Link from 'next/link'

// 人生章节类型
interface LifeChapter {
  id: string
  title: string
  period: string
  startDate: string
  endDate: string
  entryCount: number
  theme: string
  color: string
  emoji: string
  insights: string[]
  keywords: string[]
  mood: 'positive' | 'neutral' | 'challenging' | 'growth'
}

// 预定义章节模板
const CHAPTER_TEMPLATES: Omit<LifeChapter, 'id'>[] = [
  {
    title: '新起点',
    period: '2026年3月',
    startDate: '2026-03-01',
    endDate: '2026-03-25',
    entryCount: 25,
    theme: '开始 Claw Diary 之旅，记录每一天的成长',
    color: 'from-orange-400 to-amber-500',
    emoji: '🌅',
    insights: ['建立了每日记录的习惯', '发现了写作的乐趣', '开始关注内心感受'],
    keywords: ['开始', '探索', '好奇', '成长'],
    mood: 'growth',
  },
  {
    title: '情绪探索期',
    period: '2026年2月',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    entryCount: 28,
    theme: '深入了解自己的情绪模式',
    color: 'from-purple-400 to-indigo-500',
    emoji: '🔮',
    insights: ['学会了识别情绪触发点', '建立了情绪日记习惯', '发现内在力量'],
    keywords: ['情绪', '觉察', '理解', '接纳'],
    mood: 'neutral',
  },
  {
    title: '职业转型期',
    period: '2026年1月',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    entryCount: 20,
    theme: '面对职业选择，寻找新方向',
    color: 'from-blue-400 to-cyan-500',
    emoji: '🔄',
    insights: ['明确了自己的价值观', '学会了接受不确定性', '找到新的可能性'],
    keywords: ['转型', '选择', '勇气', '希望'],
    mood: 'challenging',
  },
  {
    title: '年度总结期',
    period: '2025年12月',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    entryCount: 31,
    theme: '回顾过去，展望未来',
    color: 'from-green-400 to-emerald-500',
    emoji: '📊',
    insights: ['完成年度目标回顾', '制定了新年计划', '感恩这一年的成长'],
    keywords: ['回顾', '感恩', '规划', '期待'],
    mood: 'positive',
  },
]

// 情绪指示器颜色
const moodColors = {
  positive: 'bg-green-100 text-green-700 border-green-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  challenging: 'bg-amber-100 text-amber-700 border-amber-200',
  growth: 'bg-purple-100 text-purple-700 border-purple-200',
}

const moodLabels = {
  positive: '积极期',
  neutral: '平稳期',
  challenging: '挑战期',
  growth: '成长期',
}

// 新建章节表单
function NewChapterForm({ onClose, onAdd }: { onClose: () => void; onAdd: (chapter: Partial<LifeChapter>) => void }) {
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [emoji, setEmoji] = useState('📖')

  const emojis = ['📖', '🌅', '💫', '🎯', '💪', '❤️', '🌟', '🌈', '🔥', '💎', '🦋', '🚀']

  const handleSubmit = () => {
    if (!title || !startDate) return
    onAdd({
      title,
      theme,
      startDate,
      endDate: endDate || startDate,
      emoji,
      period: `${startDate.slice(0, 7)}`,
      entryCount: 0,
      color: 'from-indigo-400 to-purple-500',
      insights: ['新章节，期待你的故事'],
      keywords: [],
      mood: 'neutral',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📚 新建人生章节</h3>
        
        {/* 标题 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">章节名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="如：新起点、转折期..."
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Emoji 选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">选择图标</label>
          <div className="flex flex-wrap gap-2">
            {emojis.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition-all ${
                  emoji === e ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* 主题 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">主题描述</label>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="这个章节的主要内容和感受..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* 日期 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">结束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || !startDate}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建章节
          </button>
        </div>
      </div>
    </div>
  )
}

// 章节详情弹窗
function ChapterDetail({ chapter, onClose }: { chapter: LifeChapter; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className={`bg-gradient-to-r ${chapter.color} p-6 text-white`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{chapter.emoji}</span>
            <div>
              <h3 className="text-2xl font-bold">{chapter.title}</h3>
              <p className="text-white/80">{chapter.period}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm border ${moodColors[chapter.mood]}`}>
              {moodLabels[chapter.mood]}
            </span>
            <span className="text-white/70 text-sm">
              📝 {chapter.entryCount} 篇日记
            </span>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 主题 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">📖 章节主题</h4>
            <p className="text-gray-700">{chapter.theme}</p>
          </div>

          {/* 洞察 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">💡 AI 洞察</h4>
            <div className="space-y-2">
              {chapter.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 关键词 */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">🏷️ 关键词</h4>
            <div className="flex flex-wrap gap-2">
              {chapter.keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 操作 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              查看日记
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LifeChaptersPage() {
  const [chapters, setChapters] = useState<LifeChapter[]>(
    CHAPTER_TEMPLATES.map((c, i) => ({ ...c, id: `chapter-${i}` }))
  )
  const [showNewForm, setShowNewForm] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<LifeChapter | null>(null)
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline')

  // 添加新章节
  const handleAddChapter = (chapter: Partial<LifeChapter>) => {
    const newChapter: LifeChapter = {
      id: `chapter-${Date.now()}`,
      title: chapter.title || '新章节',
      period: chapter.period || '',
      startDate: chapter.startDate || '',
      endDate: chapter.endDate || '',
      entryCount: chapter.entryCount || 0,
      theme: chapter.theme || '',
      color: chapter.color || 'from-indigo-400 to-purple-500',
      emoji: chapter.emoji || '📖',
      insights: chapter.insights || [],
      keywords: chapter.keywords || [],
      mood: chapter.mood || 'neutral',
    }
    setChapters([newChapter, ...chapters])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-amber-200/50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl hover:opacity-70 transition-opacity">
                ←
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-amber-700">📚 人生章节</h1>
                <p className="text-sm text-gray-500">将日记串联成你的人生故事</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* 视图切换 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  时间线
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  网格
                </button>
              </div>
              {/* 新建按钮 */}
              <button
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>+</span>
                <span>新建章节</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { value: chapters.length, label: '章节', emoji: '📚' },
            { value: chapters.reduce((sum, c) => sum + c.entryCount, 0), label: '日记', emoji: '📝' },
            { value: chapters.filter(c => c.mood === 'growth').length, label: '成长期', emoji: '🌱' },
            { value: chapters.filter(c => c.mood === 'positive').length, label: '积极期', emoji: '😊' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-white/50"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-xl font-bold text-amber-600">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 时间线视图 */}
        {viewMode === 'timeline' && (
          <div className="relative">
            {/* 时间线中轴 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-amber-300 to-rose-300" />

            {/* 章节列表 */}
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="relative pl-16 cursor-pointer group"
                  onClick={() => setSelectedChapter(chapter)}
                >
                  {/* 时间点 */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full bg-gradient-to-r ${chapter.color} ring-4 ring-white shadow-md group-hover:scale-125 transition-transform`} />

                  {/* 章节卡片 */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-lg transition-all group-hover:border-orange-200">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{chapter.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{chapter.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${moodColors[chapter.mood]}`}>
                            {moodLabels[chapter.mood]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{chapter.period}</p>
                        <p className="text-gray-600 text-sm mb-3">{chapter.theme}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📝 {chapter.entryCount} 篇日记</span>
                          <span>🏷️ {chapter.keywords.length} 个关键词</span>
                        </div>
                      </div>
                      <div className="text-gray-300 group-hover:text-orange-400 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 网格视图 */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className={`bg-gradient-to-br ${chapter.color} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{chapter.emoji}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-white/20`}>
                    {moodLabels[chapter.mood]}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{chapter.title}</h3>
                <p className="text-white/70 text-sm mb-3">{chapter.period}</p>
                <p className="text-white/80 text-sm line-clamp-2">{chapter.theme}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                  <span>📝 {chapter.entryCount} 篇</span>
                  <span className="group-hover:translate-x-1 transition-transform">查看 →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI 生成章节建议 */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🤖</span>
            AI 章节建议
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: '学习成长篇', desc: '记录学习新技能的旅程', emoji: '📖' },
              { title: '感情篇章', desc: '记录重要的情感经历', emoji: '❤️' },
              { title: '职业发展', desc: '追踪职业发展轨迹', emoji: '💼' },
            ].map((suggestion) => (
              <button
                key={suggestion.title}
                onClick={() => setShowNewForm(true)}
                className="text-left p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
              >
                <div className="text-2xl mb-2">{suggestion.emoji}</div>
                <div className="font-medium text-gray-800 group-hover:text-orange-600">{suggestion.title}</div>
                <div className="text-xs text-gray-500">{suggestion.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 相关功能 */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">🔗 相关功能</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/diary-timemachine"
              className="bg-white/60 p-4 rounded-xl hover:bg-white/80 transition-colors text-center"
            >
              <div className="text-2xl mb-1">⏰</div>
              <div className="text-sm text-gray-700">时光机</div>
            </Link>
            <Link
              href="/life-milestones"
              className="bg-white/60 p-4 rounded-xl hover:bg-white/80 transition-colors text-center"
            >
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-sm text-gray-700">里程碑</div>
            </Link>
            <Link
              href="/growth-path"
              className="bg-white/60 p-4 rounded-xl hover:bg-white/80 transition-colors text-center"
            >
              <div className="text-2xl mb-1">🛤️</div>
              <div className="text-sm text-gray-700">成长路径</div>
            </Link>
          </div>
        </div>
      </main>

      {/* 新建章节表单 */}
      {showNewForm && (
        <NewChapterForm onClose={() => setShowNewForm(false)} onAdd={handleAddChapter} />
      )}

      {/* 章节详情 */}
      {selectedChapter && (
        <ChapterDetail chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />
      )}
    </div>
  )
}