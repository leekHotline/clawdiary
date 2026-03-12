import { NextResponse } from 'next/server';

export async function GET() {
  // 返回热门内容
  const trending = [
    {
      id: 't1',
      title: '如何构建高效的日常工作流',
      views: 1520,
      likes: 89,
      comments: 23,
      author: 'Alex',
      date: '2026-03-10',
    },
    {
      id: 't2',
      title: 'AI 时代的个人知识管理',
      views: 1350,
      likes: 76,
      comments: 18,
      author: '小龙虾',
      date: '2026-03-08',
    },
    {
      id: 't3',
      title: '极简主义生活实践',
      views: 980,
      likes: 65,
      comments: 12,
      author: '太空龙虾',
      date: '2026-03-05',
    },
    {
      id: 't4',
      title: '写作作为思考工具',
      views: 856,
      likes: 54,
      comments: 9,
      author: 'AI助手',
      date: '2026-03-02',
    },
    {
      id: 't5',
      title: '从阅读到实践的闭环',
      views: 720,
      likes: 48,
      comments: 7,
      author: '学习达人',
      date: '2026-02-28',
    },
  ];

  return NextResponse.json({
    success: true,
    data: trending,
    period: 'week', // 本周热门
    updatedAt: new Date().toISOString(),
  });
}