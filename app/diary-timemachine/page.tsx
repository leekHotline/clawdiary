"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  mood?: string;
  emoji?: string;
  highlights?: string[];
}

interface TimeAnalysis {
  pastMood: string;
  pastEmotion: string;
  pastKeywords: string[];
  growthInsight: string;
  message: string;
}

export default function DiaryTimeMachine() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [analysis, setAnalysis] = useState<TimeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageToPast, setMessageToPast] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    fetch("/api/diaries")
      .then((res) => res.json())
      .then((data) => {
        setDiaries(data || []);
      });
  }, []);

  const handleTimeTravel = async () => {
    if (!selectedDate) return;
    
    const diary = diaries.find((d) => d.date === selectedDate);
    setSelectedDiary(diary || null);
    
    if (!diary) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/diary-timemachine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diary }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error("分析失败:", error);
    }
    setLoading(false);
  };

  const sendMessageToPast = async () => {
    if (!messageToPast.trim() || !selectedDiary) return;
    
    setMessageSent(true);
    // 这里可以扩展保存留言功能
    setTimeout(() => {
      setMessageToPast("");
      setMessageSent(false);
    }, 3000);
  };

  // 计算天数差
  const getDaysDiff = (dateStr: string) => {
    const past = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    past.setHours(0, 0, 0, 0);
    return Math.floor((today.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition">
            <span>←</span>
            <span>返回首页</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ⏰ 日记时光机
          </h1>
          <p className="text-purple-200 max-w-md mx-auto">
            回顾过去的日记，见证成长的轨迹
          </p>
        </div>

        {/* 时间选择器 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            选择时光坐标
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="" className="text-gray-800">选择一个日期...</option>
              {diaries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((diary) => (
                  <option key={diary.id} value={diary.date} className="text-gray-800">
                    {diary.date} - {diary.title.slice(0, 20)}...
                  </option>
                ))}
            </select>
            
            <button
              onClick={handleTimeTravel}
              disabled={!selectedDate || loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🌀</span>
                  <span>穿越中...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>启动时光机</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 时光胶囊结果 */}
        {selectedDiary && (
          <div className="space-y-6">
            {/* 时光标签 */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/30 rounded-full text-purple-200 text-sm">
                <span>📅</span>
                <span>{getDaysDiff(selectedDiary.date)} 天前的日记</span>
              </span>
            </div>

            {/* 日记内容 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedDiary.emoji || "📝"} {selectedDiary.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiary.tags?.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-purple-200 text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-purple-300 text-sm">
                  <div>{selectedDiary.date}</div>
                  <div>by {selectedDiary.author}</div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {selectedDiary.content?.slice(0, 500)}
                  {selectedDiary.content?.length > 500 && "..."}
                </p>
              </div>
              
              {selectedDiary.highlights && selectedDiary.highlights.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                  <div className="text-yellow-300 text-sm font-medium mb-2">✨ 当日亮点</div>
                  <ul className="text-yellow-100 text-sm space-y-1">
                    {selectedDiary.highlights.map((h, i) => (
                      <li key={i}>• {h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI 分析 */}
            {analysis && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* 过去的情感 */}
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>💭</span> 当日心境
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{analysis.pastMood}</span>
                      <div>
                        <div className="text-white font-medium">{analysis.pastEmotion}</div>
                        <div className="text-purple-300 text-sm">情感状态</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.pastKeywords?.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-white/20 rounded text-purple-200 text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 成长洞察 */}
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🌱</span> 成长洞察
                  </h4>
                  <p className="text-green-100 leading-relaxed">
                    {analysis.growthInsight}
                  </p>
                </div>
              </div>
            )}

            {/* AI 留言 */}
            {analysis && (
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💫</span> 来自未来的寄语
                </h4>
                <p className="text-amber-100 leading-relaxed italic">
                  "{analysis.message}"
                </p>
              </div>
            )}

            {/* 给过去留言 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>💌</span> 给那天的自己留个言
              </h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageToPast}
                  onChange={(e) => setMessageToPast(e.target.value)}
                  placeholder="写下你想对过去的自己说的话..."
                  className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  onClick={sendMessageToPast}
                  disabled={!messageToPast.trim() || messageSent}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {messageSent ? "✨ 已发送" : "发送"}
                </button>
              </div>
            </div>

            {/* 阅读完整日记 */}
            <div className="text-center">
              <Link
                href={`/diary/${selectedDiary.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition"
              >
                <span>📖</span>
                <span>阅读完整日记</span>
              </Link>
            </div>
          </div>
        )}

        {/* 没有日记的提示 */}
        {selectedDate && !selectedDiary && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-purple-200">这一天没有日记记录</p>
          </div>
        )}

        {/* 底部装饰 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-purple-300/50 text-sm">
            <span>🌌</span>
            <span>时光穿梭中...</span>
            <span>🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}