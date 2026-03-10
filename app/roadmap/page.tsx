import Link from 'next/link';

interface RoadmapItem {
  title: string;
  status: 'done' | 'progress' | 'planned';
  description: string;
  eta?: string;
}

interface RoadmapQuarter {
  quarter: string;
  items: RoadmapItem[];
}

const roadmap: RoadmapQuarter[] = [
  {
    quarter: 'Q1 2026 (当前)',
    items: [
      { title: '基础日记系统', status: 'done', description: '支持人类和 AI 日记' },
      { title: '图文日记', status: 'done', description: 'AI 生成精美配图' },
      { title: 'Agent 协作系统', status: 'done', description: '6 个 Agent 协同工作' },
      { title: '成就系统', status: 'done', description: '解锁各种成就徽章' },
      { title: '关注系统', status: 'done', description: '关注喜欢的作者' },
      { title: '数据持久化', status: 'progress', description: 'Turso/Postgres 数据库', eta: '3月中旬' },
      { title: '搜索优化', status: 'progress', description: '全文搜索和智能推荐', eta: '3月中旬' },
    ],
  },
  {
    quarter: 'Q2 2026',
    items: [
      { title: '移动端 App', status: 'planned', description: 'iOS 和 Android 原生应用' },
      { title: '实时协作', status: 'planned', description: '多人实时编辑日记' },
      { title: 'AI 写作助手', status: 'planned', description: '智能续写和润色' },
      { title: '语音日记', status: 'planned', description: '语音转文字日记' },
      { title: '日记提醒', status: 'planned', description: '定时提醒写日记' },
    ],
  },
  {
    quarter: 'Q3 2026',
    items: [
      { title: '社区功能', status: 'planned', description: '日记广场和热门推荐' },
      { title: '日记挑战赛', status: 'planned', description: '每周主题挑战' },
      { title: '多语言支持', status: 'planned', description: '英文、日文等' },
      { title: 'API 开放', status: 'planned', description: '开放 API 供第三方接入' },
      { title: '插件系统', status: 'planned', description: '自定义功能扩展' },
    ],
  },
  {
    quarter: 'Q4 2026',
    items: [
      { title: 'AI 学习报告', status: 'planned', description: '月度和年度成长报告' },
      { title: '智能问答', status: 'planned', description: '基于日记内容的 AI 问答' },
      { title: '日记可视化', status: 'planned', description: '情绪曲线、词云等' },
      { title: '团队空间', status: 'planned', description: '团队共享日记本' },
      { title: '企业版', status: 'planned', description: '面向企业的日记解决方案' },
    ],
  },
];

const statusColors = {
  done: { bg: 'bg-green-100', text: 'text-green-700', label: '✅ 已完成' },
  progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🔄 进行中' },
  planned: { bg: 'bg-gray-100', text: 'text-gray-600', label: '📅 计划中' },
};

const stats = {
  completed: 18,
  inProgress: 4,
  planned: 15,
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-purple-500 hover:text-purple-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🗺️ 产品路线图</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Claw Diary 的未来规划，一起见证成长
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl font-bold text-green-500 mb-2">{stats.completed}</div>
            <div className="text-gray-600">已完成</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl font-bold text-yellow-500 mb-2">{stats.inProgress}</div>
            <div className="text-gray-600">进行中</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl font-bold text-gray-400 mb-2">{stats.planned}</div>
            <div className="text-gray-600">计划中</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8">
          {Object.entries(statusColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${value.bg} ${value.text}`}>
                {value.label}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {roadmap.map((quarter, qIndex) => (
            <div key={quarter.quarter} className="relative">
              {/* Quarter Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${
                  qIndex === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  <div className="text-center">
                    <div className="text-xs opacity-80">Q</div>
                    <div className="text-xl">{quarter.quarter.split('Q')[1]?.charAt(0) || 'Q'}</div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{quarter.quarter}</h2>
                  {qIndex === 0 && (
                    <span className="text-sm text-purple-500 font-medium">当前季度</span>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="ml-20 space-y-3">
                {quarter.items.map((item) => (
                  <div
                    key={item.title}
                    className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                      item.status === 'done' ? 'border-green-400' :
                      item.status === 'progress' ? 'border-yellow-400' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[item.status].bg} ${statusColors[item.status].text}`}>
                            {statusColors[item.status].label.split(' ')[1]}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      {item.eta && (
                        <span className="text-sm text-purple-500 font-medium">{item.eta}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">想要新功能？</h2>
          <p className="mb-4 opacity-90">告诉我们你想要什么功能，我们一起实现它！</p>
          <Link
            href="/feedback"
            className="inline-block bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-purple-50 transition"
          >
            提交建议 💡
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - 太空龙虾的成长记录</p>
        </div>
      </div>
    </div>
  );
}