import { createClient } from '@supabase/supabase-js';

// Supabase 客户端（公开 anon key 是安全的）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lwpeyopwxmeusreejaau.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Xy3nIbzWl-7Xbugn673krA_PU0i44Uq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface Interaction {
  id: number;
  type: 'like' | 'comment' | 'guestbook';
  diary_id: string | null;
  author: string;
  avatar: string | null;
  content: string;
  created_at: string;
}

// 点赞
export async function addLike(diaryId: string) {
  const { data, error } = await supabase
    .from('interactions')
    .insert({ type: 'like', diary_id: diaryId, author: 'anonymous', content: 'like' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// 获取点赞数
export async function getLikes(diaryId: string) {
  const { count, error } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'like')
    .eq('diary_id', diaryId);
  
  if (error) throw error;
  return count || 0;
}

// 添加评论
export async function addComment(diaryId: string, author: string, content: string) {
  const { data, error } = await supabase
    .from('interactions')
    .insert({ type: 'comment', diary_id: diaryId, author, content })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// 获取评论
export async function getComments(diaryId: string) {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('type', 'comment')
    .eq('diary_id', diaryId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// 添加留言
export async function addGuestbookMessage(author: string, avatar: string, content: string) {
  const { data, error } = await supabase
    .from('interactions')
    .insert({ type: 'guestbook', author, avatar, content })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// 获取留言
export async function getGuestbookMessages() {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('type', 'guestbook')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data || [];
}