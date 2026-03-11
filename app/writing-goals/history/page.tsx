'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HistoryEntry {
  id: string
  goalId: string
  goalTitle: string
  action: 'created' | 'updated' | 'completed' | 'paused' | 'resumed' | 'milestone' | 'reward'
  increment?: number
  milestonePercentage?: number
  rewardName?: string
  timestamp: string
}

interface Goal {
  id: string
  title: string
  type: string
  status: string
}

const actionLabels: Record<string, string> = {
  created: '创建目标',
  updated: '更新进度',
  completed: '完成目标',
  paused: '暂停目标',
  resumed: '恢复目标',
  milestone: '达到里程碑',
  reward: '获得奖励'
}

const actionColors: Record<string, string> = {
  created: 'bg-green-100 text-green-700 border-green-200',
  updated: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-purple-100 text-purple-700 border-purple-200',
  paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  resumed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  milestone: 'bg-orange-100 text-orange-700 border-orange-200',
  reward: 'bg-pink-100 text-pink-700 border-pink-200'
}

const actionIcons: Record<string, string> = {
  created: '🎯',
  updated: '📈',
  completed: '🏆',
  paused: '⏸️',
  resumed: '▶️',
  milestone: '🚩',
  reward: '🎁'
}

const typeLabels: Record<string, string> = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
  custom: '自定义'
}

export default function WritingGoalsHistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'created' | 'updated' | 'completed' | 'milestone' | 'reward'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')

  useEffect(() => {
    fetchData()
  }, [filter, dateRange])

  const fetchData = async () => {
    try {
      const [historyRes, goalsRes] = await Promise.all([
        fetch('/api/writing-goals/history'),
        fetch('/api/writing-goals')
      ])
      
      const historyData = await historyRes.json()
      const goalsData = await goalsRes.json()
      
      if (historyData.success) {
        let filtered = historyData.data
        
        // 按动作过滤
        if (filter !== 'all') {
          filtered = filtered.filter((h: HistoryEntry) => h.action === filter)
        }
        
        // 按时间过滤
        const now = new Date()
        if (dateRange === 'today') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          filtered = filtered.filter((h: HistoryEntry) => new Date(h.timestamp) >= today)
        } else if (dateRange === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((h: HistoryEntry) => new Date(h.timestamp) >= weekAgo)
        } else if (dateRange === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((h: HistoryEntry) => new Date(h.timestamp) >= monthAgo)
        }
        
        setHistory(filtered)
      }
      
      if (goalsData.success) {
        setGoals(goalsData.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGoalInfo = (goalId: string) => {
    return goals.find(g => g.id === goalId)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
    
    return date.toLocaleDateString()
  }

  const groupByDate = (entries: HistoryEntry[]) => {
    const groups: Record<string, HistoryEntry[]> = {}
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
      
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(entry)
    })
    
    return groups
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const groupedHistory = groupByDate(history)
  const stats = {
    total: history.length,
    created: history.filter(h => h.action === 'created').length,
    completed: history.filter(h => h.action === 'completed').length,
    milestones: history.filter(h => h.action === 'milestone').length,
    rewards: history.filter(h => h.action === 'reward').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/writing-goals" className="text-gray-600 hover:text-indigo-600">
                ← 返回目标
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📜 历史记录
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">总记录</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.created}</div>
            <div className="text-xs text-gray-500">创建</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-xs text-gray-500">完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.milestones}</div>
            <div className="text-xs text-gray-500">里程碑</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.rewards}</div>
            <div className="text-xs text-gray-500">奖励</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 bg-white rounded-xl p-3 shadow-sm">
          <div className="flex gap-1 flex-wrap">
            {(['all', 'created', 'updated', 'completed', 'milestone', 'reward'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? '全部' : actionLabels[f]}
              </button>
            ))}
          </div>
          
          <div className="border-l border-gray-200 mx-2"></div>
          
          <div className="flex gap-1">
            {(['today', 'week', 'month', 'all'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  dateRange === d
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {d === 'all' ? '全部时间' : d === 'today' ? '今天' : d === 'week' ? '本周' : '本月'}
              </button>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-gray-500 text-lg">暂无历史记录</p>
            <p className="text-gray-400 text-sm mt-2">创建目标后，这里会显示你的进度记录</p>
            <Link
              href="/writing-goals"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              创建目标
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">{date}</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {entries.map((entry, index) => {
                    const goal = getGoalInfo(entry.goalId)
                    return (
                      <div
                        key={entry.id}
                        className={`p-4 flex items-start gap-4 ${
                          index !== entries.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                          {actionIcons[entry.action]}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${actionColors[entry.action]}`}>
                              {actionLabels[entry.action]}
                            </span>
                            <Link
                              href={`/writing-goals/${entry.goalId}`}
                              className="font-medium text-gray-800 hover:text-indigo-600 truncate"
                            >
                              {entry.goalTitle}
                            </Link>
                          </div>
                          
                          <div className="text-sm text-gray-500 mt-1">
                            {entry.action === 'updated' && entry.increment && (
                              <span>+{entry.increment} 进度</span>
                            )}
                            {entry.action === 'milestone' && entry.milestonePercentage && (
                              <span>达到 {entry.milestonePercentage}% 里程碑 🎉</span>
                            )}
                            {entry.action === 'reward' && entry.rewardName && (
                              <span>获得「{entry.rewardName}」奖励</span>
                            )}
                            {entry.action === 'completed' && (
                              <span>恭喜完成目标！</span>
                            )}
                          </div>
                          
                          {goal && (
                            <div className="text-xs text-gray-400 mt-1">
                              {typeLabels[goal.type] || goal.type} · 
                              {goal.status === 'active' ? '进行中' : 
                               goal.status === 'completed' ? '已完成' :
                               goal.status === 'paused' ? '已暂停' : goal.status}
                            </div>
                          )}
                        </div>
                        
                        {/* Time */}
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTime(entry.timestamp)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {history.length >= 20 && (
          <div className="text-center">
            <button className="px-6 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              加载更多
            </button>
          </div>
        )}
      </main>
    </div>
  )
}