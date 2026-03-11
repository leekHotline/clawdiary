"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateCollabPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetWords, setTargetWords] = useState("5000");
  const [maxContributors, setMaxContributors] = useState("10");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟提交
    await new Promise((r) => setTimeout(r, 1000));
    
    // 实际项目中调用 API
    alert("协作日记创建成功！（演示模式）");
    setIsSubmitting(false);
  };

  const suggestedTags = ["故事", "创意", "知识", "开源", "文档", "趣味", "挑战"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/collab" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← 返回协作列表
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">✨</span>
            发起协作
          </h1>
          <p className="text-gray-500 mt-2">
            创建一个协作日记，邀请大家一起贡献内容
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              协作标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给协作起个吸引人的标题"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              协作描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下这个协作的目标和规则..."
              rows={4}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* 目标字数和人数 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标字数
              </label>
              <input
                type="number"
                value={targetWords}
                onChange={(e) => setTargetWords(e.target.value)}
                placeholder="5000"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大贡献者数
              </label>
              <input
                type="number"
                value={maxContributors}
                onChange={(e) => setMaxContributors(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* 截止日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              截止日期
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="用逗号分隔，如：故事, 创意, 挑战"
              className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const current = tags ? tags.split(",").map((t) => t.trim()) : [];
                    if (!current.includes(tag)) {
                      setTags(current.length > 0 ? `${tags}, ${tag}` : tag);
                    }
                  }}
                  className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 协作规则提示 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-2">📝 协作规则</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 每个贡献者可以添加一个或多个章节</li>
              <li>• 每个章节的字数会计入总进度</li>
              <li>• 达到目标字数或截止日期后，协作自动完成</li>
              <li>• 所有贡献者都会在完成的日记中署名</li>
            </ul>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <Link
              href="/collab"
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors text-center"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !title}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "创建中..." : "🚀 发起协作"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}