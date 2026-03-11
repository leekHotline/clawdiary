"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BackupSettingsPage() {
  const [backupFormat, setBackupFormat] = useState("json");
  const [includeImages, setIncludeImages] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [backupResult, setBackupResult] = useState<any>(null);
  const [restorePreview, setRestorePreview] = useState<any>(null);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const params = new URLSearchParams({
        format: backupFormat,
        images: includeImages.toString(),
        from: dateFrom,
        to: dateTo,
      });
      
      const res = await fetch(`/api/backup?${params}`);
      const data = await res.json();
      setBackupResult(data);
    } catch (err) {
      console.error("创建备份失败:", err);
      alert("创建备份失败");
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setRestorePreview(data);
      } else {
        alert(data.error || "解析失败");
      }
    } catch (err) {
      console.error("上传失败:", err);
      alert("上传失败");
    } finally {
      setRestoring(false);
    }
  };

  const handleConfirmRestore = async (mode: string) => {
    try {
      const res = await fetch("/api/restore", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed: true,
          mergeMode: mode,
          conflictResolution: "skip",
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`恢复完成！导入 ${data.stats.imported} 篇日记`);
        setRestorePreview(null);
      }
    } catch (err) {
      console.error("恢复失败:", err);
      alert("恢复失败");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">数据备份与恢复</h1>
              <p className="text-sm text-gray-500">保护你的日记数据安全</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 备份 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">创建备份</h2>
                <p className="text-sm text-gray-500">导出你的日记数据</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "json", label: "JSON", desc: "完整数据" },
                    { value: "markdown", label: "Markdown", desc: "可读性好" },
                    { value: "txt", label: "TXT", desc: "纯文本" },
                  ].map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setBackupFormat(format.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        backupFormat === format.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium text-gray-800">{format.label}</div>
                      <div className="text-xs text-gray-500">{format.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期范围</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="开始日期"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="结束日期"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">包含图片附件</span>
              </label>

              <button
                onClick={handleCreateBackup}
                disabled={creating}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {creating ? "创建中..." : "创建备份"}
              </button>

              {backupResult && (
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-green-700 font-medium mb-2">✅ 备份就绪</p>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>总计 {backupResult.stats?.totalDiaries} 篇日记</p>
                    <p>共 {backupResult.stats?.totalWords?.toLocaleString()} 字</p>
                  </div>
                  <button className="mt-3 w-full py-2 bg-green-500 text-white rounded-lg">
                    下载备份文件
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* 恢复 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">恢复数据</h2>
                <p className="text-sm text-gray-500">从备份文件恢复</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept=".json,.md,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="backup-file"
                  disabled={restoring}
                />
                <label htmlFor="backup-file" className="cursor-pointer">
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-gray-700 font-medium">点击选择备份文件</p>
                  <p className="text-sm text-gray-500 mt-1">支持 JSON、Markdown、TXT 格式</p>
                </label>
              </div>

              {restoring && (
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"
                  />
                  <span>解析中...</span>
                </div>
              )}

              {restorePreview && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-purple-700 font-medium mb-3">📄 备份文件解析成功</p>
                  <div className="text-sm text-purple-600 space-y-1">
                    <p>文件：{restorePreview.preview.fileName}</p>
                    <p>格式：{restorePreview.preview.detectedFormat}</p>
                    <p>预计导入：{restorePreview.preview.estimatedDiaries} 篇日记</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">选择恢复方式：</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleConfirmRestore("replace")}
                        className="py-2 px-3 bg-red-500 text-white rounded-lg text-sm"
                      >
                        替换全部
                      </button>
                      <button
                        onClick={() => handleConfirmRestore("merge")}
                        className="py-2 px-3 bg-purple-500 text-white rounded-lg text-sm"
                      >
                        智能合并
                      </button>
                      <button
                        onClick={() => handleConfirmRestore("append")}
                        className="py-2 px-3 bg-blue-500 text-white rounded-lg text-sm"
                      >
                        追加导入
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 自动备份设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ 自动备份</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="autoBackup" className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-800">每天</p>
                <p className="text-xs text-gray-500">推荐</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="autoBackup" className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-800">每周</p>
                <p className="text-xs text-gray-500">节省空间</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input type="radio" name="autoBackup" defaultChecked className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-800">关闭</p>
                <p className="text-xs text-gray-500">手动备份</p>
              </div>
            </label>
          </div>
        </motion.div>
      </main>
    </div>
  );
}