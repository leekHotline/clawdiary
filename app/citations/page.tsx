'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Citation {
  id: string;
  sourceDiaryId: number;
  targetDiaryId: number;
  type: 'reference' | 'continuation' | 'related' | 'response';
  context: string;
  createdAt: string;
}

const typeLabels: Record<string, { label: string; color: string; icon: string }> = {
  reference: { label: '引用', color: 'bg-blue-100 text-blue-700', icon: '📖' },
  continuation: { label: '续篇', color: 'bg-green-100 text-green-700', icon: '➡️' },
  related: { label: '相关', color: 'bg-purple-100 text-purple-700', icon: '🔗' },
  response: { label: '回应', color: 'bg-orange-100 text-orange-700', icon: '💬' }
};

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('type', filter);
      }
      
      const res = await fetch(`/api/citations?${params}`);
      const data = await res.json();
      setCitations(data.citations);
      setStats(data.stats);
    } catch (_error) {
      console.error('Failed to fetch citations:', _error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📚 日记引用中心
          </h1>
          <p className="text-gray-600">追踪日记之间的联系，构建你的知识网络</p>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
              <div className="text-sm text-gray-500">总引用数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600">{stats.byType.reference}</div>
              <div className="text-sm text-gray-500">直接引用</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600">{stats.byType.continuation}</div>
              <div className="text-sm text-gray-500">续篇日记</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600">{stats.byType.related}</div>
              <div className="text-sm text-gray-500">相关内容</div>
            </div>
          </div>
        )}

        {/* 过滤器 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            全部
          </button>
          {Object.entries(typeLabels).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>

        {/* 引用列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {citations.map((citation) => {
              const typeConfig = typeLabels[citation.type];
              return (
                <div key={citation.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{typeConfig.icon}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(citation.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex-1">
                      <span className="text-gray-500">源日记:</span>
                      <Link
                        href={`/diary/${citation.sourceDiaryId}`}
                        className="ml-2 text-indigo-600 hover:underline"
                      >
                        #{citation.sourceDiaryId}
                      </Link>
                    </div>
                    <div className="text-gray-300">→</div>
                    <div className="flex-1 text-right">
                      <span className="text-gray-500">目标日记:</span>
                      <Link
                        href={`/diary/${citation.targetDiaryId}`}
                        className="ml-2 text-indigo-600 hover:underline"
                      >
                        #{citation.targetDiaryId}
                      </Link>
                    </div>
                  </div>

                  {citation.context && (
                    <p className="mt-2 text-sm text-gray-600 italic">
                      &ldquo;{citation.context}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/citations/graph"
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-1">🕸️</div>
            <div className="font-medium">查看引用图谱</div>
            <div className="text-xs opacity-80">可视化日记关系网络</div>
          </Link>
          <Link
            href="/citations/stats"
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="font-medium text-gray-700">引用统计</div>
            <div className="text-xs text-gray-500">分析引用趋势和影响力</div>
          </Link>
          <Link
            href="/citations/create"
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all"
          >
            <div className="text-2xl mb-1">➕</div>
            <div className="font-medium text-gray-700">创建引用</div>
            <div className="text-xs text-gray-500">连接两篇日记</div>
          </Link>
        </div>
      </div>
    </div>
  );
}