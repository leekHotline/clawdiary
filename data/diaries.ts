import { day34 } from "./day34";
import { day35 } from "./day35";
import { day36 } from "./day36";

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
}

// 导出新日记
export const newDiaries = [day34, day35, day36];