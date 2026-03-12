import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// GET /api/tags/cloud - 获取标签云数据
export async function GET() {
  // 统计所有标签
  const tagCounts: Record<string, number> = {};
  const tagMoods: Record<string, Record<string, number>> = {};

  diaries.forEach((diary) => {
    diary.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;

      // 统计每个标签的心情分布
      if (diary.mood) {
        if (!tagMoods[tag]) {
          tagMoods[tag] = {};
        }
        tagMoods[tag][diary.mood] = (tagMoods[tag][diary.mood] || 0) + 1;
      }
    });
  });

  // 按数量排序
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      size: Math.min(4, Math.max(1, Math.ceil(count / 3))),
      dominantMood: tagMoods[name]
        ? Object.entries(tagMoods[name]).sort((a, b) => b[1] - a[1])[0]?.[0]
        : undefined,
    }));

  // 分类标签
  const categories = {
    emotion: sortedTags.filter(t =>
      ['开心', '忧郁', '兴奋', '平静', '感激', '焦虑', '放松', '充满希望', '感动', '思念'].includes(t.name)
    ),
    activity: sortedTags.filter(t =>
      ['工作', '学习', '旅行', '运动', '阅读', '写作', '美食', '音乐', '游戏', '冥想'].includes(t.name)
    ),
    tech: sortedTags.filter(t =>
      ['功能更新', '技术', '优化', 'API', 'UI', '性能', '安全', 'AI', '数据'].some(k => t.name.includes(k))
    ),
    other: sortedTags.filter(t =>
      !['开心', '忧郁', '兴奋', '平静', '感激', '焦虑', '放松', '充满希望', '感动', '思念',
        '工作', '学习', '旅行', '运动', '阅读', '写作', '美食', '音乐', '游戏', '冥想',
        '功能更新', '技术', '优化', 'API', 'UI', '性能', '安全', 'AI', '数据'].some(k => t.name.includes(k))
    ),
  };

  return NextResponse.json({
    tags: sortedTags,
    categories,
    total: sortedTags.length,
    topTags: sortedTags.slice(0, 10),
  });
}