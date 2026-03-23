'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

// 问题分类
const CATEGORIES = [
  { id: 'reflection', name: '自我反思', emoji: '🪞', color: 'from-purple-500 to-indigo-500' },
  { id: 'gratitude', name: '感恩记录', emoji: '🙏', color: 'from-pink-500 to-rose-500' },
  { id: 'growth', name: '成长探索', emoji: '🌱', color: 'from-green-500 to-emerald-500' },
  { id: 'dream', name: '梦想愿景', emoji: '✨', color: 'from-amber-500 to-orange-500' },
  { id: 'relationship', name: '人际关系', emoji: '💝', color: 'from-red-500 to-pink-500' },
  { id: 'creativity', name: '创意灵感', emoji: '🎨', color: 'from-cyan-500 to-blue-500' },
];

// 每日问题库
const QUESTIONS: Record<string, string[]> = {
  reflection: [
    "今天有什么让你感到自豪的事？",
    "如果今天可以重来，你会改变什么？",
    "你今天学到的最重要的一课是什么？",
    "今天有什么让你感到意外的事？",
    "你今天面对的最大挑战是什么？你是如何应对的？",
    "今天有什么让你感到平静的时刻？",
    "你的内心在告诉你什么？你有在倾听吗？",
    "今天有什么决定让你感到纠结？",
    "你最近在逃避什么？为什么？",
    "如果用一个词形容今天的自己，你会选什么？为什么？",
  ],
  gratitude: [
    "今天有哪三件小事让你感到感激？",
    "谁是你今天想感谢的人？为什么？",
    "今天有什么平凡的时刻让你感到幸福？",
    "你拥有什么别人可能没有的东西？",
    "今天有什么让你觉得「生活真好」的瞬间？",
    "你的身体今天为你做了什么？你有感谢它吗？",
    "你的生活中有什么稳定不变的东西让你安心？",
    "今天有什么让你微笑的事？",
    "你的朋友或家人最近做了什么让你感动的事？",
    "你最近发现了什么新的美好？",
  ],
  growth: [
    "今天你比昨天进步了什么？",
    "你最近在努力培养什么习惯？进展如何？",
    "有什么技能你一直想学但还没开始？是什么阻碍了你？",
    "你最近突破了什么舒适区？感觉如何？",
    "你最想改善的生活领域是什么？今天你为此做了什么？",
    "你最近读了什么或看了什么对你有帮助的内容？",
    "你从最近的失败中学到了什么？",
    "你最近帮助了谁？这让你感觉如何？",
    "你最欣赏自己的哪个特质？为什么？",
    "一年后的你，会对现在的你说什么？",
  ],
  dream: [
    "如果你的时间和金钱都不是问题，你会做什么？",
    "你小时候的梦想是什么？现在还相关吗？",
    "你最想实现的人生目标是什么？你为此做了什么？",
    "想象五年后的自己，你在做什么？",
    "有什么梦想你一直不敢说出口？",
    "如果你知道不会失败，你会尝试什么？",
    "你最想改变世界的方式是什么？",
    "你理想中的一天是什么样的？",
    "你希望被后人记住的是什么？",
    "你有什么「人生清单」上的项目？今天能完成其中一项吗？",
  ],
  relationship: [
    "今天你和谁进行了有意义的对话？",
    "有什么话你一直想对某人说但还没说出口？",
    "你最近和哪位老朋友疏远了？想重新联系吗？",
    "你从最近的人际交往中学到了什么？",
    "你今天是如何表达对某人的关心的？",
    "有什么关系让你感到滋养？什么关系让你感到消耗？",
    "你最近为家人做了什么？",
    "你和朋友之间最珍贵的回忆是什么？",
    "你如何让自己成为更好的倾听者？",
    "你今天帮助了谁？谁帮助了你？",
  ],
  creativity: [
    "如果你能创造任何东西，你会创造什么？",
    "今天有什么让你感到好奇的事？",
    "如果你的生活是一部电影，今天这一幕是什么？",
    "你最想尝试的创作形式是什么？（写作、绘画、音乐...）",
    "你最近有什么奇思妙想？",
    "如果给你一天完全自由创作，你会做什么？",
    "你从哪个艺术作品或创意项目中获得了灵感？",
    "你有什么独特的观点想分享？",
    "如果设计一件产品，你会设计什么？",
    "你最近的美学发现是什么？（音乐、电影、书籍、展览...）",
  ],
};

// 名人名言库
const QUOTES = [
  { text: "未经审视的生活不值得过。", author: "苏格拉底" },
  { text: "认识你自己。", author: "德尔斐神谕" },
  { text: "我们是自己选择的总和。", author: "让-保罗·萨特" },
  { text: "写作是思考的最好方式。", author: "E.M.福斯特" },
  { text: "每天的醒来，都是新生的开始。", author: "爱比克泰德" },
  { text: "不是事情本身困扰我们，而是我们对事情的看法。", author: "爱比克泰德" },
  { text: "生活不是等待暴风雨过去，而是学会在雨中跳舞。", author: "维维安·格林" },
  { text: "记录你的生活，就是在珍惜它。", author: "佚名" },
];

interface Answer {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

// 基于日期生成种子，确保同一天同一分类返回同一问题
function getDailyQuestion(category: string): { question: string; index: number } {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const questions = QUESTIONS[category] || QUESTIONS.reflection;
  const index = seed % questions.length;
  return { question: questions[index], index };
}

function getDailyQuote() {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return QUOTES[seed % QUOTES.length];
}

export default function DailyQuestionPage() {
  const [selectedCategory, setSelectedCategory] = useState('reflection');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [recentAnswers, setRecentAnswers] = useState<Answer[]>([]);
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadRecentAnswers(user.id);
      }
    };
    initUser();
    updateQuestion(selectedCategory);
  }, []);

  useEffect(() => {
    updateQuestion(selectedCategory);
  }, [selectedCategory]);

  const updateQuestion = (category: string) => {
    const { question: q } = getDailyQuestion(category);
    setQuestion(q);
  };

  const loadRecentAnswers = async (uid: string) => {
    try {
      // 先尝试从数据库加载
      const { data, error } = await supabase
        .from('daily_answers')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const answers = data.map(d => ({
          id: d.id,
          question: d.question,
          answer: d.answer,
          category: d.category,
          createdAt: d.created_at,
        }));
        setRecentAnswers(answers);

        // 检查今天是否已回答
        const today = new Date().toDateString();
        const answeredToday = data.some(d => 
          new Date(d.created_at).toDateString() === today
        );
        setHasAnsweredToday(answeredToday);
      }
    } catch (error) {
      // 如果表不存在或出错，使用本地存储
      const saved = localStorage.getItem('daily_answers');
      if (saved) {
        const answers = JSON.parse(saved);
        setRecentAnswers(answers);
        const today = new Date().toDateString();
        setHasAnsweredToday(answers.some((a: Answer) => 
          new Date(a.createdAt).toDateString() === today
        ));
      }
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const newAnswer: Answer = {
      id: Date.now().toString(),
      question,
      answer: answer.trim(),
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    try {
      if (userId) {
        // 保存到数据库
        const { error } = await supabase
          .from('daily_answers')
          .insert({
            user_id: userId,
            question: newAnswer.question,
            answer: newAnswer.answer,
            category: newAnswer.category,
            created_at: newAnswer.createdAt,
          });

        if (error) throw error;
      }

      // 更新本地状态
      setRecentAnswers(prev => [newAnswer, ...prev.slice(0, 9)]);
      setHasAnsweredToday(true);
      setShowSuccess(true);
      setAnswer('');

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // 失败时保存到本地
      const saved = localStorage.getItem('daily_answers');
      const answers = saved ? JSON.parse(saved) : [];
      localStorage.setItem('daily_answers', JSON.stringify([newAnswer, ...answers]));
      setRecentAnswers(prev => [newAnswer, ...prev.slice(0, 9)]);
      setHasAnsweredToday(true);
      setShowSuccess(true);
      setAnswer('');
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRandomQuestion = () => {
    const questions = QUESTIONS[selectedCategory];
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestion(questions[randomIndex]);
  };

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory)!;
  const quote = getDailyQuote();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-3xl hover:scale-110 transition-transform">
            🦞
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-white/80 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>📜</span>
              <span>历史回答</span>
            </button>
            {recentAnswers.length > 0 && (
              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                {recentAnswers.length} 条
              </span>
            )}
          </div>
        </div>

        {/* 标题区 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span>💭</span>
            <span>每日一问</span>
          </h1>
          <p className="text-gray-500">用一个问题，开启今天的心灵探索</p>
        </div>

        {/* 今日完成提示 */}
        {hasAnsweredToday && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span className="text-green-700 font-medium">今天已经回答过问题了！</span>
            </div>
            <p className="text-sm text-green-600 mt-1">你可以继续回答更多问题，或者查看历史回顾</p>
          </div>
        )}

        {/* 分类选择 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 问题卡片 */}
        <div className={`bg-gradient-to-br ${currentCategory.color} rounded-3xl p-8 shadow-xl mb-6`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4">
              <span>{currentCategory.emoji}</span>
              <span>{currentCategory.name}</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-4">
              {question}
            </p>
            <button
              onClick={getRandomQuestion}
              className="text-white/70 hover:text-white text-sm flex items-center gap-1 mx-auto transition-colors"
            >
              <span>🎲</span>
              <span>换一个问题</span>
            </button>
          </div>
        </div>

        {/* 回答区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="写下你的想法...不用担心，这里只有你和你的思绪"
            className="w-full h-40 p-4 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-400">
              {answer.length} 字
            </span>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                answer.trim() && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '保存中...' : '保存回答'}
            </button>
          </div>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-50">
            <span>✨</span>
            <span>回答已保存！继续探索吧</span>
          </div>
        )}

        {/* 每日名言 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
          <p className="text-gray-600 italic mb-2">"{quote.text}"</p>
          <p className="text-sm text-gray-400">—— {quote.author}</p>
        </div>

        {/* 历史回答面板 */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">历史回答</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-4">
                {recentAnswers.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-4xl mb-2">📝</p>
                    <p>还没有回答记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAnswers.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                            {CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-2">{item.question}</p>
                        <p className="text-sm text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 快速入口 */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link
            href="/chat-diary"
            className="bg-white/70 rounded-xl p-4 text-center hover:bg-white transition-colors"
          >
            <span className="text-2xl block mb-1">💬</span>
            <span className="text-sm text-gray-700">对话日记</span>
          </Link>
          <Link
            href="/diary-templates"
            className="bg-white/70 rounded-xl p-4 text-center hover:bg-white transition-colors"
          >
            <span className="text-2xl block mb-1">📝</span>
            <span className="text-sm text-gray-700">日记模板</span>
          </Link>
          <Link
            href="/insights"
            className="bg-white/70 rounded-xl p-4 text-center hover:bg-white transition-colors"
          >
            <span className="text-2xl block mb-1">📊</span>
            <span className="text-sm text-gray-700">写作洞察</span>
          </Link>
          <Link
            href="/challenges"
            className="bg-white/70 rounded-xl p-4 text-center hover:bg-white transition-colors"
          >
            <span className="text-2xl block mb-1">🏆</span>
            <span className="text-sm text-gray-700">写作挑战</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center py-6 text-gray-400 text-sm">
        <p>💭 每一个问题，都是与自己对话的机会</p>
      </footer>
    </div>
  );
}