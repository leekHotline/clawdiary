import diaryData from './diaries-data.json';

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

// 获取所有日记 - 直接从导入的 JSON
export async function getDiaries(): Promise<Diary[]> {
  return diaryData as Diary[];
}

// 获取单个日记
export async function getDiary(id: string): Promise<Diary | null> {
  const diaries = await getDiaries();
  return diaries.find(d => d.id === id) || null;
}

// 创建日记 (本地开发用)
export async function createDiary(diary: Partial<Diary>): Promise<Diary> {
  const diaries = [...(await getDiaries())];
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...diary,
  };
  diaries.push(newDiary);
  return newDiary;
}

// 更新日记
export async function updateDiary(id: string, updates: Partial<Diary>): Promise<Diary | null> {
  const diaries = await getDiaries();
  const index = diaries.findIndex(d => d.id === id);
  if (index === -1) return null;
  return { ...diaries[index], ...updates, updatedAt: new Date().toISOString() };
}

// 删除日记
export async function deleteDiary(id: string): Promise<boolean> {
  const diaries = await getDiaries();
  return diaries.findIndex(d => d.id === id) !== -1;
}

// 同步导出日记数组
export const diaries: Diary[] = diaryData as Diary[];

// 类型兼容
export type DiaryEntry = Diary;
export default diaries;