"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";

interface Report {
  id: string;
  type: string;
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
  snapshot?: {
    title?: string;
    content?: string;
    authorId?: string;
    authorName?: string;
  };
}

const statusConfig: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "待处理", color: "text-amber-700", bg: "bg-amber-100" },
  reviewing: { label: "审核中", color: "text-blue-700", bg: "bg-blue-100" },
  resolved: { label: "已解决", color: "text-green-700", bg: "bg-green-100" },
  dismissed: { label: "已驳回", color: "text-gray-700", bg: "bg-gray-100" },
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [relatedReports, setRelatedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${params.id}`);
      const data = await res.json();
      setReport(data.report);
      setRelatedReports(data.relatedReports || []);
      setResolution(data.report?.resolution || "");
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: ReportStatus) => {
    if (!report) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          resolvedBy: "admin",
          resolution,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      alert("更新失败");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-gray-500">举报不存在</div>
          <Link href="/reports" className="text-blue-500 mt-4 inline-block">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="mb-6">
          <Link
            href="/reports"
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
          >
            ← 返回列表
          </Link>
        </div>

        {/* 状态标签 */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusConfig[report.status].bg
            } ${statusConfig[report.status].color}`}
          >
            {statusConfig[report.status].label}
          </span>
          <span className="text-sm text-gray-500">
            创建于 {formatDate(report.createdAt)}
          </span>
        </div>

        {/* 主要内容 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            举报详情
          </h1>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">举报类型</span>
              <span className="font-medium text-gray-800">{report.type}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">目标类型</span>
              <span className="font-medium text-gray-800">{report.targetType}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">目标 ID</span>
              <span className="font-medium text-gray-800 font-mono text-sm">
                {report.targetId}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">举报人</span>
              <span className="font-medium text-gray-800">{report.reporterName}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">举报原因</h3>
            <p className="text-gray-800">{report.reason}</p>
          </div>

          {report.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">详细说明</h3>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-xl">
                {report.description}
              </p>
            </div>
          )}
        </div>

        {/* 内容快照 */}
        {report.snapshot && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📸 内容快照
            </h2>
            {report.snapshot.title && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">标题</div>
                <div className="font-medium text-gray-800">{report.snapshot.title}</div>
              </div>
            )}
            {report.snapshot.content && (
              <div>
                <div className="text-sm text-gray-500 mb-1">内容</div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap">
                  {report.snapshot.content}
                </div>
              </div>
            )}
            {report.snapshot.authorName && (
              <div className="mt-4 text-sm text-gray-500">
                作者: {report.snapshot.authorName}
              </div>
            )}
          </div>
        )}

        {/* 相关举报 */}
        {relatedReports.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🔗 相关举报 ({relatedReports.length})
            </h2>
            <div className="space-y-3">
              {relatedReports.map((r) => (
                <Link
                  key={r.id}
                  href={`/reports/${r.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{r.reason}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusConfig[r.status].bg
                      } ${statusConfig[r.status].color}`}
                    >
                      {statusConfig[r.status].label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(r.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 处理区域 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ⚙️ 处理操作
          </h2>
          
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="处理备注（可选）..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
          />

          <div className="flex gap-3">
            {report.status === "pending" && (
              <button
                onClick={() => updateStatus("reviewing")}
                disabled={updating}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "处理中..." : "开始审核"}
              </button>
            )}
            {(report.status === "pending" || report.status === "reviewing") && (
              <>
                <button
                  onClick={() => updateStatus("resolved")}
                  disabled={updating}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
                >
                  确认违规
                </button>
                <button
                  onClick={() => updateStatus("dismissed")}
                  disabled={updating}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 disabled:opacity-50"
                >
                  驳回举报
                </button>
              </>
            )}
          </div>

          {report.resolution && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">处理备注</div>
              <div className="text-gray-800">{report.resolution}</div>
              {report.resolvedAt && (
                <div className="text-xs text-gray-400 mt-2">
                  处理时间: {formatDate(report.resolvedAt)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}