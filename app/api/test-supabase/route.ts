import { NextResponse } from 'next/server';

export async function GET() {
  // 测试最基本的响应
  return NextResponse.json({ 
    success: true, 
    message: 'API 工作正常',
    env: {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_ANON_KEY,
    }
  });
}