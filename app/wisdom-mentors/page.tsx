'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 历史智慧导师库
const MENTORS = [
  {
    id: 'socrates',
    name: '苏格拉底',
    emoji: '🏛️',
    era: '古希腊 · 公元前470-399年',
    title: '西方哲学之父',
    style: '追问式对话，引导自我反思',
    quote: '我唯一知道的，就是我一无所知。',
    color: 'from-blue-500 to-cyan-500',
    specialty: '人生意义、自我认知、道德哲学',
  },
  {
    id: 'laozi',
    name: '老子',
    emoji: '☯️',
    era: '中国 · 约公元前6世纪',
    title: '道家创始人',
    style: '无为而治，道法自然',
    quote: '道可道，非常道；名可名，非常名。',
    color: 'from-green-500 to-teal-500',
    specialty: '处世智慧、心灵平静、人生格局',
  },
  {
    id: 'kongzi',
    name: '孔子',
    emoji: '📚',
    era: '中国 · 公元前551-479年',
    title: '儒家创始人',
    style: '仁义礼智信，中庸之道',
    quote: '学而不思则罔，思而不学则殆。',
    color: 'from-red-500 to-orange-500',
    specialty: '为人处世、修身养性、家庭教育',
  },
  {
    id: 'davinci',
    name: '达芬奇',
    emoji: '🎨',
    era: '意大利 · 1452-1519',
    title: '文艺复兴通才',
    style: '跨学科思维，永葆好奇',
    quote: '学习永远不会让心智疲惫。',
    color: 'from-purple-500 to-pink-500',
    specialty: '创造力、好奇心、多元发展',
  },
  {
    id: 'einstein',
    name: '爱因斯坦',
    emoji: '💫',
    era: '德国/美国 · 1879-1955',
    title: '现代物理学之父',
    style: '想象力比知识更重要',
    quote: '想象力比知识更重要。知识有限，想象力无限。',
    color: 'from-yellow-500 to-orange-500',
    specialty: '创新思维、打破常规、人生选择',
  },
  {
    id: 'curie',
    name: '居里夫人',
    emoji: '⚗️',
    era: '波兰/法国 · 1867-1934',
    title: '放射性研究先驱',
    style: '坚韧不拔，专注热爱',
    quote: '生活中没有什么可怕的东西，只有需要理解的东西。',
    color: 'from-indigo-500 to-purple-500',
    specialty: '坚持梦想、女性成长、面对困难',
  },
  {
    id: 'marcus',
    name: '马可·奥勒留',
    emoji: '👑',
    era: '古罗马 · 公元121-180年',
    title: '哲学家皇帝',
    style: '斯多葛哲学，内心宁静',
    quote: '你有力量控制自己的思想，而非外部事件。',
    color: 'from-stone-500 to-slate-600',
    specialty: '情绪管理、内心平静、面对困境',
  },
  {
    id: 'zhuangzi',
    name: '庄子',
    emoji: '🦋',
    era: '中国 · 约公元前369-286年',
    title: '道家哲学家',
    style: '逍遥自在，物我两忘',
    quote: '井蛙不可以语于海者，拘于虚也。',
    color: 'from-emerald-500 to-green-500',
    specialty: '心灵自由、看淡得失、人生境界',
  },
];

interface Message {
  role: 'user' | 'mentor';
  content: string;
  timestamp: Date;
}

export default function WisdomMentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectMentor = (mentor: typeof MENTORS[0]) => {
    setSelectedMentor(mentor);
    setMessages([
      {
        role: 'mentor',
        content: `你好，我是${mentor.name}。${mentor.quote}\n\n我是你的${mentor.title}，擅长与你探讨${mentor.specialty}。\n\n告诉我，今天你想和我聊些什么？`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedMentor || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/wisdom-mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          mentorName: selectedMentor.name,
          mentorStyle: selectedMentor.style,
          mentorSpecialty: selectedMentor.specialty,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('请求失败');

      const data = await response.json();
      
      const mentorMessage: Message = {
        role: 'mentor',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, mentorMessage]);
    } catch (error) {
      // 离线回复
      const offlineResponses: Record<string, string[]> = {
        socrates: [
          '你提出了一个有趣的问题。但让我先问你：你认为是什么让你思考这个问题？',
          '这个问题值得深思。你有没有考虑过，真正的答案可能在于问题本身？',
          '我善于提问，而非回答。让我引导你——你内心深处是如何看待这个问题的？',
        ],
        laozi: [
          '水善利万物而不争。你之所惑，或许正是因为太想"得到"了。',
          '天地不仁，以万物为刍狗。放下执念，顺其自然，答案自现。',
          '大道至简。你的困惑，往往源于想得太多，做得太少。',
        ],
        kongzi: [
          '己所不欲，勿施于人。你的问题，是否也考虑了他人的立场？',
          '三人行，必有我师焉。从你周围的人身上，你能学到什么？',
          '知之为知之，不知为不知，是知也。承认无知，才是智慧的开始。',
        ],
        davinci: [
          '我曾研究解剖、绘画、飞行、水利工程...好奇心是最好的老师。',
          '创造力来自跨界思维。你有没有尝试从完全不同的角度看这个问题？',
          '艺术与科学是一体的。用感性去感受，用理性去分析。',
        ],
        einstein: [
          '逻辑会把你从A带到B，想象力能带你去任何地方。',
          '我没有特别的才能，只是保持了强烈的好奇心。',
          '疯狂就是重复做同样的事情却期待不同的结果。你在做什么不同的事？',
        ],
        curie: [
          '生活中没有什么可怕的东西，只有需要理解的东西。你害怕什么？',
          '我的一生证明了：专注和坚持可以克服任何障碍。',
          '荣誉不重要，重要的是工作本身。你的热情在哪里？',
        ],
        marcus: [
          '你有力量控制自己的思想——认识到这一点，你就找到了力量。',
          '不要为他人的看法而活。你为什么在意别人的评价？',
          '每一件困难的事都是一次锻炼心智的机会。',
        ],
        zhuangzi: [
          '井蛙不可以语于海，夏虫不可以语于冰。你看到的边界，只是你心里的边界。',
          '蝴蝶曾是我，我曾是蝴蝶。物我两忘，方得自在。',
          '逍遥游于天地之间，何必执着于一时的得失？',
        ],
      };

      const responses = offlineResponses[selectedMentor.id] || ['让我想想...这个问题很有深度。'];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const mentorMessage: Message = {
        role: 'mentor',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, mentorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedMentor(null);
    setMessages([]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          {selectedMentor ? (
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-700">
              ← 换一位导师
            </button>
          ) : (
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← 返回首页
            </Link>
          )}
          <h1 className="text-lg font-semibold text-gray-800">🎓 智慧导师</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 导师选择 */}
        {!selectedMentor && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                与历史智者对话
              </h2>
              <p className="text-gray-500">
                选择一位导师，获取跨越千年的人生智慧
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {MENTORS.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => handleSelectMentor(mentor)}
                  className={`p-5 bg-gradient-to-br ${mentor.color} rounded-2xl text-white text-left hover:scale-[1.02] transition-all shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{mentor.emoji}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {mentor.era.split('·')[0]}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{mentor.name}</h3>
                  <p className="text-sm text-white/80 mb-2">{mentor.title}</p>
                  <p className="text-xs text-white/60 line-clamp-1">
                    「{mentor.quote.slice(0, 15)}...」
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">💡 如何使用</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 选择一位你感兴趣的导师</li>
                <li>• 向他们提问人生困惑、寻求建议</li>
                <li>• 导师会用他们的哲学思想回答你</li>
                <li>• 可以随时切换不同的导师</li>
              </ul>
            </div>
          </div>
        )}

        {/* 对话界面 */}
        {selectedMentor && (
          <div className="flex flex-col h-[calc(100vh-180px)]">
            {/* 导师信息卡片 */}
            <div className={`bg-gradient-to-r ${selectedMentor.color} rounded-2xl p-4 text-white mb-4`}>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedMentor.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg">{selectedMentor.name}</h3>
                  <p className="text-sm text-white/80">{selectedMentor.title}</p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.role === 'mentor' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{selectedMentor.emoji}</span>
                        <span className="text-sm font-medium text-gray-600">
                          {selectedMentor.name}
                        </span>
                      </div>
                    )}
                    <p className={msg.role === 'user' ? 'text-white' : 'text-gray-700'}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedMentor.emoji}</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={`向${selectedMentor.name}提问...`}
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange-300"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    input.trim() && !isLoading
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  发送
                </button>
              </div>
              
              {/* 快捷问题 */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  '我该如何面对困境？',
                  '人生的意义是什么？',
                  '如何保持内心平静？',
                  '怎样做出正确选择？',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        <p>🧬 ClawDiary · 千年智慧，今人对话</p>
      </footer>
    </div>
  );
}