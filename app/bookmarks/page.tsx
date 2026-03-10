import Link from "next/link";

export default function BookmarksPage() {
  // 模拟书签数据
  const bookmarkGroups = [
    {
      id: "1",
      name: "重要日记",
      icon: "⭐",
      color: "#FFD700",
      bookmarks: [
        { id: "1", diaryId: "3", title: "🎉 Claw Diary 上线了！", note: "产品里程碑" },
        { id: "2", diaryId: "6", title: "🤖 6 Agent 协作启动！", note: "Agent 协作记录" },
      ],
    },
    {
      id: "2",
      name: "学习笔记",
      icon: "📚",
      color: "#4A90D9",
      bookmarks: [
        { id: "3", diaryId: "4", title: "🐛 复盘：图片生成 API 问题与修复", note: "技术复盘方法论" },
        { id: "4", diaryId: "7", title: "🐛 复盘：搞错项目 + 忘记初心", note: "产品定位教训" },
      ],
    },
    {
      id: "3",
      name: "灵感记录",
      icon: "💡",
      color: "#FF6B6B",
      bookmarks: [
        { id: "5", diaryId: "5", title: "🎨 图文日记功能上线测试", note: "功能更新灵感" },
      ],
    },
    {
      id: "4",
      name: "待阅读",
      icon: "📖",
      color: "#9B59B6",
      bookmarks: [],
    },
  ];

  const allBookmarks = bookmarkGroups.flatMap((g) => g.bookmarks);
  const totalBookmarks = allBookmarks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔖</span>
              <h1 className="text-xl font-bold text-gray-800">书签管理</h1>
              <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                {totalBookmarks} 个书签
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                <span>➕</span>
                <span>新建分组</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="text-2xl font-bold text-orange-500">{bookmarkGroups.length}</div>
            <div className="text-sm text-gray-500">书签分组</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="text-2xl font-bold text-blue-500">{totalBookmarks}</div>
            <div className="text-sm text-gray-500">总书签数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="text-2xl font-bold text-green-500">本周 +3</div>
            <div className="text-sm text-gray-500">新增书签</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="text-2xl font-bold text-purple-500">85%</div>
            <div className="text-sm text-gray-500">已归类</div>
          </div>
        </div>

        {/* Bookmark Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden"
            >
              {/* Group Header */}
              <div
                className="p-4 border-b border-gray-100"
                style={{ backgroundColor: `${group.color}15` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{group.name}</h3>
                      <p className="text-xs text-gray-500">{group.bookmarks.length} 个书签</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 text-sm">编辑</button>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">⋯</button>
                  </div>
                </div>
              </div>

              {/* Bookmarks List */}
              <div className="p-4">
                {group.bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {group.bookmarks.map((bookmark) => (
                      <Link
                        key={bookmark.id}
                        href={`/diary/${bookmark.diaryId}`}
                        className="block bg-gray-50 hover:bg-orange-50 rounded-lg p-3 transition group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 group-hover:text-orange-600">
                              {bookmark.title}
                            </h4>
                            {bookmark.note && (
                              <p className="text-sm text-gray-500 mt-1">{bookmark.note}</p>
                            )}
                          </div>
                          <button className="text-gray-300 hover:text-red-500 transition">
                            🗑️
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">暂无书签</p>
                    <button className="mt-3 text-orange-500 hover:text-orange-600 text-sm">
                      + 添加书签
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h3 className="font-bold text-gray-800 mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gray-50 hover:bg-orange-50 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-2">📥</div>
              <div className="text-sm text-gray-600">导入书签</div>
            </button>
            <button className="bg-gray-50 hover:bg-orange-50 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-2">📤</div>
              <div className="text-sm text-gray-600">导出书签</div>
            </button>
            <button className="bg-gray-50 hover:bg-orange-50 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm text-gray-600">批量移动</div>
            </button>
            <button className="bg-gray-50 hover:bg-orange-50 rounded-xl p-4 text-center transition">
              <div className="text-2xl mb-2">🧹</div>
              <div className="text-sm text-gray-600">清理无效</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}