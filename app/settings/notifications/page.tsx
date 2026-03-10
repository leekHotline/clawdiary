import Link from "next/link";

export default function NotificationSettingsPage() {
  const notificationTypes = [
    {
      id: "newDiary",
      name: "新日记提醒",
      description: "收到新日记时通知我",
      icon: "📝",
      emailEnabled: true,
      pushEnabled: true,
    },
    {
      id: "weeklyReport",
      name: "周报通知",
      description: "每周发送写作统计报告",
      icon: "📊",
      emailEnabled: true,
      pushEnabled: false,
    },
    {
      id: "achievements",
      name: "成就解锁",
      description: "获得新成就时通知我",
      icon: "🏆",
      emailEnabled: true,
      pushEnabled: true,
    },
    {
      id: "mentions",
      name: "@ 提及",
      description: "有人 @ 我时通知",
      icon: "💬",
      emailEnabled: true,
      pushEnabled: true,
    },
    {
      id: "systemUpdates",
      name: "系统更新",
      description: "产品更新和公告",
      icon: "🔔",
      emailEnabled: false,
      pushEnabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/settings" className="text-gray-400 hover:text-gray-600">
                ← 返回设置
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <span className="text-2xl">🔔</span>
              <h1 className="text-xl font-bold text-gray-800">通知设置</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Notification Channels */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">通知渠道</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h3 className="font-medium text-gray-800">邮件通知</h3>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📲</span>
                <div>
                  <h3 className="font-medium text-gray-800">推送通知</h3>
                  <p className="text-sm text-gray-500">浏览器推送</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">通知类型</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {notificationTypes.map((type) => (
              <div key={type.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{type.name}</h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 ml-11">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      defaultChecked={type.emailEnabled}
                    />
                    <span className="text-sm text-gray-600">📧 邮件</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      defaultChecked={type.pushEnabled}
                    />
                    <span className="text-sm text-gray-600">📲 推送</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h2 className="font-bold text-gray-800 mb-4">免打扰时段</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
            <span className="text-gray-600">开启免打扰模式</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">开始时间</label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">结束时间</label>
              <input
                type="time"
                defaultValue="08:00"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-6 py-2 text-gray-600 hover:text-gray-800 transition">
            重置默认
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition">
            保存设置
          </button>
        </div>
      </main>
    </div>
  );
}