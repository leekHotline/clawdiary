'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReportSummary {
  weekStart: string;
  weekEnd: string;
  diaryCount: number;
  wordCount: number;
  dominantMood: string;
}

export default function WeeklyReportHistoryClient() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`/api/weekly-report/history?page=${page}&limit=10`);
      const data = await res.json();
      if (page === 1) {
        setReports(data.reports || []);
      } else {
        setReports(prev => [...prev, ...(data.reports || [])]);
      }
      setHasMore((data.reports || []).length === 10);
    } catch (_error) {
      console.error('Failed to fetch history:', _error);
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    excited: '🎉',
    calm: '😌',
    productive: '💪',
    sad: '😢',
    accomplished: '🏆',
    creative: '🎨',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-5xl animate-pulse">📊</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {reports.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有历史周报</p>
          <Link
            href="/weekly-report"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            查看本周周报
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {reports.map((report, index) => (
              <Link
                key={report.weekStart}
                href={`/weekly-report/${report.weekStart}`}
                className="group p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-purple-200 dark:text-purple-700 group-hover:text-purple-300 dark:group-hover:text-purple-600 transition-colors">
                      #{(page - 1) * 10 + index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {new Date(report.weekStart).toLocaleDateString('zh-CN')} ~ {new Date(report.weekEnd).toLocaleDateString('zh-CN')}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>📝 {report.diaryCount} 篇</span>
                        <span>✍️ {report.wordCount.toLocaleString()} 字</span>
                        <span>{moodEmojis[report.dominantMood] || '😐'} {report.dominantMood}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-purple-500 transition-colors">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                加载更多
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}