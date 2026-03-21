'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TagNode {
  id: string;
  label: string;
  count: number;
  category: string;
}

interface TagEdge {
  source: string;
  target: string;
  weight: number;
}

const TAG_CATEGORIES = [
  { id: 'emotion', name: '情感', color: '#ef4444', icon: '❤️' },
  { id: 'life', name: '生活', color: '#22c55e', icon: '🌿' },
  { id: 'work', name: '工作', color: '#3b82f6', icon: '💼' },
  { id: 'thought', name: '思考', color: '#8b5cf6', icon: '💭' },
  { id: 'travel', name: '旅行', color: '#f59e0b', icon: '✈️' },
  { id: 'creative', name: '创意', color: '#ec4899', icon: '🎨' },
];

// 模拟标签数据
const generateMockData = () => {
  const nodes: TagNode[] = [
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
  ];

  const edges: TagEdge[] = [
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
  ];

  return { nodes, edges };
};

export default function TagGraphPage() {
  // Initialize with mock data directly
  const mockData = generateMockData();
  const [nodes, setNodes] = useState<TagNode[]>(mockData.nodes);
  const [edges, setEdges] = useState<TagEdge[]>(mockData.edges);
  const [selectedNode, setSelectedNode] = useState<TagNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getConnectedNodes = (nodeId: string): string[] => {
    const connected = new Set<string>();
    edges.forEach(edge => {
      if (edge.source === nodeId) connected.add(edge.target);
      if (edge.target === nodeId) connected.add(edge.source);
    });
    return Array.from(connected);
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = TAG_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const filteredNodes = filter === 'all' 
    ? nodes 
    : nodes.filter(n => n.category === filter);

  const getNodePosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const radius = Math.min(300, 150 + total * 5);
    return {
      x: Math.cos(angle) * radius + 350,
      y: Math.sin(angle) * radius + 300,
    };
  };

  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link 
            href="/tags"
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← 返回标签管理
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🕸️</span>
            标签关系图谱
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            可视化展示标签之间的关联关系
          </p>
        </div>

        {/* 筛选器 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              全部
            </button>
            {TAG_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filter === category.id
                    ? 'text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                style={filter === category.id ? { backgroundColor: category.color } : {}}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 图谱区域 */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-white">标签网络</h2>
            </div>
            <div className="relative" style={{ height: '600px' }}>
              <svg width="100%" height="600" viewBox="0 0 700 600">
                {/* 边 */}
                {edges.map((edge, index) => {
                  const sourceIndex = filteredNodes.findIndex(n => n.id === edge.source);
                  const targetIndex = filteredNodes.findIndex(n => n.id === edge.target);
                  
                  if (sourceIndex === -1 || targetIndex === -1) return null;
                  
                  const sourcePos = getNodePosition(sourceIndex, filteredNodes.length);
                  const targetPos = getNodePosition(targetIndex, filteredNodes.length);
                  
                  const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;
                  
                  return (
                    <line
                      key={index}
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isHighlighted ? '#6366f1' : '#e5e7eb'}
                      strokeWidth={edge.weight / 5}
                      opacity={isHighlighted ? 1 : 0.5}
                      className="transition-all"
                    />
                  );
                })}
                
                {/* 节点 */}
                {filteredNodes.map((node, index) => {
                  const pos = getNodePosition(index, filteredNodes.length);
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected = connectedNodes.includes(node.id);
                  const isHovered = hoveredNode === node.id;
                  const nodeColor = getCategoryColor(node.category);
                  
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={15 + node.count / 3}
                        fill={nodeColor}
                        opacity={selectedNode && !isSelected && !isConnected ? 0.3 : 1}
                        stroke={isSelected ? '#000' : 'none'}
                        strokeWidth={2}
                        className="transition-all"
                      />
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        fill="white"
                        fontSize={12}
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label.slice(0, 2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 信息面板 */}
          <div className="space-y-6">
            {/* 选中节点信息 */}
            {selectedNode && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(selectedNode.category) }}
                  />
                  {selectedNode.label}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">使用次数</span>
                    <span className="font-medium text-gray-800 dark:text-white">{selectedNode.count} 次</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">关联标签</span>
                    <span className="font-medium text-gray-800 dark:text-white">{connectedNodes.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">分类</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {TAG_CATEGORIES.find(c => c.id === selectedNode.category)?.name}
                    </span>
                  </div>
                </div>
                
                {connectedNodes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">关联标签：</p>
                    <div className="flex flex-wrap gap-2">
                      {connectedNodes.map(tagId => {
                        const tag = nodes.find(n => n.id === tagId);
                        return tag ? (
                          <button
                            key={tagId}
                            onClick={() => setSelectedNode(tag)}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {tag.label}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 图例 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">图例</h3>
              <div className="space-y-3">
                {TAG_CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                      {category.icon} {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 统计 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">标签总数</span>
                  <span className="font-medium text-gray-800 dark:text-white">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">关联数量</span>
                  <span className="font-medium text-gray-800 dark:text-white">{edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">最热标签</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {nodes.sort((a, b) => b.count - a.count)[0]?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}