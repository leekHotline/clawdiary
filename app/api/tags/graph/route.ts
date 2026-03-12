import { NextRequest, NextResponse } from 'next/server';

// 模拟标签关系数据
const tagRelations: {
  nodes: { id: string; label: string; count: number; category: string }[];
  edges: { source: string; target: string; weight: number }[];
} = {
  nodes: [
    { id: '思考', label: '思考', count: 28, category: 'thought' },
    { id: '写作', label: '写作', count: 35, category: 'creative' },
    { id: '日记', label: '日记', count: 45, category: 'life' },
    { id: '心情', label: '心情', count: 22, category: 'emotion' },
    { id: '成长', label: '成长', count: 18, category: 'thought' },
    { id: '星空', label: '星空', count: 8, category: 'life' },
    { id: '宇宙', label: '宇宙', count: 6, category: 'thought' },
    { id: '生活', label: '生活', count: 30, category: 'life' },
    { id: '灵感', label: '灵感', count: 15, category: 'creative' },
    { id: '旅行', label: '旅行', count: 12, category: 'travel' },
    { id: '美食', label: '美食', count: 10, category: 'life' },
    { id: '阅读', label: '阅读', count: 20, category: 'thought' },
    { id: '计划', label: '计划', count: 14, category: 'work' },
    { id: '目标', label: '目标', count: 16, category: 'work' },
    { id: '幸福', label: '幸福', count: 9, category: 'emotion' },
    { id: '感恩', label: '感恩', count: 7, category: 'emotion' },
    { id: '阳光', label: '阳光', count: 5, category: 'life' },
    { id: '夜晚', label: '夜晚', count: 8, category: 'life' },
    { id: '创造力', label: '创造力', count: 11, category: 'creative' },
    { id: '隐私', label: '隐私', count: 4, category: 'thought' },
  ],
  edges: [
    { source: '思考', target: '写作', weight: 15 },
    { source: '思考', target: '成长', weight: 12 },
    { source: '写作', target: '日记', weight: 25 },
    { source: '写作', target: '灵感', weight: 10 },
    { source: '心情', target: '日记', weight: 18 },
    { source: '心情', target: '幸福', weight: 8 },
    { source: '成长', target: '目标', weight: 14 },
    { source: '成长', target: '计划', weight: 10 },
    { source: '星空', target: '宇宙', weight: 6 },
    { source: '星空', target: '夜晚', weight: 5 },
    { source: '生活', target: '日记', weight: 20 },
    { source: '生活', target: '美食', weight: 8 },
    { source: '旅行', target: '生活', weight: 10 },
    { source: '阅读', target: '思考', weight: 12 },
    { source: '阅读', target: '成长', weight: 8 },
    { source: '灵感', target: '创造力', weight: 9 },
    { source: '目标', target: '计划', weight: 15 },
    { source: '感恩', target: '幸福', weight: 7 },
    { source: '阳光', target: '心情', weight: 5 },
    { source: '夜晚', target: '思考', weight: 6 },
    { source: '隐私', target: '日记', weight: 4 },
  ]
};

// GET - 获取标签关系图谱
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tagId = searchParams.get('tagId');
  
  let filteredNodes = tagRelations.nodes;
  let filteredEdges = tagRelations.edges;
  
  // 按分类筛选
  if (category && category !== 'all') {
    filteredNodes = tagRelations.nodes.filter(n => n.category === category);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = tagRelations.edges.filter(
      e => nodeIds.has(e.source) && nodeIds.has(e.target)
    );
  }
  
  // 获取特定标签的关联
  if (tagId) {
    const connectedIds = new Set<string>();
    connectedIds.add(tagId);
    
    tagRelations.edges.forEach(edge => {
      if (edge.source === tagId) connectedIds.add(edge.target);
      if (edge.target === tagId) connectedIds.add(edge.source);
    });
    
    filteredNodes = tagRelations.nodes.filter(n => connectedIds.has(n.id));
    filteredEdges = tagRelations.edges.filter(
      e => connectedIds.has(e.source) && connectedIds.has(e.target)
    );
  }
  
  // 计算统计信息
  const stats = {
    totalNodes: filteredNodes.length,
    totalEdges: filteredEdges.length,
    categories: {
      emotion: filteredNodes.filter(n => n.category === 'emotion').length,
      life: filteredNodes.filter(n => n.category === 'life').length,
      work: filteredNodes.filter(n => n.category === 'work').length,
      thought: filteredNodes.filter(n => n.category === 'thought').length,
      travel: filteredNodes.filter(n => n.category === 'travel').length,
      creative: filteredNodes.filter(n => n.category === 'creative').length,
    },
    topTags: [...filteredNodes].sort((a, b) => b.count - a.count).slice(0, 5),
    strongestRelations: [...filteredEdges].sort((a, b) => b.weight - a.weight).slice(0, 5),
  };
  
  return NextResponse.json({
    nodes: filteredNodes,
    edges: filteredEdges,
    stats,
  });
}

// POST - 添加标签关系
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, target, weight = 1 } = body;
    
    // 检查是否已存在
    const existingIndex = tagRelations.edges.findIndex(
      e => (e.source === source && e.target === target) ||
           (e.source === target && e.target === source)
    );
    
    if (existingIndex >= 0) {
      // 增加权重
      tagRelations.edges[existingIndex].weight += weight;
    } else {
      // 添加新关系
      tagRelations.edges.push({ source, target, weight });
    }
    
    return NextResponse.json({
      success: true,
      message: '标签关系已更新',
      edge: { source, target, weight: existingIndex >= 0 ? tagRelations.edges[existingIndex].weight : weight }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '操作失败' 
    }, { status: 500 });
  }
}

// DELETE - 删除标签关系
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const target = searchParams.get('target');
    
    if (!source || !target) {
      return NextResponse.json({ 
        success: false, 
        error: '缺少参数' 
      }, { status: 400 });
    }
    
    const index = tagRelations.edges.findIndex(
      e => (e.source === source && e.target === target) ||
           (e.source === target && e.target === source)
    );
    
    if (index >= 0) {
      tagRelations.edges.splice(index, 1);
      return NextResponse.json({ 
        success: true, 
        message: '标签关系已删除' 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: '关系不存在' 
    }, { status: 404 });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: '删除失败' 
    }, { status: 500 });
  }
}