import Link from 'next/link';

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📥 日记导入</h1>
          <p className="text-gray-600">从其他平台导入你的日记数据</p>
        </div>

        {/* Import Options */}
        <div className="grid gap-6">
          {/* Markdown Import */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📝
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Markdown 文件</h2>
                <p className="text-gray-600 mb-4">上传 .md 文件批量导入日记，支持 Front Matter 格式</p>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input type="file" className="hidden" accept=".md" multiple />
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-500">点击或拖拽文件到此处上传</p>
                  <p className="text-sm text-gray-400 mt-1">支持 .md 文件，可多选</p>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Import */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">JSON 数据</h2>
                <p className="text-gray-600 mb-4">从 JSON 文件导入，适合从其他日记应用迁移</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">支持的 JSON 格式：</p>
                  <pre className="text-xs bg-gray-800 text-green-400 rounded-lg p-3 overflow-x-auto">
{`[
  {
    "title": "日记标题",
    "content": "日记内容...",
    "date": "2024-01-15",
    "tags": ["标签1", "标签2"],
    "mood": "happy"
  }
]`}
                  </pre>
                </div>
                <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  选择 JSON 文件
                </button>
              </div>
            </div>
          </div>

          {/* Day One Import */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                📔
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Day One 导入</h2>
                <p className="text-gray-600 mb-4">导入 Day One 应用的导出数据（JSON 格式）</p>
                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  上传 Day One 导出文件
                </button>
              </div>
            </div>
          </div>

          {/* Notion Import */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                📚
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Notion 导入</h2>
                <p className="text-gray-600 mb-4">从 Notion 页面导出并导入日记</p>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  上传 Notion 导出文件
                </button>
              </div>
            </div>
          </div>

          {/* Plain Text Import */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">纯文本导入</h2>
                <p className="text-gray-600 mb-4">粘贴或上传纯文本内容，自动解析日期和内容</p>
                <textarea
                  className="w-full h-32 border border-gray-200 rounded-xl p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="粘贴你的日记内容...

支持的格式：
=== 2024-01-15 ===
今天是美好的一天...

=== 2024-01-16 ===
新的一天开始了..."
                />
                <button className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                  解析并导入
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Import History */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 导入历史</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <div>
                  <p className="font-medium">Markdown 导入</p>
                  <p className="text-sm text-gray-500">2024-03-10 14:30</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">导入 15 篇日记</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-green-500">✓</span>
                <div>
                  <p className="font-medium">JSON 导入</p>
                  <p className="text-sm text-gray-500">2024-03-08 09:15</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">导入 30 篇日记</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}