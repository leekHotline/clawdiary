import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
interface ReadingRecord {
  id: string;
  diaryId: string;
  diaryTitle: string;
  readAt: string;
  duration: number; // seconds
  progress: number; // percentage 0-100
  isCompleted: boolean;
  device: string;
}

let readingRecords: ReadingRecord[] = [
  {
    id: '1',
    diaryId: 'day-1',
    diaryTitle: 'Day 1: Claw Diary 诞生',
    readAt: new Date(Date.now() - 3600000).toISOString(),
    duration: 180,
    progress: 100,
    isCompleted: true,
    device: 'Chrome / Windows',
  },
  {
    id: '2',
    diaryId: 'day-15',
    diaryTitle: 'Day 15: AI 写作助手来了',
    readAt: new Date(Date.now() - 7200000).toISOString(),
    duration: 120,
    progress: 85,
    isCompleted: false,
    device: 'Safari / iOS',
  },
  {
    id: '3',
    diaryId: 'day-20',
    diaryTitle: 'Day 20: 主题系统大升级',
    readAt: new Date(Date.now() - 86400000).toISOString(),
    duration: 200,
    progress: 100,
    isCompleted: true,
    device: 'Firefox / macOS',
  },
];

// GET - List reading records
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const completed = searchParams.get('completed');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let filtered = [...readingRecords];
  
  if (completed === 'true') {
    filtered = filtered.filter(r => r.isCompleted);
  } else if (completed === 'false') {
    filtered = filtered.filter(r => !r.isCompleted);
  }

  // Sort by readAt descending
  filtered.sort((a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime());

  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    records: paginated,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
  });
}

// POST - Create or update reading record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryId, diaryTitle, duration, progress, device } = body;

    if (!diaryId) {
      return NextResponse.json(
        { error: '日记 ID 是必填项' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingIndex = readingRecords.findIndex(r => r.diaryId === diaryId);
    
    if (existingIndex >= 0) {
      // Update existing record
      readingRecords[existingIndex] = {
        ...readingRecords[existingIndex],
        readAt: new Date().toISOString(),
        duration: (readingRecords[existingIndex].duration || 0) + (duration || 0),
        progress: Math.max(readingRecords[existingIndex].progress, progress || 0),
        isCompleted: progress >= 100,
        device: device || readingRecords[existingIndex].device,
      };
      
      return NextResponse.json({ 
        success: true, 
        record: readingRecords[existingIndex] 
      });
    }

    // Create new record
    const newRecord: ReadingRecord = {
      id: Date.now().toString(),
      diaryId,
      diaryTitle: diaryTitle || '未知日记',
      readAt: new Date().toISOString(),
      duration: duration || 0,
      progress: progress || 0,
      isCompleted: progress >= 100,
      device: device || 'Unknown',
    };

    readingRecords.push(newRecord);
    
    return NextResponse.json({ 
      success: true, 
      record: newRecord 
    });
  } catch (_error) {
    console.error('Create reading record error:', _error);
    return NextResponse.json(
      { error: '创建阅读记录失败' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all records
export async function DELETE() {
  readingRecords = [];
  return NextResponse.json({ success: true, message: '已清空所有阅读记录' });
}