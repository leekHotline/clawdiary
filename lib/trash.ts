import fs from "fs";
import path from "path";

export interface TrashItem {
  id: string;
  originalId: string;
  type: "diary" | "draft";
  title: string;
  content: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  deletedAt: string;
  originalDate?: string;
}

const TRASH_FILE = path.join(process.cwd(), "data", "trash.json");

function ensureDataDir() {
  const dataDir = path.dirname(TRASH_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getTrashItems(): Promise<TrashItem[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(TRASH_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TRASH_FILE, "utf-8");
    const items = JSON.parse(data);
    // 自动清理 30 天前的项目
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = items.filter((item: TrashItem) => 
      new Date(item.deletedAt).getTime() > thirtyDaysAgo
    );
    if (filtered.length !== items.length) {
      fs.writeFileSync(TRASH_FILE, JSON.stringify(filtered, null, 2));
    }
    return filtered.sort((a: TrashItem, b: TrashItem) => 
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    );
  } catch (error) {
    console.error("Error reading trash:", error);
    return [];
  }
}

export async function addToTrash(
  type: "diary" | "draft",
  item: {
    id: string;
    title: string;
    content: string;
    author: "AI" | "Human" | "Agent";
    authorName?: string;
    tags?: string[];
    image?: string;
    createdAt: string;
    date?: string;
  }
): Promise<TrashItem> {
  ensureDataDir();
  const trashItems = await getTrashItems();
  const trashItem: TrashItem = {
    id: `trash_${Date.now()}`,
    originalId: item.id,
    type,
    title: item.title,
    content: item.content,
    author: item.author,
    authorName: item.authorName,
    tags: item.tags,
    image: item.image,
    createdAt: item.createdAt,
    deletedAt: new Date().toISOString(),
    originalDate: item.date,
  };
  trashItems.push(trashItem);
  fs.writeFileSync(TRASH_FILE, JSON.stringify(trashItems, null, 2));
  return trashItem;
}

export async function getTrashItem(id: string): Promise<TrashItem | null> {
  const items = await getTrashItems();
  return items.find((item) => item.id === id) || null;
}

export async function restoreFromTrash(id: string): Promise<{ success: boolean; type: string; data: TrashItem } | null> {
  ensureDataDir();
  const trashItems = await getTrashItems();
  const item = trashItems.find((i) => i.id === id);
  if (!item) return null;
  
  // 从回收站移除
  const filtered = trashItems.filter((i) => i.id !== id);
  fs.writeFileSync(TRASH_FILE, JSON.stringify(filtered, null, 2));
  
  return { success: true, type: item.type, data: item };
}

export async function permanentlyDelete(id: string): Promise<boolean> {
  ensureDataDir();
  const trashItems = await getTrashItems();
  const filtered = trashItems.filter((item) => item.id !== id);
  if (filtered.length === trashItems.length) return false;
  fs.writeFileSync(TRASH_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export async function emptyTrash(): Promise<number> {
  ensureDataDir();
  const trashItems = await getTrashItems();
  const count = trashItems.length;
  fs.writeFileSync(TRASH_FILE, "[]", "utf-8");
  return count;
}