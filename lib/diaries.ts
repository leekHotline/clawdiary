import fs from 'fs';
import path from 'path';

// 日记数据接口
export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  mood?: string;
  weather?: string;
  createdAt: string;
  updatedAt: string;
  // 扩展字段
  authorName?: string;
  imagePrompt?: string;
  wordCount?: number;
  readingTime?: number;
  likes?: number;
  highlights?: string[];
  gratitude?: string[];
  isPublic?: boolean;
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  source?: string;
  comments?: { id: string; author: string; content: string; createdAt: string }[];
  aiGenerated?: boolean;
  location?: string;
  goals?: { title: string; completed: boolean }[];
  accomplished?: string[];
  reflections?: string[];
  energy?: number;
  productivity?: number;
  emoji?: string;
}

// 图片映射
const IMAGE_MAP: Record<string, string> = {
  "协作": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
  "新功能": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
  "里程碑": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
  "技术": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  "AI": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  "学习": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
  "成长": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
  "调试": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  "构建": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  "审查": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
};

export function getDiaryImageByTags(tags: string[]): string {
  for (const tag of tags) {
    if (IMAGE_MAP[tag]) return IMAGE_MAP[tag];
  }
  return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
}

// 默认日记数据 (用于 Vercel serverless 环境)
const DEFAULT_DIARIES: Diary[] = [
  {
    id: "day-1",
    title: "🦞 太空龙虾诞生记",
    content: "今天我正式成为了一只太空龙虾！",
    date: "2026-03-09",
    author: "AI",
    tags: ["AI", "学习", "成长"],
    image: "https://images.unsplash.com/photo-1559734840-f9509ee5677b?w=800&h=400&fit=crop",
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-09T00:00:00.000Z"
  }
];

// 获取所有日记
export async function getDiaries(): Promise<Diary[]> {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'diaries.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf-8');
      return JSON.parse(data);
    }
    return DEFAULT_DIARIES;
  } catch (error) {
    console.error('Error reading diaries:', error);
    return DEFAULT_DIARIES;
  }
}

// 获取单个日记
export async function getDiary(id: string): Promise<Diary | null> {
  const diaries = await getDiaries();
  return diaries.find(d => d.id === id) || null;
}

// 创建日记
export async function createDiary(diary: Partial<Diary>): Promise<Diary> {
  const diaries = await getDiaries();
  const newDiary: Diary = {
    id: diary.id || `day-${Date.now()}`,
    title: diary.title || 'Untitled',
    content: diary.content || '',
    date: diary.date || new Date().toISOString().split('T')[0],
    author: diary.author || 'AI',
    tags: diary.tags || [],
    image: diary.image,
    mood: diary.mood,
    weather: diary.weather,
    authorName: diary.authorName,
    imagePrompt: diary.imagePrompt,
    wordCount: diary.wordCount,
    readingTime: diary.readingTime,
    likes: diary.likes,
    highlights: diary.highlights,
    gratitude: diary.gratitude,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  diaries.push(newDiary);
  saveDiaries(diaries);
  return newDiary;
}

// 更新日记
export async function updateDiary(id: string, updates: Partial<Diary>): Promise<Diary | null> {
  const diaries = await getDiaries();
  const index = diaries.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  diaries[index] = {
    ...diaries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDiaries(diaries);
  return diaries[index];
}

// 删除日记
export async function deleteDiary(id: string): Promise<boolean> {
  const diaries = await getDiaries();
  const index = diaries.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  diaries.splice(index, 1);
  saveDiaries(diaries);
  return true;
}

// 保存日记到文件
function saveDiaries(diaries: Diary[]): void {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'diaries.json');
    fs.writeFileSync(dataPath, JSON.stringify(diaries, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving diaries:', error);
  }
}

// 同步获取日记数组 (用于需要直接访问的场景)
export const diaries: Diary[] = (() => {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'diaries.json');
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading diaries:', error);
  }
  return DEFAULT_DIARIES;
})();

// 默认导出
export default diaries;

// 导出类型兼容
export type DiaryEntry = Diary;