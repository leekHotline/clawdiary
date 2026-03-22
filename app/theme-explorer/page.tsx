'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 主题类型
interface Theme {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
  percentage: number;
  recentMentions: string[];
  trend: 'up' | 'stable' | 'down';
  relatedThemes: string[];
}

// 时间分布
interface TimeDistribution {
  month: string;
  themes: { theme: string; count: number }[];
}

// 模拟主题数据生成
function generateThemes(): Theme[] {
  const themeData: {
    id: string;
    name: string;
    emoji: string;
    color: string;
    count: number;
    trend: 'up' | 'stable' | 'down';
    recentMentions: string[];
    relatedThemes: string[];
  }[] = [
    {
      id: 'growth',
      name: '个人成长',
      emoji: '🌱',
      color: 'from-green-500 to-emerald-600',
      count: 45,
      trend: 'up',
      recentMentions: ['今天学到了新技能', '突破了自己的舒适区', '坚持早起第30天'],
      relatedThemes: ['学习', '目标'],
    },
    {
      id: 'emotion',
      name: '情感记录',
      emoji: '💕',
      color: 'from-pink-500 to-rose-600',
      count: 38,
      trend: 'stable',
      recentMentions: ['今天感到很幸福', '有点焦虑但正在调节', '感恩身边的人'],
      relatedThemes: ['感恩', '人际关系'],
    },
    {
      id: 'work',
      name: '工作思考',
      emoji: '💼',
      color: 'from-blue-500 to-indigo-600',
      count: 32,
      trend: 'up',
      recentMentions: ['项目进展顺利', '今天开了一个好会', '解决了棘手的问题'],
      relatedThemes: ['目标', '学习'],
    },
    {
      id: 'reflection',
      name: '自我反思',
      emoji: '🪞',
      color: 'from-purple-500 to-violet-600',
      count: 28,
      trend: 'stable',
      recentMentions: ['思考人生的意义', '审视自己的行为', '复盘今天的决定'],
      relatedThemes: ['成长', '哲学'],
    },
    {
      id: 'creativity',
      name: '创意灵感',
      emoji: '✨',
      color: 'from-amber-500 to-orange-600',
      count: 22,
      trend: 'up',
      recentMentions: ['突然有了个好点子', '尝试新的创作方式', '灵感爆发的一天'],
      relatedThemes: ['学习', '表达'],
    },
    {
      id: 'relationship',
      name: '人际关系',
      emoji: '🤝',
      color: 'from-cyan-500 to-teal-600',
      count: 18,
      trend: 'down',
      recentMentions: ['和朋友聊了很多', '家人聚餐很开心', '认识了新朋友'],
      relatedThemes: ['情感', '感恩'],
    },
    {
      id: 'health',
      name: '身心健康',
      emoji: '🏃',
      color: 'from-lime-500 to-green-600',
      count: 15,
      trend: 'up',
      recentMentions: ['坚持运动', '睡眠质量变好', '冥想让我平静'],
      relatedThemes: ['成长', '习惯'],
    },
    {
      id: 'learning',
      name: '学习探索',
      emoji: '📚',
      color: 'from-indigo-500 to-blue-600',
      count: 14,
      trend: 'stable',
      recentMentions: ['读完一本好书', '学到了新概念', '发现有趣的频道'],
      relatedThemes: ['成长', '创意'],
    },
  ];

  const total = themeData.reduce((sum, t) => sum + t.count, 0);
  
  return themeData.map(t => ({
    ...t,
    percentage: Math.round((t.count / total) * 100),
  }));
}

// 生成时间分布
function generateTimeDistribution(): TimeDistribution[] {
  const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];
  
  return months.map(month => ({
    month,
    themes: [
      { theme: '个人成长', count: Math.floor(Math.random() * 10) + 3 },
      { theme: '情感记录', count: Math.floor(Math.random() * 8) + 2 },
      { theme: '工作思考', count: Math.floor(Math.random() * 7) + 2 },
      { theme: '创意灵感', count: Math.floor(Math.random() * 5) + 1 },
    ].sort((a, b) => b.count - a.count),
  }));
}

// 主题详情弹窗
function ThemeDetailModal({ 
  theme, 
  onClose 
}: { 
  theme: Theme; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* 头部 */}
        <div className={`bg-gradient-to-r ${theme.color} p-6 text-white sticky top-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{theme.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{theme.name}</h2>
                <p className="text-white/80">出现 {theme.count} 次 · {theme.percentage}%</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 趋势指示 */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              theme.trend === 'up' ? 'bg-green-100 text-green-700' :
              theme.trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {theme.trend === 'up' ? '📈 上升趋势' :
               theme.trend === 'down' ? '📉 下降趋势' :
               '➡️ 保持稳定'}
            </span>
          </div>
        </div>

        {/* 最近提及 */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-800 mb-3">📝 最近提及</h3>
          <div className="space-y-3">
            {theme.recentMentions.map((mention, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl text-gray-700">
                "{mention}"
              </div>
            ))}
          </div>
        </div>

        {/* 相关主题 */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-800 mb-3">🔗 相关主题</h3>
          <div className="flex flex-wrap gap-2">
            {theme.relatedThemes.map((related, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                {related}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeExplorerPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<TimeDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'insights'>('overview');

  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setThemes(generateThemes());
      setTimeDistribution(generateTimeDistribution());
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-white text-lg">正在探索你的日记主题...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      {/* 头部 */}
      <header className="relative bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">主题探索器</h1>
                <p className="text-sm text-gray-400">发现日记中的隐藏模式</p>
              </div>
            </div>
            <Link
              href="/chat-diary"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-500 transition-colors"
            >
              ✍️ 写日记
            </Link>
          </div>

          {/* 视图切换 */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'overview', label: '📊 主题总览' },
              { id: 'timeline', label: '📅 时间演变' },
              { id: 'insights', label: '💡 洞察发现' },
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as typeof activeView)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  activeView === view.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* 总览视图 */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* 主题云 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">☁️ 你的主题云</h2>
              <div className="flex flex-wrap gap-3 justify-center py-4">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${theme.color} text-white font-medium hover:scale-105 transition-transform`}
                    style={{
                      fontSize: `${Math.max(14, Math.min(24, theme.percentage + 10))}px`,
                    }}
                  >
                    {theme.emoji} {theme.name}
                  </button>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                点击任意主题查看详情
              </p>
            </div>

            {/* 主题排行 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">🏆 主题排行</h2>
              <div className="space-y-4">
                {themes.slice(0, 5).map((theme, index) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${theme.color} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <span className="text-2xl">{theme.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{theme.name}</div>
                      <div className="text-gray-500 text-sm">{theme.count} 次提及</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{theme.percentage}%</div>
                      <div className={`text-xs ${
                        theme.trend === 'up' ? 'text-green-400' :
                        theme.trend === 'down' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {theme.trend === 'up' ? '↑ 上升' :
                         theme.trend === 'down' ? '↓ 下降' :
                         '→ 稳定'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 所有主题卡片 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`bg-gradient-to-br ${theme.color} rounded-2xl p-5 text-left hover:scale-[1.02] transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{theme.emoji}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      theme.trend === 'up' ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {theme.trend === 'up' ? '📈' : theme.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{theme.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/80 text-sm">{theme.count} 次</span>
                    <span className="text-white/60 text-sm">{theme.percentage}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 时间演变视图 */}
        {activeView === 'timeline' && (
          <div className="space-y-6">
            {/* 时间线图表 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-6">📅 主题时间演变</h2>
              <div className="space-y-6">
                {timeDistribution.map((month, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-20 text-gray-400 text-sm">{month.month}</div>
                    <div className="flex-1 space-y-2">
                      {month.themes.map((t, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-20 text-gray-300 text-sm truncate">{t.theme}</div>
                          <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                j === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                j === 1 ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                                j === 2 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                'bg-gradient-to-r from-amber-500 to-orange-500'
                              }`}
                              style={{ width: `${t.count * 10}%` }}
                            />
                          </div>
                          <div className="w-8 text-gray-400 text-sm text-right">{t.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 趋势分析 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <span>📈</span> 上升中的主题
                </h3>
                <div className="space-y-2">
                  {themes.filter(t => t.trend === 'up').map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-gray-300">
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <span>📉</span> 需要关注的主题
                </h3>
                <div className="space-y-2">
                  {themes.filter(t => t.trend === 'down').map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-gray-300">
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </div>
                  ))}
                  {themes.filter(t => t.trend === 'down').length === 0 && (
                    <p className="text-gray-500 text-sm">暂无下降趋势的主题</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 洞察发现视图 */}
        {activeView === 'insights' && (
          <div className="space-y-6">
            {/* AI 洞察卡片 */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔮</div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">主题洞察</h2>
                  <p className="text-gray-300 leading-relaxed">
                    根据你的日记分析，<span className="text-purple-400 font-semibold">「个人成长」</span>是你最关注的话题，
                    占比达到 {themes[0]?.percentage}%。同时，<span className="text-green-400 font-semibold">「身心健康」</span>
                    {' '}和<span className="text-amber-400 font-semibold">「创意灵感」</span>呈上升趋势，
                    说明你正在追求更全面的发展。
                  </p>
                </div>
              </div>
            </div>

            {/* 关联发现 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">🔗 主题关联发现</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">🌱</span>
                    <span className="text-white font-medium">成长与学习</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    当你写「个人成长」时，有 68% 的概率也会提到「学习」相关内容
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-pink-400">💕</span>
                    <span className="text-white font-medium">情感与感恩</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    「情感记录」和「感恩」经常同时出现，说明你善于发现生活中的美好
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-400">✨</span>
                    <span className="text-white font-medium">创意与工作</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    周末的「创意灵感」出现率比工作日高出 45%
                  </p>
                </div>
              </div>
            </div>

            {/* 建议卡片 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">💡 写作建议</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/20">
                  <h3 className="font-medium text-green-400 mb-2">继续保持 🎯</h3>
                  <p className="text-gray-300 text-sm">
                    「个人成长」主题记录丰富，建议继续保持深度思考和记录
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/20">
                  <h3 className="font-medium text-amber-400 mb-2">可以加强 💪</h3>
                  <p className="text-gray-300 text-sm">
                    「人际关系」主题占比下降，可以多记录与他人的互动和感受
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 主题详情弹窗 */}
      {selectedTheme && (
        <ThemeDetailModal
          theme={selectedTheme}
          onClose={() => setSelectedTheme(null)}
        />
      )}

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary · 发现日记中的隐藏宝藏</p>
        </div>
      </footer>
    </div>
  );
}