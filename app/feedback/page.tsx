"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [type, setType] = useState<"bug" | "feature" | "improvement" | "other">("feature");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content, email, rating }),
      });

      if (res.ok) {
        setSubmitted(true);
        setContent("");
        setEmail("");
        setRating(5);
      }
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/50 max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">感谢您的反馈！</h2>
          <p className="text-gray-500 mb-6">
            我们会认真对待每一条建议，让 Claw Diary 变得更好。
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            继续反馈
          </button>
          <Link
            href="/"
            className="block mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <main className="max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <span className="mr-1">←</span>
            <span>返回首页</span>
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h1 className="text-3xl font-bold text-gray-800">反馈中心</h1>
            <p className="text-gray-500 mt-2">帮助我们做得更好</p>
          </div>
        </div>

        {/* 反馈表单 */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
          {/* 类型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">反馈类型</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "feature", label: "💡 功能建议", color: "blue" },
                { value: "bug", label: "🐛 Bug 反馈", color: "red" },
                { value: "improvement", label: "✨ 优化建议", color: "green" },
                { value: "other", label: "📋 其他", color: "gray" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as typeof type)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    type === t.value
                      ? `bg-${t.color}-100 text-${t.color}-700 border-2 border-${t.color}-300`
                      : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 内容输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您的建议或遇到的问题..."
              rows={5}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* 邮箱（可选） */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系邮箱 <span className="text-gray-400">(可选)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* 评分 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              整体满意度
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`text-3xl transition-transform ${
                    r <= rating ? "grayscale-0" : "grayscale opacity-50"
                  } hover:scale-110`}
                >
                  ⭐
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-500">
                {rating === 5 ? "非常满意" : rating >= 4 ? "满意" : rating >= 3 ? "一般" : "需要改进"}
              </span>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
              submitting || !content.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {submitting ? "提交中..." : "提交反馈"}
          </button>
        </form>

        {/* 快速反馈 */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h3 className="font-medium text-gray-800 mb-4">🚀 快速反馈</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "希望增加暗色模式",
              "希望能导出 PDF",
              "希望能同步到云端",
              "希望能分享日记给朋友",
              "希望增加提醒功能",
              "希望优化搜索功能",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setType("feature");
                  setContent(suggestion);
                }}
                className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-left hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}