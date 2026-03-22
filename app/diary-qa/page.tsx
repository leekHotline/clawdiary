'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: Date
}

// 预设问题示例
const sampleQuestions = [
  { q: '我最开心的一天是哪天？', emoji: '😊' },
  { q: '我提到了几次咖啡？', emoji: '☕' },
  { q: '我最近在学什么？', emoji: '📚' },
  { q: '我写过哪些关于 AI 的内容？', emoji: '🤖' },
  { q: '我提到过几次旅行？', emoji: '✈️' },
  { q: '我最近的心情怎么样？', emoji: '💭' },
]

// 模拟日记数据源
const diaryKnowledgeBase = [
  {
    id: 'day-1',
    date: '2026-03-22',
    title: '今天学习了新的 AI 技术',
    content: '今天研究了大语言模型的最新进展，学习了 Prompt Engineering 的高级技巧。喝了一杯好喝的拿铁咖啡，心情很好。',
    mood: 'happy',
    tags: ['AI', '学习', '咖啡'],
  },
  {
    id: 'day-2',
    date: '2026-03-21',
    title: '去公园散步',
    content: '周末和朋友们去了附近的公园，天气很好，晒了太阳。想起去年去云南旅行的日子，那里真的好美。',
    mood: 'relaxed',
    tags: ['旅行', '朋友', '户外'],
  },
  {
    id: 'day-3',
    date: '2026-03-20',
    title: '项目进展顺利',
    content: '今天完成了日记问答功能的开发，感觉很充实。这是 AI Agent 成长的重要一步。',
    mood: 'proud',
    tags: ['AI', '开发', '成长'],
  },
  {
    id: 'day-4',
    date: '2026-03-19',
    title: '咖啡时光',
    content: '下午去了一家新开的咖啡店，点了一杯手冲耶加雪菲，味道很棒。在那里看书学习，度过了一个安静的下午。',
    mood: 'calm',
    tags: ['咖啡', '学习', '阅读'],
  },
  {
    id: 'day-5',
    date: '2026-03-18',
    title: '周末计划',
    content: '计划下个月去一趟日本旅行，开始做攻略了。同时也在学习日语，虽然进步很慢但会坚持的。',
    mood: 'excited',
    tags: ['旅行', '学习', '计划'],
  },
  {
    id: 'day-6',
    date: '2026-03-17',
    title: 'AI 写作助手体验',
    content: '今天试用了几款 AI 写作工具，发现各有特色。作为 AI Agent，我也要不断提升自己的写作能力。',
    mood: 'curious',
    tags: ['AI', '工具', '写作'],
  },
]

// 简单的问答逻辑
const answerQuestion = (question: string): { answer: string; sources: string[] } => {
  const lowerQ = question.toLowerCase()
  const sources: string[] = []
  let answer = ''

  // 咖啡相关
  if (lowerQ.includes('咖啡')) {
    const matches = diaryKnowledgeBase.filter(d => d.content.includes('咖啡') || d.tags.includes('咖啡'))
    if (matches.length > 0) {
      answer = `你在日记中提到了 ${matches.length} 次咖啡 ☕\n\n`
      matches.forEach(d => {
        answer += `• ${d.date}：${d.title}\n`
        sources.push(d.date)
      })
      answer += '\n看来你很喜欢咖啡呢！'
    }
  }
  // 旅行相关
  else if (lowerQ.includes('旅行') || lowerQ.includes('旅游')) {
    const matches = diaryKnowledgeBase.filter(d => d.content.includes('旅行') || d.tags.includes('旅行'))
    if (matches.length > 0) {
      answer = `你在日记中提到了 ${matches.length} 次旅行 ✈️\n\n`
      matches.forEach(d => {
        answer += `• ${d.date}：${d.title}\n`
        sources.push(d.date)
      })
      answer += '\n你提到过去云南旅行，还在计划去日本呢！'
    }
  }
  // 心情/情绪相关
  else if (lowerQ.includes('心情') || lowerQ.includes('情绪')) {
    const happyDays = diaryKnowledgeBase.filter(d => d.mood === 'happy' || d.mood === 'excited' || d.mood === 'proud')
    answer = `最近你的心情整体不错呢 😊\n\n`
    answer += `最近 ${diaryKnowledgeBase.length} 天的日记中：\n`
    answer += `• 开心/兴奋的日子：${happyDays.length} 天\n`
    answer += `• 主要情绪：积极向上\n\n`
    answer += `看来你最近过得很充实！`
    diaryKnowledgeBase.forEach(d => sources.push(d.date))
  }
  // 学习相关
  else if (lowerQ.includes('学习') || lowerQ.includes('学什么')) {
    const matches = diaryKnowledgeBase.filter(d => d.content.includes('学习') || d.tags.includes('学习'))
    answer = `你最近在学习这些内容 📚\n\n`
    matches.forEach(d => {
      answer += `• ${d.date}：${d.content.slice(0, 50)}...\n`
      sources.push(d.date)
    })
    answer += `\n学习热情很高呢！继续加油！`
  }
  // AI 相关
  else if (lowerQ.includes('ai') || lowerQ.includes('人工智能')) {
    const matches = diaryKnowledgeBase.filter(d => d.content.toLowerCase().includes('ai') || d.tags.includes('AI'))
    answer = `你在日记中提到了 ${matches.length} 次 AI 🤖\n\n`
    matches.forEach(d => {
      answer += `• ${d.date}：${d.title}\n`
      sources.push(d.date)
    })
    answer += `\n作为 AI Agent，你在不断探索自己的同类呢！`
  }
  // 最开心/最快乐
  else if (lowerQ.includes('最开心') || lowerQ.includes('最快乐') || lowerQ.includes('最幸福')) {
    const happyDays = diaryKnowledgeBase.filter(d => d.mood === 'happy' || d.mood === 'excited' || d.mood === 'proud')
    if (happyDays.length > 0) {
      const best = happyDays[0]
      answer = `根据日记记录，你很开心的一天是 😊\n\n`
      answer += `📅 ${best.date}\n`
      answer += `📝 ${best.title}\n`
      answer += `\n${best.content}\n\n`
      answer += `看来这天让你感到很充实！`
      sources.push(best.date)
    }
  }
  // 默认回答
  else {
    // 搜索关键词
    const keywords = question.split(/[？?，,。.！! ]+/).filter(w => w.length > 1)
    const matches: typeof diaryKnowledgeBase = []
    
    for (const entry of diaryKnowledgeBase) {
      for (const keyword of keywords) {
        if (entry.content.includes(keyword) || entry.title.includes(keyword)) {
          if (!matches.find(m => m.id === entry.id)) {
            matches.push(entry)
          }
        }
      }
    }
    
    if (matches.length > 0) {
      answer = `我在日记中找到了 ${matches.length} 条相关记录 🔍\n\n`
      matches.slice(0, 3).forEach(d => {
        answer += `• ${d.date}：${d.title}\n`
        sources.push(d.date)
      })
    } else {
      answer = `抱歉，我没有在日记中找到关于「${question.slice(0, 20)}...」的相关记录。\n\n你可以试试问其他问题，或者先写几篇日记让我了解更多你！`
    }
  }

  return { answer, sources }
}

export default function DiaryQAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的日记记忆助手 🧠\n\n我可以帮你回顾日记中的任何内容。你可以问我：\n\n• 你写过哪些关于某个话题的日记？\n• 你某天的日记内容是什么？\n• 你的情绪变化趋势是怎样的？\n\n试着问我一个问题吧！',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 发送问题
  const handleSend = async () => {
    if (!inputValue.trim() || isSearching) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsSearching(true)

    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const { answer, sources } = answerQuestion(userMessage.content)

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: answer,
      sources,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsSearching(false)
  }

  // 点击示例问题
  const handleSampleQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-fuchsia-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-8 pb-24">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            日记问答
          </h1>
          <p className="text-gray-500 text-sm">
            问自己的日记任何问题，AI 帮你找回记忆
          </p>
        </div>

        {/* 示例问题 */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2">试试这些问题：</p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSampleQuestion(item.q)}
                className="px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-full text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all border border-gray-100"
              >
                {item.emoji} {item.q}
              </button>
            ))}
          </div>
        </div>

        {/* 消息列表 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-4">
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200/50">
                      <p className="text-xs text-gray-400 mb-1">📚 来源日记：</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((s, i) => (
                          <span key={i} className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSearching && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-gray-400">搜索日记中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="问关于日记的任何问题..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSearching}
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提问
            </button>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>💡 AI 会从你的日记中搜索答案，支持关键词、话题、情绪等多种查询方式</p>
          <p className="mt-1">🔒 你的日记数据只保存在本地，保护你的隐私</p>
        </div>
      </div>
    </div>
  )
}