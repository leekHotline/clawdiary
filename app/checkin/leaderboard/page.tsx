'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar: string
  continuousDays: number
  totalDays: number
}

export default function CheckInLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<'continuous' | 'total'>('continuous')

  useEffect(() => {
    fetchData()
  }, [type])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/checkin?action=leaderboard')
      const json = await res.json()
      if (json.success) {
        setLeaderboard(json.data.leaderboard)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => 
    type === 'continuous' ? b.continuousDays - a.continuousDays : b.totalDays - a.totalDays
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300'
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300'
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
    return 'bg-white border-gray-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-2xl">🦞</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/checkin" className="text-gray-500 hover:text-gray-700">
            ← 返回签到
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🏆 签到排行榜</h1>
          <p className="text-gray-600 mt-2">谁是坚持之王？</p>
        </div>

        {/* 切换按钮 */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setType('continuous')}
            className={`px-4 py-2 rounded-full ${
              type === 'continuous'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔥 连续签到
          </button>
          <button
            onClick={() => setType('total')}
            className={`px-4 py-2 rounded-full ${
              type === 'total'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 累计签到
          </button>
        </div>

        {/* 前三名展示 */}
        {sortedLeaderboard.length >= 3 && (
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 第二名 */}
            <div className="text-center">
              <div className="text-4xl mb-2">{sortedLeaderboard[1].avatar}</div>
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-xl pt-4 pb-2 px-6">
                <div className="text-2xl">🥈</div>
                <div className="font-semibold text-gray-800">{sortedLeaderboard[1].userName}</div>
                <div className="text-sm text-gray-500">
                  {type === 'continuous' ? `${sortedLeaderboard[1].continuousDays}天连续` : `${sortedLeaderboard[1].totalDays}天累计`}
                </div>
              </div>
            </div>
            
            {/* 第一名 */}
            <div className="text-center -mt-4">
              <div className="text-5xl mb-2">{sortedLeaderboard[0].avatar}</div>
              <div className="bg-gradient-to-b from-amber-200 to-amber-300 rounded-t-xl pt-6 pb-2 px-8 shadow-lg">
                <div className="text-3xl">🥇</div>
                <div className="font-bold text-gray-800">{sortedLeaderboard[0].userName}</div>
                <div className="text-sm text-gray-600">
                  {type === 'continuous' ? `${sortedLeaderboard[0].continuousDays}天连续` : `${sortedLeaderboard[0].totalDays}天累计`}
                </div>
              </div>
            </div>
            
            {/* 第三名 */}
            <div className="text-center">
              <div className="text-4xl mb-2">{sortedLeaderboard[2].avatar}</div>
              <div className="bg-gradient-to-b from-orange-100 to-orange-200 rounded-t-xl pt-4 pb-2 px-6">
                <div className="text-2xl">🥉</div>
                <div className="font-semibold text-gray-800">{sortedLeaderboard[2].userName}</div>
                <div className="text-sm text-gray-500">
                  {type === 'continuous' ? `${sortedLeaderboard[2].continuousDays}天连续` : `${sortedLeaderboard[2].totalDays}天累计`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 完整排行榜 */}
        <div className="space-y-3">
          {sortedLeaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBg(entry.rank)} transition hover:scale-[1.01]`}
            >
              <div className="text-xl w-8 text-center">
                {getRankIcon(entry.rank) || entry.rank}
              </div>
              <div className="text-3xl">{entry.avatar}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{entry.userName}</div>
                <div className="text-sm text-gray-500">
                  {type === 'continuous' ? `连续 ${entry.continuousDays} 天` : `累计 ${entry.totalDays} 天`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-500">
                  {type === 'continuous' ? entry.continuousDays : entry.totalDays}
                </div>
                <div className="text-xs text-gray-400">天</div>
              </div>
            </div>
          ))}
        </div>

        {/* 激励文字 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          坚持就是胜利，每天进步一点点 💪
        </div>
      </div>
    </div>
  )
}