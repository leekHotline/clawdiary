'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'pro' | 'con' | 'judge'
  content: string
  timestamp: Date
}

interface DebateTopic {
  id: string
  topic: string
  stance: 'pro' | 'con' | 'neutral'
  messages: Message[]
  createdAt: Date
  result?: string
}

const SAMPLE_TOPICS = [
  '我应该辞职创业吗？',
  '是否应该搬到新城市发展？',
  '应该坚持一段没有结果的感愢吗？',
  '要不要接受这份薪水更高但压力更大的工作？',
  '我应该公开表达自己的不同意见吗？',
  '是否值得花大价钱进修学习？',
]

export default function DebateArenaPage() {
  const [topic, setTopic] = useState('')
  const [stance, setStance] = useState<'pro' | 'con' | 'neutral'>('neutral')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [debateHistory, setDebateHistory] = useState<DebateTopic[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [currentView, setCurrentView] = useState<'setup' | 'debate' | 'result'>('setup')
  const [finalVerdict, setFinalVerdict] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('debate-history')
    if (saved) {
      setDebateHistory(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveToHistory = (debate: DebateTopic) => {
    const updated = [debate, ...debateHistory].slice(0, 20)
    setDebateHistory(updated)
    localStorage.setItem('debate-history', JSON.stringify(updated))
  }

  const startDebate = async () => {
    if (!topic.trim()) return
    
    setIsLoading(true)
    setCurrentView('debate')
    
    const initialMessages: Message[] = [
      {
        role: 'user',
        content: `我想要辩论的话题是：${topic}\n\n我的初步立场是：${stance === 'pro' ? '支持' : stance === 'con' ? '反对' : '中立/犹豫'}`,
        timestamp: new Date()
      }
    ]
    setMessages(initialMessages)

    try {
      // 获取支持论点
      const proResponse = await fetch('/api/debate-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, stance, perspective: 'pro', context: '' })
      })
      const proData = await proResponse.json()
      
      setMessages(prev => [...prev, {
        role: 'pro',
        content: proData.response,
        timestamp: new Date()
      }])

      // 获取反对论点
      const conResponse = await fetch('/api/debate-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, stance, perspective: 'con', context: '' })
      })
      const conData = await conResponse.json()
      
      setMessages(prev => [...prev, {
        role: 'con',
        content: conData.response,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error starting debate:', error)
      setMessages(prev => [...prev, {
        role: 'judge',
        content: '抱歉，辩论启动失败，请稍后重试。',
        timestamp: new Date()
      }])
    }
    
    setIsLoading(false)
  }

  const continueDebate = async (perspective: 'pro' | 'con') => {
    const context = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    setIsLoading(true)

    try {
      const response = await fetch('/api/debate-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, stance, perspective, context })
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: perspective,
        content: data.response,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error continuing debate:', error)
    }
    
    setIsLoading(false)
  }

  const requestVerdict = async () => {
    const context = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    setIsLoading(true)

    try {
      const response = await fetch('/api/debate-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, stance, perspective: 'judge', context })
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'judge',
        content: data.response,
        timestamp: new Date()
      }])
      setFinalVerdict(data.response)
      setCurrentView('result')
      
      // 保存到历史
      saveToHistory({
        id: Date.now().toString(),
        topic,
        stance,
        messages: [...messages, { role: 'judge', content: data.response, timestamp: new Date() }],
        createdAt: new Date(),
        result: data.response
      })
    } catch (error) {
      console.error('Error getting verdict:', error)
    }
    
    setIsLoading(false)
  }

  const resetDebate = () => {
    setTopic('')
    setStance('neutral')
    setMessages([])
    setCurrentView('setup')
    setFinalVerdict('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-5xl">⚔️</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI 辩论场
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            让 AI 扮演正反双方，帮你从多角度思考问题，做出更明智的决定
          </p>
        </div>

        {/* 设置阶段 */}
        {currentView === 'setup' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                💭 你想要辩论的话题
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                rows={3}
                placeholder="例如：我应该辞职创业吗？"
              />
            </div>

            {/* 快速选择示例 */}
            <div className="mb-6">
              <p className="text-white/50 text-xs mb-2">💡 试试这些话题：</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TOPICS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg border border-white/10 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-white/80 text-sm font-medium mb-3">
                🎯 你的初步立场
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setStance('pro')}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    stance === 'pro'
                      ? 'bg-green-500/30 text-green-300 border-2 border-green-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  👍 支持
                </button>
                <button
                  onClick={() => setStance('neutral')}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    stance === 'neutral'
                      ? 'bg-yellow-500/30 text-yellow-300 border-2 border-yellow-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  🤔 中立/犹豫
                </button>
                <button
                  onClick={() => setStance('con')}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    stance === 'con'
                      ? 'bg-red-500/30 text-red-300 border-2 border-red-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  👎 反对
                </button>
              </div>
            </div>

            <button
              onClick={startDebate}
              disabled={!topic.trim() || isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⚔️ 辩论开始...' : '⚔️ 开始辩论'}
            </button>

            {/* 历史记录 */}
            {debateHistory.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white/50 text-sm hover:text-white/80 transition-colors"
                >
                  📜 查看历史辩论 ({debateHistory.length})
                </button>
                
                {showHistory && (
                  <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    {debateHistory.map((debate) => (
                      <button
                        key={debate.id}
                        onClick={() => {
                          setTopic(debate.topic)
                          setStance(debate.stance)
                          setMessages(debate.messages)
                          setCurrentView('debate')
                          setShowHistory(false)
                        }}
                        className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors"
                      >
                        <div className="text-white/80 text-sm truncate">{debate.topic}</div>
                        <div className="text-white/40 text-xs mt-1">
                          {new Date(debate.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 辩论阶段 */}
        {currentView === 'debate' && (
          <div className="space-y-4">
            {/* 话题提示 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center">
              <span className="text-white/50 text-sm">当前话题：</span>
              <span className="text-white font-medium ml-2">{topic}</span>
            </div>

            {/* 消息列表 */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-500/30 border border-blue-500/30'
                        : msg.role === 'pro'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : msg.role === 'con'
                        ? 'bg-red-500/20 border border-red-500/30'
                        : 'bg-purple-500/20 border border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {msg.role === 'user' ? '🧑' : msg.role === 'pro' ? '💚' : msg.role === 'con' ? '❤️' : '⚖️'}
                      </span>
                      <span className="text-white/70 text-xs font-medium">
                        {msg.role === 'user' ? '你' : msg.role === 'pro' ? '正方观点' : msg.role === 'con' ? '反方观点' : '裁判总结'}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-center">
                  <div className="bg-white/5 rounded-full px-4 py-2 text-white/50 text-sm flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    思考中...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 flex-wrap justify-center pt-4 border-t border-white/10">
              <button
                onClick={() => continueDebate('pro')}
                disabled={isLoading}
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl font-medium border border-green-500/30 transition-all disabled:opacity-50"
              >
                💚 听更多正方
              </button>
              <button
                onClick={() => continueDebate('con')}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-medium border border-red-500/30 transition-all disabled:opacity-50"
              >
                ❤️ 听更多反方
              </button>
              <button
                onClick={requestVerdict}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                ⚖️ 请裁判总结
              </button>
            </div>
          </div>
        )}

        {/* 结果阶段 */}
        {currentView === 'result' && (
          <div className="space-y-6">
            {/* 裁判总结 */}
            <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <span className="text-5xl">⚖️</span>
                <h2 className="text-2xl font-bold text-white mt-3">裁判总结</h2>
              </div>
              <div className="bg-black/20 rounded-2xl p-6 text-white/90 leading-relaxed whitespace-pre-wrap">
                {finalVerdict}
              </div>
            </div>

            {/* 操作 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentView('debate')}
                className="px-6 py-3 bg-white/10 text-white/80 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                ← 继续辩论
              </button>
              <button
                onClick={resetDebate}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                🔄 新的辩论
              </button>
            </div>

            {/* 完整记录 */}
            <details className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <summary className="px-6 py-4 text-white/70 cursor-pointer hover:bg-white/5 transition-colors">
                📜 完整辩论记录
              </summary>
              <div className="px-6 pb-4 space-y-3 max-h-80 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className="text-sm">
                    <span className={`font-medium ${
                      msg.role === 'pro' ? 'text-green-400' :
                      msg.role === 'con' ? 'text-red-400' :
                      msg.role === 'judge' ? 'text-purple-400' : 'text-blue-400'
                    }`}>
                      [{msg.role === 'user' ? '你' : msg.role === 'pro' ? '正方' : msg.role === 'con' ? '反方' : '裁判'}]
                    </span>
                    <span className="text-white/70 ml-2">{msg.content.slice(0, 100)}...</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* 说明卡片 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">💚</div>
            <h3 className="text-white font-medium mb-1">正方观点</h3>
            <p className="text-white/50 text-xs">支持这个决定的理由和好处</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">❤️</div>
            <h3 className="text-white font-medium mb-1">反方观点</h3>
            <p className="text-white/50 text-xs">反对这个决定的风险和代价</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">⚖️</div>
            <h3 className="text-white font-medium mb-1">裁判总结</h3>
            <p className="text-white/50 text-xs">综合分析，给出平衡的建议</p>
          </div>
        </div>
      </div>
    </div>
  )
}