"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface Version {
  id: string;
  diaryId: string;
  title: string;
  content: string;
  tags?: string[];
  image?: string;
  updatedAt: string;
  savedAt: string;
}

export default function HistoryPage() {
  const params = useParams();
  const diaryId = params.id as string;
  const [history, setHistory] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [diaryId]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/history`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getDiff = (oldContent: string, newContent: string) => {
    const oldLines = oldContent.split("\n");
    const newLines = newContent.split("\n");
    
    const additions = newLines.filter((line) => !oldLines.includes(line));
    const deletions = oldLines.filter((line) => !newLines.includes(line));
    
    return { additions, deletions };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">📜</div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📜</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">版本历史</h1>
          <p className="text-gray-500">查看日记的所有修改记录</p>
        </div>

        {/* 返回链接 */}
        <div className="mb-6">
          <Link
            href={`/diary/${diaryId}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>← 返回日记</span>
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">暂无历史版本</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 版本列表 */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                📋 共 {history.length} 个版本
              </h2>
              
              {history.map((version, index) => (
                <motion.button
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVersion(version)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedVersion?.id === version.id
                      ? "bg-indigo-100 border-2 border-indigo-300"
                      : "bg-white/70 border border-white/50 hover:bg-white/90"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {index === 0 ? "当前版本" : `版本 ${history.length - index}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(version.savedAt)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-700 truncate">{version.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                    {version.content.substring(0, 80)}...
                  </p>
                  {version.tags && version.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {version.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* 版本详情 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
              {selectedVersion ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      📖 版本详情
                    </h2>
                    <span className="text-xs text-gray-400">
                      保存于 {formatDate(selectedVersion.savedAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {selectedVersion.title}
                  </h3>
                  
                  {selectedVersion.image && (
                    <img
                      src={selectedVersion.image}
                      alt={selectedVersion.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap bg-gray-50 rounded-xl p-4 text-sm text-gray-700 overflow-auto max-h-96">
                      {selectedVersion.content}
                    </pre>
                  </div>
                  
                  {selectedVersion.tags && selectedVersion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedVersion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href={`/diary/${diaryId}/edit?version=${selectedVersion.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors"
                    >
                      <span>从该版本恢复</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-4">👈</div>
                  <p>选择一个版本查看详情</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </main>
    </div>
  );
}