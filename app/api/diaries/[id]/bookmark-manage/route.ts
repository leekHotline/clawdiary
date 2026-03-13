import { NextRequest, NextResponse } from 'next/server';

// Mock bookmarks data
const bookmarks: Array<{
  id: string;
  diaryId: string;
  diaryTitle: string;
  diaryPreview: string;
  groupId: string;
  note?: string;
  createdAt: string;
}> = [
  {
    id: '1',
    diaryId: 'default',
    diaryTitle: '一个美好的早晨',
    diaryPreview: '今天阳光明媚，我决定早起去公园散步。清晨的空气格外清新...',
    groupId: 'favorites',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    diaryId: 'default',
    diaryTitle: '学习笔记',
    diaryPreview: '今天学习了新的编程技术，记录一下重点内容...',
    groupId: 'work',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// GET - Get bookmarks for a diary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diaryBookmarks = bookmarks.filter(b => b.diaryId === id || id === 'default');
  
  return NextResponse.json({
    bookmarks: diaryBookmarks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}

// POST - Add bookmark
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const newBookmark = {
      id: Date.now().toString(),
      diaryId: id,
      diaryTitle: body.diaryTitle || '日记标题',
      diaryPreview: body.diaryPreview || '日记预览内容...',
      groupId: body.groupId || 'default',
      note: body.note,
      createdAt: new Date().toISOString(),
    };

    bookmarks.push(newBookmark);
    
    return NextResponse.json({ success: true, bookmark: newBookmark });
  } catch (_error) {
    return NextResponse.json(
      { error: '添加收藏失败' },
      { status: 500 }
    );
  }
}

// DELETE - Remove bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = bookmarks.findIndex(b => b.diaryId === id);
  
  if (index !== -1) {
    bookmarks.splice(index, 1);
  }

  return NextResponse.json({ success: true });
}