'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, Shuffle, Clock, Calendar, 
  Heart, Share2, RefreshCw, Sparkles
} from 'lucide-react'

interface RandomDiary {
  id: string
  date: string
  title: string
  content: string
  mood: string
  tags: string[]
  daysAgo: number
  year: number
}

const mockDiaries: RandomDiary[] = [
  {
    id: '1',
    date: '2025-06-15',
    title: '夏至前夕',
    content: '明天就是夏至了，白天越来越长。今天下班后在河边散步，看着夕阳一点点落下，天空从金黄变成粉红再到深紫。这种宁静的时刻，让我觉得生活真的很美好。',
    mood: 'calm',
    tags: ['夏天', '夕阳', '散步'],
    daysAgo: 270,
    year: 2025
  },
  {
    id: '2',
    date: '2025-03-08',
    title: '国际妇女节',
    content: '今天参加了公司组织的妇女节活动，听到了很多优秀女性同事的分享。她们的故事让我感触很深，也为自己的性别感到骄傲。女性的力量是无穷的。',
    mood: 'excited',
    tags: ['节日', '女性', '力量'],
    daysAgo: 369,
    year: 2025
  },
  {
    id: '3',
    date: '2024-12-25',
    title: '圣诞节',
    content: '今年的圣诞节在家和家人一起度过。虽然没有大餐，没有礼物，但能和爱的人在一起，就是最好的礼物。我们一起看了电影，吃了火锅，简单但温馨。',
    mood: 'happy',
    tags: ['圣诞节', '家人', '温馨'],
    daysAgo: 442,
    year: 2024
  },
  {
    id: '4',
    date: '2024-09-10',
    title: '教师节',
    content: '收到了以前学生发来的祝福信息，让我想起了当老师的那段时光。虽然现在换了工作，但那些和学生相处的日子，依然是我珍贵的回忆。',
    mood: 'calm',
    tags: ['教师节', '回忆', '学生'],
    daysAgo: 548,
    year: 2024
  },
  {
    id: '5',
    date: '2024-05-01',
    title: '劳动节旅行',
    content: '趁着劳动节假期，去了趟云南。洱海边吹风、古城里闲逛、吃了过桥米线...每一刻都值得被记住。旅行的意义，大概就是让生活多一些期待。',
    mood: 'excited',
    tags: ['旅行', '云南', '洱海'],
    daysAgo: 680,
    year: 2024
  }
]

const moodEmojis: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  excited: '🎉',
  sad: '😢',
  neutral: '😐'
}

const moodLabels: Record<string, string> = {
  happy: '开心',
  calm: '平静',
  excited: '兴奋',
  sad: '低落',
  neutral: '一般'
}

export default function RandomStoryPage() {
  const [currentDiary, setCurrentDiary] = useState<RandomDiary | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [history, setHistory] = useState<RandomDiary[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const getRandomDiary = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockDiaries.length)
      const diary = mockDiaries[randomIndex]
      setCurrentDiary(diary)
      setHistory(prev => [...prev.slice(0, historyIndex + 1), diary])
      setHistoryIndex(prev => prev + 1)
      setIsAnimating(false)
    }, 500)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setCurrentDiary(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setCurrentDiary(history[historyIndex + 1])
    }
  }

  useEffect(() => {
    getRandomDiary()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-blue-100 dark:border-blue-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/story-mode" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" />
              时光穿梭
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 text-sm mb-4">
            <Shuffle className="w-4 h-4" />
            随机探索过去的日记
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🕰️ 时光穿梭机
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            每一次穿梭，都是一次与过去的重逢
          </p>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Time Badge */}
          {currentDiary && (
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium shadow-lg ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {currentDiary.daysAgo} 天前 · {currentDiary.year}年
              </div>
            </div>
          )}

          {/* Diary Card */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {currentDiary ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-6">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(currentDiary.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodEmojis[currentDiary.mood]}</span>
                      <span>{moodLabels[currentDiary.mood]}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentDiary.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                    {currentDiary.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentDiary.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">收藏</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">分享</span>
                      </button>
                    </div>
                    <Link
                      href={`/diary/${currentDiary.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                    >
                      阅读全文 →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>正在穿越时空...</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={getRandomDiary}
            disabled={isAnimating}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            穿梭到下一段时光
          </button>

          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rotate-180"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">
              最近穿梭记录
            </h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {history.slice(-5).map((diary, index) => (
                <button
                  key={diary.id + index}
                  onClick={() => {
                    setHistoryIndex(history.length - 5 + index)
                    setCurrentDiary(diary)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    historyIndex === history.length - 5 + index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {diary.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shuffle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">随机发现</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              每次穿梭都是惊喜，发现被遗忘的记忆
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">时光印记</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              显示距离现在的天数，感受时间流逝
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI 推荐</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              智能推荐你可能会喜欢的日记
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}