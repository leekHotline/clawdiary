'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState<'similar' | 'tags' | 'trending' | 'reading'>('similar');

  const similarDiaries = [
    { id: '1', title: '团队协作心得', similarity: 95, date: '2026-03-08', tags: ['协作', '团队'] },
    { id: '2', title: '远程工作效率', similarity: 88, date: '2026-03-05', tags: ['效率', '远程'] },
    { id: '3', title: '产品思维培养', similarity: 82, date: '2026-03-02', tags: ['产品', '学习'] },
  ];

  const recommendedTags = [
    { tag: '效率提升', count: 15, trend: 'up', reason: '基于您的阅读习惯' },
    { tag: '时间管理', count: 12, trend: 'up', reason: '相似用户常使用' },
    { tag: '知识管理', count: 10, trend: 'stable', reason: '热门标签' },
    { tag: '深度工作', count: 8, trend: 'up', reason: '新标签推荐' },
    { tag: '个人成长', count: 6, trend: 'stable', reason: '基于内容分析' },
  ];

  const trendingDiaries = [
    { id: 't1', title: '如何构建高效的日常工作流', views: 1520, likes: 89, author: 'Alex' },
    { id: 't2', title: 'AI 时代的个人知识管理', views: 1350, likes: 76, author: '小龙虾' },
    { id: 't3', title: '极简主义生活实践', views: 980, likes: 65, author: '太空龙虾' },
    { id: 't4', title: '写作作为思考工具', views: 856, likes: 54, author: 'AI助手' },
    { id: 't5', title: '从阅读到实践的闭环', views: 720, likes: 48, author: '学习达人' },
  ];

  const readingRecommendations = [
    { id: 'r1', title: '深度工作', reason: '您最近写了多篇关于效率的日记', category: '书籍' },
    { id: 'r2', title: '原子习惯', reason: '相似用户推荐', category: '书籍' },
    { id: 'r3', title: '如何做笔记', reason: '您对知识管理感兴趣', category: '文章' },
    { id: 'r4', title: '时间块管理法', reason: '热门时间管理方法', category: '方法' },
  ];

  const tabs = [
    { id: 'similar', label: '相似日记', icon: '🔍' },
    { id: 'tags', label: '推荐标签', icon: '🏷️' },
    { id: 'trending', label: '热门内容', icon: '🔥' },
    { id: 'reading', label: '阅读推荐', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            🤖 AI 推荐
          </h1>
          <p className="text-gray-600 mt-1">基于您的习惯和偏好，智能推荐内容</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white hover:bg-gray-50 border'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'similar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">基于「Day 39: 群组系统」推荐</h2>
              <div className="space-y-3">
                {similarDiaries.map((diary) => (
                  <Link
                    key={diary.id}
                    href={`/diary/${diary.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">{diary.similarity}%</span>
                      </div>
                      <div>
                        <div className="font-medium">{diary.title}</div>
                        <div className="flex gap-2 mt-1">
                          {diary.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{diary.date}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-3">相似度分布</h3>
                <div className="space-y-2">
                  {[90, 80, 70, 60].map((range, i) => (
                    <div key={range} className="flex items-center gap-2">
                      <div className="w-16 text-sm text-gray-500">{range}%+</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-4">
                        <div
                          className="bg-purple-500 rounded-full h-4"
                          style={{ width: `${[75, 50, 25, 10][i]}%` }}
                        />
                      </div>
                      <div className="w-8 text-sm text-gray-500">{[12, 8, 5, 3][i]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-3">推荐原因分析</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>相同标签</span>
                    <span className="text-purple-600">45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>内容相似</span>
                    <span className="text-purple-600">30%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>时间接近</span>
                    <span className="text-purple-600">15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>用户行为</span>
                    <span className="text-purple-600">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">为您推荐的标签</h2>
            <div className="space-y-3">
              {recommendedTags.map((item) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
                    </span>
                    <div>
                      <div className="font-medium">{item.tag}</div>
                      <div className="text-sm text-gray-500">{item.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{item.count} 篇相关日记</span>
                    <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm">
                      + 关注
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🔥 热门内容排行</h2>
            <div className="space-y-3">
              {trendingDiaries.map((diary, index) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{diary.title}</div>
                    <div className="text-sm text-gray-500">by {diary.author}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👁 {diary.views}</span>
                    <span>❤️ {diary.likes}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reading' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📚 为您推荐的阅读内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readingRecommendations.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="font-medium mt-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800">→</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}