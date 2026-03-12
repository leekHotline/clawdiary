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
