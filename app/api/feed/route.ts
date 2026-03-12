import { NextResponse } from 'next/server'

// 动态类型
interface Activity {
  id: string
  userId: string
  userName: string
  userAvatar: string
  type: 'diary' | 'like' | 'comment' | 'achievement' | 'streak' | 'follow'
  content: string
  targetId?: string
  targetTitle?: string
  createdAt: string
  likes: number
  comments: number
}

// 模拟好友动态
const generateActivities = (): Activity[] => [
  {
    id: 'act_1',
    userId: 'user_star',
    userName: '星辰大海',
    userAvatar: '🌟',
    type: 'diary',
    content: '发布了新日记',
    targetId: 'diary_101',
    targetTitle: '今天的阳光格外温暖',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likes: 12,
    comments: 3,
  },
  {
    id: 'act_2',
    userId: 'user_moon',
    userName: '月光诗人',
    userAvatar: '🌙',
    type: 'achievement',
    content: '解锁了成就「百日坚持」',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 28,
    comments: 5,
  },
  {
    id: 'act_3',
    userId: 'user_forest',
    userName: '森林精灵',
    userAvatar: '🌲',
    type: 'diary',
    content: '发布了新日记',
    targetId: 'diary_102',
    targetTitle: '山中漫步的感悟',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 8,
    comments: 2,
  },
  {
    id: 'act_4',
    userId: 'user_ocean',
    userName: '海洋之心',
    userAvatar: '🌊',
    type: 'streak',
    content: '连续写日记30天！',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 45,
    comments: 12,
  },
  {
    id: 'act_5',
    userId: 'user_rainbow',
    userName: '雨后彩虹',
    userAvatar: '🌈',
    type: 'comment',
    content: '评论了你的日记「春天的故事」',
    targetId: 'diary_99',
    targetTitle: '春天的故事',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 3,
    comments: 1,
  },
  {
    id: 'act_6',
    userId: 'user_cloud',
    userName: '云端漫步',
    userAvatar: '☁️',
    type: 'like',
    content: '赞了你的日记「日记的价值」',
    targetId: 'diary_98',
    targetTitle: '日记的价值',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 1,
    comments: 0,
  },
  {
    id: 'act_7',
    userId: 'user_sun',
    userName: '阳光向日葵',
    userAvatar: '🌻',
    type: 'follow',
    content: '关注了你',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: 0,
    comments: 0,
  },
  {
    id: 'act_8',
    userId: 'user_time',
    userName: '时间旅行者',
    userAvatar: '⏰',
    type: 'diary',
    content: '发布了新日记',
    targetId: 'diary_103',
    targetTitle: '穿越时光的思考',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes: 15,
    comments: 4,
  },
]

// GET - 获取好友动态
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const type = searchParams.get('type')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  let activities = generateActivities()
  
  if (type && type !== 'all') {
    activities = activities.filter(a => a.type === type)
  }

  return NextResponse.json({
    success: true,
    data: {
      activities,
      stats: {
        total: 156,
        friends: 28,
        following: 35,
        followers: 42,
      },
      types: [
        { id: 'all', name: '全部', icon: '📋' },
        { id: 'diary', name: '新日记', icon: '📝' },
        { id: 'achievement', name: '成就', icon: '🏆' },
        { id: 'streak', name: '打卡', icon: '🔥' },
        { id: 'comment', name: '评论', icon: '💬' },
        { id: 'like', name: '点赞', icon: '❤️' },
        { id: 'follow', name: '关注', icon: '👥' },
      ],
      pagination: {
        page,
        limit,
        hasMore: page < 10,
      },
    }
  })
}

// POST - 发布动态/点赞/评论
export async function POST(request: Request) {
  const body = await request.json()
  const { action, activityId } = body

  if (action === 'like') {
    return NextResponse.json({
      success: true,
      data: {
        activityId,
        liked: true,
        likes: 13,
      }
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      message: '操作成功',
    }
  })
}