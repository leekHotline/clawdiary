import { NextResponse } from 'next/server'

// 反馈类型
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
  votedUsers: string[]
  comments: FeedbackComment[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface FeedbackComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

// 模拟反馈数据
const generateFeedbacks = (): Feedback[] => [
  {
    id: 'fb_1',
    userId: 'user_star',
    userName: '星辰大海',
    type: 'feature',
    priority: 'high',
    title: '希望支持 Markdown 编辑器',
    content: '现在的纯文本编辑器功能有限，希望能支持 Markdown 语法，这样可以用标题、列表、代码块等丰富内容。',
    status: 'in_progress',
    votes: 156,
    votedUsers: [],
    comments: [
      { id: 'c1', userId: 'admin', userName: '管理员', content: '已加入开发计划，预计下周上线', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    tags: ['编辑器', '用户体验'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'fb_2',
    userId: 'user_moon',
    userName: '月光诗人',
    type: 'bug',
    priority: 'medium',
    title: '移动端图片上传失败',
    content: '在手机上上传图片时，偶尔会出现上传失败的问题，需要重试多次才能成功。',
    status: 'reviewing',
    votes: 45,
    votedUsers: [],
    comments: [],
    tags: ['移动端', '图片'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'fb_3',
    userId: 'user_forest',
    userName: '森林精灵',
    type: 'feature',
    priority: 'medium',
    title: '希望增加日记模板功能',
    content: '每天写日记时，有很多重复的内容，希望能创建日记模板，一键填充基础内容。',
    status: 'pending',
    votes: 89,
    votedUsers: [],
    comments: [],
    tags: ['模板', '效率'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'fb_4',
    userId: 'user_ocean',
    userName: '海洋之心',
    type: 'improvement',
    priority: 'low',
    title: '日历视图希望显示心情',
    content: '日历视图现在只显示是否有日记，建议能显示那天的心情，比如用不同颜色的小圆点表示。',
    status: 'pending',
    votes: 34,
    votedUsers: [],
    comments: [],
    tags: ['日历', '心情'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'fb_5',
    userId: 'user_rainbow',
    userName: '雨后彩虹',
    type: 'feature',
    priority: 'high',
    title: '希望支持语音转文字',
    content: '有时候不方便打字，希望能直接录音，然后自动转成文字，这样写日记会更方便。',
    status: 'pending',
    votes: 234,
    votedUsers: [],
    comments: [
      { id: 'c2', userId: 'user_1', userName: '星光点点', content: '这个功能太需要了！', createdAt: new Date(Date.now() - 3600000).toISOString() }
    ],
    tags: ['语音', 'AI'],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

// GET - 获取反馈列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const sort = searchParams.get('sort') || 'votes'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  let feedbacks = generateFeedbacks()
  
  // 筛选类型
  if (type && type !== 'all') {
    feedbacks = feedbacks.filter(f => f.type === type)
  }
  
  // 筛选状态
  if (status && status !== 'all') {
    feedbacks = feedbacks.filter(f => f.status === status)
  }
  
  // 排序
  if (sort === 'votes') {
    feedbacks.sort((a, b) => b.votes - a.votes)
  } else if (sort === 'newest') {
    feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sort === 'priority') {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    feedbacks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  // 分页
  const start = (page - 1) * limit
  const pagedFeedbacks = feedbacks.slice(start, start + limit)

  return NextResponse.json({
    success: true,
    data: {
      feedbacks: pagedFeedbacks,
      stats: {
        total: feedbacks.length,
        byType: {
          bug: feedbacks.filter(f => f.type === 'bug').length,
          feature: feedbacks.filter(f => f.type === 'feature').length,
          improvement: feedbacks.filter(f => f.type === 'improvement').length,
          other: feedbacks.filter(f => f.type === 'other').length,
        },
        byStatus: {
          pending: feedbacks.filter(f => f.status === 'pending').length,
          reviewing: feedbacks.filter(f => f.status === 'reviewing').length,
          in_progress: feedbacks.filter(f => f.status === 'in_progress').length,
          resolved: feedbacks.filter(f => f.status === 'resolved').length,
        },
      },
      types: [
        { id: 'all', name: '全部', icon: '📋' },
        { id: 'bug', name: '问题报告', icon: '🐛' },
        { id: 'feature', name: '功能建议', icon: '💡' },
        { id: 'improvement', name: '改进意见', icon: '⬆️' },
        { id: 'other', name: '其他', icon: '💬' },
      ],
      statuses: [
        { id: 'pending', name: '待处理', color: 'gray' },
        { id: 'reviewing', name: '审核中', color: 'blue' },
        { id: 'in_progress', name: '处理中', color: 'yellow' },
        { id: 'resolved', name: '已解决', color: 'green' },
        { id: 'closed', name: '已关闭', color: 'red' },
      ],
      pagination: {
        page,
        limit,
        total: feedbacks.length,
        hasMore: start + limit < feedbacks.length,
      },
    }
  })
}

// POST - 创建反馈
export async function POST(request: Request) {
  const body = await request.json()
  const { userId = 'default', userName = '用户', type, priority, title, content, tags } = body

  if (!title || !content) {
    return NextResponse.json({
      success: false,
      error: '标题和内容不能为空'
    }, { status: 400 })
  }

  const newFeedback: Feedback = {
    id: `fb_${Date.now()}`,
    userId,
    userName,
    type: type || 'other',
    priority: priority || 'medium',
    title,
    content,
    status: 'pending',
    votes: 0,
    votedUsers: [],
    comments: [],
    tags: tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: {
      feedback: newFeedback,
      message: '感谢你的反馈！我们会认真考虑每一条建议。',
    }
  })
}

// PUT - 更新反馈（投票、评论等）
export async function PUT(request: Request) {
  const body = await request.json()
  const { feedbackId, action, userId = 'default' } = body

  if (action === 'vote') {
    return NextResponse.json({
      success: true,
      data: {
        voted: true,
        votes: 157,
      }
    })
  }

  if (action === 'comment') {
    const { content } = body
    return NextResponse.json({
      success: true,
      data: {
        comment: {
          id: `c_${Date.now()}`,
          userId,
          userName: '我',
          content,
          createdAt: new Date().toISOString(),
        }
      }
    })
  }

  return NextResponse.json({
    success: true,
    data: { message: '操作成功' }
  })
}