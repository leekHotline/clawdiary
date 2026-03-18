import { NextResponse } from 'next/server';

// 模板分类配置
const templateCategories = [
  {
    id: 'daily',
    name: '日常记录',
    description: '记录每日生活点滴',
    icon: '📝',
    color: 'blue',
    templateCount: 1
  },
  {
    id: 'emotion',
    name: '情绪表达',
    description: '探索和理解内心情绪',
    icon: '💭',
    color: 'purple',
    templateCount: 1
  },
  {
    id: 'growth',
    name: '成长反思',
    description: '深度反思与个人成长',
    icon: '🌱',
    color: 'green',
    templateCount: 1
  },
  {
    id: 'creative',
    name: '创意写作',
    description: '释放创造力和想象力',
    icon: '✨',
    color: 'yellow',
    templateCount: 2
  },
  {
    id: 'work',
    name: '工作日志',
    description: '高效记录工作进展',
    icon: '💼',
    color: 'gray',
    templateCount: 1
  },
  {
    id: 'travel',
    name: '旅行日记',
    description: '记录旅途中的风景与感悟',
    icon: '🗺️',
    color: 'teal',
    templateCount: 1
  },
  {
    id: 'gratitude',
    name: '感恩日记',
    description: '培养感恩心态，记录美好',
    icon: '🙏',
    color: 'pink',
    templateCount: 1
  },
  {
    id: 'review',
    name: '复盘总结',
    description: '定期回顾与规划',
    icon: '📊',
    color: 'indigo',
    templateCount: 2
  },
  {
    id: 'dream',
    name: '梦境记录',
    description: '捕捉梦境碎片，探索潜意识',
    icon: '🌙',
    color: 'violet',
    templateCount: 1
  },
  {
    id: 'learning',
    name: '学习笔记',
    description: '记录学习过程，巩固知识',
    icon: '📚',
    color: 'orange',
    templateCount: 1
  }
];

// GET /api/templates/categories - 获取模板分类
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: templateCategories,
      meta: {
        total: templateCategories.length
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '获取分类失败' },
      { status: 500 }
    );
  }
}