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