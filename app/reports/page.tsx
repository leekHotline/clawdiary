"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";
type ReportType = "spam" | "harassment" | "hate_speech" | "violence" | "adult" | "misinformation" | "copyright" | "other";

interface Report {
  id: string;
  type: ReportType;
  targetType: string;
  targetId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

interface ReportStats {
  total: number;
  pending: number;
  reviewing: number;
  resolved: number;
  dismissed: number;
}

const statusConfig: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "待处理", color: "text-amber-700", bg: "bg-amber-100" },
  reviewing: { label: "审核中", color: "text-blue-700", bg: "bg-blue-100" },
  resolved: { label: "已解决", color: "text-green-700", bg: "bg-green-100" },
  dismissed: { label: "已驳回", color: "text-gray-700", bg: "bg-gray-100" },
};

const typeConfig: Record<ReportType, { label: string; icon: string }> = {
  spam: { label: "垃圾内容", icon: "🗑️" },
  harassment: { label: "骚扰", icon: "😠" },
  hate_speech: { label: "仇恨言论", icon: "🚫" },
  violence: { label: "暴力内容", icon: "⚠️" },
  adult: { label: "成人内容", icon: "🔞" },
  misinformation: { label: "虚假信息", icon: "❌" },
  copyright: { label: "版权问题", icon: "©️" },
  other: { label: "其他", icon: "📝" },
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/reports" : `/api/reports?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setReports(data.reports || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🚨 举报管理</h1>
            <p className="text-gray-500 mt-1">审核和处理用户举报</p>
          </div>
          <Link
            href="/reports/create"
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            + 新建举报
          </Link>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-5 gap-3 mb-8">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">总计</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-amber-200">
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-xs text-amber-600 mt-1">待处理</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.reviewing}</div>
              <div className="text-xs text-blue-600 mt-1">审核中</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-green-600 mt-1">已解决</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{stats.dismissed}</div>
              <div className="text-xs text-gray-500 mt-1">已驳回</div>
            </div>
          </div>
        )}

        {/* 筛选 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "pending", "reviewing", "resolved", "dismissed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === s
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s === "all" ? "全部" : statusConfig[s].label}
            </button>
          ))}
        </div>

        {/* 举报列表 */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <div className="text-gray-500">暂无举报</div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {typeConfig[report.type]?.icon || "📝"}
                    </span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {typeConfig[report.type]?.label || report.type}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {report.targetType} · {report.targetId}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusConfig[report.status].bg
                    } ${statusConfig[report.status].color}`}
                  >
                    {statusConfig[report.status].label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {report.reason}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>举报人: {report.reporterName}</span>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}