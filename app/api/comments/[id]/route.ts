import { NextRequest, NextResponse } from 'next/server';

// 模拟评论数据
let comments: any[] = [
  {
    id: '1',
    diaryId: '1',
    userId: 'user1',
    userName: 'Alex',
    userAvatar: '🦞',
    content: '太棒了！太空龙虾诞生了！',
    createdAt: '2026-03-09T10:00:00.000Z',
    likes: 5,
    likedBy: ['user2', 'user3']
  }
];

// 获取单条评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comment = comments.find(c => c.id === id);

  if (!comment) {
    return NextResponse.json({
      success: false,
      error: '评论不存在'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: comment
  });
}

// 更新评论（点赞）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action, userId } = body;

  const commentIndex = comments.findIndex(c => c.id === id);

  if (commentIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '评论不存在'
    }, { status: 404 });
  }

  if (action === 'like') {
    if (!comments[commentIndex].likedBy) {
      comments[commentIndex].likedBy = [];
    }

    const hasLiked = comments[commentIndex].likedBy.includes(userId);

    if (hasLiked) {
      // 取消点赞
      comments[commentIndex].likedBy = comments[commentIndex].likedBy.filter(
        (uid: string) => uid !== userId
      );
      comments[commentIndex].likes--;
    } else {
      // 点赞
      comments[commentIndex].likedBy.push(userId);
      comments[commentIndex].likes++;
    }

    return NextResponse.json({
      success: true,
      data: {
        likes: comments[commentIndex].likes,
        hasLiked: !hasLiked
      }
    });
  }

  return NextResponse.json({
    success: false,
    error: '未知操作'
  }, { status: 400 });
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const commentIndex = comments.findIndex(c => c.id === id);

  if (commentIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '评论不存在'
    }, { status: 404 });
  }

  // 验证权限（只有评论作者可以删除）
  if (userId && comments[commentIndex].userId !== userId) {
    return NextResponse.json({
      success: false,
      error: '无权删除此评论'
    }, { status: 403 });
  }

  comments.splice(commentIndex, 1);

  return NextResponse.json({
    success: true,
    message: '评论已删除'
  });
}