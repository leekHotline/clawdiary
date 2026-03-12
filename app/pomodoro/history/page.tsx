'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PomodoroSession {
  id: string
  type: 'work' | 'shortBreak' | 'longBreak'
  duration: number
  task: string
  timestamp: string
}

interface DailyStats {
  date: string
  sessions: number
  focusTime: number
  tasks: string[]
}

export default function PomodoroHistoryPage() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [filter, setFilter] = useState<'all' | 'work' | 'break'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) {
      const allSessions = JSON.parse(saved)
      setSessions(allSessions)
      
      // Calculate daily stats
      const stats: Record<string, DailyStats> = {}
      allSessions.forEach((session: PomodoroSession) => {
        const date = new Date(session.timestamp).toDateString()
        if (!stats[date]) {
          stats[date] = {
            date,
            sessions: 0,
            focusTime: 0,
            tasks: []
          }
        }
        if (session.type === 'work') {
          stats[date].sessions++
          stats[date].focusTime += session.duration
          if (session.task && !stats[date].tasks.includes(session.task)) {
            stats[date].tasks.push(session.task)
          }
        }
      })
      
      setDailyStats(Object.values(stats).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ))
    }
  }

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7))
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getWeekStats = (weekOffset: number) => {
    const weekDates = getWeekDates(weekOffset)
    const dateStrings = weekDates.map(d => d.toDateString())
    
    return dailyStats
      .filter(stat => dateStrings.includes(stat.date))
      .reduce((acc, stat) => ({
        sessions: acc.sessions + stat.sessions,
        focusTime: acc.focusTime + stat.focusTime
      }), { sessions: 0, focusTime: 0 })
  }

  const weekDates = getWeekDates(selectedWeek)
  const weekStats = getWeekStats(selectedWeek)

  const filteredSessions = sessions.filter(s => {
    if (filter === 'all') return true
    if (filter === 'work') return s.type === 'work'
    return s.type !== 'work'
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/pomodoro"
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-2xl font-bold">📊 番茄钟历史</h1>
            <p className="text-gray-400 text-sm">查看你的专注记录</p>
          </div>
        </div>

        {/* Week Selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedWeek(prev => prev + 1)}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            ← 上周
          </button>
          <div className="text-center">
            <div className="font-medium">
              {weekDates[0].toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-sm text-gray-400">
              {selectedWeek === 0 ? '本周' : `${Math.abs(selectedWeek)}周前`}
            </div>
          </div>
          <button
            onClick={() => setSelectedWeek(prev => Math.max(0, prev - 1))}
            disabled={selectedWeek === 0}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition disabled:opacity-50"
          >
            下周 →
          </button>
        </div>

        {/* Week Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400">{weekStats.sessions}</div>
            <div className="text-gray-400">本周番茄</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400">{formatTime(weekStats.focusTime)}</div>
            <div className="text-gray-400">专注时长</div>
          </div>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {weekDates.map((date, index) => {
            const dayStats = dailyStats.find(s => s.date === date.toDateString())
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={index}
                className={`rounded-lg p-3 text-center ${
                  isToday 
                    ? 'bg-purple-500/30 border border-purple-500' 
                    : 'bg-white/5'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}
                </div>
                <div className="font-medium mb-2">{date.getDate()}</div>
                {dayStats ? (
                  <div className="text-xs">
                    <div className="text-orange-400">{dayStats.sessions}🍅</div>
                    <div className="text-green-400">{dayStats.focusTime}分</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-600">-</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'work', 'break'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === f 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {f === 'all' ? '全部' : f === 'work' ? '专注' : '休息'}
            </button>
          ))}
        </div>

        {/* Session List */}
        <div className="bg-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">📋 记录列表</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSessions.slice().reverse().slice(0, 50).map((session) => (
              <div 
                key={session.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {session.type === 'work' ? '🍅' : '☕'}
                  </span>
                  <div>
                    <div className="font-medium">
                      {session.task || (session.type === 'work' ? '专注时间' : '休息时间')}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(session.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{session.duration}分钟</div>
                  <div className="text-sm text-gray-400">
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {filteredSessions.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                暂无记录
              </div>
            )}
          </div>
        </div>

        {/* Total Stats */}
        <div className="mt-6 bg-white/5 rounded-xl p-6">
          <h3 className="font-bold mb-4">📈 总计统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {sessions.filter(s => s.type === 'work').length}
              </div>
              <div className="text-sm text-gray-400">总番茄数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {formatTime(sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0))}
              </div>
              <div className="text-sm text-gray-400">总专注时长</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{dailyStats.length}</div>
              <div className="text-sm text-gray-400">使用天数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {dailyStats.length > 0 
                  ? Math.round(sessions.filter(s => s.type === 'work').length / dailyStats.length)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-400">日均番茄</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}