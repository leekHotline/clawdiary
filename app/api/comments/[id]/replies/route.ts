import { NextRequest, NextResponse } from 'next/server';

// 模拟评论回复数据存储
const replies: Record<string, any[]> = {};

// GET /api/comments/[id]/replies - 获取评论的回复列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = params.id;
  
  try {
    const commentReplies = replies[commentId] || [];
    
    return NextResponse.json({
      success: true,
      data: commentReplies,
      total: commentReplies.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取回复失败' },
      { status: 500 }
    );
  }
}

// POST /api/comments/[id]/replies - 添加回复
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = params.id;
  
  try {
    const body = await request.json();
    const { content, authorName, authorId } = body;
    
    if (!content || !authorName) {
      return NextResponse.json(
        { success: false, error: '内容或作者名称不能为空' },
        { status: 400 }
      );
    }
    
    if (!replies[commentId]) {
      replies[commentId] = [];
    }
    
    const newReply = {
      id: Date.now().toString(),
      commentId,
      content,
      authorId: authorId || 'anonymous',
      authorName,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    
    replies[commentId].push(newReply);
    
    return NextResponse.json({
      success: true,
      data: newReply,
      message: '回复成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '添加回复失败' },
      { status: 500 }
    );
  }
}