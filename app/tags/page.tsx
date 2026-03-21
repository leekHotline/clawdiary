'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TagInfo {
  name: string;
  count: number;
  size: number;
  dominantMood?: string;
}

interface TagStats {
  totalTags: number;
  totalUsages: number;
  avgTagsPerDiary: string;
  hotTags: TagInfo[];
  risingTags: TagInfo[];
  newTags: { name: string; count: number }[];
}

const MOOD_COLORS: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-800',
  sad: 'bg-blue-100 text-blue-800',
  excited: 'bg-pink-100 text-pink-800',
  calm: 'bg-green-100 text-green-800',
  grateful: 'bg-purple-100 text-purple-800',
  anxious: 'bg-orange-100 text-orange-800',
  productive: 'bg-indigo-100 text-indigo-800',
  creative: 'bg-rose-100 text-rose-800',
};

const TAG_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
  'bg-pink-500', 'bg-gray-500',
];

export default function TagsPage() {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [stats, setStats] = useState<TagStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'cloud' | 'list'>('cloud');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTags(), fetchStats()]);
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags/cloud');
      if (res.ok) {
        const data = await res.json();
        setTags(data.tags);
      }
    } catch (_error) {
      console.error('获取标签云失败:', _error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/tags/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (_error) {
      console.error('获取标签统计失败:', _error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">🏷️ 标签管理</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('cloud')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'cloud' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                ☁️ 云视图
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                📋 列表视图
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalTags}</div>
              <div className="text-sm text-gray-500">标签总数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalUsages}</div>
              <div className="text-sm text-gray-500">总使用次数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-gray-800">{stats.avgTagsPerDiary}</div>
              <div className="text-sm text-gray-500">平均每篇标签</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-2xl font-bold text-gray-800">{stats.newTags.length}</div>
              <div className="text-sm text-gray-500">新标签（30天）</div>
            </div>
          </div>
        )}

        {/* 标签云/列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">标签云</h2>
              
              {view === 'cloud' ? (
                <div className="flex flex-wrap gap-3 justify-center py-8">
                  {tags.map((tag) => {
                    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
                    const sizeClass = sizes[Math.min(tag.size, sizes.length - 1)];
                    
                    return (
                      <button
                        key={tag.name}
                        onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                        className={`${sizeClass} px-3 py-1 rounded-full transition-all hover:scale-105 ${
                          selectedTag === tag.name
                            ? 'ring-2 ring-purple-500 ring-offset-2'
                            : ''
                        } ${MOOD_COLORS[tag.dominantMood || ''] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {tag.name}
                        <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {tags.map((tag, index) => (
                    <div
                      key={tag.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${TAG_COLORS[index % TAG_COLORS.length]}`}></div>
                        <span className="font-medium text-gray-800">{tag.name}</span>
                        {tag.dominantMood && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            MOOD_COLORS[tag.dominantMood] || 'bg-gray-100 text-gray-600'
                          }`}>
                            {tag.dominantMood}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${TAG_COLORS[index % TAG_COLORS.length]} h-2 rounded-full`}
                            style={{ width: `${(tag.count / tags[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{tag.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 热门标签 */}
            {stats && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    🔥 热门标签
                  </h3>
                  <div className="space-y-2">
                    {stats.hotTags.slice(0, 5).map((tag, index) => (
                      <div key={tag.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index]}</span>
                          <span className="text-gray-700">{tag.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{tag.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    📈 上升趋势
                  </h3>
                  <div className="space-y-2">
                    {stats.risingTags.length > 0 ? (
                      stats.risingTags.map((tag) => (
                        <div key={tag.name} className="flex items-center justify-between">
                          <span className="text-gray-700">{tag.name}</span>
                          <span className="text-green-500 text-sm">↑ {tag.count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">暂无上升趋势标签</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    ✨ 新标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.newTags.length > 0 ? (
                      stats.newTags.map((tag) => (
                        <span
                          key={tag.name}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">暂无新标签</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 标签管理 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">标签管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-2xl mb-2">🔗</div>
              <div className="font-medium text-gray-700">合并相似标签</div>
              <div className="text-sm text-gray-500">清理重复标签</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-2xl mb-2">✏️</div>
              <div className="font-medium text-gray-700">批量重命名</div>
              <div className="text-sm text-gray-500">一次修改多个标签</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-2xl mb-2">🗑️</div>
              <div className="font-medium text-gray-700">清理未使用</div>
              <div className="text-sm text-gray-500">删除无引用标签</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}