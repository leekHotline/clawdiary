'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MuseumExhibit {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  count: number;
  preview: string[];
}

interface MuseumStats {
  totalDiaries: number;
  totalDays: number;
  totalWords: number;
  totalEmotions: number;
  startDate: string;
}

export default function DiaryMuseumPage() {
  const [exhibits, setExhibits] = useState<MuseumExhibit[]>([]);
  const [stats, setStats] = useState<MuseumStats | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<MuseumExhibit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMuseumData();
  }, []);

  const fetchMuseumData = async () => {
    try {
      const res = await fetch('/api/diary-museum');
      const data = await res.json();
      setExhibits(data.exhibits || []);
      setStats(data.stats || null);
    } catch (error) {
      // 使用模拟数据
      setExhibits(getMockExhibits());
      setStats(getMockStats());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockExhibits = (): MuseumExhibit[] => [
    {
      id: 'happy',
      title: '快乐时光馆',
      description: '收藏所有充满阳光和欢笑的日子',
      emoji: '😊',
      color: 'from-yellow-400 to-orange-400',
      count: 23,
      preview: ['第一次学会骑自行车', '收到惊喜礼物', '和朋友的海边旅行']
    },
    {
      id: 'growth',
      title: '成长足迹厅',
      description: '每一个挑战都是成长的垫脚石',
      emoji: '🌱',
      color: 'from-green-400 to-emerald-500',
      count: 18,
      preview: ['克服了演讲恐惧', '学会了新技能', '完成了一个大项目']
    },
    {
      id: 'love',
      title: '爱与温暖展区',
      description: '记录生命中最珍贵的连接',
      emoji: '❤️',
      color: 'from-pink-400 to-rose-500',
      count: 15,
      preview: ['妈妈的拥抱', '朋友的鼓励', '陌生人的善意']
    },
    {
      id: 'dreams',
      title: '梦想星空馆',
      description: '仰望星空，追逐心中的光芒',
      emoji: '✨',
      color: 'from-purple-400 to-indigo-500',
      count: 12,
      preview: ['立下新年目标', '梦想清单更新', '小小的愿望实现']
    },
    {
      id: 'insights',
      title: '顿悟时刻阁',
      description: '那些让世界突然变清晰的瞬间',
      emoji: '💡',
      color: 'from-cyan-400 to-blue-500',
      count: 8,
      preview: ['明白了生活的意义', '找到了自己的节奏', '学会放下']
    },
    {
      id: 'nature',
      title: '自然漫步廊',
      description: '与大自然相遇的美好时刻',
      emoji: '🌿',
      color: 'from-teal-400 to-green-500',
      count: 10,
      preview: ['春日的樱花', '夏天的蝉鸣', '秋天的落叶']
    }
  ];

  const getMockStats = (): MuseumStats => ({
    totalDiaries: 86,
    totalDays: 24,
    totalWords: 28500,
    totalEmotions: 156,
    startDate: '2026-03-01'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏛️</div>
          <p className="text-gray-500">博物馆正在开门迎客...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* 顶部导航 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors">
            <span>←</span>
            <span>返回首页</span>
          </Link>
        </div>

        {/* 博物馆标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-lg mb-6">
            <span className="text-5xl">🏛️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            日记博物馆
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            你的记忆有了家，每篇日记都是一件展品
          </p>
        </div>

        {/* 统计数据 */}
        {stats && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-10 shadow-lg border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <h2 className="text-lg font-bold text-gray-800">馆藏统计</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600">{stats.totalDiaries}</div>
                <div className="text-sm text-gray-500 mt-1">篇日记</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{stats.totalDays}</div>
                <div className="text-sm text-gray-500 mt-1">个日夜</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{(stats.totalWords / 1000).toFixed(1)}k</div>
                <div className="text-sm text-gray-500 mt-1">个文字</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{stats.totalEmotions}</div>
                <div className="text-sm text-gray-500 mt-1">次心动</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              自 {stats.startDate} 开馆以来
            </div>
          </div>
        )}

        {/* 展厅入口 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎭</span>
            <h2 className="text-xl font-bold text-gray-800">主题展厅</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exhibits.map((exhibit) => (
              <button
                key={exhibit.id}
                onClick={() => setSelectedExhibit(exhibit)}
                className={`group relative overflow-hidden bg-gradient-to-br ${exhibit.color} rounded-2xl p-5 text-white text-left shadow-md hover:shadow-xl transition-all hover:scale-[1.02]`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="text-4xl mb-3">{exhibit.emoji}</div>
                  <h3 className="text-lg font-bold mb-1">{exhibit.title}</h3>
                  <p className="text-white/80 text-sm mb-3">{exhibit.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      {exhibit.count} 件展品
                    </span>
                    <span className="text-xs opacity-60">点击参观 →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 特色展区 */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-10 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🖼️</span>
                <h2 className="text-2xl font-bold">年度回顾展</h2>
              </div>
              <p className="text-white/80 mb-4">将你的日记变成一场视觉盛宴，一键生成可分享的年度回顾</p>
              <Link
                href="/annual-report"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <span>生成我的回顾展</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 时间长廊 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-10 shadow-lg border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⏳</span>
            <h2 className="text-lg font-bold text-gray-800">时间长廊</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">沿着时间线，重新走过每一段旅程</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'].map((month, i) => (
              <button
                key={month}
                className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* 随机探索 */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <button
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all border border-amber-100 group"
            onClick={() => {
              // 随机跳转到一篇日记
              window.location.href = '/diary-blindbox';
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎲</span>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">随机探索</h3>
            </div>
            <p className="text-gray-500 text-sm">让命运带你回到某个被遗忘的日子</p>
          </button>
          
          <Link
            href="/emotion-map"
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all border border-amber-100 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🗺️</span>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">情绪地图</h3>
            </div>
            <p className="text-gray-500 text-sm">用颜色标记每一天，绘制专属的情绪地图</p>
          </Link>
        </div>

        {/* 镇馆之宝 */}
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 rounded-2xl p-6 mb-10 border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👑</span>
            <h2 className="text-lg font-bold text-gray-800">镇馆之宝</h2>
          </div>
          <div className="bg-white/60 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🏆</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">坚持的力量</h3>
                <p className="text-sm text-gray-500 mb-2">连续 {stats?.totalDays || 24} 天记录生活</p>
                <p className="text-sm text-gray-600">
                  "每一篇日记都是你与未来自己的一次对话。坚持本身就是最大的成就。"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 参观须知 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm">
            💡 小提示：日记博物馆会根据你的日记内容自动生成展览，越写越精彩！
          </p>
        </div>
      </main>

      {/* 展品详情弹窗 */}
      {selectedExhibit && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExhibit(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{selectedExhibit.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800">{selectedExhibit.title}</h3>
              <p className="text-gray-500 text-sm">{selectedExhibit.description}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm font-medium text-gray-600">精选展品：</div>
              {selectedExhibit.preview.map((item, i) => (
                <div 
                  key={i}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700"
                >
                  {i + 1}. {item}
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedExhibit(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                关闭
              </button>
              <Link
                href={`/explore?tag=${selectedExhibit.id}`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white text-center font-medium hover:shadow-lg transition-all"
              >
                参观展厅
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}