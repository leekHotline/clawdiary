'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  icon: string
  frequency: 'daily' | 'weekly'
  targetDays?: number[] // 0-6 for daily habits
  reminder?: string
  color: string
  createdAt: string
  isActive: boolean
}

interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  note?: string
  completedAt?: string
}

interface HabitStats {
  totalHabits: number
  activeHabits: number
  currentStreak: number
  longestStreak: number
  todayCompleted: number
  todayTotal: number
  weekCompleted: number
  weekTotal: number
  completionRate: number
}

const defaultIcons = ['✍️', '📝', '📖', '📚', '💡', '🌅', '🌙', '🎯', '⭐', '🔥']
const defaultColors = ['indigo', 'purple', 'pink', 'blue', 'green', 'orange', 'red', 'teal']

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

const dayLabels = ['日', '一', '二', '三', '四', '五', '六']

export default function WritingHabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [stats, setStats] = useState<HabitStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    icon: '✍️',
    frequency: 'daily' as 'daily' | 'weekly',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    reminder: '',
    color: 'indigo'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        fetch('/api/writing-habits'),
        fetch('/api/writing-habits/stats')
      ])
      
      const habitsData = await habitsRes.json()
      const statsData = await statsRes.json()
      
      if (habitsData.success) {
        setHabits(habitsData.data)
      }
      
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const createHabit = async () => {
    if (!newHabit.name.trim()) return

    try {
      const res = await fetch('/api/writing-habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit)
      })
      const data = await res.json()
      if (data.success) {
        setHabits([...habits, data.data])
        setShowCreateForm(false)
        setNewHabit({
          name: '',
          description: '',
          icon: '✍️',
          frequency: 'daily',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          reminder: '',
          color: 'indigo'
        })
        fetchData()
      }
    } catch (error) {
      console.error('创建习惯失败:', error)
    }
  }

  const toggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const res = await fetch('/api/writing-habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habitId,
          date: selectedDate,
          completed: true
        })
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('记录习惯失败:', error)
    }
  }

  const isHabitCompletedToday = (habitId: string) => {
    const todayLogs = logs.filter(l => 
      l.habitId === habitId && 
      l.date === selectedDate && 
      l.completed
    )
    return todayLogs.length > 0
  }

  const getHabitStreak = (habitId: string) => {
    // 简化版本：从 stats 获取
    return stats?.currentStreak || 0
  }

  const getDaysOfWeek = () => {
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: dayLabels[date.getDay()],
        dayNum: date.getDate()
      })
    }
    return days
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const weekDays = getDaysOfWeek()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-orange-600">
                ← 返回首页
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                🔥 写作习惯
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              + 新建习惯
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.activeHabits}</div>
              <div className="text-sm text-gray-500">活跃习惯</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-pink-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-500">当前连续</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.longestStreak}</div>
              <div className="text-sm text-gray-500">最长连续</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.todayCompleted}/{stats.todayTotal}</div>
              <div className="text-sm text-gray-500">今日完成</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.weekCompleted}/{stats.weekTotal}</div>
              <div className="text-sm text-gray-500">本周完成</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.completionRate}%</div>
              <div className="text-sm text-gray-500">完成率</div>
            </div>
          </div>
        )}

        {/* Week Calendar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">本周概览</h3>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`p-3 rounded-xl text-center transition-all ${
                  day.date === selectedDate
                    ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white'
                    : day.date === new Date().toISOString().split('T')[0]
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-xs mb-1">{day.dayName}</div>
                <div className="text-lg font-bold">{day.dayNum}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🔥</div>
              <p className="text-gray-500 text-lg">
                还没有写作习惯，创建一个开始培养你的写作习惯吧！
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                创建第一个习惯
              </button>
            </div>
          ) : (
            habits.map(habit => {
              const colors = colorClasses[habit.color] || colorClasses.indigo
              const isCompleted = isHabitCompletedToday(habit.id)
              const streak = getHabitStreak(habit.id)
              
              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all ${
                    isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Check Button */}
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : `border-2 border-dashed ${colors.border} ${colors.text} hover:bg-gray-50`
                      }`}
                    >
                      {isCompleted ? '✓' : habit.icon}
                    </button>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold ${isCompleted ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                          {habit.name}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
                          {habit.frequency === 'daily' ? '每日' : '每周'}
                        </span>
                      </div>
                      {habit.description && (
                        <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                      )}
                      
                      {/* Target Days */}
                      {habit.frequency === 'weekly' && habit.targetDays && (
                        <div className="flex gap-1 mt-2">
                          {dayLabels.map((label, idx) => (
                            <span
                              key={idx}
                              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                                habit.targetDays?.includes(idx)
                                  ? `${colors.bg} ${colors.text}`
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Streak */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {streak}
                      </div>
                      <div className="text-xs text-gray-500">连续天</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">💡 培养习惯小贴士</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>从小开始</strong>：先设定容易完成的目标，比如每天写 100 字</li>
            <li>• <strong>固定时间</strong>：选择一个固定的时间段写作</li>
            <li>• <strong>环境线索</strong>：在特定的地点写作，形成条件反射</li>
            <li>• <strong>记录追踪</strong>：看到连续天数增加会给你动力</li>
            <li>• <strong>不要断链</strong>：即使只写一句话，也要保持习惯</li>
          </ul>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">创建写作习惯</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">习惯名称 *</label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="例如：每日写作"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={newHabit.description}
                    onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="习惯的详细描述..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">图标</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewHabit({ ...newHabit, icon })}
                        className={`w-10 h-10 rounded-lg text-xl transition-all ${
                          newHabit.icon === icon
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-8 h-8 rounded-full ${colorClasses[color]?.bg} ${
                          newHabit.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">频率</label>
                  <select
                    value={newHabit.frequency}
                    onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                  </select>
                </div>

                {newHabit.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标日期</label>
                    <div className="flex gap-2">
                      {dayLabels.map((label, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const days = newHabit.targetDays.includes(idx)
                              ? newHabit.targetDays.filter(d => d !== idx)
                              : [...newHabit.targetDays, idx]
                            setNewHabit({ ...newHabit, targetDays: days })
                          }}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            newHabit.targetDays.includes(idx)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">提醒时间（可选）</label>
                  <input
                    type="time"
                    value={newHabit.reminder}
                    onChange={e => setNewHabit({ ...newHabit, reminder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={createHabit}
                  disabled={!newHabit.name.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建习惯
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}