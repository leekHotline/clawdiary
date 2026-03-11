"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Tag {
  name: string;
  count: number;
  lastUsed: string;
  color: string;
}

export default function TagManagePage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"count" | "name" | "recent">("count");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#FF6B6B");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [sortBy]);

  const fetchTags = async () => {
    try {
      const res = await fetch(`/api/tags/manage?sort=${sortBy}`);
      const data = await res.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error("获取标签失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleMerge = async (targetTag: string) => {
    if (selectedTags.length === 0) return;
    
    try {
      const res = await fetch("/api/tags/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceTags: selectedTags,
          targetTag,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setSelectedTags([]);
        setShowMergeModal(false);
        fetchTags();
      }
    } catch (err) {
      console.error("合并标签失败:", err);
      alert("合并失败");
    }
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const res = await fetch("/api/tags/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          color: newTagColor,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("标签创建成功");
        setNewTagName("");
        setShowCreateModal(false);
        fetchTags();
      }
    } catch (err) {
      console.error("创建标签失败:", err);
      alert("创建失败");
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
    return `${Math.floor(diffDays / 30)} 个月前`;
  };

  const presetColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8B500", "#FF8C94", "#91EAE4", "#A8E6CF", "#FFD93D",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tags"
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">标签管理</h1>
                <p className="text-sm text-gray-500">共 {tags.length} 个标签</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              创建标签
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 搜索和排序 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("count")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === "count"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-100"
              }`}
            >
              按数量
            </button>
            <button
              onClick={() => setSortBy("name")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === "name"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-100"
              }`}
            >
              按名称
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === "recent"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-100"
              }`}
            >
              按最近
            </button>
          </div>
        </div>

        {/* 批量操作栏 */}
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-purple-100 rounded-xl flex items-center justify-between"
          >
            <span className="text-purple-700">
              已选择 {selectedTags.length} 个标签
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 bg-white text-gray-600 rounded-lg hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={() => setShowMergeModal(true)}
                className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                合并标签
              </button>
            </div>
          </motion.div>
        )}

        {/* 标签列表 */}
        <div className="space-y-3">
          {filteredTags.map((tag, index) => (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                selectedTags.includes(tag.name) ? "ring-2 ring-purple-400" : ""
              }`}
              onClick={() => toggleTag(tag.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div>
                    <span className="font-semibold text-gray-800">#{tag.name}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{tag.count} 篇日记</span>
                      <span>·</span>
                      <span>最近使用: {getTimeAgo(tag.lastUsed)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* 数量条 */}
                  <div className="hidden sm:block w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((tag.count / (tags[0]?.count || 1)) * 100, 100)}%`,
                        backgroundColor: tag.color,
                      }}
                    />
                  </div>
                  
                  {selectedTags.includes(tag.name) && (
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <p className="text-gray-500">没有找到匹配的标签</p>
          </div>
        )}
      </main>

      {/* 创建标签弹窗 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">创建新标签</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签名称</label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="输入标签名称"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标签颜色</label>
                  <div className="flex flex-wrap gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewTagColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newTagColor === color ? "scale-110 ring-2 ring-purple-400 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: newTagColor }}
                  />
                  <span className="text-gray-600">#{newTagName || "标签预览"}</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTagName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 合并标签弹窗 */}
      <AnimatePresence>
        {showMergeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowMergeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">合并标签</h3>
              
              <p className="text-gray-600 mb-4">
                将以下标签合并：
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">合并到标签</label>
                <input
                  type="text"
                  placeholder="输入目标标签名称"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
                  id="mergeTarget"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMergeModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const target = (document.getElementById("mergeTarget") as HTMLInputElement)?.value;
                    if (target) handleMerge(target);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg"
                >
                  合并
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}