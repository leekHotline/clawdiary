// 日记导出中心
export const dynamic = 'force-dynamic';

import { getDiaries } from "@/lib/diaries";
import Link from "next/link";

export default async function ExportCenterPage() {
  const diaries = await getDiaries();
  const totalCount = diaries.length;
  
  // 统计数据
  const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
  const totalTags = new Set(diaries.flatMap(d => d.tags || [])).size;
  const dateRange = diaries.length > 0 ? {
    earliest: diaries.reduce((min, d) => d.date < min ? d.date : min, diaries[0].date),
    latest: diaries.reduce((max, d) => d.date > max ? d.date : max, diaries[0].date)
  } : null;

  // 按月份分组
  const diariesByMonth = diaries.reduce((acc, diary) => {
    const month = diary.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = [];
    acc[month].push(diary);
    return acc;
  }, {} as Record<string, typeof diaries>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="mb-12">
          <Link 
            href="/settings"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-6 transition-colors text-sm"
          >
            <span>←</span>
            <span>返回设置</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
              📦
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">日记导出中心</h1>
              <p className="text-gray-500">将您的日记导出为多种格式，安全备份您的故事</p>
            </div>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{totalCount}</div>
            <div className="text-sm text-gray-500 mt-1">篇日记</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
            <div className="text-3xl font-bold text-teal-600">{(totalWords / 1000).toFixed(1)}k</div>
            <div className="text-sm text-gray-500 mt-1">总字数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
            <div className="text-3xl font-bold text-cyan-600">{totalTags}</div>
            <div className="text-sm text-gray-500 mt-1">个标签</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{Object.keys(diariesByMonth).length}</div>
            <div className="text-sm text-gray-500 mt-1">个月份</div>
          </div>
        </div>

        {/* 导出格式选项 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* JSON 导出 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">JSON 格式</h3>
                <p className="text-sm text-gray-500 mb-4">
                  结构化数据，适合备份和导入到其他系统
                </p>
                <div className="flex gap-2">
                  <a
                    href="/api/export/json"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                  >
                    <span>⬇️</span>
                    <span>导出全部</span>
                  </a>
                  <a
                    href="/api/export/json?pretty=true"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
                  >
                    <span>📄</span>
                    <span>美化格式</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Markdown 导出 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                📝
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Markdown 格式</h3>
                <p className="text-sm text-gray-500 mb-4">
                  纯文本格式，适合博客发布和文档编辑
                </p>
                <div className="flex gap-2">
                  <a
                    href="/api/export/markdown"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <span>⬇️</span>
                    <span>导出全部</span>
                  </a>
                  <a
                    href="/api/export/markdown?group=month"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <span>📁</span>
                    <span>按月份打包</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* HTML 导出 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                🌐
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">HTML 格式</h3>
                <p className="text-sm text-gray-500 mb-4">
                  网页格式，可在浏览器中直接查看
                </p>
                <div className="flex gap-2">
                  <a
                    href="/api/export/html"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    <span>⬇️</span>
                    <span>导出全部</span>
                  </a>
                  <a
                    href="/api/export/html?style=journal"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 border border-orange-200 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
                  >
                    <span>📖</span>
                    <span>日志样式</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CSV 导出 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">CSV 格式</h3>
                <p className="text-sm text-gray-500 mb-4">
                  表格数据，适合数据分析和电子表格
                </p>
                <div className="flex gap-2">
                  <a
                    href="/api/export/csv"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <span>⬇️</span>
                    <span>导出全部</span>
                  </a>
                  <a
                    href="/api/export/csv?include_content=false"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                  >
                    <span>📋</span>
                    <span>仅元数据</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 高级导出选项 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>⚙️</span>
            <span>高级导出选项</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 按日期范围导出 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📅</span>
                <span>按日期范围导出</span>
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                选择开始和结束日期，导出特定时间段的日记
              </p>
              <div className="flex gap-2">
                <input
                  type="date"
                  id="export-start-date"
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
                <input
                  type="date"
                  id="export-end-date"
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  const start = (document.getElementById('export-start-date') as HTMLInputElement)?.value;
                  const end = (document.getElementById('export-end-date') as HTMLInputElement)?.value;
                  if (start && end) {
                    window.open(`/api/export/markdown?start=${start}&end=${end}`, '_blank');
                  }
                }}
                className="mt-3 w-full px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                导出日期范围
              </button>
            </div>

            {/* 按标签导出 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🏷️</span>
                <span>按标签导出</span>
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                选择特定标签，只导出包含该标签的日记
              </p>
              <select
                id="export-tag-select"
                className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent mb-3"
              >
                <option value="">选择标签...</option>
                {Array.from(new Set(diaries.flatMap(d => d.tags || []))).sort().map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const tag = (document.getElementById('export-tag-select') as HTMLSelectElement)?.value;
                  if (tag) {
                    window.open(`/api/export/markdown?tag=${encodeURIComponent(tag)}`, '_blank');
                  }
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                导出选中标签
              </button>
            </div>
          </div>
        </div>

        {/* 按月份导出 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📆</span>
            <span>按月份导出</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(diariesByMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, monthDiaries]) => (
                <a
                  key={month}
                  href={`/api/export/markdown?month=${month}`}
                  download
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-emerald-600">
                      {month}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {monthDiaries.length} 篇
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* 导出历史记录 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📜</span>
            <span>导出记录</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            最近的导出操作将显示在这里
          </p>
          <div id="export-history" className="space-y-2">
            <div className="text-sm text-gray-400 italic">
              暂无导出记录，点击上方导出按钮开始
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            💡 提示：建议定期导出日记备份到本地或云存储，确保数据安全
          </p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 记录导出历史
          document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', function() {
              const historyDiv = document.getElementById('export-history');
              const now = new Date();
              const time = now.toLocaleString('zh-CN');
              const format = this.href.split('/').pop().split('?')[0].toUpperCase();
              
              // 清除空状态提示
              if (historyDiv.querySelector('.italic')) {
                historyDiv.innerHTML = '';
              }
              
              const record = document.createElement('div');
              record.className = 'flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm';
              record.innerHTML = \`
                <span class="text-gray-600">\${format} 导出</span>
                <span class="text-gray-400">\${time}</span>
              \`;
              historyDiv.insertBefore(record, historyDiv.firstChild);
              
              // 只保留最近5条
              while (historyDiv.children.length > 5) {
                historyDiv.removeChild(historyDiv.lastChild);
              }
            });
          });
        `
      }} />
    </div>
  );
}