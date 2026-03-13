"use client";

import { useState } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdAt: string;
}

interface BookmarkGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  bookmarkCount: number;
}

export default function BookmarksManagePage() {
  const [importData, setImportData] = useState("");
  const [importFormat, setImportFormat] = useState<"json" | "html" | "csv">("json");
  const [exportFormat, setExportFormat] = useState<"json" | "html" | "csv">("json");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 模拟分组数据
  const groups: BookmarkGroup[] = [
    { id: "learning", name: "学习资源", icon: "📚", color: "blue", bookmarkCount: 12 },
    { id: "tools", name: "实用工具", icon: "🔧", color: "green", bookmarkCount: 8 },
    { id: "inspiration", name: "灵感素材", icon: "✨", color: "purple", bookmarkCount: 15 },
    { id: "reading", name: "待读文章", icon: "📖", color: "amber", bookmarkCount: 23 },
    { id: "reference", name: "参考资料", icon: "📋", color: "gray", bookmarkCount: 18 },
  ];

  // 导入书签
  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "请输入要导入的数据" });
      return;
    }

    setImporting(true);
    setMessage(null);

    try {
      let bookmarks: Bookmark[] = [];

      if (importFormat === "json") {
        bookmarks = JSON.parse(importData);
      } else if (importFormat === "csv") {
        // 解析 CSV
        const lines = importData.split("\n").slice(1); // 跳过标题行
        bookmarks = lines
          .filter((line) => line.trim())
          .map((line, index) => {
            const parts = line.match(/(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)/g);
            if (!parts || parts.length < 2) return null;
            const clean = (s: string) => s.replace(/^,?"?|"?$/g, "").replace(/""/g, '"');
            return {
              id: `import-${Date.now()}-${index}`,
              title: clean(parts[0] || ""),
              url: clean(parts[1] || ""),
              description: clean(parts[2] || ""),
              tags: clean(parts[3] || "").split(";").filter(Boolean),
              category: clean(parts[4] || "") || "导入的书签",
              createdAt: new Date().toISOString(),
            };
          })
          .filter(Boolean) as Bookmark[];
      } else if (importFormat === "html") {
        // 解析 HTML 书签文件
        const urlMatches = importData.matchAll(/<A[^>]+HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi);
        for (const match of Array.from(urlMatches)) {
          bookmarks.push({
            id: `import-${Date.now()}-${bookmarks.length}`,
            title: match[2].trim(),
            url: match[1],
            category: "导入的书签",
            createdAt: new Date().toISOString(),
          });
        }
      }

      const response = await fetch("/api/bookmarks/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookmarks,
          mode: "merge",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setImportData("");
      } else {
        setMessage({ type: "error", text: data.error || "导入失败" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "数据格式错误，请检查后重试" });
    } finally {
      setImporting(false);
    }
  };

  // 导出书签
  const handleExport = async () => {
    setExporting(true);
    setMessage(null);

    try {
      let url = `/api/bookmarks/export?format=${exportFormat}`;
      if (selectedGroup) {
        url += `&category=${encodeURIComponent(selectedGroup)}`;
      }

      const response = await fetch(url);

      if (exportFormat === "json") {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      } else {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `bookmarks-${new Date().toISOString().slice(0, 10)}.${exportFormat}`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      }

      setMessage({ type: "success", text: "导出成功！" });
    } catch (error) {
      setMessage({ type: "error", text: "导出失败" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/bookmarks" className="text-slate-500 hover:text-slate-700">
              ← 返回
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-semibold text-slate-800">书签管理</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 提示消息 */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 导出区域 */}
        <section className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span>📤</span> 导出书签
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              将书签导出为不同格式，方便备份或迁移到其他浏览器
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* 格式选择 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                导出格式
              </label>
              <div className="flex gap-3">
                {[
                  { value: "json", label: "JSON", desc: "完整数据，可重新导入" },
                  { value: "html", label: "HTML", desc: "浏览器兼容格式" },
                  { value: "csv", label: "CSV", desc: "表格格式，可用 Excel 打开" },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value as typeof exportFormat)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      exportFormat === format.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-medium text-slate-800">{format.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 分类筛选 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                筛选分类（可选）
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部书签</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.icon} {group.name} ({group.bookmarkCount})
                  </option>
                ))}
              </select>
            </div>

            {/* 导出按钮 */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {exporting ? "导出中..." : "导出书签"}
            </button>
          </div>
        </section>

        {/* 导入区域 */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span>📥</span> 导入书签
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              从其他浏览器或书签工具导入书签数据
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* 格式选择 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                导入格式
              </label>
              <div className="flex gap-3">
                {[
                  { value: "json", label: "JSON", desc: "Claw Diary 导出的 JSON 文件" },
                  { value: "html", label: "HTML", desc: "浏览器导出的书签文件" },
                  { value: "csv", label: "CSV", desc: "逗号分隔的表格文件" },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setImportFormat(format.value as typeof importFormat)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      importFormat === format.value
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-medium text-slate-800">{format.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 数据输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                粘贴或上传数据
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder={
                  importFormat === "json"
                    ? '[{"title": "示例", "url": "https://example.com", "tags": ["标签"]}]'
                    : importFormat === "csv"
                    ? "标题,URL,描述,标签,分类"
                    : '<!DOCTYPE NETSCAPE-Bookmark-file-1>...'
                }
                className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm resize-none"
              />
            </div>

            {/* 导入按钮 */}
            <button
              onClick={handleImport}
              disabled={importing || !importData.trim()}
              className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {importing ? "导入中..." : "导入书签"}
            </button>
          </div>
        </section>

        {/* 分类管理 */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span>🗂️</span> 分类管理
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div>
                      <div className="font-medium text-slate-800">{group.name}</div>
                      <div className="text-xs text-slate-500">
                        {group.bookmarkCount} 个书签
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 添加分类 */}
              <button className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors text-slate-500 hover:text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">+</span>
                  <div className="font-medium">新建分类</div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* 使用提示 */}
        <section className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• JSON 格式保留完整的书签信息，推荐用于备份和恢复</li>
            <li>• HTML 格式兼容所有主流浏览器，可直接导入 Chrome、Firefox 等</li>
            <li>• CSV 格式可用 Excel 或 Google Sheets 打开编辑</li>
            <li>• 导入时会自动跳过重复的书签 URL</li>
          </ul>
        </section>
      </main>
    </div>
  );
}