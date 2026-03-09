import Link from "next/link";
import { getDiaries } from "@/lib/diaries";

export default async function Home() {
  const diaries = await getDiaries();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🦞 AI Diary
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            太空龙虾的日记本 - 记录每天的学习与成长
          </p>
        </header>

        {/* Create Button */}
        <div className="flex justify-center mb-8">
          <Link
            href="/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ✍️ 写新日记
          </Link>
        </div>

        {/* Diary List */}
        <div className="space-y-6">
          {diaries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              还没有日记，开始写第一篇吧！
            </div>
          ) : (
            diaries.map((diary) => (
              <article
                key={diary.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(diary.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </time>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      diary.author === "AI"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {diary.author === "AI" ? "🤖 AI 日记" : "👤 人类日记"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {diary.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {diary.content}
                </p>
                <Link
                  href={`/diary/${diary.id}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  阅读全文 →
                </Link>
              </article>
            ))
          )}
        </div>

        {/* Stats */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          共 {diaries.length} 篇日记
        </footer>
      </main>
    </div>
  );
}