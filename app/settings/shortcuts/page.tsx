import Link from "next/link";

export default function ShortcutsPage() {
  const shortcuts = {
    quick: [
      { id: "1", title: "写日记", icon: "✏️", path: "/write", description: "创建一篇新日记" },
      { id: "2", title: "随机阅读", icon: "🎲", path: "/random", description: "随机推荐一篇日记" },
      { id: "3", title: "今日心情", icon: "😊", path: "/mood", description: "记录今天的心情" },
    ],
    tools: [
      { id: "4", title: "AI 助手", icon: "🤖", path: "/assistant", description: "智能写作助手" },
      { id: "5", title: "搜索", icon: "🔍", path: "/search", description: "搜索日记内容" },
      { id: "6", title: "标签管理", icon: "🏷️", path: "/tags", description: "管理日记标签" },
      { id: "7", title: "收藏夹", icon: "⭐", path: "/favorites", description: "查看收藏的日记" },
      { id: "8", title: "草稿箱", icon: "📝", path: "/drafts", description: "继续编辑草稿" },
    ],
    stats: [
      { id: "9", title: "数据统计", icon: "📊", path: "/stats", description: "查看写作统计" },
      { id: "10", title: "年度报告", icon: "📅", path: "/annual-report", description: "回顾一年的成长" },
      { id: "11", title: "AI 洞察", icon: "🔮", path: "/insights", description: "智能分析和建议" },
      { id: "12", title: "成就系统", icon: "🏆", path: "/my/achievements", description: "查看获得的成就" },
    ],
    settings: [
      { id: "13", title: "个人设置", icon: "⚙️", path: "/settings", description: "调整应用设置" },
      { id: "14", title: "主题换肤", icon: "🎨", path: "/settings/themes", description: "更换应用主题" },
      { id: "15", title: "帮助中心", icon: "❓", path: "/help", description: "获取帮助和反馈" },
    ],
  };

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
              <span className="text-2xl">⚡</span>
              <h1 className="text-xl font-bold text-gray-800">快捷方式管理</h1>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
              <span>➕</span>
              <span>添加</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Actions Section */}
        {Object.entries(shortcuts).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>
                {category === "quick" && "🚀"}
                {category === "tools" && "🛠️"}
                {category === "stats" && "📊"}
                {category === "settings" && "⚙️"}
              </span>
              <span>
                {category === "quick" && "快速操作"}
                {category === "tools" && "工具"}
                {category === "stats" && "统计"}
                {category === "settings" && "设置"}
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              {items.map((shortcut, index) => (
                <div
                  key={shortcut.id}
                  className={`flex items-center justify-between p-4 ${
                    index !== items.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{shortcut.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{shortcut.title}</h3>
                      <p className="text-sm text-gray-500">{shortcut.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">{shortcut.path}</span>
                    <button className="text-gray-400 hover:text-gray-600 cursor-move">
                      ⋮⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Custom Shortcut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-dashed border-orange-200">
          <h3 className="font-bold text-gray-800 mb-4">添加自定义快捷方式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">名称</label>
              <input
                type="text"
                placeholder="快捷方式名称"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">路径</label>
              <input
                type="text"
                placeholder="/path/to/page"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">图标</label>
              <input
                type="text"
                placeholder="🔗"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">分类</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300">
                <option value="quick">快速操作</option>
                <option value="tools">工具</option>
                <option value="stats">统计</option>
                <option value="settings">设置</option>
              </select>
            </div>
          </div>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition">
            添加快捷方式
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-800">拖拽排序</h4>
              <p className="text-sm text-blue-600 mt-1">
                你可以拖动快捷方式来调整顺序，将最常用的放在最前面。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}