import { NextRequest, NextResponse } from 'next/server'

// 模拟关注数据（实际应该从数据库或共享状态获取）
const follows: { followerId: string; followingId: string }[] = []

// GET: 检查关注状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params
    const { searchParams } = new URL(request.url)
    const currentUserId = searchParams.get('currentUserId')

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: '缺少当前用户ID' },
        { status: 400 }
      )
    }

    const isFollowing = follows.some(
      f => f.followerId === currentUserId && f.followingId === targetUserId
    )

    const isFollower = follows.some(
      f => f.followerId === targetUserId && f.followingId === currentUserId
    )

    // 统计数量
    const followersCount = follows.filter(f => f.followingId === targetUserId).length
    const followingCount = follows.filter(f => f.followerId === targetUserId).length

    return NextResponse.json({
      success: true,
      data: {
        targetUserId,
        currentUserId,
        isFollowing,
        isFollower,
        isMutual: isFollowing && isFollower,
        followersCount,
        followingCount
      }
    })
  } catch (_error) {
    console.error('检查关注状态失败:', _error)
    return NextResponse.json(
      { success: false, error: '检查关注状态失败' },
      { status: 500 }
    )
  }
}