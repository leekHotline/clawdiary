'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateCitationPage() {
  const router = useRouter();
  const [sourceDiaryId, setSourceDiaryId] = useState('');
  const [targetDiaryId, setTargetDiaryId] = useState('');
  const [type, setType] = useState('reference');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const typeOptions = [
    { value: 'reference', label: '📖 直接引用', description: '在日记中直接引用了另一篇日记的内容' },
    { value: 'continuation', label: '➡️ 续篇', description: '这篇日记是另一篇日记的续集' },
    { value: 'related', label: '🔗 相关', description: '两篇日记主题相关但非直接引用' },
    { value: 'response', label: '💬 回应', description: '对另一篇日记的观点进行回应' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sourceDiaryId || !targetDiaryId) {
      setError('请填写源日记和目标日记ID');
      return;
    }

    if (sourceDiaryId === targetDiaryId) {
      setError('源日记和目标日记不能相同');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/citations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceDiaryId: parseInt(sourceDiaryId),
          targetDiaryId: parseInt(targetDiaryId),
          type,
          context
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '创建失败');
      }

      router.push('/citations');
    } catch (err: any) {
      setError(err.message || '创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/citations" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
            ← 返回引用中心
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ➕ 创建引用
          </h1>
          <p className="text-gray-600">建立日记之间的关联，构建知识网络</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 源日记 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              源日记 ID
            </label>
            <input
              type="number"
              value={sourceDiaryId}
              onChange={(e) => setSourceDiaryId(e.target.value)}
              placeholder="输入日记编号，如 58"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">引用者：这篇日记引用了另一篇</p>
          </div>

          {/* 目标日记 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标日记 ID
            </label>
            <input
              type="number"
              value={targetDiaryId}
              onChange={(e) => setTargetDiaryId(e.target.value)}
              placeholder="输入日记编号，如 45"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">被引用者：这篇日记被源日记引用</p>
          </div>

          {/* 引用类型 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              引用类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    type === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 引用上下文 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              引用上下文（可选）
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="描述引用的具体场景，如：在讨论习惯养成时，我回顾了之前在 #45 中的经验..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 关系预览 */}
          {sourceDiaryId && targetDiaryId && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">引用关系预览：</div>
              <div className="flex items-center gap-4">
                <div className="bg-white px-3 py-2 rounded-lg border border-indigo-200">
                  <span className="text-gray-500">日记</span>
                  <span className="font-bold text-indigo-600 ml-1">#{sourceDiaryId}</span>
                </div>
                <div className="text-2xl text-gray-300">→</div>
                <div className="bg-white px-3 py-2 rounded-lg border border-purple-200">
                  <span className="text-gray-500">日记</span>
                  <span className="font-bold text-purple-600 ml-1">#{targetDiaryId}</span>
                </div>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建引用'}
            </button>
            <Link
              href="/citations"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
          </div>
        </form>

        {/* 帮助信息 */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">💡 使用提示</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              建立引用关系后，两篇日记会自动关联显示
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              引用图谱会实时更新，展示知识网络
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              选择合适的引用类型有助于更好地组织内容
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}