'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Feedback {
  id: string
  userId: string
  userName: string
  type: 'bug' | 'feature' | 'improvement' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  content: string
  status: 'pending' | 'reviewing' | 'in_progress' | 'resolved' | 'closed'
  votes: number
  comments: FeedbackComment[]
  tags: string[]
  createdAt: string
}

interface FeedbackComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface FeedbackData {
  feedbacks: Feedback[]
  stats: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
  }
  types: { id: string; name: string; icon: string }[]
  statuses: { id: string; name: string; color: string }[]
}

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'priority'>('votes')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'feature',
    priority: 'medium',
    title: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    fetchData()
  }, [activeType, activeStatus, sortBy])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (activeType !== 'all') params.set('type', activeType)
      if (activeStatus !== 'all') params.set('status', activeStatus)
      params.set('sort', sortBy)
      
      const res = await fetch(`/api/feedback?${params}`)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        })
      })
      const json = await res.json()
      if (json.success) {
        setShowForm(false)
        setForm({ type: 'feature', priority: 'medium', title: '', content: '', tags: '' })
        fetchData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleVote = async (feedbackId: string) => {
    try {
      await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId, action: 'vote' })
      })
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const getTypeIcon = (type: string) => {
    const t = data?.types.find(t => t.id === type)
    return t?.icon || '💬'
  }

  const getTypeName = (type: string) => {
    const t = data?.types.find(t => t.id === type)
    return t?.name || '其他'
  }

  const getStatusColor = (status: string) => {
    const s = data?.statuses.find(s => s.id === status)
    const colors: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
    }
    return colors[s?.color || 'gray'] || colors.gray
  }

  const getStatusName = (status: string) => {
    const s = data?.statuses.find(s => s.id === status)
    return s?.name || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-400',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500',
    }
    return colors[priority] || colors.medium
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / 86400000)
    
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-2xl">🦞</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">💬 用户反馈</h1>
            <p className="text-gray-600 mt-1">你的建议让产品更好</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            + 提交反馈
          </button>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-gray-800">{data?.stats.total || 0}</div>
            <div className="text-sm text-gray-500">总反馈</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-red-500">{data?.stats.byType.bug || 0}</div>
            <div className="text-sm text-gray-500">问题报告</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-500">{data?.stats.byType.feature || 0}</div>
            <div className="text-sm text-gray-500">功能建议</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-500">{data?.stats.byStatus.resolved || 0}</div>
            <div className="text-sm text-gray-500">已解决</div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {data?.types.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeType === type.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">排序：</span>
            {[
              { id: 'votes', name: '最多投票' },
              { id: 'newest', name: '最新发布' },
              { id: 'priority', name: '优先级' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`px-3 py-1 rounded text-sm ${
                  sortBy === s.id
                    ? 'text-purple-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* 反馈列表 */}
        <div className="space-y-4">
          {data?.feedbacks.map((feedback) => (
            <Link
              key={feedback.id}
              href={`/feedback/${feedback.id}`}
              className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* 投票 */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleVote(feedback.id)
                    }}
                    className="p-2 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-500"
                  >
                    ▲
                  </button>
                  <span className="font-bold text-gray-800">{feedback.votes}</span>
                </div>
                
                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(feedback.type)}</span>
                    <span className="font-semibold text-gray-800">{feedback.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(feedback.status)}`}>
                      {getStatusName(feedback.status)}
                    </span>
                    <span className={`text-xs ${getPriorityColor(feedback.priority)}`}>
                      {feedback.priority === 'urgent' ? '🔴' : feedback.priority === 'high' ? '🟠' : feedback.priority === 'medium' ? '🔵' : '⚪'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{feedback.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{feedback.userName}</span>
                    <span>{formatDate(feedback.createdAt)}</span>
                    <span>💬 {feedback.comments.length}</span>
                    {feedback.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 提交表单弹窗 */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">提交反馈</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="bug">🐛 问题报告</option>
                      <option value="feature">💡 功能建议</option>
                      <option value="improvement">⬆️ 改进意见</option>
                      <option value="other">💬 其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                      <option value="urgent">紧急</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="简要描述你的建议或问题"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full p-2 border rounded-lg h-32"
                    placeholder="请详细描述..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="例如：编辑器, 用户体验"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  提交反馈
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}