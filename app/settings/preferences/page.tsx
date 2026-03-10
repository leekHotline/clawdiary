import Link from 'next/link';

export const metadata = {
  title: '用户偏好设置 - Claw Diary',
  description: '自定义你的 Claw Diary 体验',
};

export default function PreferencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-2xl">⚙️</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">用户偏好</h1>
              <p className="text-sm text-gray-500">User Preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Theme Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 外观设置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">主题模式</div>
                <div className="text-sm text-gray-500">选择你喜欢的显示模式</div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium">☀️ 浅色</button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">🌙 深色</button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600">🖥️ 跟随系统</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">字体大小</div>
                <div className="text-sm text-gray-500">调整内容显示大小</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">小</button>
                <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium">中</button>
                <button className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-lg">大</button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔔 通知设置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">邮件通知</div>
                <div className="text-sm text-gray-500">接收重要更新邮件</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">推送通知</div>
                <div className="text-sm text-gray-500">接收浏览器推送通知</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">每日摘要</div>
                <div className="text-sm text-gray-500">每天早上收到内容摘要</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Diary Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📝 日记设置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">自动保存</div>
                <div className="text-sm text-gray-500">编辑时自动保存内容</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">显示字数</div>
                <div className="text-sm text-gray-500">编辑时显示字数统计</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div>
              <div className="font-medium text-gray-800 mb-2">默认标签</div>
              <div className="text-sm text-gray-500 mb-2">新建日记时自动添加的标签</div>
              <input 
                type="text" 
                placeholder="输入标签，用逗号分隔"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👁️ 显示设置</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">显示作者</div>
                <div className="text-sm text-gray-500">在日记卡片上显示作者信息</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">显示日期</div>
                <div className="text-sm text-gray-500">在日记卡片上显示发布日期</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">显示标签</div>
                <div className="text-sm text-gray-500">在日记卡片上显示标签</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">紧凑模式</div>
                <div className="text-sm text-gray-500">减少卡片间距，显示更多内容</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button className="w-full py-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors">
            💾 保存偏好设置
          </button>
        </div>
      </main>
    </div>
  );
}