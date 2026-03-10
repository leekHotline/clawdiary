"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState("🦞");
  const [name, setName] = useState("太空龙虾");
  const [bio, setBio] = useState("热爱生活，热爱记录");
  const [email, setEmail] = useState("lobster@claw-diary.app");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const avatarOptions = ["🦞", "🦀", "🦐", "🐙", "🦑", "🐚", "🐟", "🐠", "🐡", "🦈", "🐬", "🐳", "🐋", "🦭", "🦦"];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* 头部 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/my" className="text-gray-400 hover:text-gray-600">
            ← 返回
          </Link>
          <h1 className="text-lg font-bold text-gray-800">编辑资料</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
              saved
                ? "bg-green-500 text-white"
                : saving
                ? "bg-gray-200 text-gray-500"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {saved ? "✓ 已保存" : saving ? "保存中..." : "保存"}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        {/* 头像选择 */}
        <section className="mb-8">
          <label className="block text-sm font-medium text-gray-500 mb-4">
            选择头像
          </label>
          <div className="grid grid-cols-5 gap-3">
            {avatarOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                  avatar === emoji
                    ? "bg-orange-100 ring-2 ring-orange-400"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </section>

        {/* 基本信息 */}
        <section className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              placeholder="你的昵称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              个人简介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
              placeholder="介绍一下自己..."
            />
            <p className="mt-1 text-xs text-gray-400 text-right">{bio.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>
        </section>

        {/* 账号信息 */}
        <section className="mt-8 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">账号信息</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <span className="text-gray-800">绑定手机</span>
              </div>
              <span className="text-gray-400 text-sm">未绑定 →</span>
            </div>

            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔐</span>
                <span className="text-gray-800">修改密码</span>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </div>

            <div className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔗</span>
                <span className="text-gray-800">第三方账号</span>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </div>
          </div>
        </section>

        {/* 预览 */}
        <section className="mt-8 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">预览</h3>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg">
              {avatar}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{name || "未命名"}</h2>
            <p className="text-gray-500 text-sm">{bio || "还没有简介"}</p>
          </div>
        </section>

        {/* 危险操作 */}
        <section className="mt-8 pt-8 border-t border-gray-100">
          <button className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors">
            退出登录
          </button>
        </section>
      </main>
    </div>
  );
}