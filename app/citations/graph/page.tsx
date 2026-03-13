'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GraphNode {
  id: string;
  diaryId: number;
  title: string;
  date: string;
  group: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

const typeColors: Record<string, string> = {
  reference: '#3B82F6',
  continuation: '#10B981',
  related: '#8B5CF6',
  response: '#F59E0B'
};

const groupColors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'
];

export default function CitationsGraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    fetchGraph();
  }, []);

  useEffect(() => {
    if (nodes.length > 0 && canvasRef.current) {
      drawGraph();
    }
  }, [nodes, edges, positions]);

  const fetchGraph = async () => {
    try {
      const res = await fetch('/api/citations/graph');
      const data = await res.json();
      setNodes(data.nodes);
      setEdges(data.edges);
      
      // 初始化节点位置（力导向布局简化版）
      const newPositions = new Map<string, { x: number; y: number }>();
      const centerX = 400;
      const centerY = 300;
      const radius = 200;
      
      data.nodes.forEach((node: GraphNode, i: number) => {
        const angle = (2 * Math.PI * i) / data.nodes.length;
        newPositions.set(node.id, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        });
      });
      
      setPositions(newPositions);
    } catch (_error) {
      console.error('Failed to fetch graph:', _error);
    } finally {
      setLoading(false);
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制边
    edges.forEach(edge => {
      const sourcePos = positions.get(edge.source);
      const targetPos = positions.get(edge.target);
      if (sourcePos && targetPos) {
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = typeColors[edge.type] || '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // 绘制节点
    nodes.forEach(node => {
      const pos = positions.get(node.id);
      if (!pos) return;

      // 节点圆形
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = groupColors[node.group % groupColors.length];
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 节点ID
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`#${node.diaryId}`, pos.x, pos.y);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 检查点击了哪个节点
    for (const node of nodes) {
      const pos = positions.get(node.id);
      if (pos) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance < 20) {
          setSelectedNode(node);
          return;
        }
      }
    }
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/citations" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← 返回引用中心
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🕸️ 引用知识图谱
          </h1>
          <p className="text-gray-600">可视化日记之间的引用关系网络</p>
        </div>

        {/* 图例 */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: color }}></div>
              <span className="text-sm text-gray-600">
                {type === 'reference' ? '引用' : 
                 type === 'continuation' ? '续篇' : 
                 type === 'related' ? '相关' : '回应'}
              </span>
            </div>
          ))}
        </div>

        {/* 图谱区域 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            className="w-full cursor-pointer"
          />
        </div>

        {/* 选中节点信息 */}
        {selectedNode && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                日记 #{selectedNode.diaryId}
              </h3>
              <span className="text-sm text-gray-500">{selectedNode.date}</span>
            </div>
            <p className="text-gray-600 mb-4">{selectedNode.title}</p>
            <div className="flex gap-4">
              <Link
                href={`/diary/${selectedNode.diaryId}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                查看日记
              </Link>
              <Link
                href={`/citations?diaryId=${selectedNode.diaryId}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                查看引用
              </Link>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-indigo-600">{nodes.length}</div>
            <div className="text-sm text-gray-500">日记节点</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-green-600">{edges.length}</div>
            <div className="text-sm text-gray-500">引用关系</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {new Set(nodes.map(n => n.group)).size}
            </div>
            <div className="text-sm text-gray-500">主题群落</div>
          </div>
        </div>
      </div>
    </div>
  );
}