'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, Heart, Frown, Meh, Smile, Laugh, Angry,
  Flame, Droplets, Sun, Cloud, Sparkles
} from 'lucide-react'

interface MoodGroup {
  mood: string
  label: string
  color: string
  bgColor: string
  icon: React.ReactNode
  count: number
  diaries: Array<{
    id: string
    date: string
    title: string
    excerpt: string
  }>
}

const moodGroups: MoodGroup[] = [
  {
    mood: 'happy',
    label: '开心',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: <Smile className="w-8 h-8" />,
    count: 12,
    diaries: [
      { id: '1', date: '2026-03-12', title: '春日漫步', excerpt: '今天阳光很好，在公园里走了很久...' },
      { id: '2', date: '2026-03-10', title: '好消息', excerpt: '收到了期待已久的好消息...' },
      { id: '3', date: '2026-03-08', title: '朋友的惊喜', excerpt: '朋友给我准备了一个惊喜派对...' }
    ]
  },
  {
    mood: 'excited',
    label: '兴奋',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    icon: <Laugh className="w-8 h-8" />,
    count: 8,
    diaries: [
      { id: '4', date: '2026-03-09', title: '旅行计划', excerpt: '终于确定了去日本的旅行计划...' },
      { id: '5', date: '2026-03-05', title: '新项目', excerpt: '开始了一个令人兴奋的新项目...' }
    ]
  },
  {
    mood: 'calm',
    label: '平静',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: <Meh className="w-8 h-8" />,
    count: 15,
    diaries: [
      { id: '6', date: '2026-03-11', title: '咖啡馆的下午', excerpt: '在街角的咖啡馆坐了一下午...' },
      { id: '7', date: '2026-03-07', title: '读书时光', excerpt: '终于读完了那本想看很久的书...' }
    ]
  },
  {
    mood: 'sad',
    label: '低落',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: <Frown className="w-8 h-8" />,
    count: 5,
    diaries: [
      { id: '8', date: '2026-03-06', title: '雨天', excerpt: '今天下雨了，心情有些低落...' }
    ]
  },
  {
    mood: 'angry',
    label: '烦躁',
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: <Angry className="w-8 h-8" />,
    count: 3,
    diaries: [
      { id: '9', date: '2026-03-04', title: '不顺利的一天', excerpt: '今天发生了很多不顺心的事...' }
    ]
  }
]

const moodColors: Record<string, string> = {
  happy: 'from-yellow-400 to-orange-400',
  excited: 'from-pink-400 to-red-400',
  calm: 'from-blue-400 to-cyan-400',
  sad: 'from-gray-400 to-gray-600',
  angry: 'from-red-400 to-red-600'
}

export default function MoodJourneyPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedGroup = moodGroups.find(g => g.mood === selectedMood)

  const startMoodJourney = () => {
    setIsPlaying(true)
    setSelectedMood(moodGroups[0].mood)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-purple-100 dark:border-purple-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/story-mode" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              心情旅程
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/50 rounded-full text-pink-700 dark:text-pink-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            按心情色彩编织故事
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🌈 你的情绪彩虹
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            每一种心情都是生活的一部分，点击心情卡片，探索那段时光的故事
          </p>
        </div>

        {/* Mood Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {moodGroups.map((group) => (
            <button
              key={group.mood}
              onClick={() => setSelectedMood(group.mood)}
              className={`p-4 rounded-2xl transition-all ${
                selectedMood === group.mood
                  ? 'ring-2 ring-purple-500 ring-offset-2 scale-105'
                  : 'hover:scale-102'
              } ${group.bgColor}`}
            >
              <div className={`flex flex-col items-center ${group.color}`}>
                {group.icon}
                <span className="mt-2 font-medium">{group.label}</span>
                <span className="text-sm opacity-70">{group.count} 篇</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Mood Details */}
        {selectedGroup && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className={`flex items-center gap-4 mb-6 ${selectedGroup.color}`}>
              {selectedGroup.icon}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedGroup.label}的日记
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  共 {selectedGroup.count} 篇日记
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedGroup.diaries.map((diary, index) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {diary.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {diary.excerpt}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {diary.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <button className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              开始播放心情故事
            </button>
          </div>
        )}

        {/* Mood Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            📊 心情分布统计
          </h3>
          
          <div className="space-y-4">
            {moodGroups.map((group) => {
              const totalDiaries = moodGroups.reduce((sum, g) => sum + g.count, 0)
              const percentage = (group.count / totalDiaries) * 100
              
              return (
                <div key={group.mood}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 ${group.color}`}>
                      {group.icon}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {group.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {group.count} 篇 ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${moodColors[group.mood]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {moodGroups.reduce((sum, g) => sum + g.count, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">总日记数</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {moodGroups.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">心情类型</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Start */}
        <div className="mt-8 text-center">
          <button
            onClick={startMoodJourney}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium text-lg hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            开始心情旅程
          </button>
        </div>
      </main>
    </div>
  )
}