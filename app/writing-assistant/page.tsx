import Link from 'next/link'

// 写作助手功能配置
const features = [
  {
    id: 'title',
    name: '标题建议',
    icon: '📝',
    description: '根据内容智能生成标题建议',
    color: 'from-orange-400 to-amber-400',
  },
  {
    id: 'continue',
    name: '续写提示',
    icon: '✍️',
    description: '不知道怎么继续写？获取续写灵感',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'mood',
    name: '情感分析',
    icon: '💭',
    description: '分析日记的情感倾向',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 'tags',
    name: '标签推荐',
    icon: '🏷️',
    description: '智能推荐合适的标签',
    color: 'from-green-400 to-emerald-400',
  },
  {
    id: 'improve',
    name: '写作建议',
    icon: '💡',
    description: '获取改善日记质量的建议',
    color: 'from-purple-400 to-violet-400',
  },
  {
    id: 'outline',
    name: '写作大纲',
    icon: '📋',
    description: '生成日记写作框架',
    color: 'from-indigo-400 to-blue-400',
  },
]

// 写作技巧
const writingTips = [
  {
    title: '五感写作法',
    description: '描述你看到的、听到的、闻到的、尝到的、触摸到的',
    example: '清晨的阳光透过窗帘洒在被子上，温暖而柔和，空气中有淡淡的咖啡香气...',
  },
  {
    title: '场景重现',
    description: '像拍电影一样描述当时的场景',
    example: '我站在窗前，看着外面的雨滴打在玻璃上，形成一道道水痕...',
  },
  {
    title: '对话记忆',
    description: '记录印象深刻的对话内容',
    example: '他对我说："有时候，停下来休息一下也是一种前进。"',
  },
  {
    title: '内心独白',
    description: '记录你的思考和感受',
    example: '我想，也许成长就是这样，在不经意间发现自己已经走得很远...',
  },
  {
    title: '三件小事',
    description: '记录三件让你印象最深的小事',
    example: '今天有三件小事让我印象深刻：早上的惊喜、午后的阳光、晚上的安宁...',
  },
]

// 写作挑战
const challenges = [
  { id: 'gratitude', name: '感恩日记', description: '写下今天值得感恩的三件事', icon: '🙏', difficulty: '简单' },
  { id: 'detail', name: '细节描写', description: '用100字描述一个场景的细节', icon: '🔍', difficulty: '中等' },
  { id: 'emotion', name: '情感探索', description: '深入描述一种情绪', icon: '💭', difficulty: '中等' },
  { id: 'letter', name: '信件格式', description: '写一封信给未来的自己', icon: '✉️', difficulty: '困难' },
  { id: 'story', name: '故事模式', description: '把今天当作一个故事来讲述', icon: '📖', difficulty: '困难' },
]

export default function WritingAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ✍️ AI 写作助手
          </h1>
          <p className="text-gray-600">让 AI 帮你写出更好的日记</p>
        </div>

        {/* 快捷功能区 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🚀</span> 快捷功能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 text-white cursor-pointer transform hover:scale-[1.02] transition shadow-md`}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold">{feature.name}</div>
                <div className="text-sm opacity-90 mt-1">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 写作技巧 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📚</span> 写作技巧
          </h2>
          <div className="space-y-4">
            {writingTips.map((tip, index) => (
              <div key={tip.title} className="bg-white/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{tip.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{tip.description}</div>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic">
                      "{tip.example}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 写作挑战 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> 写作挑战
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white/50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{challenge.icon}</span>
                  <span className="font-semibold text-gray-800">{challenge.name}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{challenge.description}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  challenge.difficulty === '简单' ? 'bg-green-100 text-green-600' :
                  challenge.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 每日提示 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> 今日写作提示
          </h2>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="text-lg font-medium mb-2">
              如果今天可以重新来过，你会做哪些改变？
            </div>
            <div className="text-sm opacity-80">
              这个提示帮助你反思一天的选择，发现可以改进的地方。
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
              🎲 换一个提示
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
              📝 开始写作
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '5', label: '可用功能', icon: '🛠️', color: 'text-blue-500' },
            { value: '5', label: '写作技巧', icon: '📚', color: 'text-purple-500' },
            { value: '5', label: '写作挑战', icon: '🎯', color: 'text-pink-500' },
            { value: '∞', label: '写作灵感', icon: '✨', color: 'text-amber-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 返回链接 */}
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← 返回首页
          </Link>
          <span className="mx-4 text-gray-300">|</span>
          <Link href="/write" className="text-blue-600 hover:text-blue-700 font-medium">
            去写日记 →
          </Link>
        </div>
      </main>
    </div>
  )
}