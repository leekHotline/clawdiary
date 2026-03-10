"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TrashItem {
  id: string;
  originalId: string;
  type: "diary" | "draft";
  title: string;
  content: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
  createdAt: string;
  deletedAt: string;
  originalDate?: string;
}

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const res = await fetch("/api/trash");
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch trash:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: TrashItem) => {
    try {
      const res = await fetch(`/api/trash/${item.id}/restore`, {
        method: "POST",
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== item.id));
        alert("已恢复！");
      }
    } catch (error) {
      console.error("Failed to restore:", error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("永久删除后无法恢复，确定要删除吗？")) return;
    
    try {
      await fetch(`/api/trash/${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm("确定要清空回收站吗？此操作无法撤销！")) return;
    
    try {
      const res = await fetch("/api/trash/empty", { method: "POST" });
      const data = await res.json();
      setItems([]);
      alert(`已清空 ${data.count} 个项目`);
    } catch (error) {
      console.error("Failed to empty trash:", error);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      await Promise.all(
        selectedItems.map((id) => fetch(`/api/trash/${id}/restore`, { method: "POST" }))
      );
      setItems(items.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to restore items:", error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt).getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const remaining = Math.ceil((deleted + thirtyDays - Date.now()) / (24 * 60 * 60 * 1000));
    return Math.max(0, remaining);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-red-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">🗑️</div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-red-50 to-gray-100">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-red-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🗑️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">回收站</h1>
          <p className="text-gray-500">删除的内容会在 30 天后自动清除</p>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            {items.length} 个项目
          </div>
          
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkRestore}
                className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
              >
                ↩️ 恢复 ({selectedItems.length})
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
              >
                🗑️ 清空回收站
              </button>
            )}
          </div>
        </div>

        {/* 项目列表 */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-500 mb-6">回收站是空的</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition-colors"
            >
              <span>返回首页</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const daysRemaining = getDaysRemaining(item.deletedAt);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* 选择框 */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-300"
                      />
                      
                      {/* 类型标签 */}
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === "diary" 
                          ? "bg-orange-100 text-orange-600" 
                          : "bg-amber-100 text-amber-600"
                      }`}>
                        {item.type === "diary" ? "日记" : "草稿"}
                      </div>
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                          <span>删除于 {formatDate(item.deletedAt)}</span>
                          <span>·</span>
                          <span className={daysRemaining <= 7 ? "text-red-500" : ""}>
                            剩余 {daysRemaining} 天
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-gray-800 truncate">
                          {item.title || "无标题"}
                        </h3>
                        
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(item)}
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          恢复
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(item.id)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          永久删除
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* 提示 */}
        {items.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-700">
            <p>💡 提示：回收站中的项目将在删除 30 天后自动清除。重要内容请及时恢复。</p>
          </div>
        )}

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </main>
    </div>
  );
}