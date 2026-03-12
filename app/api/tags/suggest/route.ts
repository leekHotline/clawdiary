import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// GET /api/tags/suggest - 智能推荐标签
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const content = searchParams.get('content') || '';
  const title = searchParams.get('title') || '';
  const limit = parseInt(searchParams.get('limit') || '5');

  // 基于内容的关键词推荐
  const keywordTags: Record<string, string[]> = {
    '功能': ['功能更新', '开发', '产品'],
    'API': ['API', '后端', '接口'],
    '页面': ['UI', '前端', '页面'],
    '优化': ['性能', '优化', '改进'],
    '心情': ['情绪', '感悟', '心路'],
    '工作': ['工作', '职场', '效率'],
    '学习': ['学习', '成长', '知识'],
    '旅行': ['旅行', '出行', '风景'],
    '美食': ['美食', '吃货', '生活'],
    '运动': ['运动', '健身', '健康'],
    '音乐': ['音乐', '艺术', '娱乐'],
    'AI': ['AI', '智能', '技术'],
    '日记': ['日记', '记录', '生活'],
    '朋友': ['朋友', '社交', '人际'],
    '家人': ['家人', '亲情', '温暖'],
    '项目': ['项目', '开发', '进度'],
  };

  const text = (title + ' ' + content).toLowerCase();
  const suggestedTags: string[] = [];

  // 根据关键词推荐
  Object.entries(keywordTags).forEach(([keyword, tags]) => {
    if (text.includes(keyword.toLowerCase())) {
      tags.forEach(tag => {
        if (!suggestedTags.includes(tag)) {
          suggestedTags.push(tag);
        }
      });
    }
  });

  // 统计现有标签使用频率
  const tagCounts: Record<string, number> = {};
  diaries.forEach(diary => {
    diary.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // 根据用户常用标签补充推荐
  const frequentTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  frequentTags.forEach(tag => {
    if (suggestedTags.length < limit * 2 && !suggestedTags.includes(tag)) {
      suggestedTags.push(tag);
    }
  });

  // 推荐心情标签
  const moodKeywords: Record<string, string> = {
    '开心': 'happy',
    '快乐': 'happy',
    '幸福': 'happy',
    '悲伤': 'sad',
    '难过': 'sad',
    '焦虑': 'anxious',
    '担心': 'anxious',
    '兴奋': 'excited',
    '激动': 'excited',
    '平静': 'calm',
    '放松': 'calm',
    '感激': 'grateful',
    '感谢': 'grateful',
  };

  const suggestedMood = Object.entries(moodKeywords).find(([keyword]) =>
    text.includes(keyword)
  );

  return NextResponse.json({
    suggestedTags: suggestedTags.slice(0, limit),
    frequentTags: frequentTags.slice(0, 5),
    suggestedMood: suggestedMood ? {
      mood: suggestedMood[1],
      keyword: suggestedMood[0],
    } : null,
  });
}