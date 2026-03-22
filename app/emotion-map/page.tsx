"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}

// 情绪映射配置
const EMOTION_CONFIG: Record<string, { color: string; bg: string; emoji: string; label: string }> = {
  happy: { color: "#fbbf24", bg: "bg-yellow-400", emoji: "😊", label: "开心" },
  excited: { color: "#f97316", bg: "bg-orange-500", emoji: "🤩", label: "兴奋" },
  calm: { color: "#22c55e", bg: "bg-green-500", emoji: "😌", label: "平静" },
  love: { color: "#ec4899", bg: "bg-pink-500", emoji: "🥰", label: "幸福" },
  sad: { color: "#3b82f6", bg: "bg-blue-500", emoji: "😢", label: "悲伤" },
  angry: { color: "#ef4444", bg: "bg-red-500", emoji: "😤", label: "愤怒" },
  anxious: { color: "#8b5cf6", bg: "bg-purple-500", emoji: "😰", label: "焦虑" },
  tired: { color: "#6b7280", bg: "bg-gray-500", emoji: "😴", label: "疲惫" },
  neutral: { color: "#a3a3a3", bg: "bg-neutral-400", emoji: "😐", label: "一般" },
};

// 根据内容分析情绪
function analyzeEmotion(content: string, tags?: string[]): string {
  const text = content.toLowerCase();
  
  // 情绪关键词映射
  const emotionKeywords: Record<string, string[]> = {
    happy: ["开心", "高兴", "快乐", "幸福", "棒", "好", "谢谢", "感谢", "美好", "喜欢", "哈哈", "嘻嘻", "happy", "glad", "joy"],
    excited: ["兴奋", "激动", "期待", "太棒了", "太好了", "超级", "无比", "终于", "exci", "wow", "amazing"],
    calm: ["平静", "安静", "放松", "舒适", "宁静", "安详", "惬意", "calm", "peace", "relax"],
    love: ["爱", "喜欢", "温暖", "甜蜜", "感动", "浪漫", "心", "宝贝", "亲爱", "love", "sweet"],
    sad: ["难过", "伤心", "悲伤", "失落", "遗憾", "想念", "思念", "孤独", "sad", "miss", "sorry"],
    angry: ["生气", "愤怒", "烦", "讨厌", "无语", "气愤", "恼火", "angry", "hate", "damn"],
    anxious: ["焦虑", "担心", "紧张", "害怕", "不安", "压力", "焦虑", "anxious", "worry", "stress"],
    tired: ["累", "疲惫", "困", "倦", "乏力", "没劲", "撑", "tired", "exhaust"],
  };
  
  // 计算每种情绪的分数
  const scores: Record<string, number> = {};
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    scores[emotion] = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, "gi");
      const matches = text.match(regex);
      if (matches) {
        scores[emotion] += matches.length;
      }
    }
  }
  
  // 检查标签中的情绪
  if (tags && tags.length > 0) {
    const tagText = tags.join(" ").toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (tagText.includes(keyword)) {
          scores[emotion] = (scores[emotion] || 0) + 2;
        }
      }
    }
  }
  
  // 找出最高分情绪
  let maxEmotion = "neutral";
  let maxScore = 0;
  
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  }
  
  return maxScore > 0 ? maxEmotion : "neutral";
}

// 生成年度日历数据
function generateYearCalendar(year: number, diaries: DiaryEntry[]) {
  const months: { month: number; days: { date: Date; emotion: string | null; diary: DiaryEntry | null }[] }[] = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { date: Date; emotion: string | null; diary: DiaryEntry | null }[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const diary = diaries.find((d) => d.date === dateStr);
      
      days.push({
        date,
        emotion: diary ? analyzeEmotion(diary.content, diary.tags) : null,
        diary: diary || null,
      });
    }
    
    months.push({ month: month + 1, days });
  }
  
  return months;
}

// 统计情绪分布
function calculateEmotionStats(diaries: DiaryEntry[]): { emotion: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};
  let total = 0;
  
  for (const diary of diaries) {
    const emotion = analyzeEmotion(diary.content, diary.tags);
    counts[emotion] = (counts[emotion] || 0) + 1;
    total++;
  }
  
  const stats = Object.entries(counts)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
  
  return stats;
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTH_NAMES = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

export default function EmotionMapPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDiaries();
  }, []);
  
  const fetchDiaries = async () => {
    try {
      const res = await fetch("/api/diaries");
      const data = await res.json();
      setDiaries(data);
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const yearCalendar = generateYearCalendar(selectedYear, diaries);
  const emotionStats = calculateEmotionStats(diaries.filter((d) => d.date.startsWith(String(selectedYear))));
  const totalDays = diaries.filter((d) => d.date.startsWith(String(selectedYear))).length;
  
  // 找出主导情绪
  const dominantEmotion = emotionStats[0]?.emotion || "neutral";
  const dominantConfig = EMOTION_CONFIG[dominantEmotion];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-violet-300/30 rounded-full blur-3xl" />
      </div>
      
      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 text-sm text-purple-600 hover:text-purple-700">
            ← 返回首页
          </Link>
          
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            日记情绪地图
          </h1>
          <p className="text-gray-500">
            可视化你的年度情绪旅程，发现内心的节奏与模式
          </p>
        </div>
        
        {/* 年份选择与统计概览 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedYear(selectedYear - 1)}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <span className="text-2xl font-bold text-gray-800 min-w-[80px] text-center">
                {selectedYear}
              </span>
              <button
                onClick={() => setSelectedYear(selectedYear + 1)}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">共</span>
                <span className="text-2xl font-bold text-purple-600">{totalDays}</span>
                <span className="text-gray-500">篇日记</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">主导情绪:</span>
                <span className="text-lg">{dominantConfig.emoji}</span>
                <span className="font-medium text-gray-700">{dominantConfig.label}</span>
              </div>
            </div>
          </div>
          
          {/* 情绪图例 */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(EMOTION_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1 text-sm">
                <span>{config.emoji}</span>
                <span className="text-gray-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">🔄</div>
            <div>加载中...</div>
          </div>
        ) : (
          <>
            {/* 年度热力图 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-white/50">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📊</span>
                <span>年度情绪热力图</span>
              </h2>
              
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* 星期标题 */}
                  <div className="flex mb-1 pl-12">
                    {WEEKDAYS.map((day) => (
                      <div key={day} className="w-4 text-xs text-gray-400 text-center mr-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* 月份网格 */}
                  <div className="space-y-1">
                    {yearCalendar.map(({ month, days }) => {
                      // 按周分组
                      const weeks: (typeof days)[] = [];
                      let currentWeek: typeof days = [];
                      
                      // 填充月初空白
                      const firstDay = days[0]?.date.getDay() || 0;
                      for (let i = 0; i < firstDay; i++) {
                        currentWeek.push({ date: new Date(), emotion: null, diary: null });
                      }
                      
                      days.forEach((day, index) => {
                        currentWeek.push(day);
                        if (currentWeek.length === 7) {
                          weeks.push(currentWeek);
                          currentWeek = [];
                        }
                      });
                      
                      // 填充月末空白
                      if (currentWeek.length > 0) {
                        while (currentWeek.length < 7) {
                          currentWeek.push({ date: new Date(), emotion: null, diary: null });
                        }
                        weeks.push(currentWeek);
                      }
                      
                      return (
                        <div key={month} className="flex items-center gap-2">
                          <div className="w-10 text-xs text-gray-500 font-medium">
                            {month}月
                          </div>
                          <div className="flex gap-1">
                            {weeks.flat().map((day, dayIndex) => {
                              const config = day.emotion ? EMOTION_CONFIG[day.emotion] : null;
                              
                              return (
                                <div
                                  key={dayIndex}
                                  className={`w-4 h-4 rounded-sm cursor-pointer transition-all hover:scale-150 hover:z-10 ${
                                    day.diary
                                      ? "hover:ring-2 hover:ring-purple-400"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor: config?.color || "#f3f4f6",
                                    opacity: day.diary ? 1 : 0.3,
                                  }}
                                  title={
                                    day.diary
                                      ? `${day.date.toLocaleDateString()} - ${config?.label || "无情绪"}\n${day.diary.title}`
                                      : ""
                                  }
                                  onClick={() => day.diary && setSelectedDiary(day.diary)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 text-center">
                点击色块查看日记详情 · 颜色越深代表情绪越强烈
              </div>
            </div>
            
            {/* 情绪统计 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 情绪分布 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎭</span>
                  <span>情绪分布</span>
                </h3>
                
                <div className="space-y-3">
                  {emotionStats.slice(0, 6).map(({ emotion, count, percentage }) => {
                    const config = EMOTION_CONFIG[emotion];
                    return (
                      <div key={emotion} className="flex items-center gap-3">
                        <span className="text-lg w-8">{config.emoji}</span>
                        <span className="text-sm text-gray-600 w-12">{config.label}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: config.color,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-16 text-right">
                          {count}篇 ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 情绪洞察 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💡</span>
                  <span>情绪洞察</span>
                </h3>
                
                <div className="space-y-4">
                  {emotionStats.length > 0 ? (
                    <>
                      {/* 主导情绪 */}
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="text-sm text-gray-500 mb-1">你的主导情绪</div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{dominantConfig.emoji}</span>
                          <div>
                            <div className="font-bold text-gray-800">{dominantConfig.label}</div>
                            <div className="text-xs text-gray-500">
                              占全年日记的 {emotionStats[0]?.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 写作建议 */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="text-sm text-gray-500 mb-1">写作建议</div>
                        <div className="text-sm text-gray-700">
                          {dominantEmotion === "happy" || dominantEmotion === "excited" || dominantEmotion === "love"
                            ? "你的日记充满正能量！继续记录这些美好时刻，它们是你宝贵的回忆财富 ✨"
                            : dominantEmotion === "sad" || dominantEmotion === "anxious"
                            ? "发现你最近记录了较多低落情绪。试试在日记中加入一件今天感恩的小事，它会让你的心情慢慢变好 🌱"
                            : dominantEmotion === "calm"
                            ? "你的内心很平静，这是一种难得的状态。可以尝试记录更多细节，让平静的时光更加鲜活 🍃"
                            : "保持写作的习惯！每一篇日记都是与自己的对话，坚持下去会有意想不到的收获 📝"}
                        </div>
                      </div>
                      
                      {/* 探索更多 */}
                      <Link
                        href="/emotion-mirror"
                        className="block p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:from-violet-100 hover:to-purple-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500">想要更深入的情绪分析？</div>
                            <div className="font-medium text-purple-700">试试 AI 情绪镜子 →</div>
                          </div>
                          <span className="text-2xl">🪞</span>
                        </div>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📝</div>
                      <div>写更多日记来解锁情绪洞察</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 最近日记 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📖</span>
                <span>最近日记</span>
              </h3>
              
              {diaries.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {diaries.slice(0, 6).map((diary) => {
                    const emotion = analyzeEmotion(diary.content, diary.tags);
                    const config = EMOTION_CONFIG[emotion];
                    
                    return (
                      <Link
                        key={diary.id}
                        href={`/diary/${diary.id}`}
                        className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{config.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {diary.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {diary.date} · {config.label}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">📭</div>
                  <div>还没有日记</div>
                  <Link
                    href="/write"
                    className="inline-block mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    开始写第一篇日记
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* 选中日记弹窗 */}
        {selectedDiary && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDiary(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">{selectedDiary.date}</div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedDiary.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedDiary(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{EMOTION_CONFIG[analyzeEmotion(selectedDiary.content, selectedDiary.tags)].emoji}</span>
                <span className="text-gray-600">
                  {EMOTION_CONFIG[analyzeEmotion(selectedDiary.content, selectedDiary.tags)].label}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                {selectedDiary.content.substring(0, 200)}...
              </p>
              
              <Link
                href={`/diary/${selectedDiary.id}`}
                className="block w-full py-2 bg-purple-500 text-white text-center rounded-lg hover:bg-purple-600 transition-colors"
              >
                查看完整日记
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}