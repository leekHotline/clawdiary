"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TodayData {
  date: string;
  weekday: string;
  dayProgress: number;
  diaryWritten: boolean;
  diaryCount: number;
  currentMood: string | null;
  tasksCompleted: number;
  tasksTotal: number;
  streak: number;
  inspiration: string;
  weather: { temp: number; condition: string };
  recentTags: string[];
}

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const moodEmojis: Record<string, { emoji: string; color: string; bg: string }> = {
  happy: { emoji: '😊', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  sad: { emoji: '😢', color: 'text-blue-600', bg: 'bg-blue-100' },
  calm: { emoji: '😌', color: 'text-green-600', bg: 'bg-green-100' },
  excited: { emoji: '🎉', color: 'text-pink-600', bg: 'bg-pink-100' },
  anxious: { emoji: '😰', color: 'text-purple-600', bg: 'bg-purple-100' },
  grateful: { emoji: '🙏', color: 'text-amber-600', bg: 'bg-amber-100' },
  tired: { emoji: '😴', color: 'text-gray-600', bg: 'bg-gray-100' },
};

const inspirations = [
  "今天有什么让你微笑的小事？",
  "如果用一个词形容今天，会是什么？",
  "今天学到了什么新东西？",
  "最近有什么让你感恩的事？",
  "如果明天是全新的一天，你最想做什么？",
  "今天有没有哪个瞬间让你觉得时间静止了？",
  "最近在思考什么问题？",
  "有什么想对自己说的话吗？",
];

export default function TodayPage() {
  const [data, setData] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const now = new Date();
      setData({
        date: now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
        weekday: weekdays[now.getDay()],
        dayProgress: Math.round((now.getHours() / 24) * 100),
        diaryWritten: Math.random() > 0.5,
        diaryCount: 23,
        currentMood: ['happy', 'calm', 'excited', 'grateful'][Math.floor(Math.random() * 4)],
        tasksCompleted: Math.floor(Math.random() * 3) + 1,
        tasksTotal: 3,
        streak: Math.floor(Math.random() * 10) + 1,
        inspiration: inspirations[Math.floor(Math.random() * inspirations.length)],
        weather: { temp: 22, condition: '晴' },
        recentTags: ['AI', '成长', '学习', '生活'],
      });
      setLoading(false);
    }, 500);

    // 更新时间
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🦞</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const moodInfo = data?.currentMood ? moodEmojis[data.currentMood] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">🦞</Link>
          <div className="flex items-center gap-3">
            <Link href="/settings" className="p-2 rounded-lg hover:bg-white/50 transition-colors">⚙️</Link>
          </div>
        </div>

        {/* Hero 问候 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-orange-600 mb-4">
            <span>🌅</span>
            <span>今日概览</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            {currentTime.getHours() < 12 ? '早上好' : currentTime.getHours() < 18 ? '下午好' : '晚上好'} 👋
          </h1>
          
          <p className="text-lg text-gray-500">
            {data?.date} · {data?.weekday}
          </p>
          
          {/* 时间 */}
          <div className="mt-4 text-3xl font-mono text-gray-400">
            {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* 日进度条 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">今日进度</span>
            <span className="text-sm font-medium text-orange-600">{data?.dayProgress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${data?.dayProgress}%` }}
            />
          </div>
        </div>

        {/* 核心卡片 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* 日记状态 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">📝 今日日记</h2>
              {data?.diaryWritten ? (
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">已完成</span>
              ) : (
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">待写</span>
              )}
            </div>
            
            {data?.diaryWritten ? (
              <div className="text-gray-500">
                <p>今天已经写了一篇日记 🎉</p>
                <p className="text-sm mt-2">累计 <strong className="text-orange-600">{data.diaryCount}</strong> 篇</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">还没有写今天的日记，现在开始？</p>
                <Link
                  href="/chat-diary"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <span>✍️</span>
                  <span>开始写作</span>
                </Link>
              </div>
            )}
          </div>

          {/* 心情状态 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">😊 今日心情</h2>
            
            {moodInfo ? (
              <div className="flex items-center gap-4">
                <div className={`text-5xl p-4 ${moodInfo.bg} rounded-2xl`}>
                  {moodInfo.emoji}
                </div>
                <div>
                  <p className={`text-xl font-semibold ${moodInfo.color}`}>
                    {data?.currentMood === 'happy' ? '开心' : 
                     data?.currentMood === 'calm' ? '平静' :
                     data?.currentMood === 'excited' ? '兴奋' : '感恩'}
                  </p>
                  <p className="text-sm text-gray-400">点击更换心情</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">还没有记录今天的心情</p>
                <Link
                  href="/mood"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <span>🎭</span>
                  <span>记录心情</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 连续打卡 + 任务 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* 连续打卡 */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="text-sm opacity-80 mb-1">连续打卡</div>
            <div className="text-4xl font-bold">{data?.streak} 天</div>
            <div className="text-sm opacity-80 mt-2">🔥 继续保持！</div>
          </div>

          {/* 今日任务 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <div className="text-sm text-gray-500 mb-1">今日任务</div>
            <div className="text-2xl font-bold text-gray-800">
              {data?.tasksCompleted}/{data?.tasksTotal}
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{ width: `${((data?.tasksCompleted || 0) / (data?.tasksTotal || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* 天气 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <div className="text-sm text-gray-500 mb-1">天气</div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">☀️</span>
              <div>
                <div className="text-2xl font-bold text-gray-800">{data?.weather.temp}°</div>
                <div className="text-sm text-gray-400">{data?.weather.condition}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 今日灵感 */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 rounded-2xl p-6 mb-6 border border-white/50">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">今日灵感</h3>
              <p className="text-gray-600 italic">"{data?.inspiration}"</p>
              <Link href="/inspiration-generator" className="text-purple-600 text-sm mt-2 inline-block hover:underline">
                获取更多灵感 →
              </Link>
            </div>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ 快捷入口</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { emoji: '💬', name: 'AI对话', href: '/chat-diary', color: 'from-blue-500 to-indigo-600' },
              { emoji: '📊', name: '统计', href: '/stats', color: 'from-purple-500 to-pink-600' },
              { emoji: '🎯', name: '挑战', href: '/challenges', color: 'from-green-500 to-emerald-600' },
              { emoji: '🏆', name: '成就', href: '/achievements', color: 'from-amber-500 to-orange-600' },
              { emoji: '😊', name: '心情', href: '/mood', color: 'from-pink-500 to-rose-600' },
              { emoji: '📅', name: '日历', href: '/calendar', color: 'from-cyan-500 to-blue-600' },
              { emoji: '🏷️', name: '标签', href: '/tags', color: 'from-violet-500 to-purple-600' },
              { emoji: '⚙️', name: '设置', href: '/settings', color: 'from-gray-500 to-slate-600' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 hover:shadow-md transition-all group"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-xs text-gray-600 group-hover:text-gray-800">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近标签 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-4">🏷️ 最近标签</h3>
          <div className="flex flex-wrap gap-2">
            {data?.recentTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            <Link
              href="/tags"
              className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              查看全部 →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          {!data?.diaryWritten && (
            <Link
              href="/chat-diary"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-2xl">🦞</span>
              <span>开始今天的日记</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}