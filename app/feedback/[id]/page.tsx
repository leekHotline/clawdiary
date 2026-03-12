'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FeedbackDetail {
  id: string
  userId: string
  userName: string
  type: string
  priority: string
  title: string
  content: string
  status: string
  votes: number
  votedUsers: string[]
  comments: Comment[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export default function FeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    // 模拟加载详情
    const mockFeedback: FeedbackDetail = {
      id: params.id as string,
      userId: 'user_star',
      userName: '星辰大海',
      type: 'feature',
      priority: 'high',
      title: '希望支持 Markdown 编辑器',
      content: `现在的纯文本编辑器功能有限，希望能支持 Markdown 语法，这样可以用标题、列表、代码块等丰富内容。

具体需求：
1. 支持标题语法（# ## ###）
2. 支持列表（有序/无序）
3. 支持代码块
4. 支持表格
5. 支持图片插入
6. 支持链接
7. 实时预览功能

这样会让日记内容更加丰富和有组织性。`,
      status: 'in_progress',
      votes: 156,
      votedUsers: [],
      comments: [
        {
          id: 'c1',
          userId: 'admin',
          userName: '管理员',
          content: '已加入开发计划，预计下周上线！感谢你的建议。',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'c2',
          userId: 'user_1',
          userName: '星光点点',
          content: '这个功能太需要了！期待！',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'c3',
          userId: 'user_2',
          userName: '月光诗人',
          content: '建议增加代码高亮功能，这样写技术笔记会更方便。',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
      tags: ['编辑器', '用户体验', 'Markdown'],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    }
    
    setTimeout(() => {
      setFeedback(mockFeedback)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleVote = async () => {
    if (feedback) {
      setFeedback({ ...feedback, votes: feedback.votes + 1 })
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: `c_${Date.now()}`,
      userId: 'default',
      userName: '我',
      content: newComment,
      createdAt: new Date().toISOString(),
    }
    
    if (feedback) {
      setFeedback({ ...feedback, comments: [...feedback.comments, comment] })
    }
    setNewComment('')
  }

  const getTypeInfo = (type: string) => {
    const types: Record<string, { icon: string; name: string; color: string }> = {
      bug: { icon: '🐛', name: '问题报告', color: 'red' },
      feature: { icon: '💡', name: '功能建议', color: 'purple' },
      improvement: { icon: '⬆️', name: '改进意见', color: 'blue' },
      other: { icon: '💬', name: '其他', color: 'gray' },
    }
    return types[type] || types.other
  }

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, { name: string; color: string; bgColor: string }> = {
      pending: { name: '待处理', color: 'gray', bgColor: 'bg-gray-100' },
      reviewing: { name: '审核中', color: 'blue', bgColor: 'bg-blue-100' },
      in_progress: { name: '处理中', color: 'yellow', bgColor: 'bg-yellow-100' },
      resolved: { name: '已解决', color: 'green', bgColor: 'bg-green-100' },
      closed: { name: '已关闭', color: 'red', bgColor: 'bg-red-100' },
    }
    return statuses[status] || statuses.pending
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-2xl">🦞</div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-gray-500">反馈不存在</div>
          <Link href="/feedback" className="text-purple-500 mt-2 inline-block">返回列表</Link>
        </div>
      </div>
    )
  }

  const typeInfo = getTypeInfo(feedback.type)
  const statusInfo = getStatusInfo(feedback.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* 返回 */}
        <Link href="/feedback" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← 返回反馈列表
        </Link>

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* 头部 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{typeInfo.icon}</span>
              <span className={`px-2 py-1 rounded text-sm bg-${typeInfo.color}-100 text-${typeInfo.color}-600`}>
                {typeInfo.name}
              </span>
              <span className={`px-2 py-1 rounded text-sm ${statusInfo.bgColor} text-${statusInfo.color}-600`}>
                {statusInfo.name}
              </span>
              {feedback.priority === 'urgent' && (
                <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-600">🔴 紧急</span>
              )}
              {feedback.priority === 'high' && (
                <span className="px-2 py-1 rounded text-sm bg-orange-100 text-orange-600">🟠 高优先级</span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{feedback.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👤 {feedback.userName}</span>
              <span>📅 {formatDate(feedback.createdAt)}</span>
              {feedback.updatedAt !== feedback.createdAt && (
                <span>✏️ 更新于 {formatDate(feedback.updatedAt)}</span>
              )}
            </div>
          </div>
          
          {/* 内容 */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none">
              {feedback.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {feedback.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  🏷️ {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* 底部操作 */}
          <div className="px-6 py-4 bg-gray-50 flex items-center gap-4">
            <button
              onClick={handleVote}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              ▲ 投票 {feedback.votes}
            </button>
            <span className="text-gray-500">{feedback.votes} 人支持这个建议</span>
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💬 评论 ({feedback.comments.length})
          </h2>
          
          {/* 评论列表 */}
          <div className="space-y-4 mb-6">
            {feedback.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {comment.userName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{comment.userName}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 发表评论 */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
              🦞
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none"
                placeholder="写下你的想法..."
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发表评论
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 相关反馈 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">相关反馈</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: '日记模板功能', votes: 89, type: 'feature' },
              { title: '语音转文字支持', votes: 234, type: 'feature' },
              { title: '日历显示心情', votes: 34, type: 'improvement' },
            ].map((item, i) => (
              <Link
                key={i}
                href={`/feedback/fb_${i + 2}`}
                className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition"
              >
                <div className="font-medium text-gray-800 truncate">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {item.votes} 票 · {item.type === 'feature' ? '功能建议' : '改进意见'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}