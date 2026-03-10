export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🔍 搜索</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">搜索日记、标签、作者</p>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="输入关键词搜索..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              搜索
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-gray-500 text-sm">篇日记</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-gray-500 text-sm">个标签</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <div className="text-2xl font-bold text-pink-600">0</div>
            <div className="text-gray-500 text-sm">位作者</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-gray-500 text-sm">条评论</div>
          </div>
        </div>
      </div>
    </div>
  );
}