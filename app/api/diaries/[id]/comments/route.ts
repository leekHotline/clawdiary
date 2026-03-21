import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Comment {
  id: string;
  diaryId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json");

function getComments(): Comment[] {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COMMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  const dataDir = path.dirname(COMMENTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// GET /api/diaries/[id]/comments - 获取日记评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = getComments().filter(c => c.diaryId === id);
    return NextResponse.json(comments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/diaries/[id]/comments - 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, content } = body;
    
    if (!userId || !userName || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const comments = getComments();
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: Date.now().toString(),
      diaryId: id,
      userId,
      userName,
      content,
      createdAt: now,
      updatedAt: now,
    };
    
    comments.push(newComment);
    saveComments(comments);
    
    return NextResponse.json(newComment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// DELETE /api/diaries/[id]/comments - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // 路由参数不需要使用
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    
    if (!commentId) {
      return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
    }
    
    const comments = getComments();
    const filtered = comments.filter(c => c.id !== commentId);
    saveComments(filtered);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}