'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface InspirationCard {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  pinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const COLORS = [
  '#FFE4B5', // 浅橙
  '#E6E6FA', // 薰衣草
  '#B0E0E6', // 粉蓝
  '#98FB98', // 浅绿
  '#FFB6C1', // 浅粉
  '#DDA0DD', // 梅红
  '#F0E68C', // 卡其
  '#87CEEB', // 天蓝
];

export default function InspirationWallPage() {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<InspirationCard | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [tags, setTags] = useState('');

  const fetchCards = useCallback(async () => {
    try {
      const url = selectedTag 
        ? `/api/inspiration-wall?tag=${encodeURIComponent(selectedTag)}`
        : '/api/inspiration-wall';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCards(data.data);
        setStats(data.stats);
        setAvailableTags(data.tags || []);
      }
    } catch (_error) {
      console.error('获取灵感墙失败:', _error);
    } finally {
      setLoading(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleAddCard = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await fetch('/api/inspiration-wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          color,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (data.success) {
        setCards(prev => [...prev, data.data]);
        setShowAddModal(false);
        setTitle('');
        setContent('');
        setColor(COLORS[0]);
        setTags('');
      }
    } catch (_error) {
      console.error('创建失败:', _error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('确定删除这个灵感卡片吗？')) return;

    try {
      const res = await fetch(`/api/inspiration-wall?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCards(prev => prev.filter(c => c.id !== id));
      }
    } catch (_error) {
      console.error('删除失败:', _error);
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const res = await fetch('/api/inspiration-wall/pin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pinned: !currentPinned })
      });
      const data = await res.json();
      if (data.success) {
        setCards(prev => prev.map(c => 
          c.id === id ? { ...c, pinned: !currentPinned } : c
        ));
      }
    } catch (_error) {
      console.error('置顶失败:', _error);
    }
  };

  const handleEditCard = (card: InspirationCard) => {
    setEditingCard(card);
    setTitle(card.title);
    setContent(card.content);
    setColor(card.color);
    setTags(card.tags.join(', '));
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              🎨 灵感墙
            </h1>
            <p className="text-gray-600 mt-2">收集你的灵感，点亮创作的火花</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>✨</span> 添加灵感
          </button>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-500">总灵感数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-orange-500">{stats.pinned}</div>
              <div className="text-sm text-gray-500">已置顶</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-purple-500">{availableTags.length}</div>
              <div className="text-sm text-gray-500">标签数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="text-2xl font-bold text-pink-500">{Object.keys(stats.byColor || {}).length}</div>
              <div className="text-sm text-gray-500">颜色种类</div>
            </div>
          </div>
        )}

        {/* 标签筛选 */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全部
            </button>
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* 灵感墙网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map(card => (
            <div
              key={card.id}
              className="group relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ backgroundColor: card.color }}
            >
              {/* 置顶标记 */}
              {card.pinned && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium">
                  📌 置顶
                </div>
              )}
              
              {/* 卡片内容 */}
              <div className="p-5 min-h-[180px]">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-sm line-clamp-4">
                  {card.content}
                </p>
                
                {/* 标签 */}
                {card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {card.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs bg-black/10 text-gray-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 时间 */}
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(card.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex justify-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleTogglePin(card.id, card.pinned); }}
                  className={`px-3 py-1 rounded text-sm ${
                    card.pinned ? 'bg-gray-500 text-white' : 'bg-yellow-400 text-yellow-900'
                  }`}
                >
                  {card.pinned ? '取消置顶' : '置顶'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditCard(card); }}
                  className="px-3 py-1 rounded text-sm bg-blue-500 text-white"
                >
                  编辑
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                  className="px-3 py-1 rounded text-sm bg-red-500 text-white"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {cards.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">还没有灵感</h3>
            <p className="text-gray-500 mb-4">点击右上角按钮添加你的第一个灵感</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg"
            >
              添加灵感
            </button>
          </div>
        )}

        {/* 添加/编辑模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCard ? '编辑灵感' : '添加新灵感'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="给你的灵感起个名字"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="记录你的灵感..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="创意, 写作, 灵感"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCard(null);
                    setTitle('');
                    setContent('');
                    setColor(COLORS[0]);
                    setTags('');
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  {editingCard ? '保存' : '添加'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 快捷导航 */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/inspirations" className="text-sm text-purple-600 hover:underline">
            💡 灵感库
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/templates" className="text-sm text-purple-600 hover:underline">
            📝 模板
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/stats/insights" className="text-sm text-purple-600 hover:underline">
            📊 数据洞察
          </Link>
        </div>
      </div>
    </div>
  );
}