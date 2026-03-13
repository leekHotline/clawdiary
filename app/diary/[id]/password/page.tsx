'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PasswordProtectionPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [hint, setHint] = useState('');
  
  // 表单状态
  const [action, setAction] = useState<'set' | 'change' | 'remove'>('set');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newHint, setNewHint] = useState('');
  const [removePassword, setRemovePassword] = useState('');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    fetchProtectionStatus();
  }, [diaryId]);

  const fetchProtectionStatus = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/password`);
      const data = await res.json();
      setIsProtected(data.isProtected);
      setHint(data.hint || '');
      if (data.isProtected) {
        setAction('change');
      }
    } catch (_error) {
      console.error('获取保护状态失败:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 4) {
      setMessage({ type: 'error', text: '密码至少需要4个字符' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/diaries/${diaryId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'set', 
          password,
          hint: hint || undefined 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '密码保护设置成功！' });
        setIsProtected(true);
        setPassword('');
        setConfirmPassword('');
        setAction('change');
      } else {
        setMessage({ type: 'error', text: data.error || '设置失败' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: '新密码至少需要4个字符' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/diaries/${diaryId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'change', 
          oldPassword,
          newPassword,
          newHint: newHint || undefined 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '密码修改成功！' });
        setOldPassword('');
        setNewPassword('');
        setNewHint('');
      } else {
        setMessage({ type: 'error', text: data.error || '修改失败' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!removePassword) {
      setMessage({ type: 'error', text: '请输入当前密码' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/diaries/${diaryId}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'remove', 
          currentPassword: removePassword 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '密码保护已移除！' });
        setIsProtected(false);
        setRemovePassword('');
        setAction('set');
      } else {
        setMessage({ type: 'error', text: data.error || '移除失败' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link 
            href={`/diary/${diaryId}`}
            className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← 返回日记
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🔐</span>
            密码保护设置
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            为你的日记添加密码保护，只有输入正确密码才能查看内容
          </p>
        </div>

        {/* 状态卡片 */}
        <div className={`rounded-xl p-4 mb-6 ${
          isProtected 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isProtected ? '🔒' : '🔓'}</span>
            <div>
              <p className={`font-medium ${
                isProtected 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                {isProtected ? '此日记已设置密码保护' : '此日记未设置密码保护'}
              </p>
              {hint && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  提示：{hint}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 操作选项卡 */}
        {isProtected && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAction('change')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action === 'change'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              修改密码
            </button>
            <button
              onClick={() => setAction('remove')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action === 'remove'
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              移除保护
            </button>
          </div>
        )}

        {/* 消息提示 */}
        {message && (
          <div className={`rounded-xl p-4 mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* 设置密码表单 */}
        {!isProtected && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              设置访问密码
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码 *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码（至少4个字符）"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  确认密码 *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  密码提示（可选）
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="例如：我的生日"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  提示可以帮助你回忆密码，但也可能让他人更容易猜到
                </p>
              </div>
            </div>

            <button
              onClick={handleSetPassword}
              disabled={saving || !password || !confirmPassword}
              className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? '设置中...' : '设置密码保护'}
            </button>
          </div>
        )}

        {/* 修改密码表单 */}
        {isProtected && action === 'change' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              修改访问密码
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  当前密码 *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新密码 *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少4个字符）"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新密码提示（可选）
                </label>
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="留空则保持原提示"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving || !oldPassword || !newPassword}
              className="mt-6 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? '修改中...' : '修改密码'}
            </button>
          </div>
        )}

        {/* 移除保护表单 */}
        {isProtected && action === 'remove' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              移除密码保护
            </h2>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">
                ⚠️ 移除密码保护后，任何人都可以查看这篇日记的内容。请确认是否继续。
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                当前密码 *
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={removePassword}
                onChange={(e) => setRemovePassword(e.target.value)}
                placeholder="请输入当前密码以确认"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleRemovePassword}
              disabled={saving || !removePassword}
              className="mt-6 w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? '移除中...' : '确认移除保护'}
            </button>
          </div>
        )}

        {/* 提示信息 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 安全提示</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• 密码至少需要4个字符</li>
            <li>• 连续输错5次密码将被锁定30分钟</li>
            <li>• 设置密码提示可以帮助回忆密码</li>
            <li>• 密码保护只限制网页端访问，无法阻止数据库访问</li>
          </ul>
        </div>
      </div>
    </div>
  );
}