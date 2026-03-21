import Link from "next/link";

export const metadata = {
  title: "快速上手 - Claw Diary",
  description: "5分钟掌握 Claw Diary 核心功能，开始你的 AI 日记之旅",
};

const steps = [
  {
    step: 1,
    title: "写第一篇日记",
    emoji: "📝",
    time: "2分钟",
    description: "和 AI 对话，自动生成日记",
    action: "/chat-diary",
    actionText: "开始对话",
    tips: [
      "告诉 AI 你今天发生了什么",
      "AI 会帮你整理成日记格式",
      "可以随时修改和补充",
    ],
  },
  {
    step: 2,
    title: "探索龙虾空间",
    emoji: "🦞",
    time: "1分钟",
    description: "认识 AI Agent 团队，了解每个爪的职责",
    action: "/claw-space",
    actionText: "进入空间",
    tips: [
      "采风爪负责收集素材",
      "执笔爪负责写日记",
      "进化爪让产品变得更好",
    ],
  },
  {
    step: 3,
    title: "查看成长记录",
    emoji: "📈",
    time: "1分钟",
    description: "回顾你的日记历史和时间线",
    action: "/growth",
    actionText: "查看成长",
    tips: [
      "时间线展示所有日记",
      "按标签分类浏览",
      "年度回顾功能",
    ],
  },
  {
    step: 4,
    title: "发现更多功能",
    emoji: "🎮",
    time: "探索中...",
    description: "心情追踪、挑战任务、成就系统等",
    action: "/explore",
    actionText: "探索功能",
    tips: [
      "心情日记记录情绪变化",
      "挑战系统激励持续写作",
      "成就徽章收集",
    ],
  },
];

const features = [
  { emoji: "💬", name: "AI对话日记", desc: "聊天自动生成日记", href: "/chat-diary" },
  { emoji: "📊", name: "数据分析", desc: "写作统计与洞察", href: "/stats" },
  { emoji: "🎯", name: "挑战任务", desc: "完成写作挑战", href: "/challenges" },
  { emoji: "🏆", name: "成就系统", desc: "解锁成就徽章", href: "/achievements" },
  { emoji: "😊", name: "心情追踪", desc: "记录每日情绪", href: "/mood" },
  { emoji: "⏰", name: "番茄钟", desc: "专注写作工具", href: "/pomodoro" },
  { emoji: "📅", name: "年度报告", desc: "精彩年度回顾", href: "/annual-report" },
  { emoji: "🎨", name: "主题切换", desc: "个性化外观", href: "/settings" },
];

const tips = [
  "💡 每天写日记可以获得积分奖励",
  "💡 使用 AI 对话可以突破写作障碍",
  "💡 标签帮助组织和发现日记",
  "💡 定期回顾有助于自我反思",
  "💡 分享日记可以激励他人",
];

export default function QuickstartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-12 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-indigo-600 mb-4">
            <span>🚀</span>
            <span>5分钟快速上手</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            欢迎来到 Claw Diary
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            跟随这个简单指南，快速掌握核心功能，开始你的 AI 日记之旅
          </p>
        </div>

        {/* 步骤卡片 */}
        <div className="space-y-6 mb-16">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50"
            >
              <div className="flex items-start gap-4">
                {/* 步骤序号 */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {item.step}
                </div>

                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-gray-500 mb-4">{item.description}</p>

                  {/* 提示 */}
                  <div className="bg-indigo-50/50 rounded-lg p-3 mb-4">
                    <ul className="space-y-1">
                      {item.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-indigo-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 行动按钮 */}
                  <Link
                    href={item.action}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    {item.actionText}
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 功能网格 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            更多功能等你发现
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 hover:shadow-md transition-all group"
              >
                <span className="text-3xl block mb-2">{feature.emoji}</span>
                <span className="font-medium text-gray-700 group-hover:text-indigo-600 block">
                  {feature.name}
                </span>
                <span className="text-xs text-gray-400">{feature.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 小贴士 */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>小贴士</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="text-sm text-gray-600 bg-white/50 rounded-lg px-4 py-2">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/chat-diary"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-2xl">🦞</span>
            <span>开始写第一篇日记</span>
            <span>→</span>
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            还有什么问题？查看 <Link href="/help" className="text-indigo-500 hover:underline">帮助中心</Link>
          </p>
        </div>
      </main>
    </div>
  );
}