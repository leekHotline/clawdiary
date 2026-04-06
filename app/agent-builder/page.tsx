"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Agent types and templates
const AGENT_TEMPLATES = [
  {
    id: 'diary-companion',
    name: '日记伴侣',
    description: '陪伴你记录每日心情与思考的智能伙伴',
    icon: '📔',
    color: 'from-rose-400 to-pink-500',
    capabilities: ['emotion-tracking', 'inspiration', 'reflection'],
  },
  {
    id: 'writing-coach',
    name: '写作教练',
    description: '帮助你提升写作技巧的AI导师',
    icon: '✍️',
    color: 'from-amber-400 to-orange-500',
    capabilities: ['style-analysis', 'suggestions', 'practice'],
  },
  {
    id: 'growth-mentor',
    name: '成长导师',
    description: '追踪你的成长轨迹，提供个性化建议',
    icon: '🌱',
    color: 'from-emerald-400 to-green-500',
    capabilities: ['goal-tracking', 'milestones', 'insights'],
  },
  {
    id: 'mood-buddy',
    name: '心情伙伴',
    description: '理解你的情绪，提供温暖支持',
    icon: '💝',
    color: 'from-violet-400 to-purple-500',
    capabilities: ['mood-check', 'empathy', 'coping'],
  },
  {
    id: 'creative-muse',
    name: '创意 muse',
    description: '激发创意灵感，陪伴创意探索',
    icon: '🎨',
    color: 'from-cyan-400 to-blue-500',
    capabilities: ['brainstorm', 'ideas', 'exploration'],
  },
]

const CAPABILITY_OPTIONS = [
  { id: 'emotion-tracking', name: '情绪追踪', icon: '📊' },
  { id: 'inspiration', name: '灵感激发', icon: '💡' },
  { id: 'reflection', name: '反思引导', icon: '🤔' },
  { id: 'style-analysis', name: '风格分析', icon: '🔍' },
  { id: 'suggestions', name: '写作建议', icon: '📝' },
  { id: 'practice', name: '练习指导', icon: '🎯' },
  { id: 'goal-tracking', name: '目标追踪', icon: '🎯' },
  { id: 'milestones', name: '里程碑', icon: '🏆' },
  { id: 'insights', name: '洞察分析', icon: '📈' },
  { id: 'mood-check', name: '心情检查', icon: '❤️' },
  { id: 'empathy', name: '共情回应', icon: '🤗' },
  { id: 'coping', name: '应对策略', icon: '🧘' },
  { id: 'brainstorm', name: '头脑风暴', icon: '🌀' },
  { id: 'ideas', name: '创意生成', icon: '✨' },
  { id: 'exploration', name: '探索引导', icon: '🗺️' },
]

export default function AgentBuilder() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [personality, setPersonality] = useState('supportive')
  const [tone, setTone] = useState('warm')
  const [isBuilding, setIsBuilding] = useState(false)
  const [built, setBuilt] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId)
    setSelectedTemplate(templateId)
    if (template) {
      setAgentName(template.name)
      setAgentDescription(template.description)
      setSelectedCapabilities(template.capabilities)
    }
  }

  const toggleCapability = (capId: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capId) 
        ? prev.filter(c => c !== capId)
        : [...prev, capId]
    )
  }

  const handleBuild = async () => {
    setIsBuilding(true)
    // Simulate building
    await new Promise(resolve => setTimeout(resolve, 1500))
    setBuilt(true)
    setIsBuilding(false)
  }

  const resetBuilder = () => {
    setStep(1)
    setAgentName('')
    setAgentDescription('')
    setSelectedTemplate(null)
    setSelectedCapabilities([])
    setPersonality('supportive')
    setTone('warm')
    setBuilt(false)
  }

  if (built) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-4">AI 助手已创建！</h1>
            <p className="text-white/70 mb-8">
              你的 "{agentName}" 已准备就绪，现在可以开始使用了
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => router.push('/diary-chat')}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition"
              >
                开始对话 →
              </button>
              <button
                onClick={resetBuilder}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                创建另一个
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🧩 AI 助手构建器
          </h1>
          <p className="text-white/60">打造属于你的专属AI伙伴</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                step >= s 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' 
                  : 'bg-white/10 text-white/40'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-2 transition ${
                  step > s ? 'bg-violet-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Templates */}
        {step === 1 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">选择模板开始</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {AGENT_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-white/20 ring-2 ring-violet-400'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{template.icon}</span>
                    <span className="font-semibold text-white">{template.name}</span>
                  </div>
                  <p className="text-white/60 text-sm">{template.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedTemplate}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 2 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">自定义配置</h2>
            
            <div>
              <label className="block text-white/80 mb-2">名称</label>
              <input
                type="text"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="给你的AI助手起个名字"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2">描述</label>
              <textarea
                value={agentDescription}
                onChange={e => setAgentDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                rows={2}
                placeholder="描述你的AI助手"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-3">能力选择</label>
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_OPTIONS.map(cap => (
                  <button
                    key={cap.id}
                    onClick={() => toggleCapability(cap.id)}
                    className={`px-3 py-2 rounded-xl text-sm transition ${
                      selectedCapabilities.includes(cap.id)
                        ? 'bg-violet-500/30 text-white border border-violet-400'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cap.icon} {cap.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 mb-2">人格</label>
                <select
                  value={personality}
                  onChange={e => setPersonality(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <option value="supportive">支持型</option>
                  <option value="analytical">分析型</option>
                  <option value="creative">创意型</option>
                  <option value="direct">直接型</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 mb-2">语气</label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <option value="warm">温暖</option>
                  <option value="professional">专业</option>
                  <option value="casual">轻松</option>
                  <option value="encouraging">鼓励</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                ← 上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!agentName}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Build */}
        {step === 3 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">预览并创建</h2>
            
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl p-6 mb-6 border border-violet-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-3xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{agentName}</h3>
                  <p className="text-white/60">{agentDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCapabilities.map(capId => {
                  const cap = CAPABILITY_OPTIONS.find(c => c.id === capId)
                  return cap ? (
                    <span key={capId} className="px-2 py-1 bg-white/10 rounded-lg text-white/80 text-sm">
                      {cap.icon} {cap.name}
                    </span>
                  ) : null
                })}
              </div>
              <div className="flex gap-4 text-sm text-white/60">
                <span>人格: {personality}</span>
                <span>语气: {tone}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                ← 上一步
              </button>
              <button
                onClick={handleBuild}
                disabled={isBuilding}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-40 hover:opacity-90 transition flex items-center gap-2"
              >
                {isBuilding ? (
                  <>
                    <span className="animate-spin">⚡</span> 构建中...
                  </>
                ) : (
                  <>🚀 创建 AI 助手</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
