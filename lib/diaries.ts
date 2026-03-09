import fs from "fs";
import path from "path";

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
  imagePrompt?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "diaries.json");

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getDiaries(): Promise<Diary[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const diaries = JSON.parse(data);
    return diaries.sort((a: Diary, b: Diary) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading diaries:", error);
    return [];
  }
}

export async function getDiary(id: string): Promise<Diary | null> {
  const diaries = await getDiaries();
  return diaries.find((d) => d.id === id) || null;
}

export async function createDiary(diary: Omit<Diary, "id" | "createdAt" | "updatedAt">): Promise<Diary> {
  ensureDataDir();
  const diaries = await getDiaries();
  const now = new Date().toISOString();
  const newDiary: Diary = {
    ...diary,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  diaries.push(newDiary);
  fs.writeFileSync(DATA_FILE, JSON.stringify(diaries, null, 2));
  return newDiary;
}

export async function updateDiary(id: string, updates: Partial<Diary>): Promise<Diary | null> {
  ensureDataDir();
  const diaries = await getDiaries();
  const index = diaries.findIndex((d) => d.id === id);
  if (index === -1) return null;
  
  diaries[index] = {
    ...diaries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(diaries, null, 2));
  return diaries[index];
}

export async function deleteDiary(id: string): Promise<boolean> {
  ensureDataDir();
  const diaries = await getDiaries();
  const filtered = diaries.filter((d) => d.id !== id);
  if (filtered.length === diaries.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}