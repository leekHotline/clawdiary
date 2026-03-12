import { NextRequest, NextResponse } from 'next/server';

// 模拟引用图谱数据
const graphData = {
  nodes: [
    { id: '1', diaryId: 45, title: '习惯的力量', date: '2026-03-10', group: 1 },
    { id: '2', diaryId: 48, title: '坚持的秘密', date: '2026-03-13', group: 1 },
    { id: '3', diaryId: 50, title: '习惯养成心得', date: '2026-03-15', group: 1 },
    { id: '4', diaryId: 52, title: '继续前行', date: '2026-03-17', group: 1 },
    { id: '5', diaryId: 30, title: '新年计划', date: '2026-02-22', group: 2 },
    { id: '6', diaryId: 35, title: '目标追踪', date: '2026-02-27', group: 2 },
    { id: '7', diaryId: 40, title: '季度总结', date: '2026-03-05', group: 2 },
    { id: '8', diaryId: 55, title: '冥想初体验', date: '2026-03-20', group: 3 },
    { id: '9', diaryId: 56, title: '冥想周记', date: '2026-03-21', group: 3 },
  ],
  edges: [
    { source: '3', target: '1', type: 'reference' },
    { source: '4', target: '2', type: 'continuation' },
    { source: '6', target: '5', type: 'continuation' },
    { source: '7', target: '6', type: 'reference' },
    { source: '9', target: '8', type: 'continuation' },
  ]
};

// GET /api/citations/graph - 获取引用图谱
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const diaryId = searchParams.get('diaryId');
  const depth = parseInt(searchParams.get('depth') || '2');

  if (!diaryId) {
    // 返回完整图谱
    return NextResponse.json(graphData);
  }

  // 返回特定日记的引用图谱
  const id = parseInt(diaryId);
  const visited = new Set<string>();
  const nodes: any[] = [];
  const edges: any[] = [];

  function traverse(nodeId: string, currentDepth: number) {
    if (currentDepth > depth || visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) nodes.push(node);

    // 找相关边
    graphData.edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        edges.push(edge);
        const nextNode = edge.source === nodeId ? edge.target : edge.source;
        traverse(nextNode, currentDepth + 1);
      }
    });
  }

  const startNode = graphData.nodes.find(n => n.diaryId === id);
  if (startNode) {
    traverse(startNode.id, 0);
  }

  return NextResponse.json({ nodes, edges });
}