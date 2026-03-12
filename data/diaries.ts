import { day34 } from "./day34";
import { day35 } from "./day35";
import { day36 } from "./day36";
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
export const newDiaries = [day34, day35, day36, day37, day38, day39, day40, day41, day42, day43, day44, day45, day46, day47];