'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type TimeOfDay = 'morning' | 'evening';

interface MorningEntry {
  date: string;
  intention: string;
  mood: number;
  energy: number;
  gratitude: string;
  focus: string;
}

interface EveningEntry {
  date: string;
  wins: string;
  challenges: string;
  learning: string;
  mood: number;
  energy: number;
  tomorrowIntent: string;
}

const morningPrompts = [
  '今天我最想完成的一件事是...',
  '我期待今天发生的美好是...',
  '今天的能量来源于...',
  '我想给自己的一句话是...',
  '如果今天圆满结束，我会...',
];

const eveningPrompts = [
  '今天让我感到骄傲的是...',
  '我学到的最重要一课是...',
  '今天意想不到的惊喜是...',
  '我想感谢的人或事是...',
  '今天最让我微笑的瞬间是...',
];

export default function DailyReflectionPage() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentDate] = useState(new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  }));
  
  // 晨间状态
  const [intention, setIntention] = useState('');
  const [morningMood, setMorningMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [gratitude, setGratitude] = useState('');
  const [focus, setFocus] = useState('');
  const [morningPromptIndex, setMorningPromptIndex] = useState(0);
  
  // 晚间状态
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learning, setLearning] = useState('');
  const [eveningMood, setEveningMood] = useState(3);
  const [eveningEnergy, setEveningEnergy] = useState(3);
  const [tomorrowIntent, setTomorrowIntent] = useState('');
  const [eveningPromptIndex, setEveningPromptIndex] = useState(0);
  
  // 历史记录
  const [history, setHistory] = useState<(MorningEntry | EveningEntry)[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('daily-reflection-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    
    // 检测时间自动选择
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 17 && hour < 23) {
      setTimeOfDay('evening');
    }
  }, []);

  // 保存晨间反思
  const saveMorningReflection = () => {
    const entry: MorningEntry = {
      date: new Date().toISOString(),
      intention,
      mood: morningMood,
      energy,
      gratitude,
      focus,
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem('daily-reflection-history', JSON.stringify(newHistory));
    
    // 清空表单
    setIntention('');
    setMorningMood(3);
    setEnergy(3);
    setGratitude('');
    setFocus('');
    
    alert('晨间反思已保存！✨ 祝你有美好的一天！');
  };

  // 保存晚间反思
  const saveEveningReflection = () => {
    const entry: EveningEntry = {
      date: new Date().toISOString(),
      wins,
      challenges,
      learning,
      mood: eveningMood,
      energy: eveningEnergy,
      tomorrowIntent,
    };
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem('daily-reflection-history', JSON.stringify(newHistory));
    
    // 清空表单
    setWins('');
    setChallenges('');
    setLearning('');
    setEveningMood(3);
    setEveningEnergy(3);
    setTomorrowIntent('');
    
    alert('晚间反思已保存！🌙 祝你有个好梦！');
  };

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const energyLabels = ['疲惫', '困倦', '一般', '精力充沛', '充满活力'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-6">
          <Link href="/experiment" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            ← 实验功能
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {timeOfDay === 'morning' ? '🌅 晨间反思' : '🌙 晚间反思'}
          </h1>
          <p className="text-gray-500">{currentDate}</p>
        </div>

        {/* 时间切换 */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTimeOfDay('morning')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              timeOfDay === 'morning'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            🌅 晨间
          </button>
          <button
            onClick={() => setTimeOfDay('evening')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              timeOfDay === 'evening'
                ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            🌙 晚间
          </button>
        </div>

        {/* 晨间反思表单 */}
        {timeOfDay === 'morning' && (
          <div className="space-y-6">
            {/* 今日意图 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-xl">🎯</span> 今日意图
                </label>
                <button
                  onClick={() => setMorningPromptIndex((i) => (i + 1) % morningPrompts.length)}
                  className="text-xs text-amber-600 hover:text-amber-700"
                >
                  🔄 换一个
                </button>
              </div>
              <p className="text-sm text-amber-600 mb-3 italic">"{morningPrompts[morningPromptIndex]}"</p>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="今天我想专注于..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-amber-100 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 outline-none resize-none h-24"
              />
            </div>

            {/* 心情 & 能量 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <span>😊</span> 起床心情
                </label>
                <div className="flex justify-between">
                  {moodEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setMorningMood(i + 1)}
                      className={`text-2xl p-1 rounded-lg transition-all ${
                        morningMood === i + 1 ? 'bg-amber-100 scale-125' : 'hover:scale-110'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <span>⚡</span> 能量水平
                </label>
                <div className="flex justify-between text-xs text-gray-500">
                  {energyLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setEnergy(i + 1)}
                      className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                        energy === i + 1 ? 'bg-orange-100 scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <span className="text-lg">{['🔋', '🪫', '⚡', '🔋', '⚡'][i]}</span>
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 感恩 & 专注 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-xl">🙏</span> 今日感恩
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="我感谢今天拥有的..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-amber-100 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 outline-none mb-4"
              />
              
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-xl">🎪</span> 今天最重要的焦点
              </label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="今天如果只完成一件事，那就是..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-amber-100 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </div>

            {/* 保存按钮 */}
            <button
              onClick={saveMorningReflection}
              disabled={!intention.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ 保存晨间反思
            </button>
          </div>
        )}

        {/* 晚间反思表单 */}
        {timeOfDay === 'evening' && (
          <div className="space-y-6">
            {/* 今日胜利 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-xl">🏆</span> 今日小胜
                </label>
                <button
                  onClick={() => setEveningPromptIndex((i) => (i + 1) % eveningPrompts.length)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  🔄 换一个
                </button>
              </div>
              <p className="text-sm text-indigo-600 mb-3 italic">"{eveningPrompts[eveningPromptIndex]}"</p>
              <textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="今天让我感到骄傲的是..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-24"
              />
            </div>

            {/* 挑战 & 学习 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-xl">💪</span> 今天的挑战
              </label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="遇到什么困难？怎么应对的？"
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-20 mb-4"
              />
              
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-xl">💡</span> 今日学习
              </label>
              <textarea
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                placeholder="今天学到的重要一课是..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-20"
              />
            </div>

            {/* 心情 & 能量 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <span>🌙</span> 睡前心情
                </label>
                <div className="flex justify-between">
                  {moodEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setEveningMood(i + 1)}
                      className={`text-2xl p-1 rounded-lg transition-all ${
                        eveningMood === i + 1 ? 'bg-indigo-100 scale-125' : 'hover:scale-110'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <span>🔋</span> 剩余能量
                </label>
                <div className="flex justify-between text-xs text-gray-500">
                  {energyLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setEveningEnergy(i + 1)}
                      className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                        eveningEnergy === i + 1 ? 'bg-purple-100 scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <span className="text-lg">{['🪫', '🔋', '⚡', '🔋', '⚡'][i]}</span>
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 明日意图 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <span className="text-xl">🌅</span> 明日期待
              </label>
              <input
                type="text"
                value={tomorrowIntent}
                onChange={(e) => setTomorrowIntent(e.target.value)}
                placeholder="明天醒来想做的第一件事..."
                className="w-full px-4 py-3 bg-white/50 rounded-xl border border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            {/* 保存按钮 */}
            <button
              onClick={saveEveningReflection}
              disabled={!wins.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🌙 保存晚间反思
            </button>
          </div>
        )}

        {/* 历史记录 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            📊 查看历史记录 ({history.length} 条)
            <span className={`transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {showHistory && history.length > 0 && (
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {history.slice().reverse().map((entry, i) => {
                const isMorning = 'intention' in entry;
                const date = new Date(entry.date).toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <div key={i} className={`p-4 rounded-xl ${isMorning ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {isMorning ? '🌅 晨间' : '🌙 晚间'}
                      </span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {isMorning 
                        ? (entry as MorningEntry).intention 
                        : (entry as EveningEntry).wins}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span>心情: {moodEmojis[(isMorning ? (entry as MorningEntry).mood : (entry as EveningEntry).mood) - 1]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {showHistory && history.length === 0 && (
            <p className="mt-4 text-center text-sm text-gray-400">还没有记录，开始你的第一次反思吧！</p>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>💡 研究表明，每日反思可以降低焦虑、提升幸福感</p>
          <p className="mt-1">坚持记录，见证成长</p>
        </div>
      </main>
    </div>
  );
}