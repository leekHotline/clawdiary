import { NextResponse } from 'next/server';

// 手动生成周报
export async function POST() {
  // 模拟生成过程
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    success: true,
    message: '周报已重新生成',
    generatedAt: new Date().toISOString(),
  });
}