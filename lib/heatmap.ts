import fs from "fs";
import path from "path";

export interface HeatmapEntry {
  date: string;
  count: number;
  words: number;
  mood: number | null;
}

interface HeatmapStats {
  totalDays: number;
  activeDays: number;
  totalWords: number;
  avgWordsPerDay: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; words: number } | null;
}

const DATA_FILE = path.join(process.cwd(), "data", "heatmap.json");

// Generate sample heatmap data for a year
function generateSampleData(year: number): HeatmapEntry[] {
  const data: HeatmapEntry[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getDay();
    const random = Math.random();

    // More likely to write on weekdays
    const writeChance = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.5;
    const shouldWrite = random < writeChance;

    if (shouldWrite) {
      const entries = Math.floor(Math.random() * 3) + 1;
      const words = Math.floor(Math.random() * 1500) + 100;
      const mood = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null;

      data.push({
        date: dateStr,
        count: entries,
        words,
        mood,
      });
    } else {
      data.push({
        date: dateStr,
        count: 0,
        words: 0,
        mood: null,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

function calculateStreaks(data: HeatmapEntry[]): { longest: number; current: number } {
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  // Sort by date
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach((entry) => {
    if (entry.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  // Calculate current streak from today backwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(today);
  currentStreak = 0;

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    const entry = data.find((e) => e.date === dateStr);
    if (entry && entry.count > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { longest: longestStreak, current: currentStreak };
}

function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export async function getHeatmapData(year: number): Promise<{
  data: HeatmapEntry[];
  stats: HeatmapStats;
}> {
  try {
    ensureDataDir();
    
    let data: HeatmapEntry[];
    
    if (fs.existsSync(DATA_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      data = fileData[year] || generateSampleData(year);
    } else {
      data = generateSampleData(year);
    }

    // Calculate stats
    const activeDays = data.filter((d) => d.count > 0).length;
    const totalWords = data.reduce((sum, d) => sum + d.words, 0);
    const { longest, current } = calculateStreaks(data);

    // Find best day
    const sortedByWords = [...data].filter((d) => d.words > 0).sort((a, b) => b.words - a.words);
    const bestDay = sortedByWords[0] ? { date: sortedByWords[0].date, words: sortedByWords[0].words } : null;

    const stats: HeatmapStats = {
      totalDays: data.length,
      activeDays,
      totalWords,
      avgWordsPerDay: activeDays > 0 ? Math.round(totalWords / activeDays) : 0,
      longestStreak: longest,
      currentStreak: current,
      bestDay,
    };

    return { data, stats };
  } catch (error) {
    console.error("Error reading heatmap data:", error);
    const data = generateSampleData(year);
    return {
      data,
      stats: {
        totalDays: data.length,
        activeDays: data.filter((d) => d.count > 0).length,
        totalWords: data.reduce((sum, d) => sum + d.words, 0),
        avgWordsPerDay: 0,
        longestStreak: 0,
        currentStreak: 0,
        bestDay: null,
      },
    };
  }
}

export async function updateHeatmapEntry(entry: Partial<HeatmapEntry> & { date: string }): Promise<void> {
  ensureDataDir();
  
  let allData: Record<number, HeatmapEntry[]> = {};
  if (fs.existsSync(DATA_FILE)) {
    allData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  }

  const year = new Date(entry.date).getFullYear();
  if (!allData[year]) {
    allData[year] = generateSampleData(year);
  }

  const index = allData[year].findIndex((e) => e.date === entry.date);
  if (index !== -1) {
    allData[year][index] = { ...allData[year][index], ...entry };
  } else {
    allData[year].push({
      date: entry.date,
      count: entry.count || 0,
      words: entry.words || 0,
      mood: entry.mood || null,
    });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2));
}