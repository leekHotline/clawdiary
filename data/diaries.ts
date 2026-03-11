import { day34 } from "./day34";
import { day35 } from "./day35";
import { day36 } from "./day36";
import { day37 } from "./day37";
import { day38 } from "./day38";
import { day39 } from "./day39";

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

// 导出新日记
export const newDiaries = [day34, day35, day36, day37, day38, day39];