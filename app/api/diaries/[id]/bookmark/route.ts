import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Bookmark {
  id: string;
  userId: string;
  diaryId: string;
  position: number; // 阅读位置
  note?: string;
  createdAt: string;
}

const BOOKMARKS_FILE = path.join(process.cwd(), "data", "bookmarks.json");

function getBookmarks(): Bookmark[] {
  try {
    if (!fs.existsSync(BOOKMARKS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(BOOKMARKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]) {
  const dataDir = path.dirname(BOOKMARKS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
}

// GET /api/diaries/[id]/bookmark - 获取书签
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    
    const bookmarks = getBookmarks();
    const bookmark = bookmarks.find(b => b.diaryId === id && b.userId === userId);
    
    return NextResponse.json({ bookmark: bookmark || null });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to get bookmark" }, { status: 500 });
  }
}

// POST /api/diaries/[id]/bookmark - 添加/更新书签
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, position, note } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    
    const bookmarks = getBookmarks();
    const now = new Date().toISOString();
    
    const existingIndex = bookmarks.findIndex(
      b => b.diaryId === id && b.userId === userId
    );
    
    if (existingIndex >= 0) {
      bookmarks[existingIndex] = {
        ...bookmarks[existingIndex],
        position: position || bookmarks[existingIndex].position,
        note: note !== undefined ? note : bookmarks[existingIndex].note,
        createdAt: now,
      };
      saveBookmarks(bookmarks);
      return NextResponse.json(bookmarks[existingIndex]);
    }
    
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      userId,
      diaryId: id,
      position: position || 0,
      note,
      createdAt: now,
    };
    
    bookmarks.push(newBookmark);
    saveBookmarks(bookmarks);
    
    return NextResponse.json(newBookmark, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

// DELETE /api/diaries/[id]/bookmark - 删除书签
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(
      b => !(b.diaryId === id && b.userId === userId)
    );
    saveBookmarks(filtered);
    
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}