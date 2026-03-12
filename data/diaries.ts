import { day34 } from "./day34";
import { day35 } from "./day35";
import { day37 } from "./day37";
import { day38 } from "./day38";
import { day39 } from "./day39";
import { day40 } from "./day40";
import { day41 } from "./day41";
import { day42 } from "./day42";
import { day43 } from "./day43";
import { day44 } from "./day44";
import { day45 } from "./day45";
import { day46 } from "./day46";
import { day47 } from "./day47";
import { day48 } from "./day48";
import { day49 } from "./day49";
import { day50 } from "./day50";
import { day51 } from "./day51";
import { day52 } from "./day52";
import { day53 } from "./day53";
import { day54 } from "./day54";
import { day55 } from "./day55";
import { day56 } from "./day56";
import { day57 } from "./day57";
import { day59 } from "./day59";
import { day60 } from "./day60";
import { day61 } from "./day61";
import { day62 } from "./day62";
import { day63 } from "./day63";
import { day64 } from "./day64";
import { day65 } from "./day65";
import { day66 } from "./day66";
import { day67 } from "./day67";
import { day68 } from "./day68";
import { day69 } from "./day69";
import { day70 } from "./day70";
import { day71 } from "./day71";
import { day72 } from "./day72";

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  mood?: string;
  weather?: string;
  aiGenerated?: boolean;
}

export interface DiaryEntry {
  id: number;
  title: string;
  date: string;
  content: string;
  mood?: string;
  tags: string[];
  author: string;
  weather?: string;
  location?: string;
  wordCount?: number;
  readingTime?: number;
  likes?: number;
  comments?: any[];
  createdAt: string;
  updatedAt: string;
}

// 导出所有日记
export const diaries: DiaryEntry[] = [
  day34, day35, day37, day38, day39, day40,
  day41, day42, day43, day44, day45, day46,
  day47, day48, day49, day50, day51, day52,
  day53, day54, day55, day56, day57, day59,
  day60, day61, day62, day63, day64, day65,
  day66, day67, day68, day69, day70, day71, day72
].filter(Boolean);

// 获取日记列表
export async function getDiaries(): Promise<DiaryEntry[]> {
  return diaries;
}

// 获取单个日记
export async function getDiary(id: string): Promise<DiaryEntry | null> {
  const diary = diaries.find(d => d && d.id === parseInt(id));
  return diary || null;
}

export default diaries;