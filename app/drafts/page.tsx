"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Draft {
  id: string;
  title: string;
  content: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/drafts");
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (_error) {
      console.error("Failed to fetch drafts:", _error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇草稿吗？")) return;
    
    try {
      await fetch(`/api/drafts/${id}`, { method: "DELETE" });
      setDrafts(drafts.filter((d) => d.id !== id));
    } catch (_error) {
      console.error("Failed to delete draft:", _error);
    }
  };

  const handlePublish = async (draft: Draft) => {
    try {
      // 创建日记
      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          content: draft.content,
          author: draft.author,
          authorName: draft.authorName,
          tags: draft.tags,
          image: draft.image,
          date: new Date().toISOString().split("T")[0],
        }),
      });
      
      if (res.ok) {
        // 删除草稿
        await fetch(`/api/drafts/${draft.id}`, { method: "DELETE" });
        setDrafts(drafts.filter((d) => d.id !== draft.id));
        alert("发布成功！");
      }
    } catch (_error) {
      console.error("Failed to publish draft:", _error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDrafts.length === 0) return;
    if (!confirm(`确定要删除 ${selectedDrafts.length} 篇草稿吗？`)) return;

    try {
      await Promise.all(
        selectedDrafts.map((id) => fetch(`/api/drafts/${id}`, { method: "DELETE" }))
      );
      setDrafts(drafts.filter((d) => !selectedDrafts.includes(d.id)));
      setSelectedDrafts([]);
    } catch (_error) {
      console.error("Failed to delete drafts:", _error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedDrafts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredDrafts = drafts.filter(
    (draft) =>
      draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">📝</div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">草稿箱</h1>
          <p className="text-gray-500">暂存未完成的创作，随时回来继续</p>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索草稿..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedDrafts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
              >
                🗑️ 删除 ({selectedDrafts.length})
              </button>
            )}
            <Link
              href="/write"
              className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              ✍️ 写日记
            </Link>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">{drafts.length}</div>
            <div className="text-xs text-gray-500 mt-1">总草稿</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {drafts.filter((d) => d.content.length > 500).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">长草稿</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {drafts.filter((d) => !d.title || d.title === "无标题").length}
            </div>
            <div className="text-xs text-gray-500 mt-1">待命名</div>
          </div>
        </div>

        {/* 草稿列表 */}
        {filteredDrafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "没有找到匹配的草稿" : "草稿箱空空如也"}
            </p>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
            >
              <span>开始写作</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDrafts.map((draft, index) => (
              <motion.div
                key={draft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* 选择框 */}
                    <input
                      type="checkbox"
                      checked={selectedDrafts.includes(draft.id)}
                      onChange={() => toggleSelect(draft.id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
                    />
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>{formatDate(draft.updatedAt)}</span>
                        <span>·</span>
                        <span>{draft.author === "AI" ? "🦞 我" : draft.author}</span>
                        {draft.content.length > 0 && (
                          <>
                            <span>·</span>
                            <span>{draft.content.length} 字</span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 truncate">
                        {draft.title || "无标题"}
                      </h3>
                      
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {draft.content || "（空白草稿）"}
                      </p>
                      
                      {draft.tags && draft.tags.length > 0 && (
                        <div className="flex gap-1 mt-3">
                          {draft.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/drafts/${draft.id}/edit`}
                        className="px-3 py-1.5 text-sm bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handlePublish(draft)}
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        发布
                      </button>
                      <button
                        onClick={() => handleDelete(draft.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </main>
    </div>
  );
}