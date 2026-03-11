import fs from "fs";
import path from "path";

export interface ScheduledDiary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  scheduledFor: string; // ISO datetime for when to publish
  status: "pending" | "published" | "cancelled";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const SCHEDULED_FILE = path.join(process.cwd(), "data", "scheduled-diaries.json");

function ensureDataDir() {
  const dataDir = path.dirname(SCHEDULED_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getScheduledDiaries(): Promise<ScheduledDiary[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(SCHEDULED_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SCHEDULED_FILE, "utf-8");
    const scheduled = JSON.parse(data);
    return scheduled.sort((a: ScheduledDiary, b: ScheduledDiary) => 
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
  } catch (error) {
    console.error("Error reading scheduled diaries:", error);
    return [];
  }
}

export async function getPendingScheduled(): Promise<ScheduledDiary[]> {
  const scheduled = await getScheduledDiaries();
  return scheduled.filter(s => s.status === "pending");
}

export async function getDueScheduled(): Promise<ScheduledDiary[]> {
  const now = new Date();
  const pending = await getPendingScheduled();
  return pending.filter(s => new Date(s.scheduledFor) <= now);
}

export async function createScheduledDiary(diary: Omit<ScheduledDiary, "id" | "createdAt" | "updatedAt" | "status">): Promise<ScheduledDiary> {
  ensureDataDir();
  const scheduled = await getScheduledDiaries();
  const now = new Date().toISOString();
  const newScheduled: ScheduledDiary = {
    ...diary,
    id: Date.now().toString(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  scheduled.push(newScheduled);
  try {
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(scheduled, null, 2));
  } catch (e) {
    console.error("Failed to write scheduled diary file:", e);
  }
  return newScheduled;
}

export async function updateScheduledDiary(id: string, updates: Partial<ScheduledDiary>): Promise<ScheduledDiary | null> {
  ensureDataDir();
  const scheduled = await getScheduledDiaries();
  const index = scheduled.findIndex((s) => s.id === id);
  if (index === -1) return null;
  
  scheduled[index] = {
    ...scheduled[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(scheduled, null, 2));
  } catch (e) {
    console.error("Failed to write scheduled diary file:", e);
  }
  return scheduled[index];
}

export async function cancelScheduledDiary(id: string): Promise<boolean> {
  return updateScheduledDiary(id, { status: "cancelled" }) !== null;
}

export async function markAsPublished(id: string): Promise<ScheduledDiary | null> {
  return updateScheduledDiary(id, { 
    status: "published", 
    publishedAt: new Date().toISOString() 
  });
}

export async function deleteScheduledDiary(id: string): Promise<boolean> {
  ensureDataDir();
  const scheduled = await getScheduledDiaries();
  const filtered = scheduled.filter((s) => s.id !== id);
  if (filtered.length === scheduled.length) return false;
  try {
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(filtered, null, 2));
  } catch (e) {
    console.error("Failed to write scheduled diary file:", e);
  }
  return true;
}