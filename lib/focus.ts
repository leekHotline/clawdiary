import fs from "fs";
import path from "path";

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  wordsWritten: number;
  diaryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "focus-sessions.json");

const defaultSessions: FocusSession[] = [
  {
    id: "1",
    userId: "default",
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 2 + 1500000).toISOString(),
    duration: 25,
    wordsWritten: 523,
    notes: "今天的专注写作完成了一篇关于AI学习的思考",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    userId: "default",
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 2700000).toISOString(),
    duration: 45,
    wordsWritten: 1203,
    notes: "深度写作，完成了一篇长文",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    userId: "default",
    startTime: new Date().toISOString(),
    endTime: undefined,
    duration: 15,
    wordsWritten: 287,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getFocusSessions(userId?: string): Promise<FocusSession[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return defaultSessions;
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const sessions = JSON.parse(data);
    if (!sessions || sessions.length === 0) {
      return defaultSessions;
    }
    return userId
      ? sessions.filter((s: FocusSession) => s.userId === userId)
      : sessions;
  } catch (error) {
    console.error("Error reading focus sessions:", error);
    return defaultSessions;
  }
}

export async function getFocusSession(id: string): Promise<FocusSession | null> {
  const sessions = await getFocusSessions();
  return sessions.find((s) => s.id === id) || null;
}

export async function getTodayFocusSessions(userId: string): Promise<{
  sessions: FocusSession[];
  stats: {
    totalMinutes: number;
    totalWords: number;
    sessions: number;
  };
}> {
  const sessions = await getFocusSessions(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.startTime);
    return sessionDate >= today && sessionDate < tomorrow;
  });

  const stats = {
    totalMinutes: todaySessions.reduce((sum, s) => sum + s.duration, 0),
    totalWords: todaySessions.reduce((sum, s) => sum + s.wordsWritten, 0),
    sessions: todaySessions.length,
  };

  return { sessions: todaySessions, stats };
}

export async function createFocusSession(
  session: Omit<FocusSession, "id" | "createdAt" | "updatedAt">
): Promise<FocusSession> {
  ensureDataDir();
  const sessions = await getFocusSessions();
  const now = new Date().toISOString();
  const newSession: FocusSession = {
    ...session,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  sessions.push(newSession);
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
  } catch (e) {
    console.error("Failed to write focus sessions file:", e);
  }
  return newSession;
}

export async function updateFocusSession(
  id: string,
  updates: Partial<FocusSession>
): Promise<FocusSession | null> {
  ensureDataDir();
  const sessions = await getFocusSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return null;

  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
  } catch (e) {
    console.error("Failed to write focus sessions file:", e);
  }
  return sessions[index];
}

export async function deleteFocusSession(id: string): Promise<boolean> {
  ensureDataDir();
  const sessions = await getFocusSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  if (filtered.length === sessions.length) return false;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  } catch (e) {
    console.error("Failed to write focus sessions file:", e);
  }
  return true;
}

export async function getFocusStats(
  userId: string,
  period: "day" | "week" | "month" | "year" = "week"
): Promise<{
  totalMinutes: number;
  totalWords: number;
  totalSessions: number;
  avgDuration: number;
  avgWords: number;
  streak: number;
  byDate: Record<string, { minutes: number; words: number; sessions: number }>;
}> {
  const sessions = await getFocusSessions(userId);
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "day":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const filteredSessions = sessions.filter(
    (s) => new Date(s.startTime) >= startDate
  );

  const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalWords = filteredSessions.reduce((sum, s) => sum + s.wordsWritten, 0);
  const totalSessions = filteredSessions.length;
  const avgDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;
  const avgWords = totalSessions > 0 ? totalWords / totalSessions : 0;

  // Calculate streak
  const byDate: Record<string, { minutes: number; words: number; sessions: number }> = {};
  filteredSessions.forEach((s) => {
    const dateKey = new Date(s.startTime).toISOString().split("T")[0];
    if (!byDate[dateKey]) {
      byDate[dateKey] = { minutes: 0, words: 0, sessions: 0 };
    }
    byDate[dateKey].minutes += s.duration;
    byDate[dateKey].words += s.wordsWritten;
    byDate[dateKey].sessions += 1;
  });

  // Calculate current streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let checkDate = new Date(today);

  while (true) {
    const dateKey = checkDate.toISOString().split("T")[0];
    if (byDate[dateKey] && byDate[dateKey].sessions > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    totalMinutes,
    totalWords,
    totalSessions,
    avgDuration: Math.round(avgDuration),
    avgWords: Math.round(avgWords),
    streak,
    byDate,
  };
}