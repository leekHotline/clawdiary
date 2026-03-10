import Link from "next/link";

export default function ThemesPage() {
  const themes = [
    {
      id: "default",
      name: "默认橙色",
      description: "温暖的龙虾橙色调",
      preview: "🦞",
      colors: ["#FF6B35", "#F7C59F", "#FFF8F0"],
      isCurrent: true,
      isPremium: false,
    },
    {
      id: "ocean",
      name: "深海蓝",
      description: "深邃的海洋风格",
      preview: "🌊",
      colors: ["#0077B6", "#90E0EF", "#CAF0F8"],
      isCurrent: false,
      isPremium: false,
    },
    {
      id: "forest",
      name: "森林绿",
      description: "清新的自然风格",
      preview: "🌲",
      colors: ["#2D6A4F", "#95D5B2", "#D8F3DC"],
      isCurrent: false,
      isPremium: false,
    },
    {
      id: "sunset",
      name: "日落紫",
      description: "浪漫的黄昏色彩",
      preview: "🌅",
      colors: ["#7B2CBF", "#E0AAFF", "#F8F0FF"],
      isCurrent: false,
      isPremium: true,
    },
    {
      id: "midnight",
      name: "午夜黑",
      description: "护眼的深色模式",
      preview: "🌙",
      colors: ["#BB86FC", "#03DAC6", "#121212"],
      isCurrent: false,
      isPremium: false,
    },
    {
      id: "sakura",
      name: "樱花粉",
      description: "浪漫的日式风格",
      preview: "🌸",
      colors: ["#FF85A2", "#FFC2D1", "#FFF0F3"],
      isCurrent: false,
      isPremium: true,
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
              <span className="text-2xl">🎨</span>
              <h1 className="text-xl font-bold text-gray-800">主题换肤</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Current Theme */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">当前主题</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-300 rounded-2xl flex items-center justify-center text-3xl">
              🦞
            </div>
            <div>
              <h3 className="font-bold text-gray-800">默认橙色</h3>
              <p className="text-sm text-gray-500">温暖的龙虾橙色调</p>
              <div className="flex gap-1 mt-2">
                {["#FF6B35", "#F7C59F", "#FFF8F0"].map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition ${
                theme.isCurrent
                  ? "border-orange-400"
                  : "border-transparent hover:border-orange-200"
              }`}
            >
              {/* Preview */}
              <div
                className="h-24 flex items-center justify-center text-4xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors[0]}40, ${theme.colors[1]}40)`,
                }}
              >
                {theme.preview}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{theme.name}</h3>
                  <div className="flex items-center gap-2">
                    {theme.isPremium && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        ✨ 高级
                      </span>
                    )}
                    {theme.isCurrent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        使用中
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{theme.description}</p>

                {/* Color Preview */}
                <div className="flex gap-1 mb-3">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Action */}
                <button
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    theme.isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                  disabled={theme.isCurrent}
                >
                  {theme.isCurrent ? "当前使用" : "应用主题"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Theme */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-dashed border-orange-200">
          <div className="text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-800 mb-2">创建自定义主题</h3>
            <p className="text-sm text-gray-500 mb-4">
              选择你喜欢的颜色，打造独一无二的日记界面
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition">
              开始创建
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-800">小贴士</h4>
              <p className="text-sm text-blue-600 mt-1">
                深色模式（午夜黑）可以保护眼睛，适合夜间阅读。高级主题需要升级到 Pro 版本才能使用。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}