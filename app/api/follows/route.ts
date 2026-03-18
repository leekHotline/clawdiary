import { NextRequest, NextResponse } from 'next/server'

// 关注关系
interface FollowRelation {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

// 模拟关注数据
const follows: FollowRelation[] = [
  {
    id: 'f1',
    followerId: 'user1',
    followingId: 'user2',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'f2',
    followerId: 'user1',
    followingId: 'user3',
    createdAt: '2024-01-20T14:30:00Z'
  }
]

// 用户基本信息
interface UserBrief {
  id: string
  name: string
  avatar?: string
  bio?: string
}

const users: UserBrief[] = [
  { id: 'user1', name: '小明', avatar: '/avatars/user1.jpg', bio: '热爱生活' },
  { id: 'user2', name: '小红', avatar: '/avatars/user2.jpg', bio: '日记达人' },
  { id: 'user3', name: '小李', avatar: '/avatars/user3.jpg', bio: '摄影爱好者' }
]

// GET: 获取关注列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'following' // following 或 followers
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      )
    }

    let relations: FollowRelation[]
    if (type === 'following') {
      relations = follows.filter(f => f.followerId === userId)
    } else {
      relations = follows.filter(f => f.followingId === userId)
    }

    // 分页
    const total = relations.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedRelations = relations.slice(startIndex, startIndex + limit)

    // 关联用户信息
    const data = paginatedRelations.map(relation => {
      const targetId = type === 'following' ? relation.followingId : relation.followerId
      const user = users.find(u => u.id === targetId)
      return {
        ...relation,
        user: user || { id: targetId, name: '未知用户' }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        list: data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '获取关注列表失败' },
      { status: 500 }
    )
  }
}

// POST: 关注用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { followerId, followingId } = body

    if (!followerId || !followingId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { success: false, error: '不能关注自己' },
        { status: 400 }
      )
    }

    // 检查是否已关注
    const existing = follows.find(
      f => f.followerId === followerId && f.followingId === followingId
    )
    if (existing) {
      return NextResponse.json(
        { success: false, error: '已关注该用户' },
        { status: 400 }
      )
    }

    const newFollow: FollowRelation = {
      id: `f${Date.now()}`,
      followerId,
      followingId,
      createdAt: new Date().toISOString()
    }

    follows.push(newFollow)

    return NextResponse.json({
      success: true,
      data: newFollow,
      message: '关注成功'
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '关注失败' },
      { status: 500 }
    )
  }
}

// DELETE: 取消关注
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get('followerId')
    const followingId = searchParams.get('followingId')

    if (!followerId || !followingId) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const index = follows.findIndex(
      f => f.followerId === followerId && f.followingId === followingId
    )

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: '未关注该用户' },
        { status: 400 }
      )
    }

    follows.splice(index, 1)

    return NextResponse.json({
      success: true,
      message: '取消关注成功'
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '取消关注失败' },
      { status: 500 }
    )
  }
}