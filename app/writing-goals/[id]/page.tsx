'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface WritingGoal {
  id: string
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
  progressPercentage?: number
  daysRemaining?: number
  dailyRequired?: number
  isOnTrack?: boolean
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

export default function WritingGoalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [goal, setGoal] = useState<WritingGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    target: 0
  })

  useEffect(() => {
    fetchGoal()
  }, [params.id])

  const fetchGoal = async () => {
    try {
      const res = await fetch(`/api/writing-goals/${params.id}`)
      const data = await res.json()
      if (data.success) {
        setGoal(data.data)
        setEditData({
          title: data.data.title,
          description: data.data.description || '',
          target: data.data.target
        })
      }
    } catch (error) {
      console.error('获取目标失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (increment: number) => {
    if (!goal) return
    
    try {
      const res = await fetch(`/api/writing-goals/${goal.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment })
      })
      const data = await res.json()
      if (data.success) {
        setGoal(data.data)
        if (data.reachedMilestones?.length > 0) {
          alert(data.message)
        }
      }
    } catch (error) {
      console.error('更新进度失败:', error)
    }
  }

  const updateGoal = async () => {
    if (!goal) return
    
    try {
      const res = await fetch(`/api/writing-goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      const data = await res.json()
      if (data.success) {
        setGoal(data.data)
        setShowEditForm(false)
      }
    } catch (error) {
      console.error('更新目标失败:', error)
    }
  }

  const deleteGoal = async () => {
    if (!goal || !confirm('确定要删除这个目标吗？')) return
    
    try {
      const res = await fetch(`/api/writing-goals/${goal.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/writing-goals')
      }
    } catch (error) {
      console.error('删除目标失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
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

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">目标不存在</h2>
          <Link href="/writing-goals" className="text-indigo-600 hover:underline">
            返回目标列表
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = goal.progressPercentage || Math.round((goal.currentProgress / goal.target) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/writing-goals" className="text-gray-600 hover:text-indigo-600">
              ← 返回列表
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                编辑
              </button>
              <button
                onClick={deleteGoal}
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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl">
              🎯
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{goal.title}</h1>
              {goal.description && (
                <p className="text-gray-600">{goal.description}</p>
              )}
              <div className="flex gap-3 mt-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {typeLabels[goal.type]}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {goal.target} {unitLabels[goal.unit]}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  goal.status === 'active' ? 'bg-green-100 text-green-700' :
                  goal.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  goal.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {goal.status === 'active' ? '进行中' :
                   goal.status === 'completed' ? '已完成' :
                   goal.status === 'paused' ? '已暂停' : '已失败'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">当前进度</h2>
          
          {/* Large Progress Display */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {progressPercentage}%
            </div>
            <div className="text-gray-500 mt-2">
              {goal.currentProgress} / {goal.target} {unitLabels[goal.unit]}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">
                {Math.max(0, goal.target - goal.currentProgress)}
              </div>
              <div className="text-sm text-gray-500">剩余 {unitLabels[goal.unit]}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">
                {goal.daysRemaining || '-'}
              </div>
              <div className="text-sm text-gray-500">剩余天数</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">
                {goal.dailyRequired || '-'}
              </div>
              <div className="text-sm text-gray-500">每日所需</div>
            </div>
          </div>

          {/* Quick Progress Buttons */}
          {goal.status === 'active' && (
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-3">快速记录进度:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateProgress(1)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  +1 {unitLabels[goal.unit]}
                </button>
                <button
                  onClick={() => updateProgress(5)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  +5 {unitLabels[goal.unit]}
                </button>
                <button
                  onClick={() => updateProgress(10)}
                  className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                >
                  +10 {unitLabels[goal.unit]}
                </button>
                <button
                  onClick={() => updateProgress(50)}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  +50 {unitLabels[goal.unit]}
                </button>
                <button
                  onClick={() => updateProgress(100)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  +100 {unitLabels[goal.unit]}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Milestones Section */}
        {goal.milestones && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">里程碑</h2>
            <div className="grid grid-cols-4 gap-4">
              {goal.milestones.map(milestone => (
                <div
                  key={milestone.id}
                  className={`text-center p-4 rounded-xl ${
                    milestone.reachedAt
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`text-2xl mb-2 ${milestone.reachedAt ? '' : 'grayscale opacity-50'}`}>
                    {milestone.percentage === 25 ? '🌱' :
                     milestone.percentage === 50 ? '🌿' :
                     milestone.percentage === 75 ? '🌳' : '🏆'}
                  </div>
                  <div className={`font-semibold ${milestone.reachedAt ? 'text-green-700' : 'text-gray-500'}`}>
                    {milestone.percentage}%
                  </div>
                  {milestone.reachedAt && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ {new Date(milestone.reachedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Section */}
        {goal.rewards && goal.rewards.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">获得的奖励</h2>
            <div className="flex flex-wrap gap-3">
              {goal.rewards.map(reward => (
                <div
                  key={reward.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
                >
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <div className="font-medium text-yellow-800">{reward.name}</div>
                    {reward.description && (
                      <div className="text-xs text-yellow-600">{reward.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">时间线</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-gray-500">创建于 {new Date(goal.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-500">开始日期 {new Date(goal.startDate).toLocaleDateString()}</span>
            </div>
            {goal.endDate && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-500">截止日期 {new Date(goal.endDate).toLocaleDateString()}</span>
              </div>
            )}
            {goal.status === 'completed' && goal.completedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">
                  完成于 {new Date(goal.completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">编辑目标</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目标名称</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目标数量</label>
                <input
                  type="number"
                  value={editData.target}
                  onChange={e => setEditData({ ...editData, target: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                onClick={updateGoal}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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