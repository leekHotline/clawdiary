import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  diaryIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLLECTIONS_FILE = path.join(process.cwd(), "data", "collections.json");

function getCollections(): Collection[] {
  try {
    if (!fs.existsSync(COLLECTIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COLLECTIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveCollections(collections: Collection[]) {
  const dataDir = path.dirname(COLLECTIONS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
}

// GET /api/collections - 获取收藏集列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const publicOnly = searchParams.get("public") === "true";
    
    let collections = getCollections();
    
    if (userId) {
      collections = collections.filter(c => c.userId === userId);
    }
    
    if (publicOnly) {
      collections = collections.filter(c => c.isPublic);
    }
    
    return NextResponse.json(collections.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

// POST /api/collections - 创建收藏集
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, diaryIds, isPublic } = body;
    
    if (!userId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const collections = getCollections();
    const now = new Date().toISOString();
    const newCollection: Collection = {
      id: Date.now().toString(),
      userId,
      name,
      description,
      diaryIds: diaryIds || [],
      isPublic: isPublic || false,
      createdAt: now,
      updatedAt: now,
    };
    
    collections.push(newCollection);
    saveCollections(collections);
    
    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}

// PUT /api/collections - 更新收藏集
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Missing collection id" }, { status: 400 });
    }
    
    const collections = getCollections();
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    
    collections[index] = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    saveCollections(collections);
    return NextResponse.json(collections[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

// DELETE /api/collections - 删除收藏集
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing collection id" }, { status: 400 });
    }
    
    const collections = getCollections();
    const filtered = collections.filter(c => c.id !== id);
    saveCollections(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}