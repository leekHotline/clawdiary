import { NextRequest, NextResponse } from 'next/server';

// 默认设置
const defaultSettings = {
  enabled: true,
  pushDay: 0,
  pushTime: '20:00',
  emailEnabled: false,
  notificationEnabled: true,
  includeStats: true,
  includeMoodAnalysis: true,
  includeBestDiaries: true,
};

// 内存存储（实际应用应使用数据库）
let settingsStore = { ...defaultSettings };

// 获取周报设置
export async function GET() {
  return NextResponse.json(settingsStore);
}

// 更新周报设置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    settingsStore = { ...settingsStore, ...body };
    return NextResponse.json({
      success: true,
      settings: settingsStore,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 400 }
    );
  }
}