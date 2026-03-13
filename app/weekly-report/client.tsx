'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  summary: {
    totalDiaries: number;
    totalWords: number;
    totalReadingTime: number;
    avgWordsPerDay: number;
  };
  moodDistribution: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  bestDiaries: Array<{ id: number; title: string; likes: number; wordCount: number }>;
  writingTimeSlots: Array<{ hour: number; count: number }>;
  comparison: {
    diariesChange: number;
    wordsChange: number;
    moodTrend: 'up' | 'down' | 'stable';
  };
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  excited: '🎉',
  calm: '😌',
  productive: '💪',
  sad: '😢',
  anxious: '😰',
  tired: '😴',
  grateful: '🙏',
  accomplished: '🏆',
  creative: '🎨',
};

const moodLabels: Record<string, string> = {
  happy: '开心',
  excited: '兴奋',
  calm: '平静',
  productive: '高效',
  sad: '难过',
  anxious: '焦虑',
  tired: '疲惫',
  grateful: '感恩',
  accomplished: '成就感',
  creative: '创意',
};

export default function WeeklyReportClient() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/weekly-report');
      const data = await res.json();
      setReport(data);
    } catch (_error) {
      console.error('Failed to fetch report:', _error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">正在生成周报...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">本周还没有日记数据</p>
          <Link
            href="/write"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            开始写日记
          </Link>
        </div>
      </div>
    );
  }

  const totalMoods = Object.values(report.moodDistribution).reduce((a, b) => a + b, 0);
  const topMood = Object.entries(report.moodDistribution).sort((a, b) => b[1] - a[1])[0];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* 周期信息 */}
      <div className="text-center mb-8">
        <h2 className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {new Date(report.weekStart).toLocaleDateString('zh-CN')} ~ {new Date(report.weekEnd).toLocaleDateString('zh-CN')}
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm">
          {report.comparison.moodTrend === 'up' && (
            <span className="text-green-600 dark:text-green-400">📈 心情趋势向好</span>
          )}
          {report.comparison.moodTrend === 'down' && (
            <span className="text-orange-600 dark:text-orange-400">📉 心情有所波动</span>
          )}
          {report.comparison.moodTrend === 'stable' && (
            <span className="text-blue-600 dark:text-blue-400">➡️ 心情平稳</span>
          )}
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-purple-100 dark:border-purple-800">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{report.summary.totalDiaries}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">篇日记</div>
          <div className={`text-xs mt-1 ${report.comparison.diariesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {report.comparison.diariesChange >= 0 ? '↑' : '↓'} {Math.abs(report.comparison.diariesChange)} 篇较上周
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800">
          <div className="text-3xl mb-2">✍️</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{report.summary.totalWords.toLocaleString()}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">字</div>
          <div className={`text-xs mt-1 ${report.comparison.wordsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {report.comparison.wordsChange >= 0 ? '↑' : '↓'} {Math.abs(report.comparison.wordsChange)} 字较上周
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-green-100 dark:border-green-800">
          <div className="text-3xl mb-2">📖</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{report.summary.totalReadingTime}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">分钟阅读</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-orange-100 dark:border-orange-800">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{report.summary.avgWordsPerDay}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">日均字数</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* 心情分布 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🎭</span> 心情分布
          </h3>
          <div className="space-y-3">
            {Object.entries(report.moodDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmojis[mood] || '😐'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{moodLabels[mood] || mood}</span>
                      <span className="text-gray-500 dark:text-gray-400">{count} 次</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / totalMoods) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {topMood && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">本周主心情：</span>
              <span className="text-lg ml-2">
                {moodEmojis[topMood[0]]} {moodLabels[topMood[0]]}
              </span>
            </div>
          )}
        </div>

        {/* 热门标签 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🏷️</span> 热门话题
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.topTags.map(({ tag, count }) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
              >
                #{tag} <span className="text-xs opacity-70">({count})</span>
              </span>
            ))}
          </div>
          {report.topTags.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-4">暂无标签数据</p>
          )}
        </div>
      </div>

      {/* 写作时段分析 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>⏰</span> 写作时段分析
        </h3>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 24 }, (_, hour) => {
            const slot = report.writingTimeSlots.find(s => s.hour === hour);
            const count = slot?.count || 0;
            const maxCount = Math.max(...report.writingTimeSlots.map(s => s.count), 1);
            const intensity = count / maxCount;
            return (
              <div key={hour} className="text-center">
                <div
                  className={`h-16 rounded transition-all duration-300 ${
                    count > 0
                      ? `bg-gradient-to-t from-purple-500 to-pink-500`
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  style={{ opacity: count > 0 ? 0.3 + intensity * 0.7 : 1 }}
                  title={`${hour}:00 - ${count} 篇日记`}
                />
                <div className="text-xs text-gray-400 mt-1">{hour}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          颜色越深表示该时段写作越多
        </div>
      </div>

      {/* 本周精选 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>⭐</span> 本周精选
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {report.bestDiaries.map((diary, index) => (
            <Link
              key={diary.id}
              href={`/diary/${diary.id}`}
              className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl font-bold text-purple-300 dark:text-purple-600">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                    {diary.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>❤️ {diary.likes}</span>
                    <span>📝 {diary.wordCount} 字</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {report.bestDiaries.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-4">暂无精选日记</p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => {
            setLoading(true);
            fetch('/api/weekly-report/generate', { method: 'POST' }).then(() => fetchReport());
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
        >
          🔄 刷新周报
        </button>
        <button
          onClick={() => {
            // 导出周报
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `weekly-report-${report.weekStart}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          📥 导出报告
        </button>
      </div>
    </main>
  );
}