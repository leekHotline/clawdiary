import Link from "next/link";

export const metadata = {
  title: "相关日记推荐 - Claw Diary",
  description: "AI 分析日记内容，推荐相关历史记录",
};

// 模拟相关日记数据
const relatedDiaries = {
  currentDiary: {
    id: 73,
    title: "Day 73 - AI 写作风格分析",
    tags: ["AI", "写作", "分析"],
    date: "2026-03-12",
  },
  recommendations: [
    {
      id: 72,
      title: "Day 72 - 写作风格深度分析系统",
      preview: "今天完成了写作风格分析系统，包括词汇丰富度、句式多样性、情感倾向等多个维度的分析...",
      similarity: 95,
      reason: "相同主题 · 写作分析",
      tags: ["AI", "写作"],
      date: "2026-03-11",
      emoji: "📝",
    },
    {
      id: 70,
      title: "Day 70 - 任务系统与积分商城",
      preview: "完成了每日任务系统和积分商城，用户可以通过完成任务获取积分...",
      similarity: 68,
      reason: "相关功能 · 系统开发",
      tags: ["功能", "系统"],
      date: "2026-03-09",
      emoji: "🎮",
    },
    {
      id: 65,
      title: "Day 65 - 番茄钟与心理健康",
      preview: "实现了番茄钟功能，帮助用户专注写作，同时加入了心理健康相关功能...",
      similarity: 55,
      reason: "写作工具 · 专注",
      tags: ["工具", "写作"],
      date: "2026-03-04",
      emoji: "🍅",
    },
    {
      id: 58,
      title: "Day 58 - 主题系统上线",
      preview: "今天完成了主题系统，用户可以自定义界面风格...",
      similarity: 42,
      reason: "UI 相关 · 系统功能",
      tags: ["UI", "系统"],
      date: "2026-02-25",
      emoji: "🎨",
    },
  ],
  tagClusters: [
    {
      tag: "AI",
      count: 15,
      diaries: [73, 72, 69, 65, 60],
      color: "bg-blue-100 text-blue-600",
    },
    {
      tag: "写作",
      count: 12,
      diaries: [73, 72, 65, 55, 50],
      color: "bg-green-100 text-green-600",
    },
    {
      tag: "系统",
      count: 20,
      diaries: [73, 70, 68, 58, 56],
      color: "bg-purple-100 text-purple-600",
    },
  ],
  timeRelated: [
    {
      period: "上周同期",
      diaries: [
        { id: 66, title: "Day 66 - 肯定语收藏", emoji: "💪" },
        { id: 67, title: "Day 67 - 感恩统计导出", emoji: "🙏" },
      ],
    },
    {
      period: "上月同期",
      diaries: [
        { id: 43, title: "Day 43 - 写作热力图", emoji: "🔥" },
        { id: 44, title: "Day 44 - 写作洞察", emoji: "💡" },
      ],
    },
    {
      period: "去年今日",
      diaries: [],
      note: "还没有记录哦",
    },
  ],
};

export default function RelatedDiariesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-cyan-50 to-sky-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-sky-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🔗</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              相关日记推荐
            </h1>
          </div>
          <p className="text-gray-500">AI 分析内容相似度，帮你发现关联记忆</p>
        </div>

        {/* 当前日记 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="text-sm text-gray-400 mb-2">当前查看</div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{relatedDiaries.currentDiary.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                {relatedDiaries.currentDiary.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
                <span className="text-sm text-gray-400">{relatedDiaries.currentDiary.date}</span>
              </div>
            </div>
            <Link
              href={`/diary/${relatedDiaries.currentDiary.id}`}
              className="px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
            >
              查看原文
            </Link>
          </div>
        </div>

        {/* 相似度推荐 */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">📊 内容相似度推荐</h2>
        <div className="space-y-4 mb-10">
          {relatedDiaries.recommendations.map((diary) => (
            <Link
              key={diary.id}
              href={`/diary/${diary.id}`}
              className="block bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-2xl flex-shrink-0">
                  {diary.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{diary.title}</h3>
                    <span className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">
                      {diary.similarity}% 相似
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{diary.preview}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{diary.date}</span>
                    <span>·</span>
                    <span className="text-teal-600">{diary.reason}</span>
                  </div>
                </div>
              </div>
              {/* 相似度条 */}
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                  style={{ width: `${diary.similarity}%` }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* 标签聚类 */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">🏷️ 标签关联</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-10 border border-white/50">
          <div className="flex flex-wrap gap-3">
            {relatedDiaries.tagClusters.map((cluster) => (
              <div
                key={cluster.tag}
                className={`${cluster.color} rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{cluster.tag}</span>
                  <span className="text-sm opacity-70">{cluster.count} 篇</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {cluster.diaries.slice(0, 3).map((id) => (
                    <Link
                      key={id}
                      href={`/diary/${id}`}
                      className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-xs"
                    >
                      {id}
                    </Link>
                  ))}
                  {cluster.diaries.length > 3 && (
                    <span className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-xs">
                      +{cluster.diaries.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 时间关联 */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">📅 时间关联</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {relatedDiaries.timeRelated.map((period, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50"
            >
              <div className="text-sm font-medium text-gray-600 mb-3">{period.period}</div>
              {period.diaries.length > 0 ? (
                <div className="space-y-2">
                  {period.diaries.map((diary) => (
                    <Link
                      key={diary.id}
                      href={`/diary/${diary.id}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600"
                    >
                      <span>{diary.emoji}</span>
                      <span className="truncate">{diary.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">{period.note}</div>
              )}
            </div>
          ))}
        </div>

        {/* 智能关联 */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-8 text-white mb-10">
          <h2 className="text-2xl font-bold mb-4">🧠 智能关联发现</h2>
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <span className="font-medium">发现模式</span>
              </div>
              <p className="text-sm text-white/90">
                你在写关于「AI 分析」的内容时，经常也会提到「系统功能」和「写作工具」，
                这三者形成了稳定的关联模式。
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📈</span>
                <span className="font-medium">趋势洞察</span>
              </div>
              <p className="text-sm text-white/90">
                近期「写作分析」相关日记占比上升 23%，建议创建「写作分析」专题收藏夹。
              </p>
            </div>
          </div>
          <Link
            href="/collections"
            className="inline-block mt-6 px-6 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
          >
            创建收藏夹 →
          </Link>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/tags"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">🏷️</span>
            <span className="font-medium text-gray-700">标签管理</span>
          </Link>
          <Link
            href="/timeline"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-3xl block mb-2">📅</span>
            <span className="font-medium text-gray-700">时间线</span>
          </Link>
        </div>
      </div>
    </div>
  );
}