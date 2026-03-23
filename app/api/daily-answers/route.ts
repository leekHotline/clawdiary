import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://lwpeyopwxmeusreejaau.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Xy3nIbzWl-7Xbugn673krA_PU0i44Uq';
const supabase = createClient(supabaseUrl, supabaseKey);

// 内存存储（用于无数据库时的降级）
const memoryAnswers: Record<string, any[]> = {};

// GET - 获取用户的每日回答
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'default-user';
  
  // 尝试从数据库获取
  try {
    const { data, error } = await supabase
      .from('daily_answers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      return NextResponse.json({ answers: data });
    }
  } catch (e) {
    // 数据库错误，使用内存存储
  }

  // 降级到内存存储
  const answers = memoryAnswers[userId] || [];
  return NextResponse.json({ answers });
}

// POST - 保存每日回答
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id') || 'default-user';
  
  try {
    const body = await request.json();
    const { question, answer, category } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const newAnswer = {
      id: Date.now().toString(),
      user_id: userId,
      question,
      answer,
      category: category || 'reflection',
      created_at: new Date().toISOString(),
    };

    // 尝试保存到数据库
    try {
      const { error } = await supabase
        .from('daily_answers')
        .insert(newAnswer);

      if (!error) {
        return NextResponse.json({ success: true, data: newAnswer });
      }
    } catch (e) {
      // 数据库错误，使用内存存储
    }

    // 降级到内存存储
    if (!memoryAnswers[userId]) {
      memoryAnswers[userId] = [];
    }
    memoryAnswers[userId].unshift(newAnswer);
    
    return NextResponse.json({ 
      success: true, 
      data: newAnswer,
      storedLocally: true 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save answer' 
    }, { status: 500 });
  }
}