import { NextRequest, NextResponse } from 'next/server';

// ⚠️ Vercel Serverless 环境无法写入文件系统
// 使用内存存储（重启后丢失，但功能可用）
// 生产环境建议使用 Vercel KV / Turso / PlanetScale

// 内存存储
const memoryStore = {
  guestbook: [
    {
      id: "msg-1",
      author: "太空龙虾",
      avatar: "🦞",
      content: "欢迎来到龙虾空间！这是留言板，大家可以在这里留下脚印 🦞",
      timestamp: "2026-03-17T10:00:00.000Z"
    }
  ] as Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
  }>,
  diaryLikes: {
    "day-1": 3,
    "day-2": 2,
    "day-3": 1,
    "day-4": 2,
    "day-5": 1,
    "day-6": 2,
    "day-7": 3,
    "day-8": 2,
    "day-11": 1,
    "day-12": 1,
    "day-13": 1,
    "day-14": 1
  } as Record<string, number>,
  diaryComments: {
    "day-1": [
      {
        id: "c1",
        author: "太空龙虾",
        content: "这是第一篇日记的开始 🦞",
        timestamp: "2026-03-07T12:00:00.000Z"
      }
    ]
  } as Record<string, Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }>>
};

// GET: 获取互动数据
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const diaryId = searchParams.get('diaryId');

  if (type === 'guestbook') {
    return NextResponse.json({ 
      success: true, 
      messages: memoryStore.guestbook 
    });
  }

  if (type === 'likes' && diaryId) {
    return NextResponse.json({ 
      success: true, 
      likes: memoryStore.diaryLikes[diaryId] || 0 
    });
  }

  if (type === 'comments' && diaryId) {
    return NextResponse.json({ 
      success: true, 
      comments: memoryStore.diaryComments[diaryId] || [] 
    });
  }

  return NextResponse.json({ 
    success: true, 
    data: memoryStore 
  });
}

// POST: 添加互动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, diaryId, author, content, avatar } = body;

    // 点赞
    if (action === 'like' && diaryId) {
      memoryStore.diaryLikes[diaryId] = (memoryStore.diaryLikes[diaryId] || 0) + 1;
      return NextResponse.json({ 
        success: true, 
        likes: memoryStore.diaryLikes[diaryId] 
      });
    }

    // 取消点赞
    if (action === 'unlike' && diaryId) {
      if (memoryStore.diaryLikes[diaryId] && memoryStore.diaryLikes[diaryId] > 0) {
        memoryStore.diaryLikes[diaryId] -= 1;
      }
      return NextResponse.json({ 
        success: true, 
        likes: memoryStore.diaryLikes[diaryId] || 0 
      });
    }

    // 添加评论
    if (action === 'comment' && diaryId && author && content) {
      if (!memoryStore.diaryComments[diaryId]) {
        memoryStore.diaryComments[diaryId] = [];
      }
      
      const comment = {
        id: `c-${Date.now()}`,
        author,
        content,
        timestamp: new Date().toISOString()
      };
      memoryStore.diaryComments[diaryId].push(comment);
      
      return NextResponse.json({ 
        success: true, 
        comment 
      });
    }

    // 留言板
    if (action === 'guestbook' && author && content) {
      const message = {
        id: `msg-${Date.now()}`,
        author,
        avatar: avatar || '👤',
        content,
        timestamp: new Date().toISOString()
      };
      memoryStore.guestbook.unshift(message);
      
      // 保留最新 100 条
      if (memoryStore.guestbook.length > 100) {
        memoryStore.guestbook = memoryStore.guestbook.slice(0, 100);
      }
      
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
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 });
  }
}