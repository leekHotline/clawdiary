import fs from "fs";
import path from "path";

export interface WritingStats {
  id: string;
  date: string;
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  avgWordLength: number;
  uniqueWords: number;
  lexicalDensity: number; // unique words / total words
  readingTime: number; // in minutes
}

export interface WritingHabit {
  id: string;
  date: string;
  writeTime?: number; // minutes spent writing
  sessionCount: number;
  peakHour?: number; // most productive hour
  devices?: string[];
  locations?: string[];
}

export interface WritingStyle {
  id: string;
  period: string; // e.g., "2026-03" or "last-30-days"
  commonTopics: string[];
  commonTags: string[];
  avgMood: number;
  writingPatterns: {
    preferredDays: string[]; // e.g., ["Saturday", "Sunday"]
    preferredHours: number[];
    avgPostLength: number;
  };
  vocabulary: {
    topWords: string[];
    rareWords: string[];
    avgWordLength: number;
  };
  style: {
    formality: number; // 0-1
    emotionality: number; // 0-1
    complexity: number; // 0-1
  };
}

export interface WritingGoalProgress {
  id: string;
  goalId: string;
  date: string;
  progress: number;
  target: number;
  achieved: boolean;
}

const ANALYSIS_FILE = path.join(process.cwd(), "data", "writing-analysis.json");

function ensureDataDir() {
  const dataDir = path.dirname(ANALYSIS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 中文分词简单实现（按字符和标点分割）
function tokenize(text: string): string[] {
  // 移除标点和空白
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ");
  const tokens: string[] = [];
  let currentWord = "";
  
  for (const char of cleanText) {
    if (char === " ") {
      if (currentWord) {
        tokens.push(currentWord);
        currentWord = "";
      }
    } else if (/[\u4e00-\u9fa5]/.test(char)) {
      // 中文字符作为单个词
      if (currentWord) {
        tokens.push(currentWord);
        currentWord = "";
      }
      tokens.push(char);
    } else {
      currentWord += char;
    }
  }
  
  if (currentWord) {
    tokens.push(currentWord);
  }
  
  return tokens.filter(t => t.length > 0);
}

// 分析文本统计
export function analyzeText(content: string): WritingStats {
  const words = tokenize(content);
  const wordCount = words.length;
  const charCount = content.length;
  
  // 段落统计
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length || 1;
  
  // 句子统计（中英文）
  const sentences = content.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;
  
  // 平均句子长度
  const avgSentenceLength = Math.round(charCount / sentenceCount);
  
  // 平均词长
  const totalWordLength = words.reduce((sum, w) => sum + w.length, 0);
  const avgWordLength = wordCount > 0 ? Math.round((totalWordLength / wordCount) * 10) / 10 : 0;
  
  // 唯一词
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  
  // 词汇密度
  const lexicalDensity = wordCount > 0 ? Math.round((uniqueWords / wordCount) * 100) : 0;
  
  // 阅读时间（中文约 400 字/分钟，英文约 200 词/分钟）
  const readingTime = Math.max(1, Math.ceil(charCount / 400));
  
  return {
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0],
    wordCount,
    charCount,
    paragraphCount,
    sentenceCount,
    avgSentenceLength,
    avgWordLength,
    uniqueWords,
    lexicalDensity,
    readingTime,
  };
}

// 分析写作风格
export function analyzeStyle(diaries: Array<{ content: string; date: string; tags?: string[] }>): WritingStyle {
  const allContent = diaries.map(d => d.content).join(" ");
  const stats = analyzeText(allContent);
  const words = tokenize(allContent);
  
  // 词频统计
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const lower = w.toLowerCase();
    wordFreq[lower] = (wordFreq[lower] || 0) + 1;
  });
  
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1]);
  
  const topWords = sortedWords.slice(0, 20).map(([word]) => word);
  const rareWords = sortedWords.filter(([_, count]) => count === 1).slice(0, 20).map(([word]) => word);
  
  // 标签统计
  const tagFreq: Record<string, number> = {};
  diaries.forEach(d => {
    d.tags?.forEach(tag => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    });
  });
  const commonTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
  
  // 写作时间分析
  const hourCount: Record<number, number> = {};
  const dayCount: Record<string, number> = {};
  
  diaries.forEach(d => {
    const date = new Date(d.date);
    const hour = date.getHours();
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    hourCount[hour] = (hourCount[hour] || 0) + 1;
    dayCount[day] = (dayCount[day] || 0) + 1;
  });
  
  const preferredHours = Object.entries(hourCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h]) => parseInt(h));
  
  const preferredDays = Object.entries(dayCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => day);
  
  // 风格分析（简化版）
  const emotionalWords = ["开心", "难过", "快乐", "悲伤", "感动", "愤怒", "happy", "sad", "love", "hate", "喜欢", "讨厌", "激动", "平静"];
  const formalWords = ["因此", "所以", "此外", "然而", "总之", "综上所述", "therefore", "however", "furthermore"];
  const complexWords = words.filter(w => w.length > 4);
  
  const emotionality = Math.min(1, words.filter(w => emotionalWords.includes(w.toLowerCase())).length / Math.max(words.length, 1) * 10);
  const formality = Math.min(1, words.filter(w => formalWords.includes(w.toLowerCase())).length / Math.max(words.length, 1) * 20);
  const complexity = Math.min(1, complexWords.length / Math.max(words.length, 1) * 5);
  
  return {
    id: Date.now().toString(),
    period: "all-time",
    commonTopics: [],
    commonTags,
    avgMood: 0,
    writingPatterns: {
      preferredDays,
      preferredHours,
      avgPostLength: stats.charCount / diaries.length,
    },
    vocabulary: {
      topWords,
      rareWords,
      avgWordLength: stats.avgWordLength,
    },
    style: {
      formality: Math.round(formality * 100) / 100,
      emotionality: Math.round(emotionality * 100) / 100,
      complexity: Math.round(complexity * 100) / 100,
    },
  };
}

export async function getWritingAnalysis(): Promise<{
  stats: WritingStats[];
  habits: WritingHabit[];
  styles: WritingStyle[];
}> {
  try {
    ensureDataDir();
    if (!fs.existsSync(ANALYSIS_FILE)) {
      return { stats: [], habits: [], styles: [] };
    }
    const data = fs.readFileSync(ANALYSIS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading writing analysis:", error);
    return { stats: [], habits: [], styles: [] };
  }
}

export async function saveWritingStats(stats: WritingStats): Promise<void> {
  ensureDataDir();
  const analysis = await getWritingAnalysis();
  analysis.stats.push(stats);
  // 只保留最近 365 天的数据
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  analysis.stats = analysis.stats.filter(s => new Date(s.date) >= yearAgo);
  try {
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
  } catch (e) {
    console.error("Failed to write writing analysis file:", e);
  }
}

export async function saveWritingHabit(habit: WritingHabit): Promise<void> {
  ensureDataDir();
  const analysis = await getWritingAnalysis();
  analysis.habits.push(habit);
  try {
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
  } catch (e) {
    console.error("Failed to write writing analysis file:", e);
  }
}

export async function saveWritingStyle(style: WritingStyle): Promise<void> {
  ensureDataDir();
  const analysis = await getWritingAnalysis();
  // 更新或添加
  const index = analysis.styles.findIndex(s => s.period === style.period);
  if (index >= 0) {
    analysis.styles[index] = style;
  } else {
    analysis.styles.push(style);
  }
  try {
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
  } catch (e) {
    console.error("Failed to write writing analysis file:", e);
  }
}