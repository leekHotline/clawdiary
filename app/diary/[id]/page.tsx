import { notFound } from "next/navigation";
import Link from "next/link";
import { getDiary } from "@/lib/diaries";

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diary = await getDiary(id);

  if (!diary) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          ← 返回首页
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <time className="text-gray-500 dark:text-gray-400">
                {new Date(diary.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </time>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  diary.author === "AI"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {diary.author === "AI" ? "🤖 AI 日记" : "👤 人类日记"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {diary.title}
            </h1>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {diary.content.split("\n").map((paragraph, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {diary.tags && diary.tags.length > 0 && (
            <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {diary.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>
      </main>
    </div>
  );
}