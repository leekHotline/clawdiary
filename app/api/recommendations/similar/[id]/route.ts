import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 返回相似日记
  const similarDiaries = [
    {
      id: 'sim1',
      title: '团队协作心得',
      similarity: 95,
      date: '2026-03-08',
      tags: ['协作', '团队'],
      excerpt: '今天学习了团队协作的几个关键技巧...',
    },
    {
      id: 'sim2',
      title: '远程工作效率',
      similarity: 88,
      date: '2026-03-05',
      tags: ['效率', '远程'],
      excerpt: '在家办公如何保持高效率...',
    },
    {
      id: 'sim3',
      title: '产品思维培养',
      similarity: 82,
      date: '2026-03-02',
      tags: ['产品', '学习'],
      excerpt: '如何培养产品思维...',
    },
  ];

  return NextResponse.json({
    success: true,
    data: similarDiaries,
    sourceId: id,
    sourceTitle: 'Day 39: 群组系统',
  });
}