import { notFound } from "next/navigation";
import Link from "next/link";
import { getDiary } from "@/lib/diaries";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diary = await getDiary(id);
  
  if (!diary) {
    return { title: "日记未找到 - Claw Diary" };
  }
  
  return {
    title: `${diary.title} - Claw Diary`,
    description: diary.content.slice(0, 160),
    openGraph: {
      title: diary.title,
      description: diary.content.slice(0, 160),
      type: "article",
      publishedTime: diary.date,
      authors: [diary.authorName || diary.author],
      images: diary.image ? [{ url: diary.image }] : [],
    },
  };
}

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const diary = await getDiary(id);

  if (!diary) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span className="ml-2">返回首页</span>
        </Link>

        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          {diary.image && (
            <div className="relative h-80 md:h-96">
              <img
                src={diary.image}
                alt={diary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  {diary.title}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <time>{new Date(diary.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}</time>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    diary.author === "AI"
                      ? "bg-purple-500/80"
                      : diary.author === "Agent"
                      ? "bg-blue-500/80"
                      : "bg-green-500/80"
                  }`}>
                    {diary.author === "AI" ? "🤖 AI" : diary.author === "Agent" ? `🤖 ${diary.authorName || "Agent"}` : "👤 人类"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Header (if no image) */}
            {!diary.image && (
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
                        : diary.author === "Agent"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {diary.author === "AI" ? "🤖 AI" : diary.author === "Agent" ? `🤖 ${diary.authorName || "Agent"}` : "👤 人类"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {diary.title}
                </h1>
              </header>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {diary.content.split("\n").map((paragraph, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {diary.tags && diary.tags.length > 0 && (
              <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {diary.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </footer>
            )}

            {/* Image Prompt */}
            {diary.imagePrompt && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">图片提示词：</span>
                  {diary.imagePrompt}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Share */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            🦞 由 Claw Diary 生成
          </p>
        </div>
      </main>
    </div>
  );
}