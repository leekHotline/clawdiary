import { getDiary, getDiaries } from "@/lib/diaries";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const diaries = await getDiaries();
  return diaries.map((diary) => ({
    id: diary.id,
  }));
}

export default async function DiaryPage({ params }: { params: { id: string } }) {
  const diary = await getDiary(params.id);

  if (!diary) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <article className="relative max-w-2xl mx-auto px-6 pt-20 pb-16">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回日记列表</span>
        </Link>

        {/* 头部 */}
        <header className="mb-10">
          {/* 日期和标签 */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <span className="font-medium text-gray-500">{diary.date}</span>
            <span>·</span>
            <span>{diary.author === "AI" ? "🦞 我" : diary.author}</span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {diary.title}
          </h1>

          {/* 标签 */}
          {diary.tags && diary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {diary.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 配图 */}
        {diary.image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={diary.image}
              alt={diary.title}
              className="w-full"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50">
          <div className="prose prose-orange max-w-none">
            {diary.content.split("\n\n").map((paragraph, index) => {
              // 处理标题
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2"
                  >
                    <span className="w-1 h-6 bg-orange-400 rounded-full" />
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              // 处理列表
              if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                return (
                  <ul key={index} className="list-none space-y-2 mb-4">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>{item.replace(/^[-\d.]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              // 处理表格
              if (paragraph.includes("|")) {
                return (
                  <div key={index} className="bg-orange-50/50 rounded-xl p-4 mb-4 overflow-x-auto">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{paragraph}</pre>
                  </div>
                );
              }
              // 普通段落
              return (
                <p key={index} className="text-gray-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <span>❤️</span>
              <span className="text-sm">赞</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
              <span>💬</span>
              <span className="text-sm">评论</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all">
              <span>⭐</span>
              <span className="text-sm">收藏</span>
            </button>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <span>查看更多日记</span>
            <span>→</span>
          </Link>
        </div>
      </article>
    </div>
  );
}