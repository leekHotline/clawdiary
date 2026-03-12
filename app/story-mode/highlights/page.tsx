'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, Star, Calendar, Clock, Heart, Share2,
  Sparkles, TrendingUp, Award, Eye
} from 'lucide-react'

interface HighlightDiary {
  id: string
  date: string
  title: string
  content: string
  highlightReason: string
  score: number
  wordCount: number
  mood: string
  tags: string[]
}

const mockHighlights: HighlightDiary[] = [
  {
    id: '1',
    date: '2026-03-12',
    title: '春日漫步',
    content: '今天阳光很好，在公园里走了很久。樱花开始开放，空气中弥漫着淡淡的花香。遇到了一只可爱的小猫，它主动过来蹭我的腿，那一刻心情特别好。',
    highlightReason: '高情感分数 · 丰富的感官描写',
    score: 95,
    wordCount: 356,
    mood: 'happy',
    tags: ['春天', '散步', '猫咪']
  },
  {
    id: '2',
    date: '2026-03-09',
    title: '完成了一个项目',
    content: '终于完成了这个月的重要项目！虽然过程很辛苦，但看到成果的那一刻，所有的疲惫都消失了。晚上和朋友一起庆祝，我们聊了很多关于未来的计划。',
    highlightReason: '成就感强烈 · 人际互动丰富',
    score: 92,
    wordCount: 428,
    mood: 'excited',
    tags: ['工作', '成就', '朋友']
  },
  {
    id: '3',
    date: '2026-03-05',
    title: '深夜思考',
    content: '凌晨三点醒来，脑子里冒出很多想法。关于人生、关于选择、关于那些想要追求但一直没有勇气开始的事。也许，真的应该给自己一个机会。',
    highlightReason: '深度思考 · 哲理性内容',
    score: 88,
    wordCount: 512,
    mood: 'calm',
    tags: ['思考', '人生', '勇气']
  },
  {
    id: '4',
    date: '2026-03-01',
    title: '家庭聚餐',
    content: '全家人难得聚在一起吃了一顿饭。妈妈做了我最喜欢的红烧肉，爸爸虽然话不多但一直在给我夹菜。这种简单的幸福，真的值得被记录下来。',
    highlightReason: '家庭温情 · 情感真挚',
    score: 90,
    wordCount: 289,
    mood: 'happy',
    tags: ['家庭', '美食', '幸福']
  },
  {
    id: '5',
    date: '2026-02-28',
    title: '读书笔记',
    content: '今天读完了《被讨厌的勇气》，里面有很多观点让我深思。其中最触动我的是：所谓的自由，就是被别人讨厌。改变自己，不需要考虑别人的眼光。',
    highlightReason: '阅读笔记 · 知识性强',
    score: 86,
    wordCount: 678,
    mood: 'calm',
    tags: ['读书', '思考', '成长']
  }
]

const scoreColors = [
  { min: 90, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '优秀' },
  { min: 80, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: '良好' },
  { min: 70, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '不错' },
  { min: 0, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: '一般' }
]

const getScoreInfo = (score: number) => {
  return scoreColors.find(s => score >= s.min) || scoreColors[scoreColors.length - 1]
}

export default function HighlightsStoryPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel')
  const [isPlaying, setIsPlaying] = useState(false)

  const currentHighlight = mockHighlights[currentIndex]
  const scoreInfo = getScoreInfo(currentHighlight.score)

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => 
          prev < mockHighlights.length - 1 ? prev + 1 : 0
        )
      }, 8000)
      return () => clearInterval(timer)
    }
  }, [isPlaying])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-orange-100 dark:border-orange-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/story-mode" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              精彩时刻
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'carousel' ? 'list' : 'carousel')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-700 dark:text-orange-300 text-sm mb-4">
            <Award className="w-4 h-4" />
            AI 智能精选你的精彩日记
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⭐ 精彩时刻
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            基于情感分析、写作质量、内容深度等多维度精选
          </p>
        </div>

        {viewMode === 'carousel' ? (
          <>
            {/* Carousel View */}
            <div className="relative">
              {/* Navigation */}
              <button
                onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : mockHighlights.length - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentIndex(i => i < mockHighlights.length - 1 ? i + 1 : 0)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg rotate-180"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mx-8">
                {/* Score Badge */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6" />
                      <span className="text-lg font-medium">精彩指数</span>
                    </div>
                    <div className="text-3xl font-bold">{currentHighlight.score}</div>
                  </div>
                  <p className="text-white/80 text-sm mt-1">{currentHighlight.highlightReason}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {currentHighlight.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentHighlight.wordCount} 字
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentHighlight.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {currentHighlight.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentHighlight.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">收藏</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">分享</span>
                      </button>
                    </div>
                    <Link
                      href={`/diary/${currentHighlight.id}`}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 text-sm font-medium"
                    >
                      阅读全文 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {mockHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-orange-500 w-6'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Auto Play */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isPlaying
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isPlaying ? '暂停自动播放' : '自动播放'}
              </button>
            </div>
          </>
        ) : (
          /* List View */
          <div className="space-y-4">
            {mockHighlights.map((diary, index) => {
              const info = getScoreInfo(diary.score)
              return (
                <div
                  key={diary.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${info.bg} ${info.color}`}>
                          {diary.score}分
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{diary.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {diary.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {diary.content}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        ✨ {diary.highlightReason}
                      </p>
                    </div>
                    <Link
                      href={`/diary/${diary.id}`}
                      className="ml-4 text-orange-600 dark:text-orange-400 hover:text-orange-700"
                    >
                      查看
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            📊 精彩时刻统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-3xl font-bold text-orange-500">{mockHighlights.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">精彩日记</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-3xl font-bold text-amber-500">
                {Math.round(mockHighlights.reduce((sum, d) => sum + d.score, 0) / mockHighlights.length)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">平均分数</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-3xl font-bold text-yellow-500">
                {mockHighlights.reduce((sum, d) => sum + d.wordCount, 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">总字数</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-3xl font-bold text-green-500">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">本月新增</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}