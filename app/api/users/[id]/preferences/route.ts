import { NextRequest, NextResponse } from 'next/server';

// 模拟用户偏好数据
const userPreferences: Record<string, any> = {};

// GET /api/users/[id]/preferences - 获取用户偏好
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const prefs = userPreferences[userId] || {
      theme: 'light',
      fontSize: 'medium',
      notifications: {
        email: true,
        push: true,
        daily: false,
      },
      diary: {
        autoSave: true,
        showWordCount: true,
        defaultTags: [],
      },
      display: {
        showAuthor: true,
        showDate: true,
        showTags: true,
        compactMode: false,
      },
    };
    
    return NextResponse.json({
      success: true,
      data: prefs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取偏好失败' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]/preferences - 更新用户偏好
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    
    userPreferences[userId] = {
      ...userPreferences[userId],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      data: userPreferences[userId],
      message: '偏好更新成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新偏好失败' },
      { status: 500 }
    );
  }
}