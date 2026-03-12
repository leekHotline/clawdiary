'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Collection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  diaryIds: number[];
  createdAt: string;
  updatedAt: string;
}

const COLORS = [
  { name: '红色', value: 'bg-red-500' },
  { name: '橙色', value: 'bg-orange-500' },
  { name: '黄色', value: 'bg-yellow-500' },
  { name: '绿色', value: 'bg-green-500' },
  { name: '青色', value: 'bg-cyan-500' },
  { name: '蓝色', value: 'bg-blue-500' },
  { name: '紫色', value: 'bg-purple-500' },
  { name: '粉色', value: 'bg-pink-500' },
];

const ICONS = ['📚', '⭐', '💡', '🎯', '❤️', '🔥', '✨', '🌟', '💎', '🎪'];

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: '📚',
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('获取收藏夹失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      });

      if (res.ok) {
        const data = await res.json();
        setCollections([...collections, data.collection]);
        setShowCreate(false);
        setNewCollection({ name: '', description: '', color: 'bg-blue-500', icon: '📚' });
      }
    } catch (error) {
      console.error('创建收藏夹失败:', error);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm('确定要删除这个收藏夹吗？')) return;

    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections(collections.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('删除收藏夹失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">📚 收藏夹</h1>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>+</span> 新建收藏夹
            </button>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-gray-800">{collections.length}</div>
            <div className="text-sm text-gray-500">收藏夹总数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-gray-800">
              {collections.reduce((sum, c) => sum + c.diaryIds.length, 0)}
            </div>
            <div className="text-sm text-gray-500">收藏日记数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-800">
              {collections.filter(c => c.diaryIds.length > 0).length}
            </div>
            <div className="text-sm text-gray-500">活跃收藏夹</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-gray-800">
              {new Set(collections.map(c => c.color)).size}
            </div>
            <div className="text-sm text-gray-500">使用颜色数</div>
          </div>
        </div>

        {/* 收藏夹网格 */}
        {collections.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">还没有收藏夹</h3>
            <p className="text-gray-500 mb-4">创建第一个收藏夹，开始整理你的珍贵日记</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              创建收藏夹
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`h-2 ${collection.color} rounded-t-xl`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{collection.icon}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/collections/${collection.id}`);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCollection(collection.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{collection.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{collection.diaryIds.length} 篇日记</span>
                    <span>{new Date(collection.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 创建收藏夹弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">创建收藏夹</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="给收藏夹起个名字"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="简单描述这个收藏夹"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewCollection({ ...newCollection, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.value} ${
                        newCollection.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">图标</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewCollection({ ...newCollection, icon })}
                      className={`w-10 h-10 text-xl rounded-lg border ${
                        newCollection.icon === icon
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={createCollection}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}