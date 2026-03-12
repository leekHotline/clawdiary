import Link from 'next/link';
import WeeklyReportClient from './client';

export const metadata = {
  title: '日记周报 - Claw Diary',
  description: '每周回顾你的写作轨迹，用数据驱动成长',
};

export default function WeeklyReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">日记周报</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">每周回顾，见证成长</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/weekly-report/history"
                className="px-4 py-2 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                历史周报
              </Link>
              <Link
                href="/weekly-report/settings"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ⚙️ 设置
              </Link>
            </div>
          </div>
        </div>
      </header>
      <WeeklyReportClient />
    </div>
  );
}