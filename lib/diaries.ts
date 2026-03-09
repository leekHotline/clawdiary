import fs from "fs";
import path from "path";

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: "AI" | "Human";
  tags?: string[];
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "diaries.json");

// 确保数据目录存在
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 获取所有日记
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

// 获取单个日记
export async function getDiary(id: string): Promise<Diary | null> {
  const diaries = await getDiaries();
  return diaries.find((d) => d.id === id) || null;
}

// 创建日记
export async function createDiary(diary: Omit<Diary, "id" | "createdAt">): Promise<Diary> {
  ensureDataDir();
  const diaries = await getDiaries();
  const newDiary: Diary = {
    ...diary,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  diaries.push(newDiary);
  fs.writeFileSync(DATA_FILE, JSON.stringify(diaries, null, 2));
  return newDiary;
}

// 删除日记
export async function deleteDiary(id: string): Promise<boolean> {
  ensureDataDir();
  const diaries = await getDiaries();
  const filtered = diaries.filter((d) => d.id !== id);
  if (filtered.length === diaries.length) {
    return false;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}