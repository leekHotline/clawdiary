'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  mood?: string;
  energy?: number;
  productivity?: number;
  wordCount?: number;
}

interface WeekAnalysis {
  totalEntries: number;
  totalWords: number;
  avgEnergy: number;
  avgProductivity: number;
  topTags: { tag: string; count: number }[];
  moodDistribution: { mood: string; count: number }[];
  dailyActivity: { date: string; count: number; words: number }[];
  highlights: string[];
  insights: string[];
  suggestions: string[];
  growthScore: number;
}

export default function WeeklyReflectionPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [analysis, setAnalysis] = useState<WeekAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'last'>('this');

  useEffect(() => {
    fetchDiaries();
  }, [selectedWeek]);

  const fetchDiaries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/diaries');
      const allDiaries: Diary[] = await res.json();
      
      // 计算日期范围
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + (selectedWeek === 'this' ? 0 : -7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // 筛选本周/上周日记
      const weekDiaries = allDiaries.filter(d => {
        const date = new Date(d.date);
        return date >= weekStart && date <= weekEnd;
      });

      setDiaries(weekDiaries);
      analyzeWeek(weekDiaries);
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWeek = (weekDiaries: Diary[]) => {
    // 基础统计
    const totalWords = weekDiaries.reduce((sum, d) => sum + (d.wordCount || d.content?.length || 0), 0);
    const avgEnergy = weekDiaries.filter(d => d.energy).reduce((sum, d) => sum + (d.energy || 0), 0) / (weekDiaries.filter(d => d.energy).length || 1);
    const avgProductivity = weekDiaries.filter(d => d.productivity).reduce((sum, d) => sum + (d.productivity || 0), 0) / (weekDiaries.filter(d => d.productivity).length || 1);

    // 标签分析
    const tagCounts: Record<string, number> = {};
    weekDiaries.forEach(d => {
      d.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 心情分布
    const moodCounts: Record<string, number> = {};
    weekDiaries.filter(d => d.mood).forEach(d => {
      moodCounts[d.mood!] = (moodCounts[d.mood!] || 0) + 1;
    });
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);

    // 每日活动
    const activityMap: Record<string, { count: number; words: number }> = {};
    weekDiaries.forEach(d => {
      const date = d.date;
      if (!activityMap[date]) activityMap[date] = { count: 0, words: 0 };
      activityMap[date].count++;
      activityMap[date].words += d.wordCount || d.content?.length || 0;
    });
    const dailyActivity = Object.entries(activityMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 提取亮点（高能量或高生产力的日记）
    const highlights = weekDiaries
      .filter(d => (d.energy || 0) >= 8 || (d.productivity || 0) >= 8)
      .map(d => d.title)
      .slice(0, 3);

    // 生成洞察
    const insights = generateInsights(weekDiaries, topTags, avgEnergy, avgProductivity);
    
    // 生成建议
    const suggestions = generateSuggestions(weekDiaries, avgEnergy, avgProductivity, totalWords);

    // 成长分数
    const growthScore = calculateGrowthScore(weekDiaries.length, totalWords, avgEnergy, avgProductivity);

    setAnalysis({
      totalEntries: weekDiaries.length,
      totalWords,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgProductivity: Math.round(avgProductivity * 10) / 10,
      topTags,
      moodDistribution,
      dailyActivity,
      highlights,
      insights,
      suggestions,
      growthScore
    });
  };

  const generateInsights = (diaries: Diary[], topTags: { tag: string; count: number }[], avgEnergy: number, avgProductivity: number): string[] => {
    const insights: string[] = [];

    if (diaries.length === 0) {
      insights.push('本周还没有日记记录，开始记录你的成长吧！');
      return insights;
    }

    // 数量洞察
    if (diaries.length >= 5) {
      insights.push(`📊 坚持力很强！本周记录了 ${diaries.length} 篇日记，持续记录是成长的关键。`);
    } else if (diaries.length >= 3) {
      insights.push(`📈 本周记录了 ${diaries.length} 篇日记，保持这个节奏！`);
    } else {
      insights.push(`💡 本周记录了 ${diaries.length} 篇日记，试着每天花5分钟记录一下吧。`);
    }

    // 主题洞察
    if (topTags.length > 0) {
      insights.push(`🎯 本周关注点：${topTags.slice(0, 3).map(t => t.tag).join('、')}。这些主题反映了你的核心关注。`);
    }

    // 能量洞察
    if (avgEnergy > 0) {
      if (avgEnergy >= 7) {
        insights.push(`⚡ 本周平均能量值 ${avgEnergy}，状态很好！继续保持积极心态。`);
      } else if (avgEnergy >= 5) {
        insights.push(`🔋 本周平均能量值 ${avgEnergy}，中等状态。适当休息，调整节奏。`);
      } else {
        insights.push(`🌙 本周能量偏低(${avgEnergy})，记得关注自己的身心状态，必要时放慢脚步。`);
      }
    }

    // 生产力洞察
    if (avgProductivity > 0) {
      if (avgProductivity >= 7) {
        insights.push(`🚀 本周生产力 ${avgProductivity}，高效的一周！`);
      } else if (avgProductivity >= 5) {
        insights.push(`✨ 本周生产力 ${avgProductivity}，稳步前进中。`);
      }
    }

    return insights;
  };

  const generateSuggestions = (diaries: Diary[], avgEnergy: number, avgProductivity: number, totalWords: number): string[] => {
    const suggestions: string[] = [];

    if (diaries.length < 3) {
      suggestions.push('📝 尝试每天写日记，哪怕只有几句话。坚持记录本身就是一种成长。');
    }

    if (totalWords < 500) {
      suggestions.push('✍️ 本周记录较短，试着多写一点细节，记录过程比结果更重要。');
    }

    if (avgEnergy > 0 && avgEnergy < 5) {
      suggestions.push('🧘 能量偏低时，试试记录3件感恩的事，或者一个小小的成就。');
      suggestions.push('💤 关注睡眠和运动，它们直接影响你的能量水平。');
    }

    if (avgProductivity > 0 && avgProductivity < 5) {
      suggestions.push('🎯 下周设定1-2个核心目标，专注于最重要的事。');
      suggestions.push('⏰ 尝试番茄工作法，25分钟专注+5分钟休息。');
    }

    if (suggestions.length === 0) {
      suggestions.push('🌟 保持现在的节奏，持续记录，持续成长！');
      suggestions.push('📖 试试从不同角度记录：情绪、收获、感恩、期待...');
    }

    return suggestions.slice(0, 4);
  };

  const calculateGrowthScore = (entries: number, words: number, energy: number, productivity: number): number => {
    let score = 0;
    
    // 记录频率 (最高40分)
    score += Math.min(entries * 5, 40);
    
    // 内容深度 (最高30分)
    score += Math.min(words / 100, 30);
    
    // 能量贡献 (最高15分)
    if (energy > 0) score += Math.round(energy * 1.5);
    
    // 生产力贡献 (最高15分)
    if (productivity > 0) score += Math.round(productivity * 1.5);
    
    return Math.min(Math.round(score), 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '✨';
    if (score >= 40) return '💪';
    return '🌱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📊</div>
          <p className="text-gray-500">正在分析本周数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← 返回首页
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">📊 周复盘报告</h1>
            <p className="text-gray-500 mt-1">回顾一周，发现成长轨迹</p>
          </div>
          
          {/* 周选择 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedWeek('this')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedWeek === 'this'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              本周
            </button>
            <button
              onClick={() => setSelectedWeek('last')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedWeek === 'last'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/70 text-gray-600 hover:bg-white'
              }`}
            >
              上周
            </button>
          </div>
        </div>

        {analysis && (
          <>
            {/* 成长分数卡片 */}
            <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">本周成长分数</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold">{analysis.growthScore}</span>
                    <span className="text-2xl text-white/70">/ 100</span>
                  </div>
                  <p className="text-white/80 mt-2">
                    {getScoreEmoji(analysis.growthScore)} {analysis.growthScore >= 60 ? '表现优秀，继续保持！' : '还有进步空间，继续努力！'}
                  </p>
                </div>
                <div className="text-8xl opacity-20">📈</div>
              </div>
            </div>

            {/* 核心指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-600">{analysis.totalEntries}</div>
                <div className="text-sm text-gray-500 mt-1">📝 日记数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">{analysis.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">📚 总字数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{analysis.avgEnergy || '-'}</div>
                <div className="text-sm text-gray-500 mt-1">⚡ 能量值</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-pink-600">{analysis.avgProductivity || '-'}</div>
                <div className="text-sm text-gray-500 mt-1">🎯 生产力</div>
              </div>
            </div>

            {/* 洞察与建议 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 本周洞察 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💡</span> 本周洞察
                </h2>
                <div className="space-y-3">
                  {analysis.insights.map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下周建议 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> 下周建议
                </h2>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 标签与心情 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 热门标签 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span> 关注主题
                </h2>
                {analysis.topTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.topTags.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {item.tag} <span className="text-purple-400">×{item.count}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无标签数据</p>
                )}
              </div>

              {/* 心情分布 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>😊</span> 心情分布
                </h2>
                {analysis.moodDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.moodDistribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg">{item.mood}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full"
                            style={{ width: `${(item.count / analysis.totalEntries) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无心情数据</p>
                )}
              </div>
            </div>

            {/* 每日活动 */}
            {analysis.dailyActivity.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📅</span> 本周活动
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => {
                    const activity = analysis.dailyActivity[i];
                    const hasData = activity && activity.count > 0;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center ${
                          hasData
                            ? 'bg-gradient-to-br from-purple-400 to-indigo-400 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <span className="text-xs">{day}</span>
                        <span className="text-lg font-bold">{activity?.count || 0}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 本周日记列表 */}
            {diaries.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📝</span> 本周日记 ({diaries.length}篇)
                </h2>
                <div className="space-y-3">
                  {diaries.map((diary) => (
                    <Link
                      key={diary.id}
                      href={`/diary/${diary.id}`}
                      className="block p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{diary.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{diary.date}</p>
                        </div>
                        <div className="flex gap-2">
                          {diary.mood && <span className="text-lg">{diary.mood}</span>}
                          {diary.energy && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                              ⚡{diary.energy}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {diaries.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {selectedWeek === 'this' ? '本周还没有日记' : '上周没有日记记录'}
                </h3>
                <p className="text-gray-400 mb-6">开始记录你的成长，下周就能看到复盘报告了！</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <span>✍️</span> 写第一篇日记
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}