'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface User {
  id: string
  name: string
  avatar?: string
  bio?: string
  diaryCount?: number
  followersCount?: number
  isFollowing?: boolean
}

interface FollowRelation {
  id: string
  followerId: string
  followingId: string
  createdAt: string
  user: User
}

export default function FollowsPage() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || 'following'
  
  const [type, setType] = useState<'following' | 'followers'>(initialType as 'following' | 'followers')
  const [users, setUsers] = useState<FollowRelation[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchFollows()
  }, [type])

  const fetchFollows = async (pageNum = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/follows?userId=user1&type=${type}&page=${pageNum}&limit=20`)
      const data = await res.json()
      if (data.success) {
        if (pageNum === 1) {
          setUsers(data.data.list)
        } else {
          setUsers(prev => [...prev, ...data.data.list])
        }
        setHasMore(data.data.pagination.hasMore)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('获取关注列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        // 取消关注
        await fetch(`/api/follows?followerId=user1&followingId=${userId}`, {
          method: 'DELETE'
        })
      } else {
        // 关注
        await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followerId: 'user1', followingId: userId })
        })
      }
      // 更新本地状态
      setUsers(prev =>
        prev.map(item => ({
          ...item,
          user: { ...item.user, isFollowing: !isFollowing }
        }))
      )
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchFollows(page + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/my" className="text-gray-500 hover:text-gray-700">
                ← 返回
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {type === 'following' ? '我的关注' : '我的粉丝'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 类型切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setType('following')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              type === 'following'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            关注 {users.length > 0 && <span className="text-sm opacity-80">({users.length})</span>}
          </button>
          <button
            onClick={() => setType('followers')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              type === 'followers'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            粉丝 {users.length > 0 && <span className="text-sm opacity-80">({users.length})</span>}
          </button>
        </div>

        {/* 用户列表 */}
        {loading && users.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">
              {type === 'following' ? '还没有关注任何人' : '还没有粉丝'}
            </p>
            {type === 'following' && (
              <Link
                href="/explore"
                className="inline-block mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition"
              >
                去发现
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 hover:shadow-sm transition"
              >
                <div className="flex items-center">
                  <Link href={`/user/${item.user.id}`} className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                      {item.user.avatar ? (
                        <img src={item.user.avatar} alt={item.user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        item.user.name[0]
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{item.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.user.bio || '这个人很懒，什么都没写'}
                      </p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-400">
                        <span>📝 {item.user.diaryCount || 0} 篇日记</span>
                        <span>👥 {item.user.followersCount || 0} 粉丝</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleFollow(item.user.id, item.user.isFollowing || false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      item.user.isFollowing
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {item.user.isFollowing ? '已关注' : '关注'}
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  {type === 'following' ? '关注于' : '粉丝自'} {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 bg-white rounded-xl text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {loading ? '加载中...' : '加载更多'}
              </button>
            )}
          </div>
        )}

        {/* 推荐关注 */}
        {type === 'following' && users.length < 10 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 推荐关注</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'rec1', name: '日记达人小王', diaryCount: 256 },
                { id: 'rec2', name: '旅行者小李', diaryCount: 128 },
                { id: 'rec3', name: '美食家小张', diaryCount: 98 },
                { id: 'rec4', name: '摄影师小陈', diaryCount: 87 }
              ].map(user => (
                <div key={user.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {user.name[3]}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.diaryCount} 篇日记</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user.id, false)}
                    className="w-full mt-3 py-1.5 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-600 transition"
                  >
                    + 关注
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}