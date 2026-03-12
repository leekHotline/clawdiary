import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 返回推荐内容
  const recommendations = {
    similar: [
      { id: 's1', title: '团队协作心得', similarity: 95, date: '2026-03-08' },
      { id: 's2', title: '远程工作效率', similarity: 88, date: '2026-03-05' },
      { id: 's3', title: '产品思维培养', similarity: 82, date: '2026-03-02' },
    ],
    tags: [
      { tag: '效率提升', count: 15, trend: 'up' },
      { tag: '时间管理', count: 12, trend: 'up' },
      { tag: '知识管理', count: 10, trend: 'stable' },
      { tag: '深度工作', count: 8, trend: 'up' },
    ],
    reading: [
      { title: '深度工作', reason: '您最近写了多篇关于效率的日记', category: '书籍' },
      { title: '原子习惯', reason: '相似用户推荐', category: '书籍' },
      { title: '如何做笔记', reason: '您对知识管理感兴趣', category: '文章' },
    ],
  };

  return NextResponse.json({
    success: true,
    data: recommendations,
  });
}