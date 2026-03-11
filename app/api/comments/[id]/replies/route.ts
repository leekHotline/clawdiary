import { NextRequest, NextResponse } from 'next/server';

// 模拟回复数据
let replies: any[] = [];

// 获取评论的回复列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');

  const commentReplies = replies.filter(r => r.commentId === id);

  // 按时间正序排列（回复是对话，应该按时间顺序显示）
  commentReplies.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const total = commentReplies.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedReplies = commentReplies.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: {
      replies: paginatedReplies,
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

// 创建回复
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    const body = await request.json();
    const { userId, userName, userAvatar, content, replyToUserId, replyToUserName } = body;

    if (!content || !userId) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 });
    }

    // 内容长度限制
    if (content.length > 500) {
      return NextResponse.json({
        success: false,
        error: '回复内容不能超过500字'
      }, { status: 400 });
    }

    const newReply = {
      id: `reply-${Date.now()}`,
      commentId,
      userId,
      userName: userName || '匿名用户',
      userAvatar: userAvatar || '👤',
      content: content.trim(),
      replyToUserId,
      replyToUserName,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    replies.push(newReply);

    return NextResponse.json({
      success: true,
      data: newReply
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '创建回复失败'
    }, { status: 500 });
  }
}