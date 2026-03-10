import fs from "fs";
import path from "path";

export interface Draft {
  id: string;
  title: string;
  content: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const DRAFTS_FILE = path.join(process.cwd(), "data", "drafts.json");

function ensureDataDir() {
  const dataDir = path.dirname(DRAFTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getDrafts(): Promise<Draft[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(DRAFTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DRAFTS_FILE, "utf-8");
    const drafts = JSON.parse(data);
    return drafts.sort((a: Draft, b: Draft) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error("Error reading drafts:", error);
    return [];
  }
}

export async function getDraft(id: string): Promise<Draft | null> {
  const drafts = await getDrafts();
  return drafts.find((d) => d.id === id) || null;
}

export async function createDraft(draft: Omit<Draft, "id" | "createdAt" | "updatedAt">): Promise<Draft> {
  ensureDataDir();
  const drafts = await getDrafts();
  const now = new Date().toISOString();
  const newDraft: Draft = {
    ...draft,
    id: `draft_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  drafts.push(newDraft);
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2));
  return newDraft;
}

export async function updateDraft(id: string, updates: Partial<Draft>): Promise<Draft | null> {
  ensureDataDir();
  const drafts = await getDrafts();
  const index = drafts.findIndex((d) => d.id === id);
  if (index === -1) return null;
  
  drafts[index] = {
    ...drafts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2));
  return drafts[index];
}

export async function deleteDraft(id: string): Promise<boolean> {
  ensureDataDir();
  const drafts = await getDrafts();
  const filtered = drafts.filter((d) => d.id !== id);
  if (filtered.length === drafts.length) return false;
  fs.writeFileSync(DRAFTS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}