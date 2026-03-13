'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookmarkGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface Bookmark {
  id: string;
  diaryId: string;
  diaryTitle: string;
  diaryPreview: string;
  groupId: string;
  createdAt: string;
  note?: string;
}

export default function DiaryBookmarksPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showAddToGroup, setShowAddToGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('blue');

  const COLORS = [
    { value: 'blue', class: 'bg-blue-500' },
    { value: 'green', class: 'bg-green-500' },
    { value: 'orange', class: 'bg-orange-500' },
    { value: 'pink', class: 'bg-pink-500' },
    { value: 'purple', class: 'bg-purple-500' },
    { value: 'cyan', class: 'bg-cyan-500' },
  ];

  useEffect(() => {
    fetchBookmarks();
    fetchGroups();
  }, [diaryId]);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/bookmark`);
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (_error) {
      console.error('Failed to fetch bookmarks:', _error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/bookmarks/groups');
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
      }
    } catch (_error) {
      console.error('Failed to fetch groups:', _error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const res = await fetch('/api/bookmarks/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName.trim(),
          color: newGroupColor,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGroups([...groups, data.group]);
        setNewGroupName('');
        setShowAddToGroup(false);
      }
    } catch (_error) {
      console.error('Failed to create group:', _error);
    }
  };

  const handleMoveToGroup = async (bookmarkId: string, groupId: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
      });
      
      if (res.ok) {
        setBookmarks(bookmarks.map(b => 
          b.id === bookmarkId ? { ...b, groupId } : b
        ));
      }
    } catch (_error) {
      console.error('Failed to move bookmark:', _error);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    if (!confirm('确定要取消收藏吗？')) return;
    
    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      }
    } catch (_error) {
      console.error('Failed to remove bookmark:', _error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredBookmarks = selectedGroup === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.groupId === selectedGroup);

  const getGroupInfo = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-xl text-amber-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-amber-800">📑 收藏管理</h1>
              <p className="text-sm text-amber-600">日记 ID: {diaryId}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Groups Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-700">收藏夹</h2>
            <button
              onClick={() => setShowAddToGroup(!showAddToGroup)}
              className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建收藏夹
            </button>
          </div>

          {/* Create Group Form */}
          {showAddToGroup && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg space-y-3">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="收藏夹名称"
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">颜色：</span>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewGroupColor(color.value)}
                      className={`w-6 h-6 rounded-full ${color.class} ${
                        newGroupColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim()}
                  className="ml-auto px-4 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            </div>
          )}

          {/* Group Chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedGroup === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部 ({bookmarks.length})
            </button>
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  selectedGroup === group.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{group.icon}</span>
                {group.name} ({group.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📑</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {bookmarks.length === 0 ? '还没有收藏' : '该收藏夹为空'}
            </h3>
            <p className="text-gray-500">
              {bookmarks.length === 0 
                ? '点击日记页面的收藏按钮开始收藏' 
                : '这个收藏夹还没有日记'}
            </p>
            <Link
              href={`/diary/${diaryId}`}
              className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
            >
              返回日记
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookmarks.map((bookmark) => {
              const group = getGroupInfo(bookmark.groupId);
              
              return (
                <div
                  key={bookmark.id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Diary Preview */}
                    <div className="flex-1">
                      <Link
                        href={`/diary/${bookmark.diaryId}`}
                        className="font-medium text-gray-800 hover:text-amber-600 transition-colors"
                      >
                        {bookmark.diaryTitle}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {bookmark.diaryPreview}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          📅 {formatDate(bookmark.createdAt)}
                        </span>
                        {group && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                            {group.icon} {group.name}
                          </span>
                        )}
                      </div>
                      
                      {/* Note */}
                      {bookmark.note && (
                        <div className="mt-2 p-2 bg-amber-50 rounded text-sm text-gray-600">
                          📝 {bookmark.note}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {/* Move to Group */}
                      <select
                        value={bookmark.groupId}
                        onChange={(e) => handleMoveToGroup(bookmark.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1"
                      >
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.icon} {g.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        移除收藏
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-medium text-gray-700 mb-3">快捷操作</h3>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/bookmarks"
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm hover:bg-amber-200 transition-colors"
            >
              📑 全部收藏
            </Link>
            <button
              onClick={() => {
                const text = filteredBookmarks.map(b => `- ${b.diaryTitle}`).join('\n');
                navigator.clipboard.writeText(text);
                alert('已复制到剪贴板');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              📋 复制列表
            </button>
          </div>
        </div>

        {/* Back to Diary */}
        <div className="flex justify-center pt-6">
          <Link
            href={`/diary/${diaryId}`}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            返回日记
          </Link>
        </div>
      </main>
    </div>
  );
}