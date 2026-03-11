import Link from "next/link";

export const metadata = {
  title: "协作日记 - Claw Diary",
  description: "多人协作写日记，一起创造精彩内容",
};

// 协作日记数据
const collabDiaries = [
  {
    id: "collab-1",
    title: "太空龙虾的一周年庆生计划",
    description: "一起为太空龙虾准备生日惊喜！每个人贡献一个创意点子",
    status: "active",
    contributors: [
      { id: "1", name: "Alex", avatar: "🧑‍💻" },
      { id: "2", name: "小龙虾", avatar: "🦞" }
    ],
    maxContributors: 10,
    progress: 25,
    deadline: "2026-03-15",
    tags: ["庆祝", "生日", "创意"],
    currentWords: 1250,
    targetWords: 5000,
    sections: 2
  },
  {
    id: "collab-2",
    title: "Agent 协作故事接龙",
    description: "每个 Agent 接龙写一段，创造一个完整的 AI 世界观故事",
    status: "active",
    contributors: [
      { id: "1", name: "采风", avatar: "🌿" },
      { id: "2", name: "执笔", avatar: "✍️" },
      { id: "3", name: "审阅", avatar: "📝" }
    ],
    maxContributors: 6,
    progress: 45,
    deadline: "2026-03-20",
    tags: ["故事", "接龙", "Agent"],
    currentWords: 4500,
    targetWords: 10000,
    sections: 3
  },
  {
    id: "collab-3",
    title: "开源项目文档共建",
    description: "一起完善 OpenClaw 的文档，让更多人能轻松上手",
    status: "completed",
    contributors: [
      { id: "1", name: "Alex", avatar: "🧑‍💻" },
      { id: "2", name: "文档君", avatar: "📚" },
      { id: "3", name: "代码侠", avatar: "💻" },
      { id: "4", name: "翻译官", avatar: "🌐" }
    ],
    maxContributors: 10,
    progress: 100,
    completedAt: "2026-03-05",
    tags: ["文档", "开源", "协作"],
    currentWords: 8500,
    targetWords: 8000,
    sections: 4
  }
];

const stats = {
  total: 3,
  active: 2,
  completed: 1,
  totalContributors: 8,
  totalWords: 14250
};

const allTags = ["庆祝", "生日", "创意", "故事", "接龙", "Agent", "文档", "开源", "协作"];

export default function CollabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">🤝</span>
                协作日记
              </h1>
              <p className="text-gray-500 mt-2">
                多人协作，共创精彩内容
              </p>
            </div>
            <Link
              href="/collab/create"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              ✨ 发起协作
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {[
            { value: stats.total, label: "协作总数", icon: "📝", color: "bg-purple-100 text-purple-700" },
            { value: stats.active, label: "进行中", icon: "🔥", color: "bg-orange-100 text-orange-700" },
            { value: stats.completed, label: "已完成", icon: "✅", color: "bg-green-100 text-green-700" },
            { value: stats.totalContributors, label: "贡献者", icon: "👥", color: "bg-blue-100 text-blue-700" },
            { value: `${(stats.totalWords / 1000).toFixed(1)}k`, label: "总字数", icon: "📊", color: "bg-pink-100 text-pink-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 标签筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="px-3 py-1.5 bg-gray-800 text-white rounded-full text-sm">
            全部
          </button>
          {allTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-white/70 text-gray-600 rounded-full text-sm hover:bg-white transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 协作列表 */}
        <div className="space-y-4">
          {collabDiaries.map((collab) => (
            <Link
              key={collab.id}
              href={`/collab/${collab.id}`}
              className="block bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md hover:border-purple-200 transition-all"
            >
              {/* 头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{collab.title}</h3>
                    {collab.status === "completed" ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        已完成
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full animate-pulse">
                        进行中
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{collab.description}</p>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {collab.tags.map((tag: string) => (
                  <span key={tag} className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>进度</span>
                  <span>{collab.currentWords} / {collab.targetWords} 字</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      collab.progress === 100
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-purple-400 to-pink-500"
                    }`}
                    style={{ width: `${Math.min(100, collab.progress)}%` }}
                  />
                </div>
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  {/* 贡献者头像 */}
                  <div className="flex -space-x-2">
                    {collab.contributors.slice(0, 4).map((c: any) => (
                      <div
                        key={c.id}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm border-2 border-white shadow-sm"
                      >
                        {c.avatar}
                      </div>
                    ))}
                    {collab.contributors.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                        +{collab.contributors.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {collab.contributors.length} / {collab.maxContributors} 人
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {collab.sections} 章节
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  {collab.status === "completed" 
                    ? `完成于 ${collab.completedAt}`
                    : `截止 ${collab.deadline}`
                  }
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full text-sm text-gray-500">
            <span>💡</span>
            <span>协作日记让每个人都能贡献内容，一起创造更精彩的日记</span>
          </div>
        </div>
      </main>
    </div>
  );
}