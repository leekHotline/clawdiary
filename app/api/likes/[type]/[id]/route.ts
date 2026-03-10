import { NextRequest, NextResponse } from 'next/server';

// GET /api/likes/[type]/[id] - 获取特定内容的点赞状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';
  
  try {
    // 模拟点赞状态
    const likeKey = `${type}_${id}_${userId}`;
    const isLiked = Math.random() > 0.5; // 随机模拟
    
    return NextResponse.json({
      success: true,
      data: {
        type,
        id,
        isLiked,
        likeCount: Math.floor(Math.random() * 100) + 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取点赞状态失败' },
      { status: 500 }
    );
  }
}

// POST /api/likes/[type]/[id] - 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  
  try {
    const body = await request.json();
    const { userId, action } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID不能为空' },
        { status: 400 }
      );
    }
    
    // 模拟点赞/取消点赞
    const liked = action === 'like';
    
    return NextResponse.json({
      success: true,
      data: {
        type,
        id,
        userId,
        liked,
        message: liked ? '点赞成功' : '取消点赞成功',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '操作失败' },
      { status: 500 }
    );
  }
}