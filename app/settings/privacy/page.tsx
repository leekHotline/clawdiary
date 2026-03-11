"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: "public-profile",
      name: "公开个人资料",
      description: "允许其他用户查看你的个人资料",
      enabled: true,
    },
    {
      id: "show-diaries",
      name: "展示日记列表",
      description: "在个人主页展示你的日记列表",
      enabled: true,
    },
    {
      id: "show-achievements",
      name: "展示成就徽章",
      description: "在个人主页展示你获得的徽章",
      enabled: true,
    },
    {
      id: "show-activity",
      name: "展示活动状态",
      description: "显示你的在线状态和最近活动",
      enabled: false,
    },
    {
      id: "allow-comments",
      name: "允许评论",
      description: "允许其他用户评论你的日记",
      enabled: true,
    },
    {
      id: "allow-mentions",
      name: "允许提及",
      description: "允许其他用户在日记中 @ 你",
      enabled: true,
    },
    {
      id: "show-in-search",
      name: "搜索可见",
      description: "你的日记和资料可以被搜索到",
      enabled: true,
    },
    {
      id: "analytics-opt-in",
      name: "使用分析",
      description: "帮助我们改进产品，收集匿名使用数据",
      enabled: true,
    },
  ]);

  const [diaryVisibility, setDiaryVisibility] = useState<
    "public" | "followers" | "private"
  >("public");

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/settings"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← 返回设置
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🔒 隐私设置
        </h1>
        <p className="text-gray-600 mb-8">
          管理你的隐私偏好，控制信息的可见性
        </p>

        {/* Default Diary Visibility */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            默认日记可见性
          </h2>
          <div className="space-y-3">
            {[
              { value: "public", label: "公开", desc: "所有人可见" },
              { value: "followers", label: "仅粉丝", desc: "只有关注你的人可见" },
              { value: "private", label: "私密", desc: "仅自己可见" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                  diaryVisibility === option.value
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </div>
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={diaryVisibility === option.value}
                  onChange={() =>
                    setDiaryVisibility(
                      option.value as "public" | "followers" | "private"
                    )
                  }
                  className="w-4 h-4 text-orange-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex-1 pr-4">
                  <div className="font-medium text-gray-800">{setting.name}</div>
                  <div className="text-sm text-gray-500">{setting.description}</div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                      setting.enabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="font-semibold text-red-800 mb-2">⚠️ 危险区域</h2>
          <p className="text-sm text-red-600 mb-4">
            以下操作不可撤销，请谨慎操作
          </p>
          <div className="space-x-3">
            <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
              隐藏所有日记
            </button>
            <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
              清除所有数据
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
            保存设置
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/settings"
            className="text-orange-600 hover:text-orange-700 transition"
          >
            ← 返回设置
          </Link>
        </div>
      </main>
    </div>
  );
}