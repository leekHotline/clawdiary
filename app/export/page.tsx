'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExportPage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'range' | 'tags'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [includeImages, setIncludeImages] = useState(true);

  const formats = [
    { id: 'markdown', name: 'Markdown', icon: '📝', desc: '保留完整格式，适合迁移到其他平台' },
    { id: 'pdf', name: 'PDF', icon: '📄', desc: '排版美观，适合打印和分享' },
    { id: 'html', name: 'HTML', icon: '🌐', desc: '网页格式，样式完整保留' },
    { id: 'json', name: 'JSON', icon: '📊', desc: '原始数据，便于程序处理和迁移' },
    { id: 'txt', name: '纯文本', icon: '📃', desc: '最简单的格式，体积最小' },
  ];

  const tags = ['日记', '技术', '生活', '旅行', '美食', '阅读', '思考', '创意', '群组系统', '排行榜'];

  const handleExport = async () => {
    if (exportFormat.length === 0) {
      alert('请选择至少一种导出格式');
      return;
    }
    setExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExporting(false);
    alert('导出成功！文件已保存到下载目录');
  };

  const toggleFormat = (id: string) => {
    setExportFormat(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            📤 导出中心
          </h1>
          <p className="text-gray-600 mt-1">导出您的日记，数据完全属于您</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold">39</div>
            <div className="text-sm text-gray-500">总日记数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-3xl mb-2">🏷️</div>
            <div className="text-2xl font-bold">25</div>
            <div className="text-sm text-gray-500">标签数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-3xl mb-2">📷</div>
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-500">图片数</div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">选择导出格式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => toggleFormat(format.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  exportFormat.includes(format.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{format.icon}</span>
                  <div>
                    <div className="font-semibold">{format.name}</div>
                    <div className="text-sm text-gray-500">{format.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">选择范围</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              {(['all', 'range', 'tags'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? '全部日记' : range === 'range' ? '日期范围' : '按标签'}
                </button>
              ))}
            </div>

            {dateRange === 'range' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    开始日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    结束日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {dateRange === 'tags' && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">导出选项</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <div>
                <div className="font-medium">包含图片</div>
                <div className="text-sm text-gray-500">导出日记中包含的所有图片</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">包含元数据</div>
                <div className="text-sm text-gray-500">导出创建时间、标签、心情等信息</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">按日期分文件夹</div>
                <div className="text-sm text-gray-500">以年/月结构组织导出文件</div>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/export/history')}
            className="flex-1 px-6 py-4 border rounded-xl hover:bg-gray-50 transition-colors"
          >
            📋 导出历史
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || exportFormat.length === 0}
            className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>开始导出</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}