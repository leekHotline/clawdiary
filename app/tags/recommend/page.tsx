'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TagSuggestion {
  tag: string;
  score: number;
  reason: string;
  relatedTags: string[];
}

export default function TagRecommendPage() {
  const [diaryId, setDiaryId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/tags/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, existingTags })
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (_error) {
      console.error('Failed to analyze:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (!existingTags.includes(tag)) {
      setExistingTags([...existingTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setExistingTags(existingTags.filter(t => t !== tag));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/tags" className="text-violet-600 hover:underline mb-2 inline-block">
            ← 返回标签管理
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            🏷️ 智能标签推荐
          </h1>
          <p className="text-gray-600">AI 分析日记内容，智能推荐最合适的标签</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-medium text-gray-700 mb-4">📝 输入日记内容</h2>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">日记 ID（可选）</label>
              <input
                type="number"
                value={diaryId}
                onChange={(e) => setDiaryId(e.target.value)}
                placeholder="输入日记 ID 自动加载"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">日记内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴日记内容进行分析..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">已选标签</label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-gray-50 rounded-lg">
                {existingTags.length === 0 ? (
                  <span className="text-gray-400 text-sm">暂无标签</span>
                ) : (
                  existingTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-violet-900"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!content.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🤖 分析中...' : '✨ 智能推荐标签'}
            </button>
          </div>

          {/* 推荐结果 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-medium text-gray-700 mb-4">🎯 推荐结果</h2>
            
            {suggestions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">🏷️</div>
                <p>输入日记内容开始分析</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-100 rounded-lg hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-700">{s.tag}</span>
                        <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full">
                          匹配度 {s.score}%
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddTag(s.tag)}
                        disabled={existingTags.includes(s.tag)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          existingTags.includes(s.tag)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-violet-500 text-white hover:bg-violet-600'
                        }`}
                      >
                        {existingTags.includes(s.tag) ? '已添加' : '添加'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{s.reason}</p>
                    {s.relatedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400">相关标签:</span>
                        {s.relatedTags.map(rt => (
                          <button
                            key={rt}
                            onClick={() => handleAddTag(rt)}
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-violet-100 hover:text-violet-600 transition-colors"
                          >
                            {rt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 统计面板 */}
        {suggestions.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-medium text-gray-700 mb-4">📊 推荐统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <div className="text-3xl font-bold text-violet-600">{suggestions.length}</div>
                <div className="text-sm text-gray-500">推荐标签数</div>
              </div>
              <div className="text-center p-4 bg-fuchsia-50 rounded-lg">
                <div className="text-3xl font-bold text-fuchsia-600">
                  {Math.round(suggestions.reduce((a, b) => a + b.score, 0) / suggestions.length)}%
                </div>
                <div className="text-sm text-gray-500">平均匹配度</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-pink-600">
                  {suggestions.filter(s => s.score >= 80).length}
                </div>
                <div className="text-sm text-gray-500">高置信度</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {[...new Set(suggestions.flatMap(s => s.relatedTags))].length}
                </div>
                <div className="text-sm text-gray-500">相关标签</div>
              </div>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-medium text-gray-700 mb-4">✨ 功能特点</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-violet-500 text-lg">🎯</span>
              <div>
                <div className="font-medium text-gray-700">智能匹配</div>
                <div>基于内容语义分析推荐标签</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-500 text-lg">🔗</span>
              <div>
                <div className="font-medium text-gray-700">关联推荐</div>
                <div>自动推荐相关标签扩展分类</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-500 text-lg">📈</span>
              <div>
                <div className="font-medium text-gray-700">置信度评分</div>
                <div>每个推荐都有匹配度参考</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}