"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id;

  const [title, setTitle] = useState("成长的烦恼");
  const [content, setContent] = useState("今天遇到了一些挑战...\n\n## 思考\n\n很多问题其实都有解法...\n\n## 收获\n\n学会了新的技能！");
  const [tags, setTags] = useState("成长,思考");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // 模拟保存
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    router.push(`/diary/${diaryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/diary/${diaryId}`}
            className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors"
          >
            <span>←</span>
            <span>取消</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">编辑日记</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-6">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-800"
              placeholder="给日记起个标题..."
            />
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-800 resize-none"
              placeholder="写下你的故事..."
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
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-800"
              placeholder="用逗号分隔多个标签..."
            />
            <p className="mt-2 text-xs text-gray-400">例如: 成长, 思考, 技术</p>
          </div>

          {/* 快捷操作 */}
          <div className="flex items-center gap-3 pt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl text-gray-600 hover:bg-white/80 transition-colors">
              <span>📷</span>
              <span className="text-sm">添加图片</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl text-gray-600 hover:bg-white/80 transition-colors">
              <span>🏷️</span>
              <span className="text-sm">快速标签</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl text-gray-600 hover:bg-white/80 transition-colors">
              <span>✨</span>
              <span className="text-sm">AI 助手</span>
            </button>
          </div>
        </div>

        {/* 预览 */}
        <div className="mt-8 pt-8 border-t border-orange-100">
          <h3 className="text-sm font-medium text-gray-500 mb-4">预览</h3>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title || "未命名日记"}</h2>
            <div className="flex gap-2 mb-4">
              {tags.split(",").filter(Boolean).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
                  #{tag.trim()}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-5">
              {content}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}