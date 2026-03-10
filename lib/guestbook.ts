import fs from "fs";
import path from "path";

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "guestbook.json");

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getEntries(): Promise<GuestbookEntry[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data).sort((a: GuestbookEntry, b: GuestbookEntry) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function addEntry(entry: Omit<GuestbookEntry, "id" | "createdAt">): Promise<GuestbookEntry> {
  ensureDataDir();
  const entries = await getEntries();
  const newEntry: GuestbookEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
  return newEntry;
}