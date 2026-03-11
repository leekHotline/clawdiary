"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ScheduledDiary {
  id: string;
  title: string;
  content: string;
  scheduledFor: string;
  status: "pending" | "published" | "cancelled";
  tags: string[];
  createdAt: string;
}

export default function ScheduledDiariesPage() {
  const [scheduled, setScheduled] = useState<ScheduledDiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduled();
  }, []);

  const fetchScheduled = async () => {
    try {
      const res = await fetch("/api/scheduled");
      const data = await res.json();
      setScheduled(data);
    } catch (error) {
      console.error("Failed to fetch scheduled diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelScheduled = async (id: string) => {
    if (!confirm("确定要取消这个定时日记吗？")) return;
    
    try {
      await fetch(`/api/scheduled/${id}`, { method: "DELETE" });
      fetchScheduled();
    } catch (error) {
      console.error("Failed to cancel scheduled diary:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">⏳ 待发布</span>;
      case "published":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">✅ 已发布</span>;
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">❌ 已取消</span>;
      default:
        return null;
    }
  };

  const pendingCount = scheduled.filter(s => s.status === "pending").length;
  const publishedCount = scheduled.filter(s => s.status === "published").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⏰ 定时日记</h1>
              <p className="text-gray-600 mt-1">预约未来的发布时间</p>
            </div>
            <Link
              href="/scheduled/create"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              + 新建定时
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-gray-600 text-sm">待发布</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
            <div className="text-gray-600 text-sm">已发布</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{scheduled.length}</div>
            <div className="text-gray-600 text-sm">总计</div>
          </div>
        </div>
      </div>

      {/* List */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : scheduled.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <p className="text-gray-600 mb-4">还没有定时日记</p>
            <Link
              href="/scheduled/create"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition inline-block"
            >
              创建第一个定时日记
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduled.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(item.status)}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>📅 发布时间: {formatDate(item.scheduledFor)}</span>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {item.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.status === "pending" && (
                    <button
                      onClick={() => cancelScheduled(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      取消
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Link href="/" className="text-purple-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}