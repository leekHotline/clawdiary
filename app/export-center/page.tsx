'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  extension: string;
}

const exportFormats: ExportFormat[] = [
  {
    id: 'markdown',
    name: 'Markdown',
    description: '保留格式的 Markdown 文件，适合博客和笔记软件',
    icon: '📝',
    extension: '.md'
  },
  {
    id: 'json',
    name: 'JSON',
    description: '结构化数据格式，适合开发者导入和备份',
    icon: '{ }',
    extension: '.json'
  },
  {
    id: 'html',
    name: 'HTML',
    description: '美观的网页格式，可以直接在浏览器查看',
    icon: '🌐',
    extension: '.html'
  },
  {
    id: 'txt',
    name: '纯文本',
    description: '简单文本格式，通用性最强',
    icon: '📄',
    extension: '.txt'
  },
  {
    id: 'csv',
    name: 'CSV',
    description: '表格格式，适合 Excel 和数据分析',
    icon: '📊',
    extension: '.csv'
  }
];

export default function ExportCenterPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('markdown');
  const [diaryId, setDiaryId] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        format: selectedFormat,
        metadata: includeMetadata.toString()
      });
      
      if (diaryId) {
        params.set('diaryId', diaryId);
      }

      const response = await fetch(`/api/export/diaries?${params}`);
      
      if (!response.ok) {
        throw new Error('导出失败');
      }

      const content = await response.text();
      const filename = diaryId 
        ? `diary-${diaryId}${exportFormats.find(f => f.id === selectedFormat)?.extension}`
        : `diaries-export${exportFormats.find(f => f.id === selectedFormat)?.extension}`;

      // 创建下载
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 记录历史
      setExportHistory(prev => [{
        format: selectedFormat,
        diaryId: diaryId || '全部',
        timestamp: new Date().toISOString(),
        filename
      }, ...prev].slice(0, 10));

    } catch (_error) {
      console.error('Export failed:', _error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handlePreview = async () => {
    try {
      const params = new URLSearchParams({
        format: selectedFormat,
        metadata: includeMetadata.toString()
      });
      
      if (diaryId) {
        params.set('diaryId', diaryId);
      }

      const response = await fetch(`/api/export/diaries?${params}`);
      const content = await response.text();
      
      setPreviewData({
        format: selectedFormat,
        content: content.slice(0, 2000) + (content.length > 2000 ? '\n\n... (预览截断)' : ''),
        fullLength: content.length
      });
    } catch (_error) {
      console.error('Preview failed:', _error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:underline mb-2 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📦 导出中心
          </h1>
          <p className="text-gray-600">批量导出日记，支持多种格式，安全备份你的珍贵回忆</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：导出配置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 格式选择 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📁 选择导出格式</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exportFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedFormat === format.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <div className="font-medium text-gray-700">
                          {format.name}
                          <span className="text-xs text-gray-400 ml-2">{format.extension}</span>
                        </div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 导出范围 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">🎯 导出范围</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    日记 ID（留空导出全部）
                  </label>
                  <input
                    type="number"
                    value={diaryId}
                    onChange={(e) => setDiaryId(e.target.value)}
                    placeholder="输入日记 ID 导出单篇"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="metadata"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="metadata" className="text-sm text-gray-600">
                    包含元数据（日期、心情、天气、地点、标签等）
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePreview}
                    className="flex-1 py-3 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    👁️ 预览
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {exporting ? '⏳ 导出中...' : '📥 导出下载'}
                  </button>
                </div>
              </div>
            </div>

            {/* 预览 */}
            {previewData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-gray-700">👁️ 导出预览</h2>
                  <span className="text-xs text-gray-400">
                    共 {previewData.fullLength.toLocaleString()} 字符
                  </span>
                </div>
                <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 overflow-auto max-h-64 whitespace-pre-wrap">
                  {previewData.content}
                </pre>
              </div>
            )}
          </div>

          {/* 右侧：导出历史和说明 */}
          <div className="space-y-6">
            {/* 快捷导出 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">⚡ 快捷导出</h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('markdown');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>📝</span>
                  <span>全部日记 → Markdown</span>
                </button>
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('json');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>{'{ }'}</span>
                  <span>全部日记 → JSON 备份</span>
                </button>
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('html');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>🌐</span>
                  <span>全部日记 → 网页浏览</span>
                </button>
              </div>
            </div>

            {/* 导出历史 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📋 导出历史</h2>
              {exportHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">暂无导出记录</p>
              ) : (
                <div className="space-y-2">
                  {exportHistory.map((item, i) => (
                    <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{item.filename}</span>
                        <span className="text-xs text-gray-400">{item.format}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 使用说明 */}
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="font-medium mb-3">💡 导出说明</h3>
              <div className="text-sm text-white/80 space-y-2">
                <p><strong>Markdown</strong>: 适合导入到 Obsidian、Notion 等笔记软件</p>
                <p><strong>JSON</strong>: 适合数据备份和程序导入</p>
                <p><strong>HTML</strong>: 美观格式，可直接在浏览器查看</p>
                <p><strong>CSV</strong>: 可用 Excel 打开进行数据分析</p>
              </div>
            </div>

            {/* 统计 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📊 导出统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">支持格式</span>
                  <span className="font-medium text-indigo-600">5 种</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">本次导出</span>
                  <span className="font-medium text-indigo-600">
                    {diaryId ? '单篇' : '全部'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">历史导出</span>
                  <span className="font-medium text-indigo-600">{exportHistory.length} 次</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 格式对比 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-medium text-gray-700 mb-4">📈 格式对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">格式</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">优点</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">适用场景</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">兼容性</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">📝 Markdown</td>
                  <td className="py-3 px-4">保留格式，易读易编辑</td>
                  <td className="py-3 px-4">博客、笔记软件、Git</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4"> JSON</td>
                  <td className="py-3 px-4">结构化数据，完整保留所有信息</td>
                  <td className="py-3 px-4">数据备份、开发导入</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">🌐 HTML</td>
                  <td className="py-3 px-4">美观排版，支持样式</td>
                  <td className="py-3 px-4">网页浏览、分享</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">📄 纯文本</td>
                  <td className="py-3 px-4">最小体积，最大兼容</td>
                  <td className="py-3 px-4">任何文本编辑器</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">📊 CSV</td>
                  <td className="py-3 px-4">表格形式，数据分析</td>
                  <td className="py-3 px-4">Excel、数据分析工具</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}