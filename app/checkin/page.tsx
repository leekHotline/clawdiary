'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CheckInRecord {
  id: string
  date: string
  points: number
  continuousDays: number
  bonus: string | null
}

interface CalendarDay {
  date: string
  checked: boolean
  points: number
}

interface CheckInData {
  hasCheckedIn: boolean
  todayRecord: CheckInRecord | null
  records: CheckInRecord[]
  calendar: CalendarDay[]
  stats: {
    totalPoints: number
    totalDays: number
    currentStreak: number
    maxStreak: number
    thisMonth: number
  }
  nextBonus: { days: number; points: number; name: string } | null
}

export default function CheckInPage() {
  const [data, setData] = useState<CheckInData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/checkin')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (checking || data?.hasCheckedIn) return
    
    setChecking(true)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'default' })
      })
      const json = await res.json()
      
      if (json.success) {
        setMessage({ text: json.data.message, type: 'success' })
        fetchData()
      } else {
        setMessage({ text: json.error || '签到失败', type: 'error' })
      }
    } catch (e) {
      setMessage({ text: '网络错误', type: 'error' })
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-2xl">🦞</div>
      </div>
    )
  }

  const today = new Date()
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📅 每日签到</h1>
            <p className="text-gray-600 mt-1">坚持签到，收获成长</p>
          </div>
          <Link
            href="/checkin/leaderboard"
            className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            🏆 排行榜
          </Link>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-4 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        {/* 签到卡片 */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg opacity-90">
                {data?.hasCheckedIn ? '今日已签到 ✅' : '点击签到领取积分'}
              </div>
              <div className="text-4xl font-bold mt-2">
                {data?.hasCheckedIn ? (
                  <>+{data.todayRecord?.points || 10} 积分</>
                ) : (
                  <>+10 积分起</>
                )}
              </div>
              {data?.nextBonus && (
                <div className="mt-2 text-sm opacity-90">
                  再坚持 {data.nextBonus.days - (data.stats.currentStreak || 0)} 天解锁「{data.nextBonus.name}」
                </div>
              )}
            </div>
            <button
              onClick={handleCheckIn}
              disabled={data?.hasCheckedIn || checking}
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition ${
                data?.hasCheckedIn
                  ? 'bg-white/30 cursor-not-allowed'
                  : 'bg-white text-amber-600 hover:scale-105 shadow-lg'
              }`}
            >
              {checking ? '签到中...' : data?.hasCheckedIn ? '已签到' : '立即签到'}
            </button>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-amber-500">{data?.stats.currentStreak || 0}</div>
            <div className="text-sm text-gray-500">连续签到</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">📊</div>
            <div className="text-2xl font-bold text-blue-500">{data?.stats.totalDays || 0}</div>
            <div className="text-sm text-gray-500">累计签到</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">💎</div>
            <div className="text-2xl font-bold text-green-500">{data?.stats.totalPoints || 0}</div>
            <div className="text-sm text-gray-500">累计积分</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-purple-500">{data?.stats.maxStreak || 0}</div>
            <div className="text-sm text-gray-500">最长连续</div>
          </div>
        </div>

        {/* 签到日历 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              📅 {monthNames[today.getMonth()]} {today.getFullYear()}
            </h2>
            <div className="text-sm text-gray-500">
              本月已签到 {data?.stats.thisMonth || 0} 天
            </div>
          </div>
          
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-sm text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>
          
          {/* 日历网格 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 填充月初空白 */}
            {Array.from({ length: new Date(today.getFullYear(), today.getMonth(), 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* 日历日期 */}
            {Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }).map((_, i) => {
              const day = i + 1
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const calendarDay = data?.calendar.find(c => c.date === dateStr)
              const isToday = day === today.getDate()
              const isFuture = day > today.getDate()
              
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                    isFuture
                      ? 'text-gray-200'
                      : calendarDay?.checked
                      ? 'bg-amber-100 text-amber-600 font-semibold'
                      : isToday
                      ? 'border-2 border-amber-400 text-gray-600'
                      : 'text-gray-400'
                  }`}
                >
                  {calendarDay?.checked ? '✓' : day}
                </div>
              )
            })}
          </div>
        </div>

        {/* 签到奖励 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🎁 签到奖励</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { days: 7, points: 50, icon: '🌟' },
              { days: 14, points: 100, icon: '💫' },
              { days: 30, points: 300, icon: '💎' },
              { days: 60, points: 600, icon: '👑' },
              { days: 100, points: 1000, icon: '🏆' },
              { days: 365, points: 5000, icon: '🎉' },
            ].map((bonus) => {
              const achieved = (data?.stats.currentStreak || 0) >= bonus.days
              return (
                <div
                  key={bonus.days}
                  className={`p-3 rounded-xl border-2 ${
                    achieved
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-2xl text-center mb-1">{bonus.icon}</div>
                  <div className="text-center font-semibold text-gray-800">
                    {bonus.days}天
                  </div>
                  <div className="text-center text-sm text-amber-600">
                    +{bonus.points}积分
                  </div>
                  {achieved && (
                    <div className="text-center text-xs text-green-500 mt-1">已达成 ✓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 最近签到记录 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📝 最近签到</h2>
          <div className="space-y-3">
            {data?.records.slice(-10).reverse().map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">📅</div>
                  <div>
                    <div className="font-medium text-gray-800">{record.date}</div>
                    <div className="text-sm text-gray-500">
                      连续第 {record.continuousDays} 天
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-amber-500">+{record.points}</div>
                  {record.bonus && (
                    <div className="text-xs text-green-500">{record.bonus}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}