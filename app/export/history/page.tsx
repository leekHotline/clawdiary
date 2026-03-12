'use client';

import { useState } from 'react';

export default function ExportHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'pdf' | 'markdown' | 'json'>('all');

  const exports = [
    {
      id: '1',
      date: '2026-03-12 14:30',
      format: 'PDF',
      count: 39,
      size: '12.5 MB',
      status: 'success',
      duration: '8秒',
    },
    {
      id: '2',
      date: '2026-03-10 09:15',
      format: 'Markdown',
      count: 38,
      size: '2.3 MB',
      status: 'success',
      duration: '3秒',
    },
    {
      id: '3',
      date: '2026-03-05 18:45',
      format: 'JSON',
      count: 35,
      size: '1.8 MB',
      status: 'success',
      duration: '2秒',
    },
    {
      id: '4',
      date: '2026-02-28 11:20',
      format: 'HTML',
      count: 30,
      size: '8.7 MB',
      status: 'success',
      duration: '6秒',
    },
    {
      id: '5',
      date: '2026-02-20 16:00',
      format: 'PDF',
      count: 25,
      size: '8.2 MB',
      status: 'failed',
      duration: '-',
    },
  ];

  const filteredExports = filter === 'all' 
    ? exports 
    : exports.filter(e => e.format.toLowerCase() === filter);

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    success: { label: '成功', color: 'bg-green-100 text-green-800', icon: '✅' },
    failed: { label: '失败', color: 'bg-red-100 text-red-800', icon: '❌' },
  };

  const formatConfig: Record<string, { color: string }> = {
    PDF: { color: 'bg-red-100 text-red-800' },
    Markdown: { color: 'bg-purple-100 text-purple-800' },
    JSON: { color: 'bg-yellow-100 text-yellow-800' },
    HTML: { color: 'bg-blue-100 text-blue-800' },
    TXT: { color: 'bg-gray-100 text-gray-800' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/export" className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
            ← 返回导出中心
          </a>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mt-4">
            📋 导出历史
          </h1>
          <p className="text-gray-600 mt-1">查看所有导出记录</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-gray-500">总导出次数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold">27</div>
            <div className="text-sm text-gray-500">成功</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-500">失败</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold">89 MB</div>
            <div className="text-sm text-gray-500">总大小</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pdf', 'markdown', 'json'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-gray-50 border'
              }`}
            >
              {f === 'all' ? '全部' : f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Export List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">日期</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">格式</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">日记数</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">大小</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">耗时</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredExports.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">{exp.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${formatConfig[exp.format].color}`}>
                      {exp.format}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{exp.count} 篇</td>
                  <td className="p-4 text-sm">{exp.size}</td>
                  <td className="p-4 text-sm">{exp.duration}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${statusConfig[exp.status].color}`}>
                      {statusConfig[exp.status].icon} {statusConfig[exp.status].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      ⬇️ 下载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download All */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
            <span>📦</span>
            <span>打包下载全部</span>
          </button>
        </div>
      </div>
    </div>
  );
}