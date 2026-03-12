// 日记批量打印页面
export const dynamic = 'force-dynamic';

import { getDiaries } from "@/lib/diaries";
import Link from "next/link";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const month = typeof searchParams.month === 'string' ? searchParams.month : null;
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : null;
  const start = typeof searchParams.start === 'string' ? searchParams.start : null;
  const end = typeof searchParams.end === 'string' ? searchParams.end : null;

  let diaries = await getDiaries();

  // 过滤
  if (month) diaries = diaries.filter(d => d.date.startsWith(month));
  if (tag) diaries = diaries.filter(d => d.tags?.includes(tag));
  if (start) diaries = diaries.filter(d => d.date >= start);
  if (end) diaries = diaries.filter(d => d.date <= end);

  // 按日期排序
  diaries.sort((a, b) => a.date.localeCompare(b.date));

  // 按日期分组
  const diariesByDate = diaries.reduce((acc, d) => {
    const date = d.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(d);
    return acc;
  }, {} as Record<string, typeof diaries>);

  const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* 非打印时显示的导航 */}
      <div className="print:hidden bg-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/export"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <span>←</span>
            <span>返回导出中心</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>🖨️</span>
            <span>打印</span>
          </button>
        </div>
      </div>

      {/* 打印内容 */}
      <div className="max-w-4xl mx-auto px-6 py-8 print:py-0">
        {/* 打印封面 */}
        <div className="text-center mb-12 print:mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🦞 Claw Diary</h1>
          <p className="text-lg text-gray-500 mb-2">日记打印版</p>
          <div className="text-sm text-gray-400">
            打印时间：{new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {month && (
            <div className="mt-2 text-sm text-gray-500">
              月份：{month}
            </div>
          )}
          {tag && (
            <div className="mt-2 text-sm text-gray-500">
              标签：#{tag}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mb-12 print:mb-8 print:page-break-after-always">
          <div className="text-center p-4 bg-gray-50 rounded-xl print:bg-gray-100">
            <div className="text-3xl font-bold text-gray-800">{diaries.length}</div>
            <div className="text-sm text-gray-500">篇日记</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl print:bg-gray-100">
            <div className="text-3xl font-bold text-gray-800">{totalWords.toLocaleString()}</div>
            <div className="text-sm text-gray-500">总字数</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl print:bg-gray-100">
            <div className="text-3xl font-bold text-gray-800">{Object.keys(diariesByDate).length}</div>
            <div className="text-sm text-gray-500">天记录</div>
          </div>
        </div>

        {/* 目录 */}
        {Object.keys(diariesByDate).length > 5 && (
          <div className="mb-12 print:page-break-after-always">
            <h2 className="text-xl font-bold text-gray-800 mb-4">目录</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.keys(diariesByDate)
                .sort()
                .reverse()
                .slice(0, 50)
                .map(date => (
                  <div key={date} className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">•</span>
                    <span>{date}</span>
                    <span className="text-gray-400">({diariesByDate[date].length})</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 日记内容 */}
        {Object.entries(diariesByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dateDiaries]) => (
            <div key={date} className="mb-8 print:break-inside-avoid">
              <div className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                📅 {date}
              </div>
              {dateDiaries.map((diary) => (
                <article key={diary.id} className="mb-6 print:break-inside-avoid">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {diary.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                    <span>✍️ {diary.author || "我"}</span>
                    {diary.mood && <span>{diary.mood}</span>}
                    {diary.weather && <span>🌤️ {diary.weather}</span>}
                  </div>
                  {diary.tags && diary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {diary.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs print:bg-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {diary.content}
                  </div>
                  {diary.image && (
                    <div className="mt-4">
                      <img
                        src={diary.image}
                        alt={diary.title}
                        className="max-w-full h-auto rounded-lg print:hidden"
                      />
                      <div className="hidden print:block text-sm text-gray-400 mt-1">
                        [配图: {diary.image}]
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ))}

        {/* 页脚 */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 print:mt-8">
          <p>由 Claw Diary 自动生成</p>
          <p className="mt-1">
            共 {diaries.length} 篇日记 · {totalWords.toLocaleString()} 字
          </p>
        </div>
      </div>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}