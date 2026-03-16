'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface WritingGoal {
  id: string
  title: string
  type: 'daily' | 'weekly' | 'monthly'
  target: number
  unit: 'words' | 'entries' | 'minutes'
  progress: number
  createdAt: string
}

export default function WritingGoalsDetailPage({ params }: { params: { id: string } }) {
  // 使用 useMemo 从 localStorage 读取初始值
  const initialGoal = useMemo(() => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem('writing-goals')
    if (saved) {
      const goals = JSON.parse(saved)
      return goals.find((g: WritingGoal) => g.id === params.id) || null
    }
    return null
  }, [params.id])

  const [goal, setGoal] = useState<WritingGoal | null>(initialGoal)
  // 使用惰性初始化从 localStorage 读取，避免 useEffect 中的同步 setState
  const [history, setHistory] = useState<{ date: string; value: number }[]>(() => {
    if (typeof window === 'undefined') return []
    const historyKey = `goal-history-${params.id}`
    const historyData = localStorage.getItem(historyKey)
    return historyData ? JSON.parse(historyData) : []
  })
  const [notes, setNotes] = useState<{ date: string; note: string }[]>(() => {
    if (typeof window === 'undefined') return []
    const notesKey = `goal-notes-${params.id}`
    const notesData = localStorage.getItem(notesKey)
    return notesData ? JSON.parse(notesData) : []
  })

  const getProgressPercentage = () => {
    if (!goal) return 0
    return Math.min((goal.progress / goal.target) * 100, 100)
  }

  const getDaysInPeriod = () => {
    if (!goal) return 1
    switch (goal.type) {
      case 'daily': return 1
      case 'weekly': return 7
      case 'monthly': return 30
      default: return 1
    }
  }

  const getAveragePerDay = () => {
    if (!goal || history.length === 0) return 0
    const total = history.reduce((acc, h) => acc + h.value, 0)
    return (total / history.length).toFixed(1)
  }

  const getBestDay = () => {
    if (history.length === 0) return null
    return history.reduce((best, current) => 
      current.value > best.value ? current : best
    )
  }

  const getWeekData = () => {
    const today = new Date()
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const historyEntry = history.find(h => h.date === dateStr)
      data.push({
        date,
        value: historyEntry?.value || 0
      })
    }
    return data
  }

  const formatUnit = (value: number) => {
    if (!goal) return value
    switch (goal.unit) {
      case 'words': return `${value} 字`
      case 'entries': return `${value} 篇`
      case 'minutes': return `${value} 分钟`
      default: return value
    }
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">目标未找到</h1>
          <Link
            href="/writing-goals"
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            返回目标列表
          </Link>
        </div>
      </div>
    )
  }

  const weekData = getWeekData()
  const maxValue = Math.max(...weekData.map(d => d.value), goal.target / getDaysInPeriod())
  const bestDay = getBestDay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/writing-goals"
            className="p-2 bg-white/80 rounded-lg hover:bg-white transition"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 目标详情</h1>
            <p className="text-gray-600">{goal.title}</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500 uppercase">
                {goal.type === 'daily' ? '每日' : goal.type === 'weekly' ? '每周' : '每月'}目标
              </span>
              <div className="text-3xl font-bold text-indigo-600">
                {formatUnit(goal.progress)} / {formatUnit(goal.target)}
              </div>
            </div>
            <div className={`text-4xl ${getProgressPercentage() >= 100 ? 'text-green-500' : 'text-indigo-400'}`}>
              {getProgressPercentage() >= 100 ? '🎉' : '📝'}
            </div>
          </div>

          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                getProgressPercentage() >= 100 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-500'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="text-right text-sm text-gray-500 mt-2">
            {getProgressPercentage().toFixed(1)}% 完成
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">日均</div>
            <div className="text-2xl font-bold text-purple-500">
              {formatUnit(Number(getAveragePerDay()))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">最佳记录</div>
            <div className="text-2xl font-bold text-pink-500">
              {bestDay ? formatUnit(bestDay.value) : '-'}
            </div>
          </div>
        </div>

        {/* Week Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 本周趋势</h3>
          <div className="flex items-end justify-between h-32">
            {weekData.map((day, index) => {
              const height = (day.value / maxValue) * 100
              const isToday = day.date.toDateString() === new Date().toDateString()
              const isAboveTarget = day.value >= goal.target / getDaysInPeriod()
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-400 mb-1">
                    {day.value > 0 ? day.value : ''}
                  </div>
                  <div 
                    className={`w-6 rounded-t-lg transition-all ${
                      isAboveTarget 
                        ? 'bg-gradient-to-t from-green-400 to-emerald-500'
                        : 'bg-gradient-to-t from-indigo-400 to-purple-500'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <div className={`text-xs mt-2 ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>
                    {['日', '一', '二', '三', '四', '五', '六'][day.date.getDay()]}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Target Line */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-0.5 bg-red-300" />
            <span>日均目标: {formatUnit(Math.round(goal.target / getDaysInPeriod()))}</span>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 历史记录</h3>
          {history.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.slice().reverse().slice(0, 14).map((entry, index) => {
                const note = notes.find(n => n.date === entry.date)
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{formatUnit(entry.value)}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(entry.date).toLocaleDateString('zh-CN')}
                      </span>
                      {note && (
                        <p className="text-sm text-gray-400 mt-1">{note.note}</p>
                      )}
                    </div>
                    <span className={`text-sm ${
                      entry.value >= goal.target / getDaysInPeriod()
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}>
                      {entry.value >= goal.target / getDaysInPeriod() ? '✓' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              暂无历史记录
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
          <h3 className="font-bold mb-2">💡 写作技巧</h3>
          <ul className="text-sm space-y-1 opacity-90">
            <li>• 设定固定的写作时间，养成习惯</li>
            <li>• 不要追求完美，先完成再完善</li>
            <li>• 记录灵感，随时扩充成完整文章</li>
            <li>• 休息也是创作的一部分</li>
          </ul>
        </div>
      </div>
    </div>
  )
}