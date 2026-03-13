'use client';

import { useState, useEffect } from 'react';

interface Settings {
  enabled: boolean;
  pushDay: number; // 0-6, Sunday = 0
  pushTime: string; // HH:mm
  emailEnabled: boolean;
  notificationEnabled: boolean;
  includeStats: boolean;
  includeMoodAnalysis: boolean;
  includeBestDiaries: boolean;
}

const dayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function WeeklyReportSettingsClient() {
  const [settings, setSettings] = useState<Settings>({
    enabled: true,
    pushDay: 0,
    pushTime: '20:00',
    emailEnabled: false,
    notificationEnabled: true,
    includeStats: true,
    includeMoodAnalysis: true,
    includeBestDiaries: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/weekly-report/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (_error) {
      console.error('Failed to fetch settings:', _error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/weekly-report/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (_error) {
      console.error('Failed to save settings:', _error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 主开关 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">启用周报</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">每周自动生成并推送周报</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 推送时间 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">推送时间</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">推送日期</label>
              <select
                value={settings.pushDay}
                onChange={(e) => setSettings(s => ({ ...s, pushDay: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
              >
                {dayLabels.map((label, index) => (
                  <option key={index} value={index}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">推送时间</label>
              <input
                type="time"
                value={settings.pushTime}
                onChange={(e) => setSettings(s => ({ ...s, pushTime: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            每周{dayLabels[settings.pushDay]} {settings.pushTime} 自动推送
          </p>
        </div>

        {/* 推送方式 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">推送方式</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">站内通知</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">在通知中心接收周报</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationEnabled}
                onChange={(e) => setSettings(s => ({ ...s, notificationEnabled: e.target.checked }))}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">邮件推送</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">发送周报到邮箱</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => setSettings(s => ({ ...s, emailEnabled: e.target.checked }))}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
          </div>
        </div>

        {/* 周报内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">周报内容</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span className="text-gray-800 dark:text-white">写作统计</span>
              </div>
              <input
                type="checkbox"
                checked={settings.includeStats}
                onChange={(e) => setSettings(s => ({ ...s, includeStats: e.target.checked }))}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎭</span>
                <span className="text-gray-800 dark:text-white">心情分析</span>
              </div>
              <input
                type="checkbox"
                checked={settings.includeMoodAnalysis}
                onChange={(e) => setSettings(s => ({ ...s, includeMoodAnalysis: e.target.checked }))}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <span className="text-gray-800 dark:text-white">精选日记</span>
              </div>
              <input
                type="checkbox"
                checked={settings.includeBestDiaries}
                onChange={(e) => setSettings(s => ({ ...s, includeBestDiaries: e.target.checked }))}
                className="w-5 h-5 accent-purple-600"
              />
            </label>
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {saving ? '保存中...' : saved ? '✅ 已保存' : '保存设置'}
        </button>
      </div>
    </main>
  );
}