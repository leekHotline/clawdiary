import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDiaries } from "@/lib/diaries";

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

function getCollectionById(id: string): Collection | null {
  try {
    if (!fs.existsSync(COLLECTIONS_FILE)) {
      return null;
    }
    const data = fs.readFileSync(COLLECTIONS_FILE, "utf-8");
    const collections: Collection[] = JSON.parse(data);
    return collections.find(c => c.id === id) || null;
  } catch {
    return null;
  }
}

// GET /api/collections/[id] - 获取收藏集详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = getCollectionById(params.id);
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    
    // 获取收藏集中的日记详情
    const allDiaries = await getDiaries();
    const diaries = allDiaries.filter(d => collection.diaryIds.includes(d.id));
    
    return NextResponse.json({
      ...collection,
      diaries,
      diaryCount: collection.diaryIds.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}

// DELETE /api/collections/[id] - 删除收藏集
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collectionsFile = path.join(process.cwd(), "data", "collections.json");
    
    if (!fs.existsSync(collectionsFile)) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    
    const data = fs.readFileSync(collectionsFile, "utf-8");
    const collections: Collection[] = JSON.parse(data);
    const filtered = collections.filter(c => c.id !== params.id);
    
    if (filtered.length === collections.length) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    
    fs.writeFileSync(collectionsFile, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}