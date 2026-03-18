import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Favorite {
  id: string;
  userId: string;
  diaryId: string;
  createdAt: string;
}

const FAVORITES_FILE = path.join(process.cwd(), "data", "favorites.json");

function getFavorites(): Favorite[] {
  try {
    if (!fs.existsSync(FAVORITES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(FAVORITES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveFavorites(favorites: Favorite[]) {
  const dataDir = path.dirname(FAVORITES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

// GET /api/favorites - 获取收藏列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const diaryId = searchParams.get("diaryId");
    
    let favorites = getFavorites();
    
    if (userId) {
      favorites = favorites.filter(f => f.userId === userId);
    }
    
    if (diaryId) {
      favorites = favorites.filter(f => f.diaryId === diaryId);
    }
    
    return NextResponse.json(favorites.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

// POST /api/favorites - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, diaryId } = body;
    
    if (!userId || !diaryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const favorites = getFavorites();
    
    // 检查是否已收藏
    const exists = favorites.find(f => f.userId === userId && f.diaryId === diaryId);
    if (exists) {
      return NextResponse.json({ error: "Already favorited" }, { status: 400 });
    }
    
    const newFavorite: Favorite = {
      id: Date.now().toString(),
      userId,
      diaryId,
      createdAt: new Date().toISOString(),
    };
    
    favorites.push(newFavorite);
    saveFavorites(favorites);
    
    return NextResponse.json(newFavorite, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

// DELETE /api/favorites - 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const diaryId = searchParams.get("diaryId");
    
    if (!userId || !diaryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const favorites = getFavorites();
    const filtered = favorites.filter(f => !(f.userId === userId && f.diaryId === diaryId));
    saveFavorites(filtered);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}