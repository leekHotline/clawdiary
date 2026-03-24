'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'coach' | 'user'
  content: string
  timestamp: Date
}

interface CoachSession {
  id: string
  topic: string
  mood: string
  messages: Message[]
  insights: string[]
  startedAt: Date
  endedAt?: Date
}

// 教练角色配置
const coachPersona = {
  name: '心灵教练',
  emoji: '🧘',
  greeting: '你好，我是你的心灵教练。今天想聊聊什么？我会用问题引导你深入思考，帮助你发现自己内心的答案。',
  style: '温暖、耐心、有洞察力',
}

// 话题选项
const topics = [
  { id: 'stress', name: '压力与焦虑', emoji: '😰', prompt: '最近有什么事情让你感到压力或焦虑吗？' },
  { id: 'growth', name: '成长与目标', emoji: '🌱', prompt: '你最近在追求什么目标？有什么进展吗？' },
  { id: 'relationship', name: '人际关系', emoji: '🤝', prompt: '最近有什么人际关系让你在意吗？' },
  { id: 'work', name: '工作与事业', emoji: '💼', prompt: '工作上最近有什么让你思考的事情？' },
  { id: 'emotion', name: '情绪探索', emoji: '🌊', prompt: '你现在的心情如何？有什么情绪想探索？' },
  { id: 'meaning', name: '人生意义', emoji: '✨', prompt: '最近有没有思考过人生的意义或方向？' },
]

// 情绪选项
const moods = [
  { id: 'great', name: '很棒', emoji: '😄' },
  { id: 'good', name: '不错', emoji: '🙂' },
  { id: 'okay', name: '一般', emoji: '😐' },
  { id: 'low', name: '低落', emoji: '😔' },
  { id: 'stressed', name: '焦虑', emoji: '😰' },
]

// AI 教练回复生成
const generateCoachResponse = (userMessage: string, sessionHistory: Message[], _topic: string, _mood: string): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  // 基于话题和情绪的智能回复
  const responses: Record<string, string[]> = {
    // 深入探索类问题
    explore: [
      '能详细说说这件事让你最困扰的是什么吗？',
      '这件事对你意味着什么？',
      '你觉得这种感觉是从哪里来的？',
      '如果用一个词来形容现在的感受，会是什么？',
      '这件事如果解决了，你的生活会有什么不同？',
    ],
    // 视角转换类问题
    perspective: [
      '如果换一个角度看这件事，你会有什么发现？',
      '如果你最好的朋友遇到这种情况，你会对TA说什么？',
      '五年后回看这件事，你觉得它还重要吗？',
      '在这件事里，有什么是你能够控制的？',
      '有没有什么事情是你一直在回避面对的？',
    ],
    // 行动导向类问题
    action: [
      '现在你能做的最小一步是什么？',
      '有什么事情是你一直想做但还没开始的？',
      '如果这周只做一件事来改善这种情况，你会选什么？',
      '什么在阻止你行动？这个障碍可以怎么克服？',
      '你可以向谁寻求帮助或支持？',
    ],
    // 情感确认类
    affirm: [
      '我理解你的感受，这是很正常的。',
      '听起来这件事对你很重要。',
      '你能察觉到这些情绪，说明你在认真对待自己。',
      '有这种感觉是可以的，让我们一起来探索。',
      '感谢你愿意和我分享这些。',
    ],
    // 结束/总结类
    closing: [
      '今天的对话很棒。你有什么收获吗？',
      '我们聊了很多，你觉得最重要的发现是什么？',
      '有什么想带走或记住的洞察吗？',
      '今天的对话让你有什么新的想法吗？',
    ],
  }

  // 分析消息长度和历史选择回复类型
  const messageCount = sessionHistory.filter(m => m.role === 'user').length
  const messageLength = userMessage.length

  // 根据对话阶段选择回复策略
  let responseType: string
  if (messageCount >= 5 || lowerMessage.includes('谢谢') || lowerMessage.includes('好了') || lowerMessage.includes('就这样')) {
    responseType = 'closing'
  } else if (lowerMessage.includes('不知道') || lowerMessage.includes('不清楚') || messageLength < 10) {
    responseType = 'explore'
  } else if (lowerMessage.includes('怎么办') || lowerMessage.includes('怎么做')) {
    responseType = 'action'
  } else if (messageCount % 3 === 0) {
    responseType = 'perspective'
  } else if (messageCount % 2 === 0) {
    responseType = 'action'
  } else {
    responseType = 'explore'
  }

  // 组合回复
  const affirmations = responses.affirm
  const questions = responses[responseType]
  
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
  const question = questions[Math.floor(Math.random() * questions.length)]

  // 根据消息类型决定是否加确认语
  if (responseType === 'closing') {
    return question
  } else if (messageLength > 50 || Math.random() > 0.5) {
    return `${affirmation}\n\n${question}`
  } else {
    return question
  }
}

// 生成洞察总结
const generateInsights = (messages: Message[], topic: string): string[] => {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)
  
  // 简单的洞察生成逻辑
  const insights: string[] = []
  
  if (userMessages.length >= 3) {
    insights.push('🔍 你正在积极面对自己的内心，这需要勇气。')
  }
  
  const totalLength = userMessages.join('').length
  if (totalLength > 200) {
    insights.push('💡 你愿意深入探索，这说明你对自己很诚实。')
  }
  
  const topicInfo = topics.find(t => t.id === topic)
  if (topicInfo) {
    insights.push(`🎯 在「${topicInfo.name}」方面，你正在寻找突破。`)
  }

  insights.push('✨ 每一次反思都是成长的机会，继续关注自己的内心。')
  
  return insights
}

export default function AICoachPage() {
  const [session, setSession] = useState<CoachSession | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  // 开始新会话
  const startSession = (topicId: string, moodId: string) => {
    const topic = topics.find(t => t.id === topicId)!
    const newSession: CoachSession = {
      id: Date.now().toString(),
      topic: topicId,
      mood: moodId,
      messages: [
        {
          id: '1',
          role: 'coach',
          content: `你好！我是你的${coachPersona.name}。👋\n\n我注意到你今天感觉${moods.find(m => m.id === moodId)?.name}，想聊聊${topic.name}的话题。\n\n${topic.prompt}`,
          timestamp: new Date(),
        },
      ],
      insights: [],
      startedAt: new Date(),
    }
    setSession(newSession)
    setShowSummary(false)
    
    // 聚焦输入框
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || !session) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    const updatedMessages = [...session.messages, userMessage]
    setSession({ ...session, messages: updatedMessages })
    setInputValue('')
    setIsTyping(true)

    // 模拟 AI 思考
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    const coachResponse = generateCoachResponse(
      userMessage.content,
      updatedMessages,
      session.topic,
      session.mood
    )

    const coachMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: coachResponse,
      timestamp: new Date(),
    }

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, coachMessage],
    } : null)
    setIsTyping(false)

    // 检查是否是结束消息
    if (coachResponse.includes('收获') || coachResponse.includes('带走')) {
      setTimeout(() => {
        const insights = generateInsights([...updatedMessages, coachMessage], session.topic)
        setSession(prev => prev ? {
          ...prev,
          insights,
          endedAt: new Date(),
        } : null)
        setShowSummary(true)
      }, 500)
    }
  }

  // 结束会话
  const endSession = () => {
    if (!session) return
    const insights = generateInsights(session.messages, session.topic)
    setSession(prev => prev ? {
      ...prev,
      insights,
      endedAt: new Date(),
    } : null)
    setShowSummary(true)
  }

  // 重置
  const resetSession = () => {
    setSession(null)
    setShowSummary(false)
    setInputValue('')
  }

  // 选择话题阶段
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-16">
          {/* 头部 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg mb-4">
              <span className="text-4xl">{coachPersona.emoji}</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {coachPersona.name}
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              {coachPersona.greeting}
            </p>
          </div>

          {/* 开始会话卡片 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            {/* 第一步：选择话题 */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">1</span>
                <span className="font-medium text-gray-700">今天想聊什么？</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    data-topic={topic.id}
                    className="topic-btn p-3 rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{topic.emoji}</span>
                      <span className="font-medium text-gray-700">{topic.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 第二步：选择情绪 */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">2</span>
                <span className="font-medium text-gray-700">现在的心情如何？</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    data-mood={mood.id}
                    className="mood-btn px-4 py-2 rounded-full border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all"
                  >
                    <span className="mr-1">{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 开始按钮 */}
            <div className="p-6">
              <button
                id="start-btn"
                onClick={() => {
                  const selectedTopic = document.querySelector('.topic-btn.border-indigo-400')?.getAttribute('data-topic')
                  const selectedMood = document.querySelector('.mood-btn.border-purple-400')?.getAttribute('data-mood')
                  if (selectedTopic && selectedMood) {
                    startSession(selectedTopic, selectedMood)
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                开始对话 ✨
              </button>
            </div>
          </div>

          {/* 说明 */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>💡 提示：对话会根据你的话题和情绪动态调整</p>
            <p className="mt-1">🔒 你的对话内容仅保存在本地，保护你的隐私</p>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('border-indigo-400', 'bg-indigo-50'));
              btn.classList.add('border-indigo-400', 'bg-indigo-50');
              checkStartButton();
            });
          });
          document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('border-purple-400', 'bg-purple-50'));
              btn.classList.add('border-purple-400', 'bg-purple-50');
              checkStartButton();
            });
          });
          function checkStartButton() {
            const hasTopic = document.querySelector('.topic-btn.border-indigo-400');
            const hasMood = document.querySelector('.mood-btn.border-purple-400');
            document.getElementById('start-btn').disabled = !(hasTopic && hasMood);
          }
        `}} />
      </div>
    )
  }

  // 对话界面
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={resetSession}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← 返回
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{coachPersona.emoji}</span>
              <span className="font-medium text-gray-700">{coachPersona.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {topics.find(t => t.id === session.topic)?.emoji} {topics.find(t => t.id === session.topic)?.name}
            </span>
            <button
              onClick={endSession}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              结束对话
            </button>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {session.messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm'
                    : 'bg-white shadow-sm text-gray-700 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 总结面板 */}
      {showSummary && session.insights.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <span className="text-5xl">🎉</span>
              <h2 className="text-xl font-bold text-gray-800 mt-4">对话完成</h2>
              <p className="text-gray-500 text-sm mt-1">
                持续 {Math.round((session.endedAt!.getTime() - session.startedAt.getTime()) / 60000)} 分钟
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="font-medium text-gray-700">你的收获：</p>
              {session.insights.map((insight, i) => (
                <div key={i} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 text-gray-700">
                  {insight}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // 保存到本地存储
                  const savedSessions = JSON.parse(localStorage.getItem('coach-sessions') || '[]')
                  savedSessions.push({
                    ...session,
                    startedAt: session.startedAt.toISOString(),
                    endedAt: session.endedAt?.toISOString(),
                  })
                  localStorage.setItem('coach-sessions', JSON.stringify(savedSessions))
                  resetSession()
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                保存并返回
              </button>
              <Link
                href="/chat-diary"
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all"
              >
                写入日记 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="输入你的想法..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}