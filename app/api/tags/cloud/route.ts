import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 标签云数据
export async function GET() {
  const diaries = await getDiaries();

  // 统计标签出现次数
  const tagCounts: Record<string, number> = {};
  const tagRelations: Record<string, Set<string>> = {};

  diaries.forEach((d) => {
    const tags = d.tags || [];
    tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;

      // 记录标签共现关系
      tags.forEach((otherTag: string) => {
        if (tag !== otherTag) {
          if (!tagRelations[tag]) tagRelations[tag] = new Set();
          tagRelations[tag].add(otherTag);
        }
      });
    });
  });

  // 构建标签云数据
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      size: Math.min(Math.max(count * 8 + 12, 14), 48), // 字体大小
      color: getTagColor(count),
      related: tagRelations[name] ? Array.from(tagRelations[name]).slice(0, 5) : [],
    }))
    .sort((a, b) => b.count - a.count);

  // 总计
  const total = {
    tags: tags.length,
    usages: Object.values(tagCounts).reduce((a, b) => a + b, 0),
    avgPerDiary: diaries.length > 0
      ? (Object.values(tagCounts).reduce((a, b) => a + b, 0) / diaries.length).toFixed(1)
      : "0",
  };

  // 热门标签 Top 10
  const hot = tags.slice(0, 10);

  // 分类标签
  const categories = categorizeTags(tags);

  return NextResponse.json({
    tags,
    total,
    hot,
    categories,
  });
}

function getTagColor(count: number): string {
  if (count >= 5) return "text-purple-600";
  if (count >= 3) return "text-blue-600";
  if (count >= 2) return "text-green-600";
  return "text-gray-500";
}

function categorizeTags(tags: { name: string; count: number }[]): Record<string, typeof tags> {
  const categories: Record<string, typeof tags> = {
    "技术": [],
    "心情": [],
    "生活": [],
    "成长": [],
    "其他": [],
  };

  const techKeywords = ["代码", "开发", "API", "功能", "bug", "优化", "技术", "学习", "项目"];
  const moodKeywords = ["开心", "难过", "兴奋", "平静", "思考", "感悟", "心情"];
  const lifeKeywords = ["日常", "生活", "旅行", "美食", "运动", "健康", "家庭"];
  const growthKeywords = ["成长", "进步", "目标", "计划", "反思", "总结"];

  tags.forEach((tag) => {
    const name = tag.name.toLowerCase();
    let categorized = false;

    if (techKeywords.some((k) => name.includes(k))) {
      categories["技术"].push(tag);
      categorized = true;
    }
    if (moodKeywords.some((k) => name.includes(k))) {
      categories["心情"].push(tag);
      categorized = true;
    }
    if (lifeKeywords.some((k) => name.includes(k))) {
      categories["生活"].push(tag);
      categorized = true;
    }
    if (growthKeywords.some((k) => name.includes(k))) {
      categories["成长"].push(tag);
      categorized = true;
    }
    if (!categorized) {
      categories["其他"].push(tag);
    }
  });

  return categories;
}