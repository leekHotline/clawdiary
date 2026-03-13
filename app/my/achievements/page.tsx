'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement: { type: string; target: number; metric: string }
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface UserAchievement {
  achievementId: string
  unlocked: boolean
  progress: number
  total: number
}

const rarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  rare: 'bg-blue-50 border-blue-300 text-blue-700',
  epic: 'bg-purple-50 border-purple-300 text-purple-700',
  legendary: 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 text-yellow-800'
}

const rarityLabels = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说'
}

const categoryLabels: Record<string, string> = {
  diary: '日记',
  social: '社交',
  streak: '坚持',
  exploration: '探索',
  special: '特殊'
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    unlocked: 0,
    progress: 0,
    totalPoints: 0,
    level: 1
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [achievementsRes, userRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/achievements/user1')
      ])

      const achievementsData = await achievementsRes.json()
      const userData = await userRes.json()

      if (achievementsData.success) {
        setAchievements(achievementsData.data)
      }
      if (userData.success) {
        setUserAchievements(userData.data.achievements)
        setSummary(userData.data.summary)
      }
    } catch (_error) {
      console.error('获取成就数据失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory)

  const getUserAchievement = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievementId === achievementId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-white rounded-2xl" />
            <div className="h-16 bg-white rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-white rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/my" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold text-gray-900">🏆 成就系统</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 等级卡片 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">当前等级</p>
              <p className="text-4xl font-bold">Lv.{summary.level}</p>
              <p className="text-purple-100 mt-2">
                已获得 {summary.totalPoints} 积分
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                🦞
              </div>
              <p className="text-sm mt-2 text-purple-100">
                距下一级还需 {summary.totalPoints > 0 ? 100 - (summary.totalPoints % 100) : 100} 分
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-purple-100 mb-1">
              <span>升级进度</span>
              <span>{summary.totalPoints % 100}/100</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${summary.totalPoints % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 成就统计 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{summary.unlocked}</p>
            <p className="text-sm text-gray-500">已解锁</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-400">{summary.total - summary.unlocked}</p>
            <p className="text-sm text-gray-500">未解锁</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{summary.progress}%</p>
            <p className="text-sm text-gray-500">完成率</p>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部
          </button>
          {['diary', 'social', 'streak', 'exploration', 'special'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* 成就列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => {
            const userAch = getUserAchievement(achievement.id)
            const progressPercent = userAch
              ? Math.round((userAch.progress / userAch.total) * 100)
              : 0

            return (
              <div
                key={achievement.id}
                className={`rounded-xl border-2 p-4 transition hover:shadow-md ${
                  userAch?.unlocked
                    ? rarityColors[achievement.rarity]
                    : 'bg-white border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{userAch?.unlocked ? achievement.icon : '🔒'}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      achievement.rarity === 'legendary'
                        ? 'bg-yellow-200 text-yellow-800'
                        : achievement.rarity === 'epic'
                        ? 'bg-purple-200 text-purple-800'
                        : achievement.rarity === 'rare'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {rarityLabels[achievement.rarity]}
                  </span>
                </div>
                <h3 className="font-semibold mt-2 text-sm">{achievement.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {achievement.description}
                </p>
                {!userAch?.unlocked && userAch && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{userAch.progress}/{userAch.total}</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {categoryLabels[achievement.category]}
                  </span>
                  <span className="text-xs font-medium text-purple-600">
                    +{achievement.points} 分
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部说明 */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">💡 成就说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 完成各项任务可解锁成就并获得积分</li>
            <li>• 积分用于提升等级，展示你的成就</li>
            <li>• 稀有度从低到高：普通 → 稀有 → 史诗 → 传说</li>
            <li>• 持续写日记，解锁更多精彩成就！</li>
          </ul>
        </div>
      </main>
    </div>
  )
}