import fs from "fs";
import path from "path";

export interface Version {
  id: string;
  diaryId: string;
  title: string;
  content: string;
  tags?: string[];
  image?: string;
  updatedAt: string;
  savedAt: string;
}

const HISTORY_FILE = path.join(process.cwd(), "data", "history.json");

function ensureDataDir() {
  const dataDir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getHistory(): Promise<Version[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
}

export async function getDiaryHistory(diaryId: string): Promise<Version[]> {
  const history = await getHistory();
  return history
    .filter((v) => v.diaryId === diaryId)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export async function getVersion(id: string): Promise<Version | null> {
  const history = await getHistory();
  return history.find((v) => v.id === id) || null;
}

export async function saveVersion(
  diaryId: string,
  data: {
    title: string;
    content: string;
    tags?: string[];
    image?: string;
    updatedAt: string;
  }
): Promise<Version> {
  ensureDataDir();
  const history = await getHistory();
  
  const version: Version = {
    id: `ver_${Date.now()}`,
    diaryId,
    title: data.title,
    content: data.content,
    tags: data.tags,
    image: data.image,
    updatedAt: data.updatedAt,
    savedAt: new Date().toISOString(),
  };
  
  history.push(version);
  
  // 只保留每个日记最近 20 个版本
  const diaryVersions = new Map<string, Version[]>();
  history.forEach((v) => {
    if (!diaryVersions.has(v.diaryId)) {
      diaryVersions.set(v.diaryId, []);
    }
    diaryVersions.get(v.diaryId)!.push(v);
  });
  
  const filteredHistory: Version[] = [];
  diaryVersions.forEach((versions) => {
    const sorted = versions.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
    filteredHistory.push(...sorted.slice(0, 20));
  });
  
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(filteredHistory, null, 2));
  return version;
}

export async function deleteDiaryHistory(diaryId: string): Promise<boolean> {
  ensureDataDir();
  const history = await getHistory();
  const filtered = history.filter((v) => v.diaryId !== diaryId);
  if (filtered.length === history.length) return false;
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(filtered, null, 2));
  return true;
}