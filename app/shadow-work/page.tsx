'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// 阴影工作的核心问题库（基于荣格心理学）
const shadowQuestions = [
  // 自我认知
  { category: '自我认知', question: '我最不喜欢别人的什么特质？这些特质在我身上是否存在？', icon: '🔍' },
  { category: '自我认知', question: '我经常压抑什么情绪？为什么我觉得它不应该被表达？', icon: '🎭' },
  { category: '自我认知', question: '我害怕别人发现我的什么秘密？', icon: '🔒' },
  { category: '自我认知', question: '我嫉妒什么样的人？他们有什么我渴望拥有的？', icon: '💫' },
  
  // 人际关系
  { category: '人际关系', question: '我最容易对什么样的人生气？他们触发了我什么？', icon: '😤' },
  { category: '人际关系', question: '我在关系中扮演什么角色？这个角色是我真实想要的吗？', icon: '🤝' },
  { category: '人际关系', question: '我评判别人最多的地方是什么？这反映了我的什么？', icon: '⚖️' },
  { category: '人际关系', question: '我害怕被别人如何看待？为什么？', icon: '👁️' },
  
  // 恐惧与渴望
  { category: '恐惧与渴望', question: '我最害怕失去什么？这个恐惧从何而来？', icon: '😰' },
  { category: '恐惧与渴望', question: '我渴望成为什么样的人？什么阻止了我成为那个人？', icon: '🌟' },
  { category: '恐惧与渴望', question: '我最深的羞耻感是什么？', icon: '😢' },
  { category: '恐惧与渴望', question: '我害怕展现真实的自己，因为我担心...？', icon: '🌙' },
  
  // 成长与改变
  { category: '成长与改变', question: '我一直在逃避面对什么？', icon: '🏃' },
  { category: '成长与改变', question: '如果没有人评判我，我会做什么不同的事？', icon: '🦋' },
  { category: '成长与改变', question: '我最需要原谅自己的是什么？', icon: '💝' },
  { category: '成长与改变', question: '什么部分的我被我自己否认了？', icon: '🪞' },
];

const categoryColors: Record<string, string> = {
  '自我认知': 'from-purple-500 to-indigo-500',
  '人际关系': 'from-pink-500 to-rose-500',
  '恐惧与渴望': 'from-amber-500 to-orange-500',
  '成长与改变': 'from-emerald-500 to-teal-500',
};

const categoryBgColors: Record<string, string> = {
  '自我认知': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  '人际关系': 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  '恐惧与渴望': 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  '成长与改变': 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
};

interface ShadowEntry {
  id: string;
  question: string;
  category: string;
  reflection: string;
  insights: string;
  createdAt: string;
  integrationLevel: number; // 1-5 整合程度
}

interface ShadowInsight {
  icon: string;
  title: string;
  description: string;
}

const insights: ShadowInsight[] = [
  { icon: '🪞', title: '镜像效应', description: '我们最不喜欢别人的特质，往往是我们自己压抑的部分。' },
  { icon: '🌑', title: '阴影投射', description: '当我们强烈反应时，常常是在与自己否认的部分相遇。' },
  { icon: '💫', title: '黄金阴影', description: '我们嫉妒的品质，往往是我们自己隐藏的天赋。' },
  { icon: '🌈', title: '整合之路', description: '接纳阴影不是认同它，而是认识它、理解它、与之和解。' },
  { icon: '🌱', title: '成长种子', description: '每一次阴影探索都是自我完整的种子。' },
  { icon: '🌊', title: '情绪之海', description: '被压抑的情绪不会消失，它会以其他方式表达自己。' },
];

function getInitialEntries(): ShadowEntry[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('shadowWorkEntries');
  return saved ? JSON.parse(saved) : [];
}

function getRandomQuestion() {
  return shadowQuestions[Math.floor(Math.random() * shadowQuestions.length)];
}

export default function ShadowWorkPage() {
  const [entries, setEntries] = useState<ShadowEntry[]>(getInitialEntries);
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion);
  const [reflection, setReflection] = useState('');
  const [insight, setInsight] = useState('');
  const [integrationLevel, setIntegrationLevel] = useState(3);
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'explore' | 'reflect'>('explore');

  // 统计
  const totalEntries = entries.length;
  const categoryStats = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const avgIntegration = entries.length > 0 
    ? (entries.reduce((sum, e) => sum + e.integrationLevel, 0) / entries.length).toFixed(1)
    : '0';

  const handleSubmit = () => {
    if (!reflection.trim()) return;

    const newEntry: ShadowEntry = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      category: currentQuestion.category,
      reflection: reflection.trim(),
      insights: insight.trim(),
      createdAt: new Date().toISOString(),
      integrationLevel,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('shadowWorkEntries', JSON.stringify(updated));

    // 重置
    setReflection('');
    setInsight('');
    setIntegrationLevel(3);
    setCurrentQuestion(getRandomQuestion());
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('shadowWorkEntries', JSON.stringify(updated));
  };

  const filteredQuestions = selectedCategory 
    ? shadowQuestions.filter(q => q.category === selectedCategory)
    : shadowQuestions;

  const filteredEntries = selectedCategory
    ? entries.filter(e => e.category === selectedCategory)
    : entries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 dark:from-gray-950 dark:via-purple-950/50 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-200">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            🌑 阴影工作
          </h1>
          <p className="text-gray-400 mt-2">
            探索内心深处，整合完整的自我
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10"
          >
            <div className="text-2xl mb-1">🔮</div>
            <div className="text-2xl font-bold text-purple-400">{totalEntries}</div>
            <div className="text-sm text-gray-500">深度探索</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10"
          >
            <div className="text-2xl mb-1">💫</div>
            <div className="text-2xl font-bold text-pink-400">{avgIntegration}</div>
            <div className="text-sm text-gray-500">整合程度</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10"
          >
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-amber-400">{Object.keys(categoryStats).length}</div>
            <div className="text-sm text-gray-500">探索维度</div>
          </motion.div>
        </div>

        {/* 模式切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('explore')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              viewMode === 'explore'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            🔍 探索问题
          </button>
          <button
            onClick={() => setViewMode('reflect')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              viewMode === 'reflect'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            ✍️ 记录反思
          </button>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              !selectedCategory
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            全部
          </button>
          {Object.keys(categoryColors).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedCategory === cat
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {viewMode === 'explore' ? (
          /* 探索模式 - 问题卡片 */
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredQuestions.map((q, i) => (
                <motion.div
                  key={q.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-6 rounded-2xl border ${categoryBgColors[q.category]}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{q.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {q.category}
                      </div>
                      <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                        {q.question}
                      </p>
                      <button
                        onClick={() => {
                          setCurrentQuestion(q);
                          setViewMode('reflect');
                        }}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition"
                      >
                        开始反思 →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* 反思模式 */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* 当前问题 */}
            <div className={`p-6 rounded-2xl border ${categoryBgColors[currentQuestion.category]}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{currentQuestion.icon}</span>
                <span className="text-sm text-gray-500">{currentQuestion.category}</span>
              </div>
              <p className="text-xl text-gray-800 dark:text-gray-200 font-medium">
                {currentQuestion.question}
              </p>
              <button
                onClick={() => setCurrentQuestion(getRandomQuestion())}
                className="mt-4 text-sm text-purple-500 hover:text-purple-600"
              >
                🎲 换一个问题
              </button>
            </div>

            {/* 反思输入 */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-medium text-gray-200 mb-3">
                我的反思
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="诚实地面对内心，写下你的想法和感受..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* 洞察记录 */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-medium text-gray-200 mb-3">
                我的发现（可选）
              </label>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="从这个反思中，我有什么新的认识？"
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* 整合程度 */}
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <label className="block text-lg font-medium text-gray-200 mb-3">
                整合程度
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setIntegrationLevel(level)}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      integrationLevel === level
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>刚开始探索</span>
                <span>深度整合</span>
              </div>
            </div>

            {/* 提交按钮 */}
            <motion.button
              whileHover={{ scale: reflection.trim() ? 1.02 : 1 }}
              whileTap={{ scale: reflection.trim() ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!reflection.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                reflection.trim()
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white hover:shadow-lg'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              保存探索记录
            </motion.button>
          </motion.div>
        )}

        {/* 心理学洞察 */}
        <div className="mt-8">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
          >
            <span>💡 心理学洞察</span>
            <motion.span
              animate={{ rotate: showInsights ? 180 : 0 }}
              className="inline-block"
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden"
              >
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{insight.icon}</span>
                      <span className="font-medium text-gray-200">{insight.title}</span>
                    </div>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 历史记录 */}
        {filteredEntries.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 font-medium"
            >
              <span>📜 探索记录 ({filteredEntries.length})</span>
              <motion.span
                animate={{ rotate: showHistory ? 180 : 0 }}
                className="inline-block"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {filteredEntries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-5 rounded-xl border ${categoryBgColors[entry.category]} group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">整合度: {entry.integrationLevel}/5</span>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Q: {entry.question}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {entry.reflection}
                      </p>
                      {entry.insights && (
                        <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 italic">
                          💡 {entry.insights}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 引导 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
        >
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-purple-400">🌑 关于阴影工作：</strong>
            阴影工作源于荣格心理学，帮助我们探索和整合那些被我们否认或压抑的部分。
            通过诚实地面对内心深处的恐惧、羞耻和渴望，我们可以成为更完整、更真实的自己。
            这是一个温柔但有力的过程——请以慈悲之心对待自己。
          </p>
        </motion.div>
      </div>
    </div>
  );
}