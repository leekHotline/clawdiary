"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { id: "streak", name: "连续挑战", icon: "🔥" },
  { id: "total", name: "累计挑战", icon: "📊" },
  { id: "creative", name: "创意挑战", icon: "🎨" },
  { id: "exploration", name: "探索挑战", icon: "🔍" },
  { id: "wellness", name: "健康挑战", icon: "💚" },
  { id: "social", name: "社交挑战", icon: "👥" },
  { id: "fun", name: "趣味挑战", icon: "🎉" },
];

const difficultyOptions = [
  { value: "easy", label: "简单", color: "bg-green-100 text-green-700" },
  { value: "normal", label: "普通", color: "bg-blue-100 text-blue-700" },
  { value: "hard", label: "困难", color: "bg-orange-100 text-orange-700" },
  { value: "extreme", label: "地狱", color: "bg-red-100 text-red-700" },
];

export default function CreateChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "fun",
    goal: "",
    unit: "篇",
    duration: "",
    difficulty: "normal",
    points: "100",
    badge: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          goal: parseInt(formData.goal),
          unit: formData.unit,
          duration: parseInt(formData.duration) || 0,
          difficulty: formData.difficulty,
          rewards: {
            points: parseInt(formData.points),
            badge: formData.badge || null,
          },
          isPublic: formData.isPublic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/challenges/${data.data.id}`);
      }
    } catch (error) {
      console.error("Failed to create challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-56 h-56 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/challenges" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回挑战中心</span>
        </Link>

        {/* 头部 */}
        <div className="mb-8">
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-2xl font-bold text-gray-800">创建新挑战</h1>
          <p className="text-gray-500 mt-1">设计一个有趣的挑战，激励大家坚持写日记</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">基本信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  挑战标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：🔥 7天连续日记"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  挑战描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="描述这个挑战的目标和意义..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-2 rounded-lg text-center text-sm transition-all ${
                        formData.category === cat.id
                          ? "bg-purple-100 border-2 border-purple-500 text-purple-700"
                          : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="block text-lg mb-1">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 目标设定 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">目标设定</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标数量 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="7"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="篇">篇</option>
                  <option value="天">天</option>
                  <option value="小时">小时</option>
                  <option value="次">次</option>
                  <option value="个">个</option>
                  <option value="字">字</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                持续天数（0表示无限期）
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
              <div className="flex gap-2">
                {difficultyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: opt.value })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.difficulty === opt.value
                        ? opt.color + " ring-2 ring-offset-1"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 奖励设置 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">奖励设置</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  积分奖励
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  placeholder="100"
                  min="10"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  徽章名称（可选）
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="🔥 火焰新星"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                公开挑战（其他用户可以看到并参与）
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description || !formData.goal}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "创建中..." : "创建挑战"}
            </button>
            <Link
              href="/challenges"
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}