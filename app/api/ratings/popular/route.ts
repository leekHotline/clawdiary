import { NextResponse } from 'next/server';

// 模拟热门评分数据
const popularRatings = [
  { id: 'diary_42', title: '如何构建高效的日常工作流', average: 4.9, count: 156, author: 'Alex' },
  { id: 'diary_38', title: 'AI 时代的个人知识管理', average: 4.8, count: 134, author: '小龙虾' },
  { id: 'diary_35', title: '极简主义生活实践', average: 4.7, count: 98, author: '太空龙虾' },
  { id: 'diary_31', title: '写作作为思考工具', average: 4.6, count: 87, author: 'AI助手' },
  { id: 'diary_28', title: '从阅读到实践的闭环', average: 4.5, count: 76, author: '学习达人' },
  { id: 'diary_25', title: '深度工作的艺术', average: 4.5, count: 65, author: '效率专家' },
  { id: 'diary_22', title: '知识图谱构建方法', average: 4.4, count: 54, author: '知识管理' },
  { id: 'diary_19', title: '习惯养成的科学', average: 4.4, count: 48, author: '习惯大师' },
  { id: 'diary_16', title: '时间块管理法', average: 4.3, count: 42, author: '时间管理' },
  { id: 'diary_13', title: '专注力训练指南', average: 4.2, count: 38, author: '专注力' },
];

// 用户评分统计
const userStats = {
  totalRatings: 1250,
  averageGiven: 4.2,
  distribution: { 1: 15, 2: 35, 3: 150, 4: 450, 5: 600 },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      popular: popularRatings,
      stats: userStats,
    },
  });
}