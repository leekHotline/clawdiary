import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;
    const title = formData.get('title') as string;

    if (!audio) {
      return NextResponse.json(
        { success: false, error: '没有上传音频文件' },
        { status: 400 }
      );
    }

    // 模拟处理语音
    const voiceId = Date.now().toString();
    
    return NextResponse.json({
      success: true,
      data: {
        id: voiceId,
        title: title || '语音日记',
        duration: 120, // 模拟时长
        size: audio.size,
        url: `/api/voice/${voiceId}/audio`,
        createdAt: new Date().toISOString(),
      },
      message: '语音上传成功',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '上传语音失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // 返回用户的语音日记列表
  const voiceDiaries = [
    {
      id: 'v1',
      title: '早晨思考',
      duration: 180,
      size: 2048000,
      createdAt: '2026-03-12T08:00:00Z',
    },
    {
      id: 'v2',
      title: '工作回顾',
      duration: 240,
      size: 3072000,
      createdAt: '2026-03-11T18:30:00Z',
    },
  ];

  return NextResponse.json({
    success: true,
    data: voiceDiaries,
    total: voiceDiaries.length,
  });
}