import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LIKES_FILE = path.join(process.cwd(), "data", "likes.json");

interface Likes {
  [diaryId: string]: {
    count: number;
    users: string[];
  };
}

function getLikes(): Likes {
  try {
    if (!fs.existsSync(LIKES_FILE)) {
      return {};
    }
    const data = fs.readFileSync(LIKES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveLikes(likes: Likes) {
  const dataDir = path.dirname(LIKES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2));
}

// GET /api/diaries/[id]/like - 获取点赞数
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const likes = getLikes();
    const diaryLikes = likes[id] || { count: 0, users: [] };
    return NextResponse.json(diaryLikes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get likes" }, { status: 500 });
  }
}

// POST /api/diaries/[id]/like - 点赞/取消点赞
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'like' | 'unlike'
    
    const likes = getLikes();
    const diaryId = id;
    
    if (!likes[diaryId]) {
      likes[diaryId] = { count: 0, users: [] };
    }
    
    if (action === 'like' && !likes[diaryId].users.includes(userId)) {
      likes[diaryId].users.push(userId);
      likes[diaryId].count++;
    } else if (action === 'unlike') {
      likes[diaryId].users = likes[diaryId].users.filter(u => u !== userId);
      likes[diaryId].count = Math.max(0, likes[diaryId].count - 1);
    }
    
    saveLikes(likes);
    return NextResponse.json(likes[diaryId]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}