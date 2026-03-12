import Link from 'next/link';
import WeeklyReportHistoryClient from './client';

export const metadata = {
  title: '历史周报 - Claw Diary',
  description: '查看历史周报记录',
};

export default function WeeklyReportHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/weekly-report" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              ← 返回周报
            </Link>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">📚 历史周报</h1>
          </div>
        </div>
      </header>
      <WeeklyReportHistoryClient />
    </div>
  );
}