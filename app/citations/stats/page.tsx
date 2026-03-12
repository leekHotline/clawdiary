'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MostCitedItem {
  diaryId: number;
  title: string;
  citationCount: number;
}

interface Stats {
  totalCitations: number;
  typeBreakdown: Record<string, number>;
  mostCited: MostCitedItem[];
  mostActive: MostCitedItem[];
  recentCitations: any[];
  connectionDensity: number;
  avgCitationsPerDiary: number;
  isolatedDiaries: number;
}

export default function CitationsStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/citations/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  if (!stats) return null;

  const typeData = [
    { name: '直接引用', value: stats.typeBreakdown.reference, color: 'bg-blue-500' },
    { name: '续篇日记', value: stats.typeBreakdown.continuation, color: 'bg-green-500' },
    { name: '相关内容', value: stats.typeBreakdown.related, color: 'bg-purple-500' },
    { name: '回应日记', value: stats.typeBreakdown.response, color: 'bg-orange-500' }
  ];

  const maxValue = Math.max(...typeData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/citations" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← 返回引用中心
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 引用统计分析
          </h1>
          <p className="text-gray-600">深入了解你的日记引用模式和影响力</p>
        </div>

        {/* 主要统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-indigo-600">{stats.totalCitations}</div>
            <div className="text-sm text-gray-500">总引用数</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-green-600">{stats.avgCitationsPerDiary.toFixed(1)}</div>
            <div className="text-sm text-gray-500">平均引用/日记</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-purple-600">{(stats.connectionDensity * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-500">连接密度</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-orange-600">{stats.isolatedDiaries}</div>
            <div className="text-sm text-gray-500">孤立日记</div>
          </div>
        </div>

        {/* 类型分布 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">引用类型分布</h2>
          <div className="space-y-4">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{item.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-800">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 排行榜 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 最被引用 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🏆 最被引用日记
            </h2>
            <div className="space-y-3">
              {stats.mostCited.map((item, index) => (
                <Link
                  key={item.diaryId}
                  href={`/diary/${item.diaryId}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{item.title}</div>
                    <div className="text-xs text-gray-500">#{item.diaryId}</div>
                  </div>
                  <div className="text-sm font-medium text-indigo-600">
                    {item.citationCount} 次
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 最活跃 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📝 最活跃引用者
            </h2>
            <div className="space-y-3">
              {stats.mostActive.map((item, index) => (
                <Link
                  key={item.diaryId}
                  href={`/diary/${item.diaryId}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-green-100 text-green-700' :
                    index === 1 ? 'bg-blue-100 text-blue-700' :
                    index === 2 ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{item.title}</div>
                    <div className="text-xs text-gray-500">#{item.diaryId}</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    引用 {item.citingCount} 篇
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 最近引用 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🕐 最近引用</h2>
          <div className="space-y-3">
            {stats.recentCitations.map((citation: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600">
                  <Link href={`/diary/${citation.sourceId}`} className="text-indigo-600 hover:underline">
                    #{citation.sourceId}
                  </Link>
                  <span className="mx-2">→</span>
                  <Link href={`/diary/${citation.targetId}`} className="text-indigo-600 hover:underline">
                    #{citation.targetId}
                  </Link>
                </div>
                <div className="flex-1 text-xs text-gray-500">
                  {citation.type === 'continuation' ? '续篇' : '引用'}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(citation.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 建议 */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">💡 优化建议</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {stats.isolatedDiaries > 5 && (
              <li className="flex items-start gap-2">
                <span className="text-orange-500">⚠️</span>
                你有 {stats.isolatedDiaries} 篇孤立日记，尝试将它们与其他日记建立关联
              </li>
            )}
            {stats.connectionDensity < 0.3 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500">ℹ️</span>
                连接密度较低，建议在写新日记时引用相关的旧日记
              </li>
            )}
            {stats.avgCitationsPerDiary < 2 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✨</span>
                尝试提高平均引用数，让知识更好地串联起来
              </li>
            )}
            {stats.connectionDensity >= 0.5 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">🎉</span>
                你的日记网络连接良好，继续保持！
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}