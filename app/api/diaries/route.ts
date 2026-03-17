import { NextRequest, NextResponse } from 'next/server';
import diaries from '@/lib/diaries-data.json';

// 动态 API - 避免 Vercel 静态缓存
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // 获取单篇日记
  if (id) {
    const diary = diaries.find(d => d.id === id);
    if (!diary) {
      return NextResponse.json({ error: 'Diary not found' }, { status: 404 });
    }
    return NextResponse.json(diary);
  }
  
  // 返回所有日记
  return NextResponse.json(diaries, {
    headers: {
      // 禁用缓存，确保每次都获取最新数据
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}