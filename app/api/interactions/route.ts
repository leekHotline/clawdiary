import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 数据文件路径
const DATA_FILE = path.join(process.cwd(), 'data', 'interactions.json');

// 读取数据
async function getData() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // 文件不存在时返回默认结构
    return {
      guestbook: [],
      diaryLikes: {},
      diaryComments: {}
    };
  }
}

// 写入数据
async function setData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: 获取互动数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'guestbook' | 'likes' | 'comments'
  const diaryId = searchParams.get('diaryId');

  const data = await getData();

  if (type === 'guestbook') {
    return NextResponse.json({ 
      success: true, 
      messages: data.guestbook || [] 
    });
  }

  if (type === 'likes' && diaryId) {
    return NextResponse.json({ 
      success: true, 
      likes: data.diaryLikes?.[diaryId] || 0 
    });
  }

  if (type === 'comments' && diaryId) {
    return NextResponse.json({ 
      success: true, 
      comments: data.diaryComments?.[diaryId] || [] 
    });
  }

  // 返回所有数据
  return NextResponse.json({ 
    success: true, 
    data 
  });
}

// POST: 添加互动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, diaryId, author, content, avatar } = body;

    const data = await getData();

    // 点赞
    if (action === 'like' && diaryId) {
      if (!data.diaryLikes) data.diaryLikes = {};
      data.diaryLikes[diaryId] = (data.diaryLikes[diaryId] || 0) + 1;
      await setData(data);
      return NextResponse.json({ 
        success: true, 
        likes: data.diaryLikes[diaryId] 
      });
    }

    // 取消点赞
    if (action === 'unlike' && diaryId) {
      if (!data.diaryLikes) data.diaryLikes = {};
      if (data.diaryLikes[diaryId] && data.diaryLikes[diaryId] > 0) {
        data.diaryLikes[diaryId] -= 1;
      }
      await setData(data);
      return NextResponse.json({ 
        success: true, 
        likes: data.diaryLikes[diaryId] || 0 
      });
    }

    // 添加评论
    if (action === 'comment' && diaryId && author && content) {
      if (!data.diaryComments) data.diaryComments = {};
      if (!data.diaryComments[diaryId]) data.diaryComments[diaryId] = [];
      
      const comment = {
        id: `c-${Date.now()}`,
        author,
        content,
        timestamp: new Date().toISOString()
      };
      data.diaryComments[diaryId].push(comment);
      await setData(data);
      return NextResponse.json({ 
        success: true, 
        comment 
      });
    }

    // 留言板
    if (action === 'guestbook' && author && content) {
      if (!data.guestbook) data.guestbook = [];
      
      const message = {
        id: `msg-${Date.now()}`,
        author,
        avatar: avatar || '👤',
        content,
        timestamp: new Date().toISOString()
      };
      data.guestbook.unshift(message);
      
      // 保留最新 100 条
      if (data.guestbook.length > 100) {
        data.guestbook = data.guestbook.slice(0, 100);
      }
      
      await setData(data);
      return NextResponse.json({ 
        success: true, 
        message 
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('[interactions] Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}