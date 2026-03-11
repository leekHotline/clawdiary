"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Version {
  id: string;
  diaryId: string;
  version: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  changeSummary: string;
  wordCount: number;
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  peaceful: "😌",
  excited: "🎉",
  anxious: "😰",
  neutral: "😐",
  love: "❤️",
  grateful: "🙏",
  tired: "😴",
};

const moodColors: Record<string, string> = {
  happy: "from-yellow-400 to-orange-400",
  sad: "from-blue-400 to-blue-600",
  angry: "from-red-400 to-red-600",
  peaceful: "from-green-400 to-teal-400",
  excited: "from-pink-400 to-purple-400",
  anxious: "from-purple-400 to-indigo-400",
  neutral: "from-gray-400 to-gray-500",
  love: "from-pink-400 to-red-400",
  grateful: "from-amber-400 to-orange-400",
  tired: "from-indigo-400 to-purple-400",
};

export default function DiaryVersionsPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [comparing, setComparing] = useState(false);
  const [compareVersion, setCompareVersion] = useState<Version | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [diaryId]);

  const fetchVersions = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch (err) {
      console.error("获取版本历史失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    setRestoring(true);
    try {
      const res = await fetch(`/api/diaries/${diaryId}/versions/v${selectedVersion.version}`, {
        method: "PUT",
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`已成功恢复到版本 ${selectedVersion.version}`);
        router.push(`/diary/${diaryId}`);
      }
    } catch (err) {
      console.error("恢复版本失败:", err);
      alert("恢复版本失败");
    } finally {
      setRestoring(false);
      setShowRestoreConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 头部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/diary/${diaryId}`}
                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">版本历史</h1>
                <p className="text-sm text-gray-500">共 {versions.length} 个版本</p>
              </div>
            </div>
            
            {selectedVersion && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowRestoreConfirm(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                恢复到此版本
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 版本列表 */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">时间线</h2>
            
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-amber-400 to-yellow-400" />
              
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedVersion(version)}
                  className={`relative pl-10 pb-4 cursor-pointer group ${
                    selectedVersion?.id === version.id ? "" : ""
                  }`}
                >
                  {/* 时间线节点 */}
                  <div
                    className={`absolute left-2 top-1 w-5 h-5 rounded-full border-2 transition-all ${
                      selectedVersion?.id === version.id
                        ? "bg-orange-500 border-orange-500 scale-125"
                        : "bg-white border-orange-300 group-hover:border-orange-500"
                    }`}
                  >
                    {selectedVersion?.id === version.id && (
                      <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                    )}
                  </div>
                  
                  <div
                    className={`p-4 rounded-xl transition-all ${
                      selectedVersion?.id === version.id
                        ? "bg-white shadow-lg border-2 border-orange-300"
                        : "bg-white/50 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{moodEmojis[version.mood] || "📝"}</span>
                      <span className="font-semibold text-gray-800">
                        版本 {version.version}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                          当前
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{version.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{getTimeAgo(version.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 版本详情 */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedVersion ? (
                <motion.div
                  key={selectedVersion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* 版本头部 */}
                  <div
                    className={`p-6 bg-gradient-to-r ${
                      moodColors[selectedVersion.mood] || "from-gray-400 to-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">
                        {moodEmojis[selectedVersion.mood] || "📝"}
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {selectedVersion.title}
                        </h2>
                        <p className="text-white/80">
                          版本 {selectedVersion.version} · {selectedVersion.wordCount} 字
                        </p>
                      </div>
                    </div>
                    
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {selectedVersion.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 版本信息 */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">创建时间</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(selectedVersion.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">修改说明</p>
                        <p className="font-medium text-gray-800">
                          {selectedVersion.changeSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 版本内容 */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">内容预览</h3>
                    <div className="p-4 bg-gray-50 rounded-xl prose prose-sm max-w-none">
                      {selectedVersion.content}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="p-6 bg-gray-50 flex gap-3">
                    <button
                      onClick={() => setShowRestoreConfirm(true)}
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                    >
                      恢复此版本
                    </button>
                    {versions.length > 1 && versions[0].id !== selectedVersion.id && (
                      <button
                        onClick={() => {
                          setComparing(true);
                          setCompareVersion(versions[0]);
                        }}
                        className="flex-1 py-3 bg-white border-2 border-orange-300 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors"
                      >
                        与当前版本对比
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-96 flex items-center justify-center bg-white/50 rounded-2xl"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">📜</div>
                    <p className="text-gray-500">选择一个版本查看详情</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 恢复确认弹窗 */}
      <AnimatePresence>
        {showRestoreConfirm && selectedVersion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowRestoreConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认恢复版本</h3>
              <p className="text-gray-600 mb-6">
                您确定要恢复到版本 {selectedVersion.version} 吗？
                当前内容将被替换，但会保存为新版本。
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {restoring ? "恢复中..." : "确认恢复"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}