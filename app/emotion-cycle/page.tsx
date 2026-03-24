"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// 情绪类型
interface EmotionEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number; // 1-10
  note?: string;
}

// 周期分析结果
interface CycleAnalysis {
  averageIntensity: number;
  peakDay: string; // 一周中情绪最高的日子
  lowDay: string;
  trendDirection: "up" | "down" | "stable";
  cyclePhase: "上升期" | "高峰期" | "下降期" | "低谷期";
  weeklyPattern: { day: string; avgIntensity: number }[];
  monthlyTrend: { week: number; avgIntensity: number }[];
  insights: string[];
  nextPeakPrediction: string;
}

// 情绪选项
const EMOTIONS = [
  { value: "joy", label: "喜悦", emoji: "😊", color: "bg-yellow-100 text-yellow-700" },
  { value: "peace", label: "平静", emoji: "😌", color: "bg-green-100 text-green-700" },
  { value: "excitement", label: "兴奋", emoji: "🤩", color: "bg-orange-100 text-orange-700" },
  { value: "love", label: "爱", emoji: "🥰", color: "bg-pink-100 text-pink-700" },
  { value: "gratitude", label: "感恩", emoji: "🙏", color: "bg-purple-100 text-purple-700" },
  { value: "hope", label: "希望", emoji: "🌟", color: "bg-cyan-100 text-cyan-700" },
  { value: "anxiety", label: "焦虑", emoji: "😰", color: "bg-blue-100 text-blue-700" },
  { value: "sadness", label: "悲伤", emoji: "😢", color: "bg-indigo-100 text-indigo-700" },
  { value: "anger", label: "愤怒", emoji: "😤", color: "bg-red-100 text-red-700" },
  { value: "fear", label: "恐惧", emoji: "😨", color: "bg-gray-100 text-gray-700" },
  { value: "frustration", label: "挫折", emoji: "😞", color: "bg-stone-100 text-stone-700" },
  { value: "tired", label: "疲惫", emoji: "😴", color: "bg-slate-100 text-slate-700" },
];

const DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 生成模拟数据
function generateMockData(): EmotionEntry[] {
  const entries: EmotionEntry[] = [];
  const now = new Date();
  
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 模拟周期性波动
    const dayOfWeek = date.getDay();
    const weekFactor = Math.sin((i / 7) * Math.PI) * 1.5;
    const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : -0.5;
    const baseIntensity = 5.5 + weekFactor + dayFactor + (Math.random() - 0.5) * 2;
    
    const intensity = Math.max(1, Math.min(10, Math.round(baseIntensity)));
    const emotionIndex = Math.floor(Math.random() * EMOTIONS.length);
    
    entries.push({
      id: `entry-${i}`,
      date: date.toISOString().split("T")[0],
      emotion: EMOTIONS[emotionIndex].value,
      intensity,
      note: `第${60 - i + 1}天的情绪记录`,
    });
  }
  
  return entries;
}

// 分析情绪周期
function analyzeCycle(entries: EmotionEntry[]): CycleAnalysis {
  if (entries.length === 0) {
    return {
      averageIntensity: 5,
      peakDay: "周六",
      lowDay: "周一",
      trendDirection: "stable",
      cyclePhase: "上升期",
      weeklyPattern: DAYS.map(day => ({ day, avgIntensity: 5 })),
      monthlyTrend: [],
      insights: ["开始记录你的情绪，解锁周期分析"],
      nextPeakPrediction: "继续记录以预测",
    };
  }

  // 计算平均强度
  const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length;
  
  // 分析每周模式
  const dayGroups: Record<number, number[]> = {};
  entries.forEach(e => {
    const day = new Date(e.date).getDay();
    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(e.intensity);
  });
  
  const weeklyPattern = DAYS.map((day, i) => ({
    day,
    avgIntensity: dayGroups[i] 
      ? dayGroups[i].reduce((a, b) => a + b, 0) / dayGroups[i].length
      : avgIntensity,
  }));
  
  // 找出最高和最低的日期
  const sortedDays = [...weeklyPattern].sort((a, b) => b.avgIntensity - a.avgIntensity);
  const peakDay = sortedDays[0].day;
  const lowDay = sortedDays[sortedDays.length - 1].day;
  
  // 分析趋势
  const recentEntries = entries.slice(-14);
  const earlierEntries = entries.slice(-28, -14);
  const recentAvg = recentEntries.reduce((sum, e) => sum + e.intensity, 0) / Math.max(recentEntries.length, 1);
  const earlierAvg = earlierEntries.length > 0 
    ? earlierEntries.reduce((sum, e) => sum + e.intensity, 0) / earlierEntries.length 
    : recentAvg;
  
  const trendDirection: "up" | "down" | "stable" = 
    recentAvg - earlierAvg > 0.5 ? "up" : 
    recentAvg - earlierAvg < -0.5 ? "down" : "stable";
  
  // 判断当前周期阶段
  const last7 = entries.slice(-7);
  const last7Avg = last7.reduce((sum, e) => sum + e.intensity, 0) / last7.length;
  
  let cyclePhase: "上升期" | "高峰期" | "下降期" | "低谷期";
  if (last7Avg > avgIntensity + 1) {
    cyclePhase = "高峰期";
  } else if (last7Avg < avgIntensity - 1) {
    cyclePhase = "低谷期";
  } else if (trendDirection === "up") {
    cyclePhase = "上升期";
  } else {
    cyclePhase = "下降期";
  }
  
  // 生成月度趋势
  const weeklyTrend: { week: number; avgIntensity: number }[] = [];
  for (let week = 0; week < 4; week++) {
    const weekEntries = entries.slice(-(week + 1) * 7, week === 0 ? undefined : -week * 7);
    if (weekEntries && weekEntries.length > 0) {
      const avg = weekEntries.reduce((sum, e) => sum + e.intensity, 0) / weekEntries.length;
      weeklyTrend.unshift({ week: 4 - week, avgIntensity: avg });
    }
  }
  
  // 生成洞察
  const insights: string[] = [];
  
  if (peakDay === lowDay) {
    insights.push("你的情绪在一周内相对稳定，这是内心平静的体现");
  } else {
    insights.push(`你的情绪在${peakDay}最高，${lowDay}较低，可以据此安排活动`);
  }
  
  if (trendDirection === "up") {
    insights.push("近期情绪呈上升趋势，继续保持积极心态");
  } else if (trendDirection === "down") {
    insights.push("近期情绪有所波动，注意自我关怀和休息");
  } else {
    insights.push("情绪状态稳定，这是心理健康的良好信号");
  }
  
  const positiveEmotions = ["joy", "peace", "excitement", "love", "gratitude", "hope"];
  const positiveCount = entries.filter(e => positiveEmotions.includes(e.emotion)).length;
  const positiveRatio = (positiveCount / entries.length) * 100;
  
  if (positiveRatio > 60) {
    insights.push(`正面情绪占比${positiveRatio.toFixed(0)}%，你的心理状态很积极`);
  } else if (positiveRatio < 40) {
    insights.push("正面情绪较少，建议尝试感恩练习或冥想");
  }
  
  // 预测下一个高峰
  const daysUntilWeekend = (7 - new Date().getDay()) % 7;
  const nextPeakPrediction = peakDay === "周六" || peakDay === "周日"
    ? `预计${daysUntilWeekend === 0 ? "本周" : daysUntilWeekend + "天后"}的${peakDay}情绪会更好`
    : `工作日中${peakDay}可能是你的"高光时刻"`;
  
  return {
    averageIntensity: Math.round(avgIntensity * 10) / 10,
    peakDay,
    lowDay,
    trendDirection,
    cyclePhase,
    weeklyPattern,
    monthlyTrend: weeklyTrend,
    insights,
    nextPeakPrediction,
  };
}

export default function EmotionCyclePage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [analysis, setAnalysis] = useState<CycleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIntensity, setNewIntensity] = useState(5);
  const [newNote, setNewNote] = useState("");

  // 加载数据
  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      const mockData = generateMockData();
      setEntries(mockData);
      setAnalysis(analyzeCycle(mockData));
      setIsLoading(false);
    }, 500);
  }, []);

  // 添加新情绪
  const handleAddEmotion = () => {
    if (!selectedEmotion) return;
    
    const newEntry: EmotionEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      emotion: selectedEmotion,
      intensity: newIntensity,
      note: newNote || undefined,
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setAnalysis(analyzeCycle(updatedEntries));
    setShowAddModal(false);
    setSelectedEmotion(null);
    setNewIntensity(5);
    setNewNote("");
  };

  // 获取趋势图标
  const getTrendIcon = (direction: "up" | "down" | "stable") => {
    switch (direction) {
      case "up": return "📈";
      case "down": return "📉";
      case "stable": return "➡️";
    }
  };

  // 获取周期阶段颜色
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "高峰期": return "from-yellow-400 to-orange-500";
      case "上升期": return "from-green-400 to-emerald-500";
      case "低谷期": return "from-blue-400 to-indigo-500";
      case "下降期": return "from-purple-400 to-violet-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🔄
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-6"
      >
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
          ← 返回首页
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              情绪周期追踪器
            </h1>
            <p className="text-gray-600 mt-1">了解你的情绪节奏，把握生活节奏</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg"
          >
            + 记录情绪
          </motion.button>
        </div>
      </motion.div>

      {/* 当前状态卡片 */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getTrendIcon(analysis.trendDirection)}</span>
                <div>
                  <div className="text-sm text-gray-500">当前周期阶段</div>
                  <div className={`text-xl font-bold bg-gradient-to-r ${getPhaseColor(analysis.cyclePhase)} bg-clip-text text-transparent`}>
                    {analysis.cyclePhase}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">情绪指数</div>
                <div className="text-3xl font-bold text-indigo-600">{analysis.averageIntensity}/10</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">最佳日子</div>
                <div className="font-bold text-green-600">{analysis.peakDay}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">低谷日子</div>
                <div className="font-bold text-blue-600">{analysis.lowDay}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">记录天数</div>
                <div className="font-bold text-purple-600">{entries.length}天</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">趋势</div>
                <div className="font-bold text-orange-600">
                  {analysis.trendDirection === "up" ? "上升 ↑" : 
                   analysis.trendDirection === "down" ? "下降 ↓" : "稳定 →"}
                </div>
              </div>
            </div>
            
            {/* 预测 */}
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span>🔮</span>
                <span className="font-medium text-indigo-700">预测</span>
              </div>
              <p className="text-gray-600">{analysis.nextPeakPrediction}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 周度模式 */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📅 一周情绪模式</h2>
            <div className="flex items-end justify-between h-48 px-2">
              {analysis.weeklyPattern.map((item, index) => {
                const height = (item.avgIntensity / 10) * 100;
                const isHighest = item.day === analysis.peakDay;
                const isLowest = item.day === analysis.lowDay;
                
                return (
                  <motion.div
                    key={item.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`flex flex-col items-center justify-end w-10 ${
                      isHighest ? "bg-gradient-to-t from-green-400 to-green-300" :
                      isLowest ? "bg-gradient-to-t from-blue-400 to-blue-300" :
                      "bg-gradient-to-t from-indigo-400 to-indigo-200"
                    } rounded-t-lg relative`}
                  >
                    <span className="absolute -top-6 text-xs font-medium">
                      {item.avgIntensity.toFixed(1)}
                    </span>
                    <span className="absolute -bottom-6 text-xs text-gray-500">
                      {item.day}
                    </span>
                    {isHighest && <span className="absolute -top-10 text-lg">👑</span>}
                    {isLowest && <span className="absolute -top-10 text-lg">💧</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* 洞察卡片 */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💡 情绪洞察</h2>
            <div className="space-y-3">
              {analysis.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
                >
                  <span className="text-xl">✨</span>
                  <span className="text-gray-700">{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 最近记录 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 最近记录</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.slice(-10).reverse().map((entry, index) => {
              const emotion = EMOTIONS.find(e => e.value === entry.emotion);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emotion?.emoji || "😐"}</span>
                    <div>
                      <div className="font-medium text-gray-800">{emotion?.label || entry.emotion}</div>
                      <div className="text-xs text-gray-500">{entry.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 mx-0.5 rounded-full ${
                            i < entry.intensity ? "bg-indigo-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-indigo-600">{entry.intensity}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 添加情绪模态框 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">记录此刻情绪</h3>
              
              {/* 情绪选择 */}
              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-2 block">选择情绪</label>
                <div className="grid grid-cols-4 gap-2">
                  {EMOTIONS.map(emotion => (
                    <motion.button
                      key={emotion.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion(emotion.value)}
                      className={`p-2 rounded-xl text-center ${
                        selectedEmotion === emotion.value
                          ? emotion.color + " ring-2 ring-indigo-400"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="text-2xl">{emotion.emoji}</div>
                      <div className="text-xs">{emotion.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* 强度选择 */}
              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-2 block">
                  强度: {newIntensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newIntensity}
                  onChange={e => setNewIntensity(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>很轻微</span>
                  <span>非常强烈</span>
                </div>
              </div>
              
              {/* 备注 */}
              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-2 block">备注（可选）</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="今天发生了什么..."
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              
              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={handleAddEmotion}
                  disabled={!selectedEmotion}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg disabled:opacity-50"
                >
                  记录
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}