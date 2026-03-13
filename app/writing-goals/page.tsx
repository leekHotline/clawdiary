'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WritingGoal {
  id: string
  userId: string
  title: string
  description?: string
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  target: number
  unit: 'words' | 'entries' | 'minutes' | 'pages'
  startDate: string
  endDate?: string
  currentProgress: number
  status: 'active' | 'completed' | 'paused' | 'failed'
  createdAt: string
  updatedAt: string
  milestones?: Milestone[]
  rewards?: Reward[]
}

interface Milestone {
  id: string
  percentage: number
  reachedAt?: string
  celebrated: boolean
}

interface Reward {
  id: string
  name: string
  description?: string
  icon: string
  unlockedAt?: string
}

interface Stats {
  overview: {
    totalGoals: number
    activeGoals: number
    completedGoals: number
    pausedGoals: number
    failedGoals: number
  }
  progress: {
    totalProgress: number
    totalTarget: number
    averageCompletion: number
    highestCompletion: number
    lowestCompletion: number
  }
  byType: Record<string, { count: number; completed: number; avgProgress: number }>
  byUnit: Record<string, { count: number; total: number; target: number }>
}

const typeLabels: Record<string, string> = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
  custom: '自定义'
}

const unitLabels: Record<string, string> = {
  words: '字',
  entries: '篇',
  minutes: '分钟',
  pages: '页'
}

const typeColors: Record<string, string> = {
  daily: 'bg-green-100 text-green-800 border-green-200',
  weekly: 'bg-blue-100 text-blue-800 border-blue-200',
  monthly: 'bg-purple-100 text-purple-800 border-purple-200',
  yearly: 'bg-orange-100 text-orange-800 border-orange-200',
  custom: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  paused: 'bg-yellow-500',
  failed: 'bg-red-500'
}

export default function WritingGoalsPage() {
  const [goals, setGoals] = useState<WritingGoal[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all')
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'daily' as WritingGoal['type'],
    target: 100,
    unit: 'words' as WritingGoal['unit'],
    endDate: ''
  })

  useEffect(() => {
    fetchGoals()
    fetchStats()
  }, [])

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/writing-goals')
      const data = await res.json()
      if (data.success) {
        setGoals(data.data)
      }
    } catch (_error) {
      console.error('获取目标失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/writing-goals/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (_error) {
      console.error('获取统计失败:', _error)
    }
  }

  const createGoal = async () => {
    if (!newGoal.title.trim()) return

    try {
      const res = await fetch('/api/writing-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      })
      const data = await res.json()
      if (data.success) {
        setGoals([...goals, data.data])
        setShowCreateForm(false)
        setNewGoal({
          title: '',
          description: '',
          type: 'daily',
          target: 100,
          unit: 'words',
          endDate: ''
        })
        fetchStats()
      }
    } catch (_error) {
      console.error('创建目标失败:', _error)
    }
  }

  const updateProgress = async (goalId: string, increment: number) => {
    try {
      const res = await fetch(`/api/writing-goals/${goalId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment })
      })
      const data = await res.json()
      if (data.success) {
        setGoals(goals.map(g => g.id === goalId ? data.data : g))
        fetchStats()
        
        if (data.reachedMilestones?.length > 0) {
          alert(data.message)
        }
      }
    } catch (_error) {
      console.error('更新进度失败:', _error)
    }
  }

  const toggleStatus = async (goalId: string, newStatus: 'active' | 'paused') => {
    try {
      const res = await fetch(`/api/writing-goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        setGoals(goals.map(g => g.id === goalId ? data.data : g))
        fetchStats()
      }
    } catch (_error) {
      console.error('更新状态失败:', _error)
    }
  }

  const deleteGoal = async (goalId: string) => {
    if (!confirm('确定要删除这个目标吗？')) return
    
    try {
      const res = await fetch(`/api/writing-goals/${goalId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setGoals(goals.filter(g => g.id !== goalId))
        fetchStats()
      }
    } catch (_error) {
      console.error('删除目标失败:', _error)
    }
  }

  const getProgressPercentage = (goal: WritingGoal) => {
    return Math.min(100, Math.round((goal.currentProgress / goal.target) * 100))
  }

  const filteredGoals = goals.filter(g => filter === 'all' || g.status === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-indigo-600">
                ← 返回首页
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🎯 写作目标
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              + 新建目标
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">{stats.overview.totalGoals}</div>
              <div className="text-sm text-gray-500">总目标</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600">{stats.overview.activeGoals}</div>
              <div className="text-sm text-gray-500">进行中</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600">{stats.overview.completedGoals}</div>
              <div className="text-sm text-gray-500">已完成</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600">{stats.progress.averageCompletion}%</div>
              <div className="text-sm text-gray-500">平均进度</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600">{stats.progress.totalProgress}</div>
              <div className="text-sm text-gray-500">总进度</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
          {(['all', 'active', 'completed', 'paused'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? '全部' : f === 'active' ? '进行中' : f === 'completed' ? '已完成' : '已暂停'}
            </button>
          ))}
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg">
                {filter === 'all' ? '还没有写作目标，创建一个开始追踪你的写作进度吧！' : '暂无此类型的目标'}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  创建第一个目标
                </button>
              )}
            </div>
          ) : (
            filteredGoals.map(goal => (
              <div
                key={goal.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${typeColors[goal.type]}`}>
                        {typeLabels[goal.type]}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${statusColors[goal.status]}`}></span>
                    </div>
                    {goal.description && (
                      <p className="text-gray-500 text-sm">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {goal.status === 'active' && (
                      <button
                        onClick={() => toggleStatus(goal.id, 'paused')}
                        className="text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded-lg text-sm"
                      >
                        暂停
                      </button>
                    )}
                    {goal.status === 'paused' && (
                      <button
                        onClick={() => toggleStatus(goal.id, 'active')}
                        className="text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg text-sm"
                      >
                        继续
                      </button>
                    )}
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      进度: {goal.currentProgress} / {goal.target} {unitLabels[goal.unit]}
                    </span>
                    <span className="font-medium text-indigo-600">{getProgressPercentage(goal)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                {goal.milestones && (
                  <div className="flex gap-2 mb-4">
                    {goal.milestones.map(m => (
                      <div
                        key={m.id}
                        className={`px-3 py-1 rounded-full text-xs ${
                          m.reachedAt
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {m.percentage}% {m.reachedAt && '✓'}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                {goal.status === 'active' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                    >
                      +1 {unitLabels[goal.unit]}
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 5)}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                    >
                      +5 {unitLabels[goal.unit]}
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 10)}
                      className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200 transition-colors"
                    >
                      +10 {unitLabels[goal.unit]}
                    </button>
                  </div>
                )}

                {/* Rewards */}
                {goal.rewards && goal.rewards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">获得的奖励:</div>
                    <div className="flex gap-2">
                      {goal.rewards.map(r => (
                        <div
                          key={r.id}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full text-sm"
                        >
                          <span>{r.icon}</span>
                          <span className="text-yellow-700">{r.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">创建写作目标</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标名称 *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="例如：每天写500字"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={newGoal.description}
                    onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="目标的详细描述..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">目标类型</label>
                    <select
                      value={newGoal.type}
                      onChange={e => setNewGoal({ ...newGoal, type: e.target.value as WritingGoal['type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="daily">每日</option>
                      <option value="weekly">每周</option>
                      <option value="monthly">每月</option>
                      <option value="yearly">每年</option>
                      <option value="custom">自定义</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                    <select
                      value={newGoal.unit}
                      onChange={e => setNewGoal({ ...newGoal, unit: e.target.value as WritingGoal['unit'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="words">字数</option>
                      <option value="entries">篇数</option>
                      <option value="minutes">分钟</option>
                      <option value="pages">页数</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标数量 *</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={e => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min={1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                  <input
                    type="date"
                    value={newGoal.endDate}
                    onChange={e => setNewGoal({ ...newGoal, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  onClick={createGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建目标
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}