'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 能量等级对应的颜色和描述
const ENERGY_LEVELS = {
  low: { color: 'from-blue-400 to-blue-600', emoji: '🌊', label: '低潮期', tip: '休息一下，明天会更好' },
  medium: { color: 'from-yellow-400 to-orange-500', emoji: '🌤️', label: '平稳', tip: '保持节奏，稳中求进' },
  high: { color: 'from-green-400 to-emerald-500', emoji: '⚡', label: '充沛', tip: '乘胜追击，把握今天' },
  peak: { color: 'from-purple-500 to-pink-500', emoji: '🔥', label: '巅峰', tip: '你今天状态爆棚！' },
};

// 心情选项
const MOODS = [
  { emoji: '😴', label: '疲惫', energy: 20 },
  { emoji: '😢', label: '低落', energy: 30 },
  { emoji: '😐', label: '平静', energy: 50 },
  { emoji: '🙂', label: '不错', energy: 65 },
  { emoji: '😊', label: '开心', energy: 75 },
  { emoji: '🤩', label: '兴奋', energy: 90 },
  { emoji: '🥳', label: '超棒', energy: 100 },
];

// 模拟历史数据
const generateHistoryData = () => {
  const data = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      energy: Math.floor(Math.random() * 60) + 40,
      mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    });
  }
  return data;
};

export default function EnergyDashboard() {
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [historyData] = useState(generateHistoryData);
  const [streak, setStreak] = useState(0);
  const [todayChecked, setTodayChecked] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取连续打卡天数
    const savedStreak = localStorage.getItem('energy-streak');
    const lastCheck = localStorage.getItem('energy-last-check');
    const today = new Date().toDateString();
    
    if (lastCheck === today) {
      setTodayChecked(true);
      const savedMood = localStorage.getItem('energy-today-mood');
      if (savedMood) {
        setSelectedMood(JSON.parse(savedMood));
        setShowResult(true);
      }
    }
    
    if (savedStreak) {
      const lastDate = localStorage.getItem('energy-last-date');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString() || lastDate === today) {
        setStreak(parseInt(savedStreak));
      } else {
        setStreak(1);
        localStorage.setItem('energy-streak', '1');
      }
    } else {
      setStreak(1);
      localStorage.setItem('energy-streak', '1');
    }
  }, []);

  const handleMoodSelect = (mood: typeof MOODS[0]) => {
    if (todayChecked) return;
    
    setSelectedMood(mood);
    setShowResult(true);
    setTodayChecked(true);
    
    // 保存到 localStorage
    const today = new Date().toDateString();
    localStorage.setItem('energy-last-check', today);
    localStorage.setItem('energy-last-date', today);
    localStorage.setItem('energy-today-mood', JSON.stringify(mood));
    
    // 更新连续打卡
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('energy-streak', newStreak.toString());
  };

  const getEnergyLevel = (energy: number) => {
    if (energy < 40) return 'low';
    if (energy < 60) return 'medium';
    if (energy < 80) return 'high';
    return 'peak';
  };

  const currentEnergyLevel = selectedMood 
    ? getEnergyLevel(selectedMood.energy) 
    : 'medium';

  const avgEnergy = Math.round(
    historyData.reduce((sum, d) => sum + d.energy, 0) / historyData.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⚡ 能量仪表盘</h1>
            <p className="text-gray-500 mt-1">追踪你的每日能量状态</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl text-gray-600 hover:bg-white transition-colors"
          >
            🏠 返回首页
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-600">{streak}</div>
            <div className="text-sm text-gray-500">连续打卡</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-purple-600">{avgEnergy}</div>
            <div className="text-sm text-gray-500">平均能量</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-indigo-600">14</div>
            <div className="text-sm text-gray-500">记录天数</div>
          </div>
        </div>

        {/* 今日打卡 */}
        {!showResult ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8 border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
              今天感觉如何？
            </h2>
            <p className="text-gray-500 text-center mb-6">
              选择最符合你现在心情的表情
            </p>
            
            <div className="grid grid-cols-7 gap-3 max-w-2xl mx-auto">
              {MOODS.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => handleMoodSelect(mood)}
                  className="group flex flex-col items-center p-3 rounded-xl hover:bg-indigo-50 transition-all hover:scale-110"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {mood.emoji}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 能量结果卡片 */
          <div className="mb-8">
            <div className={`bg-gradient-to-br ${ENERGY_LEVELS[currentEnergyLevel].color} rounded-2xl p-8 shadow-lg text-white relative overflow-hidden`}>
              {/* 装饰 */}
              <div className="absolute top-4 right-4 text-6xl opacity-20">
                {ENERGY_LEVELS[currentEnergyLevel].emoji}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl">{selectedMood?.emoji}</span>
                  <div>
                    <div className="text-2xl font-bold">
                      今日能量值: {selectedMood?.energy}
                    </div>
                    <div className="text-white/80 text-lg">
                      {ENERGY_LEVELS[currentEnergyLevel].label} · {ENERGY_LEVELS[currentEnergyLevel].emoji}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>💡</span>
                    <span className="font-medium">今日提示</span>
                  </div>
                  <p className="text-white/90">{ENERGY_LEVELS[currentEnergyLevel].tip}</p>
                </div>
                
                {/* 能量条 */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>能量等级</span>
                    <span>{selectedMood?.energy}%</span>
                  </div>
                  <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${selectedMood?.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 明日提醒 */}
            <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <span className="text-gray-700">明天记得回来打卡哦！</span>
              </div>
              <span className="text-orange-600 font-bold">🔥 {streak} 天连续</span>
            </div>
          </div>
        )}

        {/* 能量趋势图 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 过去14天能量趋势</h3>
          
          <div className="flex items-end justify-between h-40 gap-1">
            {historyData.map((day, i) => {
              const level = getEnergyLevel(day.energy);
              const colors = {
                low: 'bg-blue-400',
                medium: 'bg-yellow-400',
                high: 'bg-green-400',
                peak: 'bg-purple-500',
              };
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full rounded-t ${colors[level]} transition-all hover:opacity-80`}
                    style={{ height: `${day.energy}%` }}
                    title={`${day.date}: ${day.energy}%`}
                  />
                  <span className="text-xs text-gray-400 transform -rotate-45 origin-center">
                    {day.date.split('月')[1]}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded" />
              <span className="text-gray-500">低潮</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded" />
              <span className="text-gray-500">平稳</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded" />
              <span className="text-gray-500">充沛</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded" />
              <span className="text-gray-500">巅峰</span>
            </div>
          </div>
        </div>

        {/* 心情分布 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">😊 心情分布</h3>
          
          <div className="grid grid-cols-4 gap-3">
            {MOODS.slice(2).map((mood) => {
              const count = historyData.filter(d => d.mood.emoji === mood.emoji).length;
              const percentage = Math.round((count / historyData.length) * 100);
              
              return (
                <div 
                  key={mood.emoji}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center"
                >
                  <span className="text-3xl block mb-2">{mood.emoji}</span>
                  <span className="text-2xl font-bold text-gray-800">{count}</span>
                  <span className="text-xs text-gray-500 block">次 ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 相关入口 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Link
            href="/chat-diary"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <span className="text-2xl block mb-2">💬</span>
            <span className="text-sm text-gray-600">写篇日记</span>
          </Link>
          <Link
            href="/mood"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm text-gray-600">心情详情</span>
          </Link>
          <Link
            href="/prompts"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <span className="text-2xl block mb-2">💡</span>
            <span className="text-sm text-gray-600">写作灵感</span>
          </Link>
        </div>
      </main>
    </div>
  );
}