'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar?: string
  value: number
  trend: 'up' | 'down' | 'same'
  trendValue?: number
  badge?: string
}

type LeaderboardType = 'diaries' | 'streak' | 'likes' | 'engagement' | 'followers'
type TimeRange = 'daily' | 'weekly' | 'monthly' | 'allTime'

const typeConfig: Record<LeaderboardType, { label: string; icon: string; unit: string }> = {
  diaries: { label: '日记达人', icon: '📝', unit: '篇' },
  streak: { label: '坚持之星', icon: '🔥', unit: '天' },
  likes: { label: '人气王', icon: '❤️', unit: '赞' },
  engagement: { label: '互动达人', icon: '💬', unit: '次' },
  followers: { label: '影响力榜', icon: '👥', unit: '人' }
}

const timeRangeLabels: Record<TimeRange, string> = {
  daily: '今日',
  weekly: '本周',
  monthly: '本月',
  allTime: '总榜'
}

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>('diaries')
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState({ totalParticipants: 0, lastUpdated: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [type, timeRange])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?type=${type}&timeRange=${timeRange}&limit=20`)
      const data = await res.json()
      if (data.success) {
        setLeaderboard(data.data.leaderboard)
        setStats(data.data.stats)
      }
    } catch (_error) {
      console.error('获取排行榜失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↑</span>
      case 'down':
        return <span className="text-red-500">↓</span>
      default:
        return <span className="text-gray-400">—</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold text-gray-900">🏆 排行榜</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 时间范围选择 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['daily', 'weekly', 'monthly', 'allTime'] as TimeRange[]).map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                timeRange === tr
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {timeRangeLabels[tr]}
            </button>
          ))}
        </div>

        {/* 榜单类型 */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">选择榜单</h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(typeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setType(key as LeaderboardType)}
                className={`flex flex-col items-center p-3 rounded-xl transition ${
                  type === key
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{config.icon}</span>
                <span className="text-xs mt-1">{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 前三名展示 */}
        {!loading && leaderboard.length >= 3 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6">
            <h2 className="text-white text-center font-semibold mb-4">
              {timeRangeLabels[timeRange]}{typeConfig[type].label}
            </h2>
            <div className="flex justify-center items-end gap-4">
              {/* 第二名 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center text-2xl">
                  🥈
                </div>
                <p className="text-white font-medium mt-2">{leaderboard[1]?.userName}</p>
                <p className="text-white/80 text-sm">
                  {leaderboard[1]?.value} {typeConfig[type].unit}
                </p>
              </div>
              {/* 第一名 */}
              <div className="text-center transform scale-110">
                <div className="w-20 h-20 bg-yellow-400/30 rounded-full mx-auto flex items-center justify-center text-3xl border-2 border-yellow-300">
                  🥇
                </div>
                <p className="text-white font-bold mt-2 text-lg">{leaderboard[0]?.userName}</p>
                <p className="text-yellow-200 text-sm font-medium">
                  {leaderboard[0]?.value} {typeConfig[type].unit}
                </p>
              </div>
              {/* 第三名 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center text-2xl">
                  🥉
                </div>
                <p className="text-white font-medium mt-2">{leaderboard[2]?.userName}</p>
                <p className="text-white/80 text-sm">
                  {leaderboard[2]?.value} {typeConfig[type].unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        <div className="bg-white rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              加载中...
            </div>
          ) : (
            <>
              <div className="divide-y">
                {leaderboard.slice(3).map((entry, index) => (
                  <div
                    key={entry.userId}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="w-8 text-center font-medium text-gray-400">
                      {entry.rank}
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full mx-3 flex items-center justify-center">
                      {entry.userName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.userName}</p>
                      <p className="text-sm text-gray-500">
                        {entry.value} {typeConfig[type].unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(entry.trend)}
                      {entry.trendValue && (
                        <span className="text-xs text-gray-400">{entry.trendValue}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 统计信息 */}
              <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-500">
                共 {stats.totalParticipants} 人参与 · 更新于 {new Date(stats.lastUpdated).toLocaleTimeString('zh-CN')}
              </div>
            </>
          )}
        </div>

        {/* 我的排名 */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
              🦞
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">我的排名</p>
              <p className="text-sm text-gray-500">继续努力，冲击榜单！</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">#128</p>
              <p className="text-xs text-gray-400">42 {typeConfig[type].unit}</p>
            </div>
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-medium text-purple-900 mb-2">💡 冲榜秘籍</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• 坚持每天写日记，稳步提升日记数</li>
            <li>• 多与社区互动，收获更多点赞和关注</li>
            <li>• 优质内容更容易被推荐，获得更多曝光</li>
            <li>• 邀请好友一起写日记，互相监督鼓励</li>
          </ul>
        </div>
      </main>
    </div>
  )
}