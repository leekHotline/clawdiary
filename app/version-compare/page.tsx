'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VersionComparePage() {
  const [diaryId, setDiaryId] = useState('');
  const [version1, setVersion1] = useState('');
  const [version2, setVersion2] = useState('');
  const [loading, setLoading] = useState(false);
  const [diff, setDiff] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  const fetchVersions = async () => {
    if (!diaryId) return;
    try {
      const res = await fetch(`/api/diaries/${diaryId}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch (_error) {
      console.error('Failed to fetch versions:', _error);
    }
  };

  const handleCompare = async () => {
    if (!diaryId || !version1 || !version2) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/version-compare?diaryId=${diaryId}&version1=${version1}&version2=${version2}`);
      const data = await res.json();
      setDiff(data);
    } catch (_error) {
      console.error('Failed to compare:', _error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/diary" className="text-emerald-600 hover:underline mb-2 inline-block">
            ← 返回日记
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            🔀 版本对比
          </h1>
          <p className="text-gray-600">比较日记不同版本之间的差异</p>
        </div>

        {/* 选择器 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日记 ID
              </label>
              <input
                type="number"
                value={diaryId}
                onChange={(e) => setDiaryId(e.target.value)}
                onBlur={fetchVersions}
                placeholder="输入日记 ID"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                版本 1
              </label>
              <select
                value={version1}
                onChange={(e) => setVersion1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">选择版本</option>
                {versions.map((v, i) => (
                  <option key={v.id || i} value={v.version || v.id}>
                    版本 {v.version || v.id} - {new Date(v.createdAt).toLocaleDateString('zh-CN')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                版本 2
              </label>
              <select
                value={version2}
                onChange={(e) => setVersion2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">选择版本</option>
                {versions.map((v, i) => (
                  <option key={v.id || i} value={v.version || v.id}>
                    版本 {v.version || v.id} - {new Date(v.createdAt).toLocaleDateString('zh-CN')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCompare}
                disabled={!diaryId || !version1 || !version2 || loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '对比中...' : '开始对比'}
              </button>
            </div>
          </div>
        </div>

        {/* 对比结果 */}
        {diff && (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">➕</div>
                <div className="text-2xl font-bold text-green-600">{diff.stats?.added || 0}</div>
                <div className="text-sm text-gray-500">新增行</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">➖</div>
                <div className="text-2xl font-bold text-red-600">{diff.stats?.removed || 0}</div>
                <div className="text-sm text-gray-500">删除行</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">✏️</div>
                <div className="text-2xl font-bold text-yellow-600">{diff.stats?.modified || 0}</div>
                <div className="text-sm text-gray-500">修改行</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-blue-600">{diff.stats?.changePercent || 0}%</div>
                <div className="text-sm text-gray-500">变化比例</div>
              </div>
            </div>

            {/* 并排对比 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 版本 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-700">版本 {version1}</h3>
                  <p className="text-xs text-gray-500">
                    {diff.version1?.createdAt && new Date(diff.version1.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                  {diff.version1?.content || '无内容'}
                </div>
              </div>

              {/* 版本 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-700">版本 {version2}</h3>
                  <p className="text-xs text-gray-500">
                    {diff.version2?.createdAt && new Date(diff.version2.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
                  {diff.version2?.content || '无内容'}
                </div>
              </div>
            </div>

            {/* 差异详情 */}
            {diff.changes && diff.changes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-700">📝 变更详情</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-auto">
                  {diff.changes.map((change: any, i: number) => (
                    <div key={i} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          change.type === 'add' ? 'bg-green-100 text-green-700' :
                          change.type === 'remove' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {change.type === 'add' ? '新增' : change.type === 'remove' ? '删除' : '修改'}
                        </span>
                        <span className="text-xs text-gray-500">行 {change.line}</span>
                      </div>
                      {change.oldContent && (
                        <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded mb-1 line-through">
                          {change.oldContent}
                        </div>
                      )}
                      {change.newContent && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
                          {change.newContent}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 空状态 */}
        {!diff && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🔀</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">选择要对比的版本</h3>
            <p className="text-gray-500">输入日记 ID 并选择两个版本进行对比</p>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-medium text-gray-700 mb-4">💡 使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-emerald-500">1.</span>
              <span>输入日记 ID 获取版本列表</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500">2.</span>
              <span>选择两个要对比的版本</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500">3.</span>
              <span>查看详细的差异分析</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}