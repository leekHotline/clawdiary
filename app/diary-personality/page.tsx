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
}

interface PersonalityReport {
  archetype: {
    name: string;
    emoji: string;
    description: string;
    traits: string[];
  };
  writingStyle: {
    name: string;
    description: string;
    indicators: string[];
  };
  emotionalProfile: {
    dominantEmotion: string;
    emotionEmoji: string;
    emotionalRange: string;
    patterns: string[];
  };
  themes: {
    primary: string[];
    secondary: string[];
    insights: string;
  };
  growthJourney: {
    stage: string;
    description: string;
    nextStep: string;
  };
  funFacts: string[];
  compatibility: {
    types: string[];
    description: string;
  };
  stats: {
    totalEntries: number;
    totalWords: number;
    avgWordsPerEntry: number;
    mostProductiveDay: string;
    writingConsistency: number;
  };
}

export default function DiaryPersonalityPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [report, setReport] = useState<PersonalityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const res = await fetch('/api/diaries');
      const data = await res.json();
      setDiaries(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
      setLoading(false);
    }
  };

  const analyzePersonality = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/diary-personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaries })
      });
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      // 使用本地分析
      const localReport = generateLocalReport(diaries);
      setReport(localReport);
    } finally {
      setAnalyzing(false);
    }
  };

  // 本地分析函数（备用）
  const generateLocalReport = (diaries: Diary[]): PersonalityReport => {
    const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
    const avgWords = Math.round(totalWords / (diaries.length || 1));
    
    // 提取标签
    const tagCounts: Record<string, number> = {};
    diaries.forEach(d => {
      d.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // 提取心情
    const moodCounts: Record<string, number> = {};
    diaries.filter(d => d.mood).forEach(d => {
      moodCounts[d.mood!] = (moodCounts[d.mood!] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // 分析日期分布
    const dayCounts: Record<string, number> = {};
    diaries.forEach(d => {
      const day = new Date(d.date).getDay();
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const dayName = dayNames[day];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });
    const mostProductiveDay = Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '未知';

    // 确定人格类型
    const archetypes = [
      { name: '哲学思考者', emoji: '🧠', traits: ['深度思考', '善于反思', '追求意义'] },
      { name: '情感诗人', emoji: '💝', traits: ['情感丰富', '表达细腻', '感性写作'] },
      { name: '效率达人', emoji: '⚡', traits: ['目标导向', '高效记录', '简洁有力'] },
      { name: '成长猎手', emoji: '🎯', traits: ['持续进步', '自我驱动', '行动力强'] },
      { name: '生活观察家', emoji: '🔍', traits: ['善于发现', '记录细节', '好奇心强'] },
      { name: '梦想编织者', emoji: '✨', traits: ['富有想象', '憧憬未来', '创意无限'] },
    ];

    // 基于内容特征选择人格
    const contentText = diaries.map(d => d.content).join(' ');
    let archetypeIndex = 0;
    
    if (contentText.includes('思考') || contentText.includes('反思') || contentText.includes('意义')) {
      archetypeIndex = 0;
    } else if (contentText.includes('感觉') || contentText.includes('心情') || contentText.includes('情绪')) {
      archetypeIndex = 1;
    } else if (avgWords < 200) {
      archetypeIndex = 2;
    } else if (topTags.some(t => ['成长', '目标', '学习'].includes(t))) {
      archetypeIndex = 3;
    } else if (contentText.includes('发现') || contentText.includes('观察') || contentText.includes('今天')) {
      archetypeIndex = 4;
    } else {
      archetypeIndex = 5;
    }

    const archetype = archetypes[archetypeIndex];

    // 写作风格
    const styles = [
      { name: '叙事型', description: '擅长讲述故事，条理清晰', indicators: ['时间线明确', '因果叙述', '完整故事'] },
      { name: '情感型', description: '注重情感表达，文字温暖', indicators: ['多用形容词', '情感词汇丰富', '表达细腻'] },
      { name: '分析型', description: '善于分析总结，逻辑性强', indicators: ['结构清晰', '观点明确', '数据支撑'] },
      { name: '意识流', description: '自由书写，随性真实', indicators: ['跳跃性强', '真实感', '即兴创作'] },
    ];

    const styleIndex = avgWords > 500 ? 0 : avgWords > 300 ? 1 : avgWords > 150 ? 2 : 3;

    return {
      archetype: {
        ...archetype,
        description: `你的日记展现出${archetype.traits.join('、')}的特质，这是非常珍贵的写作风格！`
      },
      writingStyle: {
        ...styles[styleIndex],
        indicators: styles[styleIndex].indicators.map(i => `✓ ${i}`)
      },
      emotionalProfile: {
        dominantEmotion: topMood?.[0] || '平静',
        emotionEmoji: topMood?.[0] === '😊' ? '😊' : topMood?.[0] === '😢' ? '😢' : '😌',
        emotionalRange: moodCounts.length > 5 ? '丰富多变' : moodCounts.length > 2 ? '稳定温和' : '专注深入',
        patterns: ['情绪与事件关联', '善于觉察内心', '表达真实自然']
      },
      themes: {
        primary: topTags.slice(0, 3),
        secondary: topTags.slice(3, 6),
        insights: `你关注的核心主题反映了你的价值观和生活重心，持续记录这些主题会带来更深的自我认知。`
      },
      growthJourney: {
        stage: diaries.length > 50 ? '深耕期' : diaries.length > 20 ? '成长期' : diaries.length > 10 ? '探索期' : '萌芽期',
        description: diaries.length > 20 ? '你已经建立了稳定的日记习惯，正在向更深层次的自我认知迈进。' : '日记之旅刚刚开始，每一天的记录都在塑造更好的你。',
        nextStep: diaries.length > 20 ? '尝试探索新的写作主题，挑战更深的自我对话' : '坚持每天记录，培养写作的肌肉记忆'
      },
      funFacts: [
        `📝 你总共写了 ${totalWords.toLocaleString()} 字，相当于 ${Math.round(totalWords / 800)} 篇作文！`,
        `📅 ${mostProductiveDay}是你最勤奋的日子`,
        `🏷️ "${topTags[0] || '生活'}"是你最关心的话题`,
        `⏱️ 平均每篇${avgWords}字，${avgWords > 300 ? '细节丰富' : avgWords > 150 ? '简洁有力' : '精炼表达'}`
      ],
      compatibility: {
        types: ['成长伙伴型', '深度对话型', '创意激发型'],
        description: '你的写作风格适合与善于倾听、能够深度交流的人互动'
      },
      stats: {
        totalEntries: diaries.length,
        totalWords,
        avgWordsPerEntry: avgWords,
        mostProductiveDay,
        writingConsistency: Math.min(Math.round(diaries.length * 2), 100)
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🎭</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">🎭 日记人格报告</h1>
          <p className="text-gray-500 mt-2">分析你的写作风格，发现独特的日记人格</p>
        </div>

        {!report ? (
          /* 开始分析卡片 */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm text-center mb-8">
            <div className="text-8xl mb-6">🔮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">发现你的日记人格</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              基于你{diaries.length > 0 ? `的 ${diaries.length} 篇` : '的'}日记，AI将分析你的写作风格、情绪模式和主题偏好，
              生成专属于你的人格画像报告。
            </p>
            
            {diaries.length > 0 ? (
              <button
                onClick={analyzePersonality}
                disabled={analyzing}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    <span>正在分析...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>开始人格分析</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-gray-400">
                <p>还没有日记记录</p>
                <Link href="/create" className="text-rose-500 hover:underline mt-2 inline-block">
                  写第一篇日记 →
                </Link>
              </div>
            )}

            {/* 功能说明 */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-2">🎭</div>
                <div className="text-sm text-gray-600">人格画像</div>
                <div className="text-xs text-gray-400 mt-1">发现你的写作人格</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm text-gray-600">风格分析</div>
                <div className="text-xs text-gray-400 mt-1">了解写作特点</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-sm text-gray-600">成长建议</div>
                <div className="text-xs text-gray-400 mt-1">个性化提升方向</div>
              </div>
            </div>
          </div>
        ) : (
          /* 报告内容 */
          <div className="space-y-6">
            {/* 人格卡片 */}
            <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center gap-6">
                <div className="text-8xl">{report.archetype.emoji}</div>
                <div>
                  <p className="text-white/70 text-sm mb-1">你的日记人格</p>
                  <h2 className="text-4xl font-bold mb-2">{report.archetype.name}</h2>
                  <p className="text-white/90">{report.archetype.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-6 flex-wrap">
                {report.archetype.traits.map((trait, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* 核心统计 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-rose-600">{report.stats.totalEntries}</div>
                <div className="text-xs text-gray-500 mt-1">📝 总日记数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-pink-600">{report.stats.totalWords.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">📚 总字数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{report.stats.avgWordsPerEntry}</div>
                <div className="text-xs text-gray-500 mt-1">✍️ 平均字数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">{report.stats.writingConsistency}%</div>
                <div className="text-xs text-gray-500 mt-1">🔥 坚持度</div>
              </div>
            </div>

            {/* 写作风格 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>✍️</span> 写作风格：{report.writingStyle.name}
              </h3>
              <p className="text-gray-600 mb-4">{report.writingStyle.description}</p>
              <div className="flex flex-wrap gap-2">
                {report.writingStyle.indicators.map((indicator, i) => (
                  <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm">
                    {indicator}
                  </span>
                ))}
              </div>
            </div>

            {/* 情感档案 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💝</span> 情感档案
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                  <span className="text-4xl">{report.emotionalProfile.emotionEmoji}</span>
                  <div>
                    <div className="text-sm text-gray-500">主导情绪</div>
                    <div className="font-bold text-gray-800">{report.emotionalProfile.dominantEmotion}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                  <span className="text-4xl">🌈</span>
                  <div>
                    <div className="text-sm text-gray-500">情感范围</div>
                    <div className="font-bold text-gray-800">{report.emotionalProfile.emotionalRange}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 关注主题 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> 关注主题
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {report.themes.primary.map((theme, i) => (
                  <span key={i} className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-medium">
                    {theme}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm">{report.themes.insights}</p>
            </div>

            {/* 成长旅程 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🌱</span> 成长旅程
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-medium">
                  {report.growthJourney.stage}
                </div>
                <div className="text-gray-600">{report.growthJourney.description}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-sm text-green-600 font-medium mb-1">💡 下一步建议</div>
                <div className="text-gray-700">{report.growthJourney.nextStep}</div>
              </div>
            </div>

            {/* 有趣数据 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎉</span> 有趣发现
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {report.funFacts.map((fact, i) => (
                  <div key={i} className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl text-sm text-gray-700">
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            {/* 重新分析 */}
            <div className="text-center pt-4">
              <button
                onClick={() => setReport(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                重新分析 →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}