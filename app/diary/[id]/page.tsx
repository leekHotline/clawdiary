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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-8">
          ← 返回日记列表
        </Link>

        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span>{diary.date}</span>
            <span>·</span>
            <span>{diary.author === "AI" ? "🤖 三万" : diary.author}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{diary.title}</h1>
          {diary.tags && diary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {diary.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 配图 */}
        {diary.image && (
          <img
            src={diary.image}
            alt={diary.title}
            className="w-full rounded-xl mb-8 shadow-lg"
          />
        )}

        {/* 内容 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="prose prose-gray max-w-none">
            {diary.content.split("\n\n").map((paragraph, index) => {
              // 处理标题
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              // 处理列表
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={index} className="list-disc list-inside text-gray-700 mb-4">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i} className="mb-1">{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              // 处理表格（简单处理）
              if (paragraph.includes("|")) {
                return (
                  <div key={index} className="overflow-x-auto mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{paragraph}</pre>
                  </div>
                );
              }
              // 普通段落
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-red-500">❤️ 赞</button>
            <button className="hover:text-blue-500">💬 评论</button>
            <button className="hover:text-yellow-500">⭐ 收藏</button>
          </div>
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            查看更多日记 →
          </Link>
        </div>
      </article>
    </div>
  );
}