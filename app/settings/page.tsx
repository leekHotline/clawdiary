export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">⚙️ 设置</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">管理你的账户和偏好设置</p>

        <div className="space-y-4">
          <a href="/settings/profile" className="block bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">👤 个人资料</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">修改头像、昵称等信息</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </a>

          <a href="/settings/theme" className="block bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🎨 主题设置</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">深色模式、主题颜色</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </a>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🔔 通知设置</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">消息推送偏好</p>
              </div>
              <button className="w-12 h-6 bg-indigo-600 rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🌐 语言</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">界面语言设置</p>
              </div>
              <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300">
                <option>简体中文</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}