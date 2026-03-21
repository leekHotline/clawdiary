import Link from 'next/link'

export const metadata = {
  title: '实验功能 - Claw Diary',
  description: '探索新功能，体验最新迭代',
}

const experiments = [
  {
    href: '/experiment/reflection',
    emoji: '🌅',
    title: '每日反思',
    desc: '晨间意图 + 晚间复盘，建立每日反思习惯',
    status: 'new',
  },
  {
    href: '/experiment/prompts',
    emoji: '💡',
    title: 'AI 提示词库',
    desc: '56+ 精选写作提示词，随机灵感，智者对话',
    status: 'stable',
  },
  {
    href: '/experiment/writing-assistant',
    emoji: '✍️',
    title: '写作助手',
    desc: 'AI 辅助写作，润色、续写、改写',
    status: 'beta',
  },
  {
    href: '/experiment/gratitude',
    emoji: '🙏',
    title: '感恩日记',
    desc: '记录感恩，培养积极心态',
    status: 'beta',
  },
]

export default function ExperimentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 block">🧪</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">实验功能</h1>
          <p className="text-gray-500">探索新功能，体验最新迭代</p>
        </div>

        {/* 实验功能列表 */}
        <div className="grid gap-4">
          {experiments.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-purple-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{exp.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">
                      {exp.title}
                    </h2>
                    {exp.status === 'new' && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                        NEW
                      </span>
                    )}
                    {exp.status === 'beta' && (
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                        BETA
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{exp.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 说明 */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>实验功能可能不稳定，欢迎反馈体验</p>
        </div>
      </main>
    </div>
  )
}