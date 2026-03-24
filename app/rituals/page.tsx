'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// 仪式模板库
const RITUAL_TEMPLATES = [
  {
    id: 'morning-reflect',
    name: '晨间反思仪式',
    emoji: '🌅',
    description: '用15分钟开启觉知的一天',
    duration: '15分钟',
    category: 'morning',
    steps: [
      { content: '闭眼深呼吸3次', duration: '1分钟', tip: '感受空气进入身体' },
      { content: '感恩3件事', duration: '3分钟', tip: '可以是小事情，如阳光、咖啡香' },
      { content: '设定今日意图', duration: '2分钟', tip: '一个词或一句话' },
      { content: '写下今天的期待', duration: '5分钟', tip: '用日记记录' },
      { content: '伸展身体', duration: '4分钟', tip: '唤醒身体能量' },
    ],
    benefits: ['提升专注力', '减少焦虑', '增加掌控感'],
  },
  {
    id: 'evening-review',
    name: '晚间回顾仪式',
    emoji: '🌙',
    description: '用温柔的方式结束这一天',
    duration: '20分钟',
    category: 'evening',
    steps: [
      { content: '放下手机', duration: '1分钟', tip: '创造安静空间' },
      { content: '回顾今天的高光时刻', duration: '5分钟', tip: '即使很小的事也值得记录' },
      { content: '写下今天的学到的', duration: '5分钟', tip: '一个教训或一个洞见' },
      { content: '原谅今天的不足', duration: '3分钟', tip: '对自己说"没关系"' },
      { content: '为明天做一个小计划', duration: '3分钟', tip: '最多3件事' },
      { content: '感恩冥想', duration: '3分钟', tip: '感受平静' },
    ],
    benefits: ['改善睡眠', '减轻压力', '提升幸福感'],
  },
  {
    id: 'achievement-celebrate',
    name: '成就庆祝仪式',
    emoji: '🎉',
    description: '当你完成一件值得骄傲的事',
    duration: '10分钟',
    category: 'milestone',
    steps: [
      { content: '停下来，深呼吸', duration: '1分钟', tip: '完全感受这一刻' },
      { content: '对自己说"我做到了"', duration: '1分钟', tip: '大声说出来' },
      { content: '记录这个成就', duration: '3分钟', tip: '写下过程和感受' },
      { content: '奖励自己', duration: '3分钟', tip: '一杯好咖啡、一首喜欢的歌' },
      { content: '分享给信任的人', duration: '2分钟', tip: '或发一条私密动态' },
    ],
    benefits: ['增强自信', '巩固习惯', '激励未来'],
  },
  {
    id: 'stress-release',
    name: '压力释放仪式',
    emoji: '🌊',
    description: '当压力让你喘不过气时',
    duration: '15分钟',
    category: 'healing',
    steps: [
      { content: '找到安静的地方坐下', duration: '1分钟', tip: '或站着，只要舒适' },
      { content: '感受压力在身体的哪个位置', duration: '2分钟', tip: '胸口？肩膀？太阳穴？' },
      { content: '写下所有担心的事', duration: '5分钟', tip: '不加筛选，全部倒出来' },
      { content: '问自己"最坏会发生什么"', duration: '2分钟', tip: '通常没有想象中可怕' },
      { content: '撕掉或划掉那些担心', duration: '1分钟', tip: '象征性释放' },
      { content: '做一件让自己开心的事', duration: '4分钟', tip: '喝杯水、听首歌、看窗外' },
    ],
    benefits: ['释放焦虑', '恢复平静', '理清思绪'],
  },
  {
    id: 'gratitude-practice',
    name: '感恩练习仪式',
    emoji: '💝',
    description: '培养感恩的习惯',
    duration: '10分钟',
    category: 'growth',
    steps: [
      { content: '闭上眼睛，感受当下', duration: '2分钟', tip: '注意周围的声音和气味' },
      { content: '想一个你要感谢的人', duration: '2分钟', tip: '可以是身边的人或远方的人' },
      { content: '想一件你拥有的东西', duration: '2分钟', tip: '健康、家人、机会...' },
      { content: '想一件今天的小确幸', duration: '2分钟', tip: '一杯好咖啡、一个微笑' },
      { content: '写下感恩清单', duration: '2分钟', tip: '保存下来，日后回顾' },
    ],
    benefits: ['提升幸福感', '减少抱怨', '改善关系'],
  },
  {
    id: 'creative-spark',
    name: '创意火花仪式',
    emoji: '✨',
    description: '当灵感需要被点燃时',
    duration: '20分钟',
    category: 'creative',
    steps: [
      { content: '清空桌面，准备一张白纸', duration: '2分钟', tip: '创造空白空间' },
      { content: '写下"如果...会怎样"', duration: '5分钟', tip: '问自己10个如果' },
      { content: '随意涂鸦或画思维导图', duration: '5分钟', tip: '不评判，只是画' },
      { content: '找一个完全不相关的事物观察', duration: '3分钟', tip: '窗外、杯子、书架...' },
      { content: '捕捉涌现的想法', duration: '5分钟', tip: '记录所有，不加筛选' },
    ],
    benefits: ['激发创意', '打破思维定式', '发现新可能'],
  },
];

// 自定义仪式步骤
interface RitualStep {
  id: string;
  content: string;
  duration: string;
  tip: string;
  completed?: boolean;
}

// 仪式记录
interface RitualRecord {
  id: string;
  ritualId: string;
  ritualName: string;
  emoji: string;
  startedAt: string;
  completedAt?: string;
  stepsCompleted: number;
  totalSteps: number;
  notes: string;
}

// 用户创建的仪式
interface CustomRitual {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: string;
  category: string;
  steps: RitualStep[];
  benefits: string[];
  createdAt: string;
  completions: number;
}

const categoryEmojis: Record<string, string> = {
  morning: '🌅',
  evening: '🌙',
  milestone: '🎉',
  healing: '🌊',
  growth: '🌱',
  creative: '✨',
  custom: '💫',
};

const categoryColors: Record<string, string> = {
  morning: 'from-amber-400 to-orange-500',
  evening: 'from-indigo-400 to-purple-500',
  milestone: 'from-pink-400 to-rose-500',
  healing: 'from-teal-400 to-cyan-500',
  growth: 'from-green-400 to-emerald-500',
  creative: 'from-violet-400 to-purple-500',
  custom: 'from-slate-400 to-gray-500',
};

const categoryBgColors: Record<string, string> = {
  morning: 'bg-amber-50 dark:bg-amber-900/20',
  evening: 'bg-indigo-50 dark:bg-indigo-900/20',
  milestone: 'bg-pink-50 dark:bg-pink-900/20',
  healing: 'bg-teal-50 dark:bg-teal-900/20',
  growth: 'bg-green-50 dark:bg-green-900/20',
  creative: 'bg-violet-50 dark:bg-violet-900/20',
  custom: 'bg-slate-50 dark:bg-slate-900/20',
};

export default function RitualsPage() {
  const [viewMode, setViewMode] = useState<'browse' | 'practice' | 'create' | 'history'>('browse');
  const [selectedRitual, setSelectedRitual] = useState<typeof RITUAL_TEMPLATES[0] | CustomRitual | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [practiceNotes, setPracticeNotes] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // 自定义仪式
  const [customRituals, setCustomRituals] = useState<CustomRitual[]>([]);
  const [newRitual, setNewRitual] = useState<Partial<CustomRitual>>({
    name: '',
    emoji: '💫',
    description: '',
    duration: '10分钟',
    category: 'custom',
    steps: [],
    benefits: [],
  });
  const [newStep, setNewStep] = useState({ content: '', duration: '1分钟', tip: '' });
  
  // 练习历史
  const [ritualHistory, setRitualHistory] = useState<RitualRecord[]>([]);
  
  // 统计
  const [stats, setStats] = useState({
    totalPractices: 0,
    thisWeekPractices: 0,
    favoriteCategory: '',
    streakDays: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedCustom = localStorage.getItem('customRituals');
    const savedHistory = localStorage.getItem('ritualHistory');
    
    if (savedCustom) setCustomRituals(JSON.parse(savedCustom));
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setRitualHistory(history);
      calculateStats(history);
    }
  };

  const calculateStats = (history: RitualRecord[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeek = history.filter(r => new Date(r.startedAt) >= weekAgo);
    
    // 找最爱类别
    const categoryCount: Record<string, number> = {};
    history.forEach(r => {
      const ritual = [...RITUAL_TEMPLATES, ...customRituals].find(rit => rit.id === r.ritualId);
      if (ritual) {
        const cat = 'category' in ritual ? ritual.category : 'custom';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      }
    });
    
    const favorite = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    
    // 计算连续天数
    const dates = [...new Set(history.map(r => new Date(r.startedAt).toDateString()))];
    let streak = 0;
    const today = new Date().toDateString();
    if (dates.includes(today)) {
      streak = 1;
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toDateString();
        if (dates.includes(checkDate)) streak++;
        else break;
      }
    }

    setStats({
      totalPractices: history.length,
      thisWeekPractices: thisWeek.length,
      favoriteCategory: favorite ? favorite[0] : '',
      streakDays: streak,
    });
  };

  const startPractice = (ritual: typeof RITUAL_TEMPLATES[0] | CustomRitual) => {
    setSelectedRitual(ritual);
    setCurrentStepIndex(0);
    setPracticeNotes('');
    setViewMode('practice');
  };

  const completeStep = () => {
    if (!selectedRitual) return;
    
    if (currentStepIndex < selectedRitual.steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      // 完成整个仪式
      completeRitual();
    }
  };

  const completeRitual = () => {
    if (!selectedRitual) return;

    const record: RitualRecord = {
      id: Date.now().toString(),
      ritualId: selectedRitual.id,
      ritualName: selectedRitual.name,
      emoji: selectedRitual.emoji,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      stepsCompleted: selectedRitual.steps.length,
      totalSteps: selectedRitual.steps.length,
      notes: practiceNotes,
    };

    const updatedHistory = [record, ...ritualHistory];
    setRitualHistory(updatedHistory);
    localStorage.setItem('ritualHistory', JSON.stringify(updatedHistory));
    calculateStats(updatedHistory);

    // 更新自定义仪式的完成次数
    if ('completions' in selectedRitual) {
      const updatedCustom = customRituals.map(r =>
        r.id === selectedRitual.id ? { ...r, completions: r.completions + 1 } : r
      );
      setCustomRituals(updatedCustom);
      localStorage.setItem('customRituals', JSON.stringify(updatedCustom));
    }

    setViewMode('history');
    setSelectedRitual(null);
  };

  const addCustomRitual = () => {
    if (!newRitual.name || !newRitual.steps?.length) return;

    const ritual: CustomRitual = {
      id: 'custom-' + Date.now(),
      name: newRitual.name,
      emoji: newRitual.emoji || '💫',
      description: newRitual.description || '',
      duration: newRitual.duration || '10分钟',
      category: 'custom',
      steps: newRitual.steps,
      benefits: newRitual.benefits || [],
      createdAt: new Date().toISOString(),
      completions: 0,
    };

    const updated = [...customRituals, ritual];
    setCustomRituals(updated);
    localStorage.setItem('customRituals', JSON.stringify(updated));
    
    setNewRitual({ name: '', emoji: '💫', description: '', duration: '10分钟', category: 'custom', steps: [], benefits: [] });
    setShowCreateForm(false);
  };

  const addStepToNewRitual = () => {
    if (!newStep.content) return;
    
    const step: RitualStep = {
      id: Date.now().toString(),
      ...newStep,
    };
    
    setNewRitual(prev => ({
      ...prev,
      steps: [...(prev.steps || []), step],
    }));
    
    setNewStep({ content: '', duration: '1分钟', tip: '' });
  };

  const deleteCustomRitual = (id: string) => {
    const updated = customRituals.filter(r => r.id !== id);
    setCustomRituals(updated);
    localStorage.setItem('customRituals', JSON.stringify(updated));
  };

  const allRituals = [...RITUAL_TEMPLATES, ...customRituals];
  const filteredRituals = filterCategory 
    ? allRituals.filter(r => ('category' in r ? r.category : 'custom') === filterCategory)
    : allRituals;

  const categories = [
    { id: 'morning', name: '早晨', emoji: '🌅' },
    { id: 'evening', name: '晚间', emoji: '🌙' },
    { id: 'milestone', name: '成就', emoji: '🎉' },
    { id: 'healing', name: '疗愈', emoji: '🌊' },
    { id: 'growth', name: '成长', emoji: '🌱' },
    { id: 'creative', name: '创意', emoji: '✨' },
    { id: 'custom', name: '自定义', emoji: '💫' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            🎭 仪式感实验室
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            用仪式感点亮平凡的日子
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: '总练习', value: stats.totalPractices, emoji: '📊', color: 'text-purple-500' },
            { label: '本周', value: stats.thisWeekPractices, emoji: '📅', color: 'text-blue-500' },
            { label: '连续', value: `${stats.streakDays}天`, emoji: '🔥', color: 'text-orange-500' },
            { label: '最爱', value: categories.find(c => c.id === stats.favoriteCategory)?.emoji || '-', emoji: '⭐', color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-3 text-center border border-white/20"
            >
              <div className="text-xl mb-1">{stat.emoji}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'browse', label: '浏览仪式', emoji: '🔍' },
            { id: 'create', label: '创建仪式', emoji: '✏️' },
            { id: 'history', label: '练习记录', emoji: '📜' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as typeof viewMode)}
              className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                viewMode === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-white/70'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Browse Mode */}
        {viewMode === 'browse' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  !filterCategory
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                }`}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-1 ${
                    filterCategory === cat.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Ritual Cards */}
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredRituals.map((ritual, i) => {
                  const category = 'category' in ritual ? ritual.category : 'custom';
                  return (
                    <motion.div
                      key={ritual.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-5 rounded-2xl border ${categoryBgColors[category]} border-white/20 dark:border-gray-700/50 group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{ritual.emoji}</span>
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                              {ritual.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span>⏱️ {ritual.duration}</span>
                              <span>•</span>
                              <span>{ritual.steps.length} 步骤</span>
                              {'completions' in ritual && typeof ritual.completions === 'number' && ritual.completions > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-500">完成 {(ritual as CustomRitual).completions} 次</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {'completions' in ritual && (
                          <button
                            onClick={() => deleteCustomRitual(ritual.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition text-sm"
                          >
                            删除
                          </button>
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {ritual.description}
                      </p>

                      {/* Steps Preview */}
                      <div className="space-y-2 mb-4">
                        {ritual.steps.slice(0, 3).map((step, si) => (
                          <div
                            key={si}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            <span className="w-5 h-5 rounded-full bg-white/50 dark:bg-gray-700/50 flex items-center justify-center text-xs">
                              {si + 1}
                            </span>
                            <span>{step.content}</span>
                            <span className="text-xs text-gray-400">({step.duration})</span>
                          </div>
                        ))}
                        {ritual.steps.length > 3 && (
                          <div className="text-sm text-gray-400 pl-7">
                            还有 {ritual.steps.length - 3} 个步骤...
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      {ritual.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ritual.benefits.map((b, bi) => (
                            <span
                              key={bi}
                              className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-300 rounded-full text-xs"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => startPractice(ritual)}
                        className={`w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r ${categoryColors[category]} hover:shadow-lg transition flex items-center justify-center gap-2`}
                      >
                        <span>▶️</span>
                        <span>开始练习</span>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Create Mode */}
        {viewMode === 'create' && (
          <div className="space-y-6">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>创建你的专属仪式</span>
              </h2>

              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    仪式名称
                  </label>
                  <input
                    type="text"
                    value={newRitual.name}
                    onChange={e => setNewRitual(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：我的晨间仪式"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={newRitual.emoji}
                      onChange={e => setNewRitual(prev => ({ ...prev, emoji: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-2xl text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      预计时长
                    </label>
                    <select
                      value={newRitual.duration}
                      onChange={e => setNewRitual(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <option>5分钟</option>
                      <option>10分钟</option>
                      <option>15分钟</option>
                      <option>20分钟</option>
                      <option>30分钟</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    描述
                  </label>
                  <textarea
                    value={newRitual.description}
                    onChange={e => setNewRitual(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="这个仪式对你的意义..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-20 resize-none"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  步骤 ({newRitual.steps?.length || 0})
                </h3>

                {/* Existing Steps */}
                <div className="space-y-2 mb-4">
                  {(newRitual.steps || []).map((step, i) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-gray-700 dark:text-gray-200">{step.content}</span>
                      <span className="text-sm text-gray-400">{step.duration}</span>
                      <button
                        onClick={() => setNewRitual(prev => ({
                          ...prev,
                          steps: prev.steps?.filter(s => s.id !== step.id)
                        }))}
                        className="text-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Step Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStep.content}
                    onChange={e => setNewStep(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="步骤内容"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                  />
                  <select
                    value={newStep.duration}
                    onChange={e => setNewStep(prev => ({ ...prev, duration: e.target.value }))}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                  >
                    <option>1分钟</option>
                    <option>2分钟</option>
                    <option>3分钟</option>
                    <option>5分钟</option>
                    <option>10分钟</option>
                  </select>
                  <button
                    onClick={addStepToNewRitual}
                    disabled={!newStep.content}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  益处（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={newRitual.benefits?.join(', ') || ''}
                  onChange={e => setNewRitual(prev => ({
                    ...prev,
                    benefits: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  placeholder="放松心情, 提升专注, 改善睡眠"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              {/* Submit */}
              <button
                onClick={addCustomRitual}
                disabled={!newRitual.name || !newRitual.steps?.length}
                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition disabled:opacity-50"
              >
                创建仪式
              </button>
            </div>
          </div>
        )}

        {/* Practice Mode */}
        {viewMode === 'practice' && selectedRitual && (
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedRitual.emoji}</span>
                  <div>
                    <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                      {selectedRitual.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      步骤 {currentStepIndex + 1} / {selectedRitual.steps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setViewMode('browse');
                    setSelectedRitual(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕ 退出
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStepIndex + 1) / selectedRitual.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-200/30"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {['🧘', '💭', '✍️', '🙏', '🌟'][currentStepIndex % 5]}
                </div>
                <div className="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm mb-4">
                  ⏱️ {selectedRitual.steps[currentStepIndex].duration}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedRitual.steps[currentStepIndex].content}
                </h3>
              </div>

              {/* Tip */}
              {selectedRitual.steps[currentStepIndex].tip && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    💡 {selectedRitual.steps[currentStepIndex].tip}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Timer Placeholder */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                用你自己的节奏完成这一步
              </p>
              <button
                onClick={completeStep}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition"
              >
                {currentStepIndex === selectedRitual.steps.length - 1 ? '✨ 完成仪式' : '下一步 →'}
              </button>
            </div>

            {/* Notes */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💭 练习笔记（可选）
              </label>
              <textarea
                value={practiceNotes}
                onChange={e => setPracticeNotes(e.target.value)}
                placeholder="记录这一刻的感受..."
                className="w-full h-20 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
              />
            </div>
          </div>
        )}

        {/* History Mode */}
        {viewMode === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span>📜</span>
              <span>练习记录</span>
              <span className="text-sm font-normal text-gray-400">
                ({ritualHistory.length} 次)
              </span>
            </h2>

            {ritualHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-4">🌱</div>
                <p>还没有练习记录</p>
                <p className="text-sm">开始你的第一个仪式吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ritualHistory.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{record.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">
                          {record.ritualName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(record.startedAt).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {record.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                            "{record.notes}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-green-500 text-sm">✓ 完成</div>
                        <div className="text-xs text-gray-400">
                          {record.stepsCompleted}/{record.totalSteps} 步
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200/30"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong className="text-purple-500">🎭 关于仪式感：</strong>
            仪式感不是繁琐的形式，而是给生活按下暂停键的能力。它帮助我们在忙碌中找回自己，
            在平凡中发现意义。每一个小小的仪式，都是对生活的敬意。
          </p>
        </motion.div>
      </div>
    </div>
  );
}