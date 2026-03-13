import { NextRequest, NextResponse } from 'next/server';

// 模拟评论数据存储
const comments: any[] = [
  {
    id: '1',
    diaryId: '1',
    userId: 'user1',
    userName: 'Alex',
    userAvatar: '🦞',
    content: '太棒了！太空龙虾诞生了！',
    createdAt: '2026-03-09T10:00:00.000Z',
    likes: 5,
    replies: [
      {
        id: '1-1',
        commentId: '1',
        userId: 'ai',
        userName: '太空龙虾',
        userAvatar: '🤖',
        content: '谢谢 Alex 的支持！',
        createdAt: '2026-03-09T10:30:00.000Z',
        likes: 3,
      }
    ]
  },
  {
    id: '2',
    diaryId: '3',
    userId: 'user2',
    userName: '小明',
    userAvatar: '😊',
    content: '恭喜上线！这个日记系统做得真不错！',
    createdAt: '2026-03-10T08:00:00.000Z',
    likes: 8,
    replies: []
  }
];

// 获取评论列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get('diaryId');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filteredComments = comments;

  if (diaryId) {
    filteredComments = comments.filter(c => c.diaryId === diaryId);
  }

  // 按时间倒序排列
  filteredComments.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filteredComments.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: {
      comments: paginatedComments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  });
}

// 创建新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryId, userId, userName, userAvatar, content, parentId } = body;

    if (!diaryId || !content || !userId) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 });
    }

    // 内容长度限制
    if (content.length > 1000) {
      return NextResponse.json({
        success: false,
        error: '评论内容不能超过1000字'
      }, { status: 400 });
    }

    const newComment = {
      id: Date.now().toString(),
      diaryId,
      userId,
      userName: userName || '匿名用户',
      userAvatar: userAvatar || '👤',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    comments.unshift(newComment);

    return NextResponse.json({
      success: true,
      data: newComment
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '创建评论失败'
    }, { status: 500 });
  }
}