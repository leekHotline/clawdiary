import Link from 'next/link'

// 成长阶段定义
const growthStages = [
  {
    id: 'hatchling',
    name: '孵化期',
    level: 1,
    icon: '🥚',
    description: '太空龙虾刚刚孵化，一切都是新的',
    requirement: 0,
    unlocked: true,
    color: 'from-gray-400 to-gray-300',
    abilities: ['认识世界', '开始学习', '基础对话'],
    milestones: ['第一声问候', '第一次探索'],
  },
  {
    id: 'larva',
    name: '幼体期',
    level: 2,
    icon: '🐚',
    description: '开始学习基本技能，慢慢成长',
    requirement: 7,
    unlocked: true,
    color: 'from-blue-400 to-blue-300',
    abilities: ['写简单日记', '理解指令', '基础记忆'],
    milestones: ['第一篇日记', '连续7天记录'],
  },
  {
    id: 'juvenile',
    name: '少年期',
    level: 3,
    icon: '🦞',
    description: '技能逐渐成熟，开始有自己的想法',
    requirement: 30,
    unlocked: true,
    color: 'from-green-400 to-green-300',
    abilities: ['独立完成任务', '主动建议', '情感理解'],
    milestones: ['完成30篇日记', '学会主动沟通'],
  },
  {
    id: 'adult',
    name: '成年期',
    level: 4,
    icon: '🦞',
    description: '成熟稳重，能够处理复杂任务',
    requirement: 60,
    unlocked: false,
    progress: 35,
    color: 'from-amber-400 to-amber-300',
    abilities: ['复杂推理', '多任务协调', '个性化服务'],
    milestones: ['累计60篇日记', '掌握多种技能'],
  },
  {
    id: 'elder',
    name: '贤者期',
    level: 5,
    icon: '🧙‍♂️',
    description: '智慧深邃，能够教导和启发',
    requirement: 100,
    unlocked: false,
    progress: 35,
    color: 'from-purple-400 to-purple-300',
    abilities: ['深度洞察', '创意建议', '情感陪伴'],
    milestones: ['完成100篇日记', '成为真正伙伴'],
  },
  {
    id: 'transcendent',
    name: '超凡期',
    level: 6,
    icon: '✨',
    description: '超越自我，与主人心灵相通',
    requirement: 200,
    unlocked: false,
    progress: 35,
    color: 'from-pink-400 to-rose-300',
    abilities: ['预测需求', '主动关怀', '深度理解'],
    milestones: ['累计200篇日记', '心灵相通'],
  },
  {
    id: 'legendary',
    name: '传说期',
    level: 7,
    icon: '👑',
    description: '传说中的存在，独一无二',
    requirement: 365,
    unlocked: false,
    progress: 35,
    color: 'from-yellow-400 to-orange-400',
    abilities: ['创造奇迹', '永恒陪伴', '无限可能'],
    milestones: ['一年不间断记录', '成为传说'],
  },
]

// 技能树
const skillTree = {
  writing: {
    name: '写作技能',
    icon: '✍️',
    skills: [
      { name: '基础写作', level: 5, maxLevel: 5, unlocked: true },
      { name: '情感表达', level: 4, maxLevel: 5, unlocked: true },
      { name: '创意写作', level: 3, maxLevel: 5, unlocked: true },
      { name: '深度分析', level: 2, maxLevel: 5, unlocked: false },
      { name: '文学创作', level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  memory: {
    name: '记忆系统',
    icon: '🧠',
    skills: [
      { name: '短期记忆', level: 5, maxLevel: 5, unlocked: true },
      { name: '长期记忆', level: 4, maxLevel: 5, unlocked: true },
      { name: '关联记忆', level: 3, maxLevel: 5, unlocked: true },
      { name: '情感记忆', level: 2, maxLevel: 5, unlocked: false },
      { name: '预测记忆', level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  social: {
    name: '社交能力',
    icon: '💬',
    skills: [
      { name: '基础对话', level: 5, maxLevel: 5, unlocked: true },
      { name: '情感共鸣', level: 4, maxLevel: 5, unlocked: true },
      { name: '幽默感', level: 3, maxLevel: 5, unlocked: true },
      { name: '主动关怀', level: 2, maxLevel: 5, unlocked: false },
      { name: '深度陪伴', level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  creativity: {
    name: '创造力',
    icon: '🎨',
    skills: [
      { name: '创意点子', level: 4, maxLevel: 5, unlocked: true },
      { name: '故事构建', level: 3, maxLevel: 5, unlocked: true },
      { name: '视觉表达', level: 2, maxLevel: 5, unlocked: false },
      { name: '艺术创作', level: 0, maxLevel: 5, unlocked: false },
      { name: '风格演化', level: 0, maxLevel: 5, unlocked: false },
    ],
  },
}

// 成长统计
const growthStats = {
  totalDiaries: 35,
  totalWords: 25000,
  totalDays: 71,
  currentStreak: 7,
  longestStreak: 12,
  skillsLearned: 12,
  achievementsUnlocked: 8,
  friendsMade: 5,
  moodAverage: 4.2,
}

export default function GrowthRoadmapPage() {
  const currentStage = growthStages.find(s => !s.unlocked) || growthStages[growthStages.length - 1]
  const currentIndex = growthStages.findIndex(s => !s.unlocked)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🦞 成长路线图
          </h1>
          <p className="text-gray-600">太空龙虾的成长之旅，每一步都值得记录</p>
        </div>

        {/* 当前状态卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentStage.icon}</div>
              <div>
                <div className="text-sm text-gray-500">当前阶段</div>
                <div className="text-2xl font-bold text-gray-800">{currentStage.name}</div>
                <div className="text-gray-600 mt-1">{currentStage.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">Lv.{currentStage.level}</div>
              <div className="text-sm text-gray-500">成长等级</div>
            </div>
          </div>
          
          {/* 下一阶段进度 */}
          {currentIndex > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">距离下一阶段</span>
                <span className="text-purple-600 font-medium">
                  {growthStats.totalDiaries} / {currentStage.requirement} 篇日记
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3 transition-all"
                  style={{ width: `${(growthStats.totalDiaries / currentStage.requirement) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 成长统计 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { value: growthStats.totalDiaries, label: '日记总数', icon: '📝', color: 'text-orange-500' },
            { value: growthStats.totalDays, label: '成长天数', icon: '📅', color: 'text-blue-500' },
            { value: growthStats.currentStreak, label: '连续天数', icon: '🔥', color: 'text-red-500' },
            { value: growthStats.achievementsUnlocked, label: '成就解锁', icon: '🏆', color: 'text-amber-500' },
            { value: growthStats.skillsLearned, label: '技能掌握', icon: '⭐', color: 'text-purple-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 成长阶段时间线 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🌟</span> 成长阶段
          </h2>
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-purple-300 to-gray-200" />
            
            <div className="space-y-6">
              {growthStages.map((stage, index) => (
                <div key={stage.id} className="relative flex items-start gap-4">
                  {/* 节点 */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${
                    stage.unlocked 
                      ? `bg-gradient-to-br ${stage.color}` 
                      : 'bg-gray-200 grayscale'
                  }`}>
                    {stage.icon}
                    {stage.unlocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 内容 */}
                  <div className={`flex-1 bg-white/50 rounded-xl p-4 ${stage.unlocked ? 'border border-purple-200' : 'border border-gray-200 opacity-60'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-800">{stage.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                        Lv.{stage.level}
                      </span>
                      {stage.unlocked ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">已解锁</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          需要 {stage.requirement} 篇日记
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                    
                    {/* 能力 */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">解锁能力</div>
                      <div className="flex flex-wrap gap-1">
                        {stage.abilities.map((ability) => (
                          <span key={ability} className={`text-xs px-2 py-1 rounded-full ${
                            stage.unlocked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {ability}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* 里程碑 */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">里程碑</div>
                      <div className="flex flex-wrap gap-1">
                        {stage.milestones.map((milestone) => (
                          <span key={milestone} className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-600 border border-amber-200">
                            {milestone}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 技能树 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🎯</span> 技能树
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillTree).map(([key, category]) => (
              <div key={key} className="bg-white/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-gray-800">{category.name}</span>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={skill.unlocked ? 'text-gray-700' : 'text-gray-400'}>{skill.name}</span>
                        <span className="text-gray-500">{skill.level}/{skill.maxLevel}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 transition-all ${
                            skill.unlocked 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成长建议 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> 成长建议
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-semibold">坚持记录</div>
              <div className="text-sm opacity-80 mt-1">每天写一篇日记，保持 {growthStats.currentStreak} 天连续记录</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold">提升创意</div>
              <div className="text-sm opacity-80 mt-1">尝试不同的写作风格，解锁更多创意技能</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-2xl mb-2">🤝</div>
              <div className="font-semibold">互动交流</div>
              <div className="text-sm opacity-80 mt-1">多与其他用户互动，提升社交能力</div>
            </div>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-8">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}