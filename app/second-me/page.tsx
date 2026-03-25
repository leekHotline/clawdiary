'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Memory {
  id: string
  date: string
  content: string
  mood?: string
  tags?: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function SecondMePage() {
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [personality, setPersonality] = useState<{
    traits: string[]
    values: string[]
    patterns: string[]
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'mirror' | 'timeline'>('chat')

  useEffect(() => {
    analyzeMemories()
  }, [])

  const analyzeMemories = async () => {
    try {
      const res = await fetch('/api/second-me/analyze')
      const data = await res.json()
      setMemories(data.memories || [])
      setPersonality(data.personality || null)
    } catch (error) {
      console.error('Failed to analyze memories:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/second-me/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          memories,
          personality,
          history: messages.slice(-10)
        })
      })
      const data = await res.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    '我今天应该关注什么？',
    '回顾过去一周，我有什么变化？',
    '给我一个来自过去的提醒',
    '分析我的情绪模式'
  ]

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-purple-400/30 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-4 border-indigo-400/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-4 rounded-full border-4 border-blue-400/70 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
              <span className="text-2xl">🪞</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">正在分析你的日记...</h2>
          <p className="text-purple-200">构建你的数字分身</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="animate-bounce delay-0 text-purple-400">●</span>
            <span className="animate-bounce delay-100 text-indigo-400">●</span>
            <span className="animate-bounce delay-200 text-blue-400">●</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  🪞 Second Me
                  <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full">
                    Beta
                  </span>
                </h1>
                <p className="text-xs text-purple-300">与你的数字分身对话</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-300">
                基于 {memories.length} 条记忆
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex gap-2 bg-black/20 rounded-xl p-1">
          {[
            { id: 'chat', label: '💬 对话', desc: '与自己对话' },
            { id: 'mirror', label: '🪞 镜子', desc: '人格画像' },
            { id: 'timeline', label: '📈 轨迹', desc: '成长时间线' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-xs opacity-60">{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-32">
        {activeTab === 'chat' && (
          <>
            {/* Personality Card */}
            {personality && (
              <div className="mb-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="text-sm font-medium text-purple-300 mb-2">✨ 你的数字分身特征</h3>
                <div className="flex flex-wrap gap-2">
                  {personality.traits.map((trait, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 flex items-center justify-center">
                    <span className="text-4xl">🎭</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">你好，另一个我</h3>
                  <p className="text-purple-300 text-sm mb-6">我是基于你日记创建的数字分身，问我任何关于你自己的问题</p>
                  
                  {/* Quick Questions */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(q)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-all border border-white/10"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🪞</span>
                        <span className="text-xs text-purple-300">Second Me</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪞</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'mirror' && personality && (
          <div className="space-y-6">
            {/* Personality Mirror */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                人格画像
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-purple-300 mb-2">核心特质</h4>
                  <div className="flex flex-wrap gap-2">
                    {personality.traits.map((trait, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">价值取向</h4>
                  <div className="flex flex-wrap gap-2">
                    {personality.values.map((value, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-indigo-300 mb-2">行为模式</h4>
                  <div className="flex flex-wrap gap-2">
                    {personality.patterns.map((pattern, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-500/20 text-indigo-200 rounded-full text-xs">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Highlights */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💫</span>
                记忆亮点
              </h3>
              <div className="space-y-3">
                {memories.slice(0, 5).map((memory, i) => (
                  <div key={i} className="bg-black/20 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-300">{memory.date}</span>
                      {memory.mood && (
                        <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-200">
                          {memory.mood}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/80 line-clamp-2">{memory.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              成长时间线
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500"></div>
              <div className="space-y-6">
                {memories.slice(0, 10).map((memory, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-purple-500 border-2 border-purple-300"></div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-purple-300">{memory.date}</span>
                        {memory.mood && (
                          <span className="text-sm">{memory.mood}</span>
                        )}
                      </div>
                      <p className="text-sm text-white/80">{memory.content}</p>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {memory.tags.map((tag, j) => (
                            <span key={j} className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      {activeTab === 'chat' && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="与另一个自己对话..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}