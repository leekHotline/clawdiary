"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 运势记录类型
interface FortuneRecord {
  id: string;
  theme: string;
  themeName: string;
  level: number;
  title: string;
  poem: string;
  interpretation: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  emoji: string;
  drawnAt: string;
}

// 主题信息
const THEME_INFO: Record<string, { name: string; color: string }> = {
  love: { name: "姻缘", color: "from-pink-400 to-rose-500" },
  career: { name: "事业", color: "from-blue-400 to-indigo-500" },
  wealth: { name: "财运", color: "from-yellow-400 to-amber-500" },
  health: { name: "健康", color: "from-green-400 to-emerald-500" },
  study: { name: "学业", color: "from-purple-400 to-violet-500" },
  overall: { name: "综合", color: "from-orange-400 to-red-500" },
};

// 星星显示
function renderStars(level: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < level ? "text-yellow-400" : "text-gray-600"}>
      ★
    </span>
  ));
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  if (diff < 7) return `${diff}天前`;
  
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function FortuneHistoryPage() {
  const [records, setRecords] = useState<FortuneRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setLoading(true);
    const historyRecords: FortuneRecord[] = [];
    
    // 从localStorage加载所有运势记录
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("fortune-")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}");
          const themeInfo = THEME_INFO[data.theme] || THEME_INFO.overall;
          historyRecords.push({
            id: key,
            theme: data.theme,
            themeName: themeInfo.name,
            level: data.level,
            title: data.title,
            poem: data.poem,
            interpretation: data.interpretation,
            advice: data.advice,
            luckyColor: data.luckyColor,
            luckyNumber: data.luckyNumber,
            luckyDirection: data.luckyDirection,
            emoji: data.emoji,
            drawnAt: data.drawnAt || key.replace("fortune-", ""),
          });
        } catch {
          // 忽略解析错误
        }
      }
    }
    
    // 按日期排序
    historyRecords.sort((a, b) => new Date(b.drawnAt).getTime() - new Date(a.drawnAt).getTime());
    setRecords(historyRecords);
    setLoading(false);
  };

  const clearHistory = () => {
    if (confirm("确定要清除所有历史运势记录吗？")) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("fortune-")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setRecords([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-violet-950">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-lg mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/diary-fortune" className="inline-block text-2xl mb-4">← 返回运势</Link>
          <h1 className="text-3xl font-bold text-white mb-2">📜 历史运势</h1>
          <p className="text-purple-200 text-sm">回顾你的运势轨迹</p>
        </div>

        {/* 统计 */}
        {records.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-purple-800/40 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{records.length}</div>
              <div className="text-purple-300 text-xs">总抽签</div>
            </div>
            <div className="bg-purple-800/40 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400">
                {(records.reduce((sum, r) => sum + r.level, 0) / records.length).toFixed(1)}
              </div>
              <div className="text-purple-300 text-xs">平均运势</div>
            </div>
            <div className="bg-purple-800/40 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">
                {records.filter(r => r.level >= 4).length}
              </div>
              <div className="text-purple-300 text-xs">好签次数</div>
            </div>
          </div>
        )}

        {/* 记录列表 */}
        {loading ? (
          <div className="text-center text-purple-300 py-12">加载中...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-purple-200 mb-2">还没有运势记录</p>
            <p className="text-purple-400 text-sm">开始你的第一次求签吧</p>
            <Link
              href="/diary-fortune"
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
            >
              去求签
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-purple-800/40 rounded-xl p-4 backdrop-blur-sm border border-purple-400/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{record.emoji}</span>
                    <div>
                      <div className="text-white font-medium">{record.title}</div>
                      <div className="text-purple-300 text-xs">{formatDate(record.drawnAt)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${THEME_INFO[record.theme]?.color || "from-gray-400 to-gray-500"}`}>
                      {record.themeName}
                    </div>
                    <div className="mt-1 text-sm">{renderStars(record.level)}</div>
                  </div>
                </div>
                
                <p className="text-purple-200 text-sm line-clamp-2 mb-2">
                  {record.poem.replace(/\n/g, " ")}
                </p>
                
                <div className="flex gap-3 text-xs text-purple-300">
                  <span>🎨 {record.luckyColor}</span>
                  <span>🔢 {record.luckyNumber}</span>
                  <span>🧭 {record.luckyDirection}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 清除记录 */}
        {records.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearHistory}
              className="text-purple-400 hover:text-purple-200 text-sm"
            >
              🗑️ 清除历史记录
            </button>
          </div>
        )}
      </main>
    </div>
  );
}