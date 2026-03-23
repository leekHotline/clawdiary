'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MoodDay {
  date: string;
  mood: number; // 1-10
  emoji: string;
  label: string;
  isForecast?: boolean;
  suggestion?: string;
}

interface MoodPattern {
  pattern: string;
  insight: string;
  suggestion: string;
}

const moodConfig = {
  1: { emoji: '🌧️', label: '低落', color: 'from-slate-400 to-slate-600' },
  2: { emoji: '🌧️', label: '低落', color: 'from-slate-400 to-slate-600' },
  3: { emoji: '🌦️', label: '疲惫', color: 'from-gray-400 to-gray-500' },
  4: { emoji: '⛅', label: '平静', color: 'from-blue-300 to-blue-400' },
  5: { emoji: '🌤️', label: '平稳', color: 'from-sky-300 to-sky-400' },
  6: { emoji: '☀️', label: '愉悦', color: 'from-amber-300 to-orange-400' },
  7: { emoji: '☀️', label: '愉悦', color: 'from-amber-300 to-orange-400' },
  8: { emoji: '🌞', label: '兴奋', color: 'from-yellow-400 to-orange-500' },
  9: { emoji: '🌈', label: '极好', color: 'from-pink-400 to-purple-500' },
  10: { emoji: '✨', label: '巅峰', color: 'from-purple-400 to-pink-500' },
};

const weatherBg = {
  rainy: 'from-slate-600 via-slate-500 to-slate-400',
  cloudy: 'from-gray-400 via-gray-300 to-gray-200',
  sunny: 'from-amber-300 via-yellow-200 to-sky-200',
  rainbow: 'from-purple-400 via-pink-300 to-amber-200',
};

const forecastSuggestions = [
  { condition: 'rising', text: '情绪上升期！适合挑战新事物 🚀' },
  { condition: 'stable', text: '情绪稳定期，保持日常节奏 ⚖️' },
  { condition: 'declining', text: '注意休息，给自己更多关爱 💝' },
  { condition: 'low', text: '低谷期正常，试试散步或听音乐 🎵' },
];

// 模拟历史数据 + AI 预测
function generateMoodForecast(): MoodDay[] {
  const today = new Date();
  const days: MoodDay[] = [];
  
  // 生成过去7天的模拟数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const mood = Math.floor(Math.random() * 5) + 4; // 4-8 范围
    const config = moodConfig[mood as keyof typeof moodConfig];
    days.push({
      date: date.toISOString().split('T')[0],
      mood,
      emoji: config.emoji,
      label: config.label,
    });
  }
  
  // 生成未来3天预测
  const lastMood = days[days.length - 1].mood;
  const trend = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const forecastMood = Math.max(1, Math.min(10, lastMood + trend * i + Math.floor(Math.random() * 2)));
    const config = moodConfig[forecastMood as keyof typeof moodConfig];
    
    let suggestion = '';
    if (forecastMood <= 3) {
      suggestion = '给自己安排一些放松活动';
    } else if (forecastMood >= 7) {
      suggestion = '好状态！适合处理重要事务';
    } else {
      suggestion = '保持节奏，适度运动';
    }
    
    days.push({
      date: date.toISOString().split('T')[0],
      mood: forecastMood,
      emoji: config.emoji,
      label: config.label,
      isForecast: true,
      suggestion,
    });
  }
  
  return days;
}

function generateInsight(days: MoodDay[]): MoodPattern {
  const avgMood = days.slice(0, 7).reduce((sum, d) => sum + d.mood, 0) / 7;
  const lastThree = days.slice(4, 7);
  const nextThree = days.slice(7, 10);
  
  const trend = nextThree.reduce((s, d) => s + d.mood, 0) / 3 - lastThree.reduce((s, d) => s + d.mood, 0) / 3;
  
  if (trend > 1) {
    return {
      pattern: '情绪上升',
      insight: '最近情绪有好转趋势，继续保持当前的积极状态',
      suggestion: '这个时期适合尝试新挑战、学习新技能或处理重要决策',
    };
  } else if (trend < -1) {
    return {
      pattern: '情绪波动',
      insight: '近期情绪有下降趋势，可能需要更多自我关怀',
      suggestion: '尝试：减少咖啡因摄入、保证睡眠、和朋友聊天、做喜欢的运动',
    };
  } else {
    return {
      pattern: '情绪稳定',
      insight: '情绪状态比较平稳，是个舒适的状态',
      suggestion: '保持当前的生活节奏，可以尝试一些新的放松方式',
    };
  }
}

export default function MoodForecastPage() {
  const [forecast, setForecast] = useState<MoodDay[]>([]);
  const [insight, setInsight] = useState<MoodPattern | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<MoodDay | null>(null);

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      const data = generateMoodForecast();
      setForecast(data);
      setInsight(generateInsight(data));
      setIsLoading(false);
    }, 800);
  }, []);

  const refreshForecast = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMoodForecast();
      setForecast(data);
      setInsight(generateInsight(data));
      setIsLoading(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🌤️
        </motion.div>
      </div>
    );
  }

  const currentWeather = forecast[6]; // 今天
  const forecastDays = forecast.slice(7); // 未来3天

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 text-8xl opacity-20">🌈</div>
        <div className="absolute bottom-40 left-10 text-6xl opacity-20">☁️</div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-10">✨</div>
      </div>

      <main className="relative max-w-2xl mx-auto px-4 pt-8 pb-20">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← 返回
          </Link>
          <button
            onClick={refreshForecast}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>🔄</span> 刷新预测
          </button>
        </div>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">心情预报</h1>
          <p className="text-gray-500">基于历史日记分析，预测你的情绪天气</p>
        </div>

        {/* 当前情绪天气 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${moodConfig[currentWeather.mood as keyof typeof moodConfig].color} rounded-3xl p-6 text-white mb-6 shadow-xl`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">今日情绪</p>
              <div className="text-5xl mb-2">{currentWeather.emoji}</div>
              <p className="text-2xl font-bold">{currentWeather.label}</p>
              <p className="text-white/70 text-sm mt-1">{currentWeather.date}</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold opacity-50">{currentWeather.mood}</div>
              <p className="text-white/70 text-sm">情绪指数</p>
            </div>
          </div>
        </motion.div>

        {/* 未来3天预报 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔮</span> 未来3天预测
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {forecastDays.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDay(day)}
                className={`bg-gradient-to-br ${moodConfig[day.mood as keyof typeof moodConfig].color} rounded-xl p-4 text-white text-center cursor-pointer hover:scale-105 transition-transform`}
              >
                <p className="text-xs text-white/70 mb-1">
                  {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                </p>
                <div className="text-3xl mb-1">{day.emoji}</div>
                <p className="text-sm font-medium">{day.label}</p>
                <p className="text-2xl font-bold mt-1">{day.mood}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI 洞察 */}
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white mb-6 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="font-bold mb-1">AI 情绪洞察</h3>
                <p className="text-white/90 text-sm mb-2">{insight.insight}</p>
                <p className="text-white/80 text-sm bg-white/20 rounded-lg p-3">
                  💡 {insight.suggestion}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 过去7天历史 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span> 过去7天情绪
          </h2>
          <div className="flex items-end justify-between h-32 gap-1">
            {forecast.slice(0, 7).map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${day.mood * 10}%` }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className={`w-full rounded-t-lg bg-gradient-to-t ${moodConfig[day.mood as keyof typeof moodConfig].color}`}
                  style={{ height: '100%' }}
                >
                  <div className="text-center text-white text-xs mt-1 opacity-80">
                    {day.emoji}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(day.date).toLocaleDateString('zh-CN', { day: 'numeric' })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 情绪建议卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/write"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium text-gray-800">写日记改善心情</p>
            <p className="text-xs text-gray-500">记录此刻的感受</p>
          </Link>
          <Link
            href="/meditation"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors"
          >
            <div className="text-2xl mb-2">🧘</div>
            <p className="font-medium text-gray-800">冥想放松</p>
            <p className="text-xs text-gray-500">5分钟正念练习</p>
          </Link>
          <Link
            href="/mood"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium text-gray-800">情绪分析</p>
            <p className="text-xs text-gray-500">深入了解情绪模式</p>
          </Link>
          <Link
            href="/inspirations"
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white transition-colors"
          >
            <div className="text-2xl mb-2">✨</div>
            <p className="font-medium text-gray-800">获取灵感</p>
            <p className="text-xs text-gray-500">发现新的可能</p>
          </Link>
        </div>

        {/* 选中日期详情 */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedDay(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-gradient-to-br ${moodConfig[selectedDay.mood as keyof typeof moodConfig].color} rounded-2xl p-6 text-white max-w-sm w-full`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-3">{selectedDay.emoji}</div>
                  <p className="text-2xl font-bold mb-1">{selectedDay.label}</p>
                  <p className="text-white/70">{selectedDay.date}</p>
                  <div className="text-5xl font-bold my-4">{selectedDay.mood}</div>
                  {selectedDay.suggestion && (
                    <div className="bg-white/20 rounded-xl p-3 text-sm">
                      💡 {selectedDay.suggestion}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="mt-4 w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  关闭
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}