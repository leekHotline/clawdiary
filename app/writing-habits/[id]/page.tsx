'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Habit {
  id: string
  name: string
  description?: string
  icon: string
  frequency: 'daily' | 'weekly'
  targetDays?: number[]
  reminder?: string
  color: string
  createdAt: string
  isActive: boolean
  streak?: number
  totalCompletions?: number
}

interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  note?: string
  completedAt?: string
}

const dayLabels = ['日', '一', '二', '三', '四', '五', '六']

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' }
}

export default function WritingHabitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [habit, setHabit] = useState<Habit | null>(null)
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    reminder: ''
  })

  useEffect(() => {
    fetchHabit()
  }, [params.id])

  const fetchHabit = async () => {
    try {
      const [habitRes, logsRes] = await Promise.all([
        fetch(`/api/writing-habits/${params.id}`),
        fetch(`/api/writing-habits/log?habitId=${params.id}`)
      ])
      
      const habitData = await habitRes.json()
      const logsData = await logsRes.json()
      
      if (habitData.success) {
        setHabit(habitData.data)
        setEditData({
          name: habitData.data.name,
          description: habitData.data.description || '',
          reminder: habitData.data.reminder || ''
        })
      }
      
      if (logsData.success) {
        setLogs(logsData.data)
      }
    } catch (_error) {
      console.error('获取习惯失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLog = async (date: string) => {
    try {
      const res = await fetch('/api/writing-habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId: params.id,
          date,
          completed: true
        })
      })
      const data = await res.json()
      if (data.success) {
        fetchHabit()
      }
    } catch (_error) {
      console.error('更新日志失败:', _error)
    }
  }

  const updateHabit = async () => {
    if (!habit) return
    
    try {
      const res = await fetch(`/api/writing-habits/${habit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      const data = await res.json()
      if (data.success) {
        setHabit(data.data)
        setShowEditForm(false)
      }
    } catch (_error) {
      console.error('更新习惯失败:', _error)
    }
  }

  const deleteHabit = async () => {
    if (!habit || !confirm('确定要删除这个习惯吗？所有记录将被删除。')) return
    
    try {
      const res = await fetch(`/api/writing-habits/${habit.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/writing-habits')
      }
    } catch (_error) {
      console.error('删除习惯失败:', _error)
    }
  }

  // 生成日历数据
  const generateCalendar = () => {
    const today = new Date()
    const calendar = []
    
    for (let week = 0; week < 5; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date(today)
        date.setDate(today.getDate() - (today.getDay() - day) - (week * 7))
        const dateStr = date.toISOString().split('T')[0]
        const log = logs.find(l => l.date === dateStr)
        
        weekData.push({
          date: dateStr,
          day: date.getDate(),
          isToday: dateStr === today.toISOString().split('T')[0],
          isFuture: date > today,
          completed: log?.completed || false
        })
      }
      calendar.push(weekData.reverse())
    }
    
    return calendar.reverse()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">习惯不存在</h2>
          <Link href="/writing-habits" className="text-orange-600 hover:underline">
            返回习惯列表
          </Link>
        </div>
      </div>
    )
  }

  const colors = colorClasses[habit.color] || colorClasses.indigo
  const calendar = generateCalendar()
  const completedDays = logs.filter(l => l.completed).length
  const thisMonthLogs = logs.filter(l => {
    const logDate = new Date(l.date)
    const now = new Date()
    return l.completed && logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/writing-habits" className="text-gray-600 hover:text-orange-600">
              ← 返回列表
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                编辑
              </button>
              <button
                onClick={deleteHabit}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Title Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center text-3xl`}>
              {habit.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{habit.name}</h1>
              {habit.description && (
                <p className="text-gray-600">{habit.description}</p>
              )}
              <div className="flex gap-3 mt-3">
                <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm`}>
                  {habit.frequency === 'daily' ? '每日习惯' : '每周习惯'}
                </span>
                {habit.reminder && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    ⏰ {habit.reminder}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-orange-600">{habit.streak || 0}</div>
            <div className="text-sm text-gray-500">当前连续</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-pink-600">{completedDays}</div>
            <div className="text-sm text-gray-500">总完成天数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600">{thisMonthLogs}</div>
            <div className="text-sm text-gray-500">本月完成</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 日历视图</h2>
          
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="space-y-1">
            {calendar.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIdx) => (
                  <button
                    key={dayIdx}
                    onClick={() => !day.isFuture && toggleLog(day.date)}
                    disabled={day.isFuture}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      day.isFuture
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : day.isToday
                        ? day.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-orange-100 text-orange-700 ring-2 ring-orange-400'
                        : day.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>已完成</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-orange-100 ring-2 ring-orange-400"></div>
              <span>今天</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-50"></div>
              <span>未完成</span>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📝 最近记录</h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              还没有记录，开始追踪你的习惯吧！
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 10).map(log => (
                <div
                  key={log.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    log.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{log.completed ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {new Date(log.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </div>
                    {log.note && (
                      <div className="text-sm text-gray-500">{log.note}</div>
                    )}
                  </div>
                  {log.completedAt && (
                    <div className="text-xs text-gray-400">
                      {new Date(log.completedAt).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">💡 关于这个习惯</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 创建于 {new Date(habit.createdAt).toLocaleDateString('zh-CN')}</li>
            <li>• {habit.frequency === 'daily' ? '每天' : '每周'}完成一次</li>
            {habit.reminder && <li>• 提醒时间：{habit.reminder}</li>}
            <li>• 点击日历中的日期可以切换完成状态</li>
          </ul>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">编辑习惯</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">习惯名称</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">提醒时间</label>
                <input
                  type="time"
                  value={editData.reminder}
                  onChange={e => setEditData({ ...editData, reminder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={updateHabit}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}