import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://lwpeyopwxmeusreejaau.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Xy3nIbzWl-7Xbugn673krA_PU0i44Uq';

const supabase = createClient(supabaseUrl, supabaseKey);

// 表名
const TABLE = 'interactions';

// GET: 获取互动数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const diaryId = searchParams.get('diaryId');

  try {
    // 获取留言板
    if (type === 'guestbook') {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('type', 'guestbook')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        // 表不存在时返回默认数据
        if (error.code === 'PGRST205') {
          return NextResponse.json({ 
            success: true, 
            messages: [{
              id: '1',
              author: '太空龙虾',
              avatar: '🦞',
              content: '欢迎来到龙虾空间！留言板功能即将上线...',
              timestamp: new Date().toISOString()
            }]
          });
        }
        throw error;
      }

      const messages = (data || []).map(row => ({
        id: String(row.id),
        author: row.author,
        avatar: row.avatar || '👤',
        content: row.content,
        timestamp: row.created_at
      }));

      return NextResponse.json({ success: true, messages });
    }

    // 获取点赞数
    if (type === 'likes' && diaryId) {
      const { count, error } = await supabase
        .from(TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('type', 'like')
        .eq('diary_id', diaryId);

      if (error && error.code !== 'PGRST205') throw error;

      return NextResponse.json({ 
        success: true, 
        likes: count || 0 
      });
    }

    // 获取评论
    if (type === 'comments' && diaryId) {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('type', 'comment')
        .eq('diary_id', diaryId)
        .order('created_at', { ascending: true });

      if (error && error.code !== 'PGRST205') throw error;

      const comments = (data || []).map(row => ({
        id: String(row.id),
        author: row.author,
        content: row.content,
        timestamp: row.created_at
      }));

      return NextResponse.json({ success: true, comments });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[interactions] GET error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Database error',
      details: String(error)
    }, { status: 500 });
  }
}

// POST: 添加互动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, diaryId, author, content, avatar } = body;

    // 点赞
    if (action === 'like' && diaryId) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({
          type: 'like',
          diary_id: diaryId,
          author: author || 'anonymous',
          content: 'like'
        })
        .select();

      if (error) {
        // 表不存在
        if (error.code === 'PGRST205') {
          return NextResponse.json({ 
            success: false,
            error: 'Table not created. Please run SQL in Supabase Dashboard.' 
          }, { status: 500 });
        }
        throw error;
      }

      // 获取新的点赞总数
      const { count } = await supabase
        .from(TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('type', 'like')
        .eq('diary_id', diaryId);

      return NextResponse.json({ 
        success: true, 
        likes: count || 1 
      });
    }

    // 评论
    if (action === 'comment' && diaryId && content) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({
          type: 'comment',
          diary_id: diaryId,
          author: author || '访客',
          avatar: avatar || '👤',
          content
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        comment: {
          id: String(data.id),
          author: data.author,
          content: data.content,
          timestamp: data.created_at
        }
      });
    }

    // 留言板
    if (action === 'guestbook' && content) {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({
          type: 'guestbook',
          author: author || '访客',
          avatar: avatar || '👤',
          content
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ 
        success: true, 
        message: {
          id: String(data.id),
          author: data.author,
          avatar: data.avatar,
          content: data.content,
          timestamp: data.created_at
        }
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('[interactions] POST error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Database error',
      details: String(error)
    }, { status: 500 });
  }
}