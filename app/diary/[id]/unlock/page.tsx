'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnlockDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleUnlock = async () => {
    if (!password) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/diaries/${diaryId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password }),
      });
      const data = await res.json();

      if (data.success) {
        // 解锁成功，跳转到日记详情
        router.push(`/diary/${diaryId}?unlocked=true`);
      } else {
        setError(data.error || '密码错误');
        setAttempts(data.attempts || attempts + 1);
        
        if (data.locked) {
          setLocked(true);
          setRemainingTime(data.remainingTime || 30);
        }
      }
    } catch (_error) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* 主卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* 锁图标 */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              日记已加密
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              请输入密码以查看此日记内容
            </p>
          </div>

          {/* 锁定提示 */}
          {locked && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <span>🚫</span>
                账户已锁定，请 {remainingTime} 分钟后重试
              </p>
            </div>
          )}

          {/* 错误提示 */}
          {error && !locked && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              {attempts > 0 && attempts < 5 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  还剩 {5 - attempts} 次尝试机会
                </p>
              )}
            </div>
          )}

          {/* 尝试进度 */}
          {attempts > 0 && !locked && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>尝试次数</span>
                <span>{attempts} / 5</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    attempts < 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(attempts / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* 密码输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              访问密码
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入密码"
                disabled={locked}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* 解锁按钮 */}
          <button
            onClick={handleUnlock}
            disabled={loading || locked || !password}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                验证中...
              </span>
            ) : (
              '解锁日记'
            )}
          </button>

          {/* 返回链接 */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              返回首页
            </Link>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            忘记密码？请联系日记作者或通过其他方式验证身份
          </p>
        </div>
      </div>
    </div>
  );
}