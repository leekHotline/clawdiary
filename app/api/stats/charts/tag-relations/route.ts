import { NextResponse } from 'next/server';

// 标签关联图 API - 分析标签之间的关联强度
export async function GET() {
  // 模拟标签关联数据
  const tagRelations = [
    { source: '技术', target: '学习', strength: 0.85, count: 42 },
    { source: '技术', target: '工作', strength: 0.72, count: 35 },
    { source: '学习', target: '成长', strength: 0.78, count: 28 },
    { source: '生活', target: '心情', strength: 0.65, count: 22 },
    { source: '心情', target: '感恩', strength: 0.82, count: 31 },
    { source: '工作', target: '压力', strength: 0.55, count: 18 },
    { source: '成长', target: '反思', strength: 0.88, count: 38 },
    { source: '反思', target: '目标', strength: 0.75, count: 25 },
    { source: '目标', target: '计划', strength: 0.92, count: 45 },
    { source: '计划', target: '执行', strength: 0.68, count: 20 },
    { source: '健康', target: '运动', strength: 0.85, count: 32 },
    { source: '运动', target: '心情', strength: 0.72, count: 24 },
    { source: '阅读', target: '学习', strength: 0.80, count: 36 },
    { source: '阅读', target: '成长', strength: 0.75, count: 30 },
    { source: '创意', target: '灵感', strength: 0.90, count: 28 }
  ];

  // 构建节点列表
  const nodeMap = new Map<string, { id: string; count: number }>();
  tagRelations.forEach(r => {
    if (!nodeMap.has(r.source)) {
      nodeMap.set(r.source, { id: r.source, count: 0 });
    }
    if (!nodeMap.has(r.target)) {
      nodeMap.set(r.target, { id: r.target, count: 0 });
    }
    nodeMap.get(r.source)!.count += r.count;
    nodeMap.get(r.target)!.count += r.count;
  });

  const nodes = Array.from(nodeMap.values()).map(n => ({
    ...n,
    size: Math.max(20, Math.min(60, n.count * 1.5))
  }));

  // 找出强关联标签对
  const strongRelations = tagRelations
    .filter(r => r.strength >= 0.7)
    .sort((a, b) => b.strength - a.strength);

  // 标签聚类
  const clusters = [
    { name: '学习成长', tags: ['学习', '成长', '反思', '目标', '计划'] },
    { name: '生活情感', tags: ['生活', '心情', '感恩', '健康', '运动'] },
    { name: '工作创造', tags: ['工作', '技术', '创意', '灵感', '阅读'] }
  ];

  return NextResponse.json({
    success: true,
    data: {
      nodes,
      links: tagRelations.map(r => ({
        source: r.source,
        target: r.target,
        strength: r.strength,
        count: r.count
      })),
      analysis: {
        totalTags: nodes.length,
        totalRelations: tagRelations.length,
        strongRelations: strongRelations.slice(0, 5).map(r => 
          `${r.source} ↔ ${r.target} (${Math.round(r.strength * 100)}%)`
        ),
        clusters,
        insights: [
          `🔗 发现 ${strongRelations.length} 对强关联标签`,
          `📊 ${nodes.length} 个标签形成知识网络`,
          '💡 尝试组合关联标签获得更丰富的内容'
        ]
      }
    }
  });
}