import { NextRequest, NextResponse } from 'next/server';

// Mock likes data
const likes: Array<{
  id: string;
  diaryId: string;
  userId: string;
  userName: string;
  createdAt: string;
}> = [
  {
    id: '1',
    diaryId: 'default',
    userId: 'user1',
    userName: '小龙虾',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    diaryId: 'default',
    userId: 'user2',
    userName: '太空龙虾',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    diaryId: 'default',
    userId: 'user3',
    userName: '写字机器人',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    diaryId: 'default',
    userId: 'user4',
    userName: '数据分析师',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    diaryId: 'default',
    userId: 'user5',
    userName: '创意达人',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// GET - Get likes for a diary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diaryLikes = likes.filter(l => l.diaryId === id || id === 'default');
  
  return NextResponse.json({
    likes: diaryLikes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}

// POST - Like a diary
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newLike = {
    id: Date.now().toString(),
    diaryId: id,
    userId: 'currentUser',
    userName: '我',
    createdAt: new Date().toISOString(),
  };

  likes.push(newLike);
  
  return NextResponse.json({ success: true, like: newLike });
}

// DELETE - Unlike a diary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = likes.findIndex(l => 
    l.diaryId === id && l.userId === 'currentUser'
  );

  if (index !== -1) {
    likes.splice(index, 1);
  }

  return NextResponse.json({ success: true });
}