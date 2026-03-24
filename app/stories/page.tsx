import { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户故事墙 - Claw Diary",
  description: "听听用户怎么说？真实的故事，真实的成长",
};

// 模拟用户故事数据
const stories = [
  {
    id: 1,
    avatar: "👩‍💻",
    name: "小雅",
    role: "产品经理",
    timeAgo: "3天前",
    content:
      "用了两周，发现AI情绪镜子功能太准了！它分析出我每次周会后都会焦虑，建议我调整会议节奏。现在我的周一不再那么压抑了。",
    tags: ["情绪洞察", "职场成长"],
    likes: 42,
    feature: "emotion-mirror",
  },
  {
    id: 2,
    avatar: "🧑‍🎨",
    name: "阿杰",
    role: "设计师",
    timeAgo: "1周前",
    content:
      "日记盲盒功能太惊喜了！今天抽到了我去年写的一篇关于职业迷茫的日记，对比现在，发现自己真的成长了很多。时间的力量。",
    tags: ["回忆", "成长"],
    likes: 38,
    feature: "diary-blindbox",
  },
  {
    id: 3,
    avatar: "👩‍🔬",
    name: "科研喵",
    role: "研究生",
    timeAgo: "2周前",
    content:
      "AI日记教练告诉我，我的日记总是'先写困难再写解决'的模式，建议我多记录成功时刻。现在每篇日记都是正能量满满！",
    tags: ["写作模式", "正能量"],
    likes: 29,
    feature: "diary-coach",
  },
  {
    id: 4,
    avatar: "🧑‍💼",
    name: "Tony",
    role: "创业者",
    timeAgo: "3周前",
    content:
      "周复盘报告帮我发现了盲点：我总是在周三情绪低落。现在我会主动在周三安排一些小奖励给自己，效率反而更高了。",
    tags: ["周复盘", "自我管理"],
    likes: 56,
    feature: "weekly-reflection",
  },
  {
    id: 5,
    avatar: "👩‍🎤",
    name: "文艺少女",
    role: "自由职业",
    timeAgo: "1个月前",
    content:
      "人生里程碑功能简直是我的'时光相册'！AI自动标记了我创业第一周、第一个付费用户、第一次出差...每个瞬间都值得被记住。",
    tags: ["里程碑", "记忆"],
    likes: 71,
    feature: "life-milestones",
  },
  {
    id: 6,
    avatar: "🧑‍🚀",
    name: "太空漫步",
    role: "程序员",
    timeAgo: "1个月前",
    content:
      "作为一个理工男，我以前从不写日记。但AI对话日记让我可以像聊天一样记录，完全没有心理负担。现在已经坚持了60天！",
    tags: ["习惯养成", "对话日记"],
    likes: 83,
    feature: "chat-diary",
  },
];

// 统计数据
const stats = [
  { value: "10,000+", label: "活跃用户" },
  { value: "500,000+", label: "日记篇数" },
  { value: "98%", label: "满意度" },
  { value: "42天", label: "平均坚持" },
];

// 功能标签对应链接
const featureLinks: Record<string, string> = {
  "emotion-mirror": "/emotion-mirror",
  "diary-blindbox": "/diary-blindbox",
  "diary-coach": "/diary-coach",
  "weekly-reflection": "/weekly-reflection",
  "life-milestones": "/life-milestones",
  "chat-diary": "/chat-diary",
};

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-12">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-orange-600 mb-4">
            <span>✨</span>
            <span>真实用户 · 真实故事</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            用户故事墙
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            听听其他龙虾们怎么说？每一个故事都是真实的成长轨迹
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm border border-white/50"
            >
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 故事瀑布流 */}
        <div className="space-y-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all"
            >
              {/* 用户信息 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-2xl">
                  {story.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{story.name}</span>
                    <span className="text-sm text-gray-400">{story.role}</span>
                  </div>
                  <span className="text-xs text-gray-400">{story.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <span>❤️</span>
                  <span className="text-sm font-medium">{story.likes}</span>
                </div>
              </div>

              {/* 故事内容 */}
              <p className="text-gray-700 leading-relaxed mb-4">{story.content}</p>

              {/* 标签 */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <a
                  href={featureLinks[story.feature]}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  试试这个功能 →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">开始你的故事</h2>
            <p className="text-white/90 mb-6">
              每一个伟大的改变，都从第一篇日记开始
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/chat-diary"
                className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
              >
                💬 开始对话日记
              </a>
              <a
                href="/quickstart"
                className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                🚀 快速上手
              </a>
            </div>
          </div>
        </div>

        {/* 分享入口 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">也有故事想分享？</p>
          <a
            href="/feedback"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-gray-600 hover:bg-white/80 transition-colors"
          >
            <span>✍️</span>
            <span>提交你的故事</span>
          </a>
        </div>
      </main>
    </div>
  );
}