'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MoodTrend {
  date: string;
  score: number;
  mood: string;
}

interface EmotionCount {
  emotion: string;
  count: number;
  percentage: number;
}

interface Correlation {
  factor1: string;
  factor2: string;
  correlation: number;
  note: string;
}

interface MentalHealthReport {
  period: string;
  generatedAt: string;
  summary: {
    totalDiaries: number;
    totalWords: number;
    averageWordsPerDiary: number;
    daysTracked: number;
    consistency: number;
  };
  moodAnalysis: {
    counts: Record<string, number>;
    dominantMood: string;
    moodDiversity: number;
  };
  moodTrend: MoodTrend[];
  sentimentAnalysis: {
    overall: number;
    positive: number;
    neutral: number;
    negative: number;
    topEmotions: EmotionCount[];
  };
  streaks: {
    currentWritingStreak: number;
    longestWritingStreak: number;
    moodTrackingStreak: number;
    positiveDaysThisMonth: number;
  };
  correlations: Correlation[];
  riskFactors: { factor: string; level: string; description: string }[];
  recommendations: string[];
}

export default function MentalHealthReportPage() {
  const [report, setReport] = useState<MentalHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchReport();
  }, [period]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mental-health/report?period=${period}`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
      anxious: '😰',
      sad: '😢',
      angry: '😠',
      tired: '😴',
      productive: '💪',
      grateful: '🙏',
    };
    return moodEmojis[mood] || '📝';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-teal-600 hover:underline mb-2 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                🧠 心理健康报告
              </h1>
              <p className="text-gray-600">基于日记内容的心理健康分析与洞察</p>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    period === p
                      ? 'bg-teal-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p === 'week' ? '本周' : p === 'month' ? '本月' : '本年'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {report && (
          <div className="space-y-6">
            {/* 概览卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-2xl font-bold text-teal-600">{report.summary.totalDiaries}</div>
                <div className="text-sm text-gray-500">日记总数</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-2xl font-bold text-blue-600">{report.summary.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-500">总字数</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-orange-600">{report.streaks.currentWritingStreak}</div>
                <div className="text-sm text-gray-500">连续记录</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">😊</div>
                <div className="text-2xl font-bold text-green-600">{report.streaks.positiveDaysThisMonth}</div>
                <div className="text-sm text-gray-500">积极天数</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-2xl font-bold text-cyan-600">{report.summary.consistency}%</div>
                <div className="text-sm text-gray-500">记录一致性</div>
              </div>
            </div>

            {/* 情绪分析 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-medium text-gray-700 mb-4">😊 情绪分布</h2>
                <div className="space-y-3">
                  {report.sentimentAnalysis.topEmotions.map((emotion, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-16 text-sm text-gray-600">{emotion.emotion}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                          style={{ width: `${emotion.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {emotion.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">主导情绪</span>
                    <span className="text-lg font-medium text-teal-600">
                      {getMoodEmoji(report.moodAnalysis.dominantMood)} {report.moodAnalysis.dominantMood}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-medium text-gray-700 mb-4">📊 心情趋势</h2>
                <div className="h-40 flex items-end gap-1">
                  {report.moodTrend.map((day, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div
                        className={`w-full rounded-t transition-all ${
                          day.score >= 70 ? 'bg-green-400' :
                          day.score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ height: `${day.score}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  {report.moodTrend.slice(0, 7).map((day, i) => (
                    <span key={i}>{new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 因素关联 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">🔗 情绪关联分析</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.correlations.map((corr, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {corr.factor1} ↔ {corr.factor2}
                      </span>
                      <span className="text-lg font-bold text-teal-600">
                        {Math.round(corr.correlation * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${corr.correlation * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{corr.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 风险因素和建议 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-medium text-gray-700 mb-4">⚠️ 关注点</h2>
                {report.riskFactors.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    <div className="text-3xl mb-2">✨</div>
                    <p>暂无明显风险因素</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.riskFactors.map((risk, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk.level)}`}>
                          {risk.level === 'high' ? '高' : risk.level === 'medium' ? '中' : '低'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-700">{risk.factor}</div>
                          <div className="text-sm text-gray-500">{risk.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-medium text-gray-700 mb-4">💡 建议</h2>
                <div className="space-y-3">
                  {report.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg text-sm text-gray-700">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 整体评分 */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">整体心理健康指数</h3>
                  <p className="text-white/80">基于情绪分布、记录频率和内容分析</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold">{report.sentimentAnalysis.overall}</div>
                  <div className="text-white/80 text-sm">满分 100</div>
                </div>
              </div>
            </div>

            {/* 底部说明 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium text-gray-700 mb-3">📌 说明</h3>
              <div className="text-sm text-gray-500 space-y-2">
                <p>• 心理健康报告基于日记内容和心情标签进行分析</p>
                <p>• 建议仅供参考，如有需要请咨询专业人士</p>
                <p>• 坚持记录日记有助于更好地了解自己的心境变化</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}