'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Challenge {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: 'daily' | 'weekly' | 'monthly'
  goal: number
  progress: number
  participants: number
  category: string
}

interface ActivityItem {
  id: string
  type: string
  timestamp: string
  action?: string
  amount?: number
}

export default function ChallengeStatsPage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [dailyProgress, setDailyProgress] = useState<number[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Load challenge data
    const saved = localStorage.getItem('challenges')
    if (saved) {
      const challenges = JSON.parse(saved)
      const found = challenges.find((c: Challenge) => c.id === params.id)
      if (found) {
        setChallenge(found)
        
        // Load progress
        const progressKey = `challenge-progress-${params.id}`
        const progressData = localStorage.getItem(progressKey)
        if (progressData) {
          setDailyProgress(JSON.parse(progressData))
        }
        
        // Load activity
        const activityKey = `challenge-activity-${params.id}`
        const activityData = localStorage.getItem(activityKey)
        if (activityData) {
          setRecentActivity(JSON.parse(activityData))
        }
      }
    }
  }, [params.id])

  const getProgressPercentage = () => {
    if (!challenge) return 0
    return Math.min((challenge.progress / challenge.goal) * 100, 100)
  }

  const getDaysRemaining = () => {
    if (!challenge) return 0
    const end = new Date(challenge.endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const getAverageDaily = () => {
    if (dailyProgress.length === 0) return 0
    const sum = dailyProgress.reduce((a, b) => a + b, 0)
    return (sum / dailyProgress.length).toFixed(1)
  }

  const getStreak = () => {
    let streak = 0
    for (let i = dailyProgress.length - 1; i >= 0; i--) {
      if (dailyProgress[i] > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getWeekData = () => {
    const today = new Date()
    const weekData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayIndex = Math.floor((date.getTime() - new Date(challenge?.startDate || '').getTime()) / (1000 * 60 * 60 * 24))
      weekData.push({
        date,
        value: dailyProgress[dayIndex] || 0
      })
    }
    return weekData
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">挑战未找到</h1>
          <Link
            href="/challenges"
            className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
          >
            返回挑战列表
          </Link>
        </div>
      </div>
    )
  }

  const weekData = getWeekData()
  const maxValue = Math.max(...weekData.map(d => d.value), 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/challenges"
            className="p-2 bg-white/80 rounded-lg hover:bg-white transition"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 挑战统计</h1>
            <p className="text-gray-600">{challenge.title}</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">完成进度</span>
            <span className="text-2xl font-bold text-amber-600">
              {challenge.progress} / {challenge.goal}
            </span>
          </div>
          
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>{getProgressPercentage().toFixed(1)}%</span>
            <span>剩余 {getDaysRemaining()} 天</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{getStreak()}</div>
            <div className="text-sm text-gray-600">连续天数</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-500">{getAverageDaily()}</div>
            <div className="text-sm text-gray-600">日均完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-yellow-500">{challenge.participants}</div>
            <div className="text-sm text-gray-600">参与者</div>
          </div>
        </div>

        {/* Week Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 本周进度</h3>
          <div className="flex items-end justify-between h-40">
            {weekData.map((day, index) => {
              const height = (day.value / maxValue) * 100
              const isToday = day.date.toDateString() === new Date().toDateString()
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-8 bg-gradient-to-t from-amber-400 to-orange-500 rounded-t-lg transition-all"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {['日', '一', '二', '三', '四', '五', '六'][day.date.getDay()]}
                  </div>
                  {isToday && (
                    <div className="text-xs text-amber-600 font-medium">今天</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 最近活动</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice().reverse().slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-amber-600 font-medium">+{activity.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              暂无活动记录
            </div>
          )}
        </div>

        {/* Motivation */}
        <div className="mt-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-6 text-center text-white">
          <div className="text-4xl mb-2">💪</div>
          <p className="font-bold text-lg">
            {getProgressPercentage() >= 100 
              ? '恭喜完成挑战！' 
              : `继续加油！还差 ${challenge.goal - challenge.progress} 步达成目标`
            }
          </p>
        </div>
      </div>
    </div>
  )
}