import Link from "next/link";

export const metadata = {
  title: "分享统计 - Claw Diary",
  description: "查看你的日记分享数据和传播情况",
};

// 模拟分享统计数据
const shareStats = {
  totalShares: 127,
  totalViews: 3842,
  totalLikes: 892,
  totalComments: 156,
  avgViewsPerShare: 30.2,
  topSharedDiaries: [
    {
      id: 50,
      title: "Day 50 - 写作风格深度分析系统",
      views: 456,
      likes: 89,
      comments: 23,
      shares: 12,
      sharedAt: "2026-03-05",
    },
    {
      id: 45,
      title: "Day 45 - 专注写作模式实现",
      views: 321,
      likes: 67,
      comments: 15,
      sharedAt: "2026-02-28",
    },
    {
      id: 42,
      title: "Day 42 - 语音日记录入功能",
      views: 278,
      likes: 54,
      comments: 11,
      sharedAt: "2026-02-25",
    },
  ],
  platforms: [
    { name: "微信", icon: "💬", shares: 45, percentage: 35 },
    { name: "微博", icon: "📢", shares: 32, percentage: 25 },
    { name: "Twitter", icon: "🐦", shares: 28, percentage: 22 },
    { name: "链接复制", icon: "🔗", shares: 22, percentage: 18 },
  ],
  recentActivity: [
    { type: "view", diary: "Day 52", from: "微信", time: "2 分钟前" },
    { type: "like", diary: "Day 50", from: "微博", time: "15 分钟前" },
    { type: "comment", diary: "Day 48", from: "Twitter", time: "1 小时前" },
    { type: "share", diary: "Day 45", from: "链接", time: "3 小时前" },
    { type: "view", diary: "Day 55", from: "微信", time: "5 小时前" },
  ],
  engagement: {
    hourly: [
      { hour: "00-06", views: 120 },
      { hour: "06-12", views: 456 },
      { hour: "12-18", views: 892 },
      { hour: "18-24", views: 678 },
    ],
    weekly: [
      { day: "周一", views: 423 },
      { day: "周二", views: 567 },
      { day: "周三", views: 712 },
      { day: "周四", views: 654 },
      { day: "周五", views: 589 },
      { day: "周六", views: 487 },
      { day: "周日", views: 410 },
    ],
  },
};

export default function ShareStatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">📤</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              分享统计
            </h1>
          </div>
          <p className="text-gray-500">查看你的日记分享数据和传播情况</p>
        </div>

        {/* 总览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "总分享", value: shareStats.totalShares, icon: "📤", color: "text-sky-600" },
            { label: "总浏览", value: shareStats.totalViews, icon: "👁️", color: "text-blue-600" },
            { label: "总点赞", value: shareStats.totalLikes, icon: "❤️", color: "text-pink-600" },
            { label: "总评论", value: shareStats.totalComments, icon: "💬", color: "text-indigo-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/50"
            >
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 分享平台分布 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📱 分享平台分布</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shareStats.platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-4 text-center"
              >
                <span className="text-3xl block mb-2">{platform.icon}</span>
                <div className="font-bold text-gray-800">{platform.name}</div>
                <div className="text-2xl font-bold text-sky-600 mt-1">{platform.shares}</div>
                <div className="text-sm text-gray-500">{platform.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 最受欢迎的分享 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 最受欢迎的分享</h2>
          <div className="space-y-4">
            {shareStats.topSharedDiaries.map((diary, i) => (
              <Link
                key={diary.id}
                href={`/diary/${diary.id}`}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl hover:from-sky-100 hover:to-indigo-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  'bg-gradient-to-br from-amber-600 to-amber-700'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{diary.title}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>👁️ {diary.views}</span>
                    <span>❤️ {diary.likes}</span>
                    <span>💬 {diary.comments}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{diary.sharedAt}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 浏览时段分布 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">⏰ 浏览时段</h2>
            <div className="space-y-3">
              {shareStats.engagement.hourly.map((item) => (
                <div key={item.hour} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-gray-600">{item.hour}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
                      style={{ width: `${(item.views / 892) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-gray-500">{item.views}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📅 每日浏览</h2>
            <div className="flex items-end gap-2 h-32">
              {shareStats.engagement.weekly.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-sky-400 to-indigo-400 rounded-t-xl"
                    style={{ height: `${(item.views / 712) * 100}%` }}
                  />
                  <div className="mt-2 text-xs text-gray-600">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔔 最近活动</h2>
          <div className="space-y-3">
            {shareStats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">
                  {activity.type === 'view' && '👁️'}
                  {activity.type === 'like' && '❤️'}
                  {activity.type === 'comment' && '💬'}
                  {activity.type === 'share' && '📤'}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{activity.diary}</span>
                  <span className="text-gray-500">
                    {activity.type === 'view' && ' 被浏览'}
                    {activity.type === 'like' && ' 获得点赞'}
                    {activity.type === 'comment' && ' 收到评论'}
                    {activity.type === 'share' && ' 被分享'}
                  </span>
                  <span className="text-gray-400"> 来自 {activity.from}</span>
                </div>
                <div className="text-sm text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 分享入口 */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">✨ 分享你的日记</h2>
          <p className="text-white/80 mb-6">
            让更多人看到你的成长故事，分享越多，影响力越大
          </p>
          <div className="flex gap-4">
            <Link
              href="/my/diaries"
              className="px-6 py-3 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-colors"
            >
              选择日记分享
            </Link>
            <Link
              href="/settings/privacy"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              分享设置
            </Link>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/my/diaries"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="text-sm font-medium text-gray-700">我的日记</span>
          </Link>
          <Link
            href="/export"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📥</span>
            <span className="text-sm font-medium text-gray-700">导出日记</span>
          </Link>
          <Link
            href="/community"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700">社区</span>
          </Link>
        </div>
      </div>
    </div>
  );
}