"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { id: "quote", name: "名言金句", icon: "💭", description: "值得铭记的话语" },
  { id: "prompt", name: "写作提示", icon: "💡", description: "激发写作灵感" },
  { id: "theme", name: "写作主题", icon: "🎨", description: "深入探索的主题" },
  { id: "story", name: "故事种子", icon: "📖", description: "故事的开端" },
  { id: "question", name: "思考问题", icon: "🤔", description: "引发深思的问题" },
  { id: "method", name: "写作方法", icon: "✏️", description: "实用的写作技巧" },
];

export default function CreateInspirationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "prompt",
    tags: "",
    author: "",
    source: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/inspirations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
          author: formData.author || undefined,
          source: formData.source || undefined,
          isPublic: formData.isPublic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/inspirations/${data.data.id}`);
      }
    } catch (_error) {
      console.error("Failed to create inspiration:", _error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-56 h-56 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/inspirations" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回灵感库</span>
        </Link>

        {/* 头部 */}
        <div className="mb-8">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-gray-800">分享灵感</h1>
          <p className="text-gray-500 mt-1">分享你的写作灵感，帮助更多人找到创作方向</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 分类选择 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">选择类型</h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.category === cat.id
                      ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                      : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 内容输入 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">灵感内容</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="给这个灵感起个名字..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="写下你的灵感..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="写作, 灵感, 创意"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 来源信息 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">来源信息（可选）</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作者/出处
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="佚名"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  来源链接
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="书籍/网站名称"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                公开分享（其他用户可以看到）
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "分享中..." : "分享灵感"}
            </button>
            <Link
              href="/inspirations"
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