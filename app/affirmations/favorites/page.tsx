'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Affirmation {
  id: string
  text: string
  category: string
  isCustom: boolean
}

interface AffirmationHistory {
  date: string
  affirmationId: string
  reflection: string
}

interface State {
  affirmations: Affirmation[]
  history: AffirmationHistory[]
  favorites: string[]
  streakInfo: { streak: number; totalDays: number }
  categoryStats: Record<string, number>
}

const CATEGORIES = [
  { id: 'confidence', name: '自信', emoji: '💪', color: 'from-orange-500 to-red-500' },
  { id: 'peace', name: '平静', emoji: '🧘', color: 'from-blue-500 to-cyan-500' },
  { id: 'success', name: '成功', emoji: '🏆', color: 'from-yellow-500 to-amber-500' },
  { id: 'love', name: '爱', emoji: '❤️', color: 'from-pink-500 to-rose-500' },
  { id: 'health', name: '健康', emoji: '🏃', color: 'from-green-500 to-emerald-500' },
  { id: 'abundance', name: '丰盛', emoji: '🌟', color: 'from-purple-500 to-violet-500' },
  { id: 'gratitude', name: '感恩', emoji: '🙏', color: 'from-indigo-500 to-blue-500' },
  { id: 'growth', name: '成长', emoji: '🌱', color: 'from-teal-500 to-green-500' }
]

function getInitialState(): State {
  if (typeof window === 'undefined') {
    return {
      affirmations: [],
      history: [],
      favorites: [],
      streakInfo: { streak: 0, totalDays: 0 },
      categoryStats: {}
    }
  }

  const savedAffirmations = localStorage.getItem('affirmations')
  const parsedAffirmations = savedAffirmations ? JSON.parse(savedAffirmations) : []

  const savedHistory = localStorage.getItem('affirmation-history-detailed')
  const historyData = savedHistory ? JSON.parse(savedHistory) : []

  const savedFavorites = localStorage.getItem('affirmation-favorites')
  const favs = savedFavorites ? JSON.parse(savedFavorites) : []

  // Calculate streak info
  const dates = historyData.map((h: AffirmationHistory) => new Date(h.date).toDateString())
  const uniqueDates = [...new Set(dates)] as string[]
  uniqueDates.sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    streak = 1
    const startFrom = uniqueDates.includes(today) ? today : yesterday

    for (let i = 1; i < 365; i++) {
      const checkDate = new Date(startFrom)
      checkDate.setDate(checkDate.getDate() - i)
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++
      } else {
        break
      }
    }
  }

  // Calculate category stats
  const stats: Record<string, number> = {}
  favs.forEach((id: string) => {
    const affirmation = parsedAffirmations.find((a: Affirmation) => a.id === id)
    if (affirmation) {
      stats[affirmation.category] = (stats[affirmation.category] || 0) + 1
    }
  })

  return {
    affirmations: parsedAffirmations,
    history: historyData,
    favorites: favs,
    streakInfo: { streak, totalDays: uniqueDates.length },
    categoryStats: stats
  }
}

export default function AffirmationsHistoryPage() {
  const [state] = useState(getInitialState)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const { affirmations, history, favorites, streakInfo, categoryStats } = state

  const getAffirmationById = (id: string) => {
    return affirmations.find(a => a.id === id)
  }

  const getCategoryById = (id: string) => {
    return CATEGORIES.find(c => c.id === id)
  }

  const getFilteredFavorites = () => {
    let favs = affirmations.filter(a => favorites.includes(a.id))
    if (selectedCategory) {
      favs = favs.filter(a => a.category === selectedCategory)
    }
    return favs
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/affirmations"
            className="px-4 py-2 bg-white/80 rounded-lg hover:bg-white transition shadow-sm"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">❤️ 我的收藏</h1>
            <p className="text-gray-600 text-sm">收藏的肯定语和历史记录</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-violet-500">{favorites.length}</div>
            <div className="text-sm text-gray-600">收藏数量</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-fuchsia-500">{streakInfo.streak}</div>
            <div className="text-sm text-gray-600">连续天数</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-500">{streakInfo.totalDays}</div>
            <div className="text-sm text-gray-600">使用天数</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === null
                ? 'bg-purple-500 text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            全部 ({favorites.length})
          </button>
          {CATEGORIES.map(category => {
            const count = categoryStats[category.id] || 0
            if (count === 0) return null
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {category.emoji} {category.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Favorites Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">❤️ 收藏的肯定语</h3>
          {getFilteredFavorites().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {getFilteredFavorites().map(affirmation => {
                const category = getCategoryById(affirmation.category)
                return (
                  <div
                    key={affirmation.id}
                    className={`p-4 rounded-xl bg-gradient-to-r ${category?.color} text-white`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm opacity-80">
                        {category?.emoji} {category?.name}
                      </span>
                      {affirmation.isCustom && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                          自定义
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{affirmation.text}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              {selectedCategory ? '该分类暂无收藏' : '暂无收藏的肯定语'}
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 分类分布</h3>
          <div className="space-y-3">
            {CATEGORIES.map(category => {
              const count = categoryStats[category.id] || 0
              const percentage = favorites.length > 0 ? (count / favorites.length) * 100 : 0
              
              return (
                <div key={category.id} className="flex items-center gap-3">
                  <span className="text-xl w-8">{category.emoji}</span>
                  <span className="w-16 text-gray-700">{category.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 最近使用</h3>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice().reverse().slice(0, 10).map((entry, index) => {
                const affirmation = getAffirmationById(entry.affirmationId)
                const category = affirmation ? getCategoryById(affirmation.category) : null
                
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </span>
                      {category && (
                        <span className="text-sm">
                          {category.emoji} {category.name}
                        </span>
                      )}
                    </div>
                    {affirmation && (
                      <p className="text-gray-700 font-medium">{affirmation.text}</p>
                    )}
                    {entry.reflection && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        &ldquo;{entry.reflection}&rdquo;
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              暂无使用记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}